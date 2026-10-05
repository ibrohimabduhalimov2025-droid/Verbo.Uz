import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

app.use(express.json({ limit: '15mb' }));

// In-memory cache for CEFR 10,500 words database
const cefrCache: Record<string, any[]> = {};
const cefrDir = path.join(process.cwd(), 'public', 'data', 'cefr');

// Global index of CEFR words for instant lookup and AI fallbacks
const cefrWordMap = new Map<string, any>();
function initCefrWordMap() {
  if (cefrWordMap.size > 0) return;
  const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
  for (const lvl of levels) {
    const list = getCefrLevelData(lvl);
    for (const item of list) {
      if (item && item.english) {
        cefrWordMap.set(item.english.toLowerCase().trim(), item);
      }
    }
  }
}

// Standardized Gemini AI Model Constants
const GEMINI_TEXT_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_TTS_MODEL = 'gemini-3.8-flash-lite-tts';

function getCefrLevelData(level: string): any[] {
  const lvl = level.toUpperCase();
  if (cefrCache[lvl]) return cefrCache[lvl];
  const filePath = path.join(cefrDir, `${lvl.toLowerCase()}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      cefrCache[lvl] = JSON.parse(raw);
      return cefrCache[lvl];
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
    }
  }
  return [];
}

// Lazy GoogleGenAI client helper
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// Resilient Gemini Generator with automatic fallback & retry on 503/429 spikes
async function generateContentWithRetry(ai: GoogleGenAI, contents: any, maxRetries = 2) {
  const candidateModels = [GEMINI_TEXT_MODEL, 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-pro-preview'];
  let lastErr: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: unknown) {
        lastErr = err;
        console.warn(`Model ${modelName} temporary failure (attempt ${attempt + 1}):`, err instanceof Error ? err.message : String(err));
      }
    }
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 450 * (attempt + 1)));
    }
  }
  throw lastErr;
}

// Resilient JSON extractor from AI output
function extractJsonFromText(rawText: string): any {
  if (!rawText) return null;
  const cleaned = rawText
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const cleanTrailed = cleaned.replace(/,\s*([\]}])/g, '$1');
    try {
      return JSON.parse(cleanTrailed);
    } catch {}

    const firstBracket = cleanTrailed.indexOf('[');
    const lastBracket = cleanTrailed.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(cleanTrailed.slice(firstBracket, lastBracket + 1));
      } catch {}
    }
    const firstBrace = cleanTrailed.indexOf('{');
    const lastBrace = cleanTrailed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleanTrailed.slice(firstBrace, lastBrace + 1));
      } catch {}
    }
    throw new Error('Could not parse valid JSON from AI output');
  }
}

// In-memory audio cache for TTS responses
const audioCache = new Map<string, Buffer>();

// Helper: Convert 16-bit 24kHz Mono PCM to WAV buffer
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// --- API Routes ---

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// CEFR 10,500 Database: Metadata & Level statistics
app.get('/api/cefr/metadata', (req: Request, res: Response) => {
  const metaPath = path.join(cefrDir, 'metadata.json');
  if (fs.existsSync(metaPath)) {
    try {
      const raw = fs.readFileSync(metaPath, 'utf-8');
      return res.json(JSON.parse(raw));
    } catch (e) {
      console.error('Error reading CEFR metadata:', e);
    }
  }
  res.json({
    title: "Verbo.uz CEFR English Vocabulary Database (A1–C2)",
    totalWords: 10500,
    levels: {
      A1: { count: 500, orderRange: [1, 500] },
      A2: { count: 1000, orderRange: [1, 1000] },
      B1: { count: 1500, orderRange: [1, 1500] },
      B2: { count: 2000, orderRange: [1, 2000] },
      C1: { count: 2500, orderRange: [1, 2500] },
      C2: { count: 3000, orderRange: [1, 3000] }
    }
  });
});

// CEFR 10,500 Database: Paginated & Filtered Words
app.get('/api/cefr/words', (req: Request, res: Response) => {
  const level = (req.query.level as string || 'A1').toUpperCase();
  const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
  const limit = Math.min(200, Math.max(10, parseInt(req.query.limit as string || '50', 10)));
  const search = (req.query.search as string || '').toLowerCase().trim();
  const category = (req.query.category as string || '').trim();
  const pos = (req.query.pos as string || '').trim();

  let words = getCefrLevelData(level);

  if (search) {
    words = words.filter(w =>
      w.english.toLowerCase().includes(search) ||
      w.uzbek.toLowerCase().includes(search) ||
      (w.transcription && w.transcription.toLowerCase().includes(search))
    );
  }

  if (category && category !== 'all' && category !== 'barchasi') {
    words = words.filter(w => w.category === category);
  }

  if (pos && pos !== 'all' && pos !== 'barchasi') {
    words = words.filter(w => w.partOfSpeech === pos);
  }

  const total = words.length;
  const startIndex = (page - 1) * limit;
  const paginated = words.slice(startIndex, startIndex + limit);

  res.json({
    level,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    words: paginated
  });
});

// CEFR 10,500 Database: Full Level Words for Flashcards/Tests/Games
app.get('/api/cefr/all-level-words', (req: Request, res: Response) => {
  const level = (req.query.level as string || 'A1').toUpperCase();
  const words = getCefrLevelData(level);
  res.json({
    level,
    count: words.length,
    words
  });
});

// 1. AI Single Word Info & Auto-fill
app.post('/api/ai/word-info', async (req: Request, res: Response) => {
  try {
    const { word, targetLang = 'uz' } = req.body;
    if (!word || typeof word !== 'string' || !word.trim()) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const prompt = `You are an expert English-Uzbek lexicographer for the Verbo.uz educational app.
Analyze the word or phrase: "${word.trim()}".
Return a valid JSON object ONLY (without markdown code fences if possible, or inside \`\`\`json) with these exact fields:
{
  "english": "properly capitalized English word/phrase",
  "uzbek": "accurate, natural Uzbek translation (latin script)",
  "transcription": "standard IPA phonetic transcription with brackets e.g. [ˈwɜːd]",
  "exampleSentence": "a clear, natural contextual English sentence demonstrating the word",
  "exampleSentenceUz": "natural Uzbek translation of the example sentence",
  "level": "A1" | "A2" | "B1" | "B2" | "C1",
  "partOfSpeech": "noun" | "verb" | "adjective" | "adverb" | "phrase" | "idiom",
  "synonyms": ["synonym1", "synonym2", "synonym3"]
}`;

    const response = await generateContentWithRetry(ai, prompt);
    const data = extractJsonFromText(response.text || '');

    return res.json(data);
  } catch (err: unknown) {
    console.error('Error in /api/ai/word-info:', err);
    return res.status(500).json({
      error: 'Failed to generate word info',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// 2. AI Flashcard Candidate Extractor (Returns validation flag isValid, summary, and words)
app.post('/api/ai/extract-words', async (req: Request, res: Response) => {
  initCefrWordMap();
  const { text: userText, imageBase64, imageMime = 'image/jpeg', fileText } = req.body;
  const combinedSourceText = [userText, fileText].filter(Boolean).join('\n\n').trim();

  // If completely empty input
  if (!combinedSourceText && !imageBase64) {
    return res.json({
      isValid: false,
      summary: 'Hech qanday matn, rasm yoki fayl kiritilmadi',
      words: [],
    });
  }

  try {
    const ai = getAI();
    if (!ai) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const systemPrompt = `You are the expert Vocabulary Extractor and Validator for Verbo.uz (English-Uzbek vocabulary learning app).

Task:
1. Examine the provided input (text, photo of book page, scan, or uploaded document).
2. Assess whether the content contains readable English text, vocabulary, or learning material.
3. If it contains NO readable English words, is empty, or is gibberish:
Return valid JSON:
{
  "isValid": false,
  "summary": "Kiritilgan materialda mos inglizcha so‘zlar aniqlanmadi",
  "words": []
}

4. If it DOES contain English words or learning material:
Extract all essential, high-utility English vocabulary items (typically between 5 and 35 words depending on text size).
For each word provide:
- "english": correct English spelling (clean word or short phrase, capitalize only proper nouns)
- "uzbek": natural, precise Uzbek translation in Latin alphabet (e.g. "Bardoshli, chidamli")
- "partOfSpeech": "noun" | "verb" | "adjective" | "adverb" | "phrase" | "idiom"
- "level": automatically detected CEFR level ("A1" | "A2" | "B1" | "B2" | "C1")

Return ONLY valid JSON in this exact structure with no markdown ticks:
{
  "isValid": true,
  "summary": "12 ta foydali so‘z aniqlandi",
  "words": [
    { "english": "Resilient", "uzbek": "Chidamli, bardoshli", "partOfSpeech": "adjective", "level": "B2" }
  ]
}

${combinedSourceText ? `Source Text:\n"""\n${combinedSourceText.slice(0, 8000)}\n"""` : ''}`;

    const contents: any[] = [];
    if (imageBase64) {
      let pureBase64 = imageBase64;
      let detectedMime = imageMime || 'image/jpeg';
      if (imageBase64.includes('base64,')) {
        const parts = imageBase64.split('base64,');
        pureBase64 = parts[1];
        const match = parts[0].match(/data:([^;]+)/);
        if (match) detectedMime = match[1];
      }
      contents.push({
        inlineData: {
          data: pureBase64.trim(),
          mimeType: detectedMime,
        },
      });
    }
    contents.push(systemPrompt);

    const response = await generateContentWithRetry(ai, contents);
    const parsed = extractJsonFromText(response.text || '');

    let isValid = false;
    let summary = '';
    let words: any[] = [];

    if (Array.isArray(parsed)) {
      words = parsed;
      isValid = words.length > 0;
      summary = `${words.length} ta so‘z aniqlandi`;
    } else if (parsed && typeof parsed === 'object') {
      words = Array.isArray(parsed.words) ? parsed.words : [];
      isValid = parsed.isValid !== false && words.length > 0;
      summary = parsed.summary || `${words.length} ta so‘z aniqlandi`;
    }

    if (words.length > 0) {
      return res.json({ isValid: true, summary, words });
    }

    return res.json({
      isValid: false,
      summary: summary || 'Kiritilgan materialda mos inglizcha so‘zlar aniqlanmadi',
      words: [],
    });
  } catch (err: unknown) {
    console.warn('AI extract warning, trying local fallback:', err instanceof Error ? err.message : String(err));

    // Fallback: extract english words from text using CEFR database
    if (combinedSourceText) {
      const tokens = combinedSourceText.match(/[A-Za-z]{3,30}/g) || [];
      const uniqueTokens = Array.from(new Set(tokens.map((t) => t.toLowerCase())));
      const matchedWords: any[] = [];

      for (const token of uniqueTokens) {
        if (cefrWordMap.has(token)) {
          const item = cefrWordMap.get(token);
          matchedWords.push({
            english: item.english,
            uzbek: item.uzbek,
            partOfSpeech: item.partOfSpeech || 'noun',
            level: item.level || 'B1',
          });
        }
        if (matchedWords.length >= 25) break;
      }

      if (matchedWords.length > 0) {
        return res.json({
          isValid: true,
          summary: `${matchedWords.length} ta so‘z aniqlandi (Lug‘at bazasidan)`,
          words: matchedWords,
        });
      }
    }

    return res.json({
      isValid: false,
      summary: 'Kiritilgan materialda mos inglizcha so‘zlar aniqlanmadi',
      words: [],
    });
  }
});

// 2b. AI Flashcard Generator for Specifically Selected Words (True marked words)
app.post('/api/ai/generate-selected-cards', async (req: Request, res: Response) => {
  initCefrWordMap();
  try {
    const { selectedWords, level } = req.body;

    if (!Array.isArray(selectedWords) || selectedWords.length === 0) {
      return res.status(400).json({ error: 'No words selected for generation' });
    }

    const ai = getAI();
    let cards: any[] = [];

    if (ai) {
      try {
        const wordsJson = JSON.stringify(selectedWords.slice(0, 35));
        const prompt = `You are the Flashcard Generator for Verbo.uz (English-Uzbek vocabulary learning app).
The user confirmed (True) these specific English words to generate complete study flashcards for:
${wordsJson}

For EACH of the provided words, generate a complete, high-quality flashcard with:
- "english": exact English word (standard capitalization)
- "uzbek": accurate, rich Uzbek translation in Latin alphabet
- "transcription": accurate IPA phonetic transcription enclosed in slashes, e.g. "/rɪˈzɪliənt/"
- "exampleSentence": natural, contextual English example sentence demonstrating practical usage
- "exampleSentenceUz": natural Uzbek translation of the example sentence
- "level": CEFR level (A1, A2, B1, B2, or C1)
- "partOfSpeech": "noun" | "verb" | "adjective" | "adverb" | "phrase"

Return ONLY a valid JSON array of objects matching each provided word. No markdown ticks.`;

        const response = await generateContentWithRetry(ai, prompt);
        const parsed = extractJsonFromText(response.text || '');
        if (Array.isArray(parsed) && parsed.length > 0) {
          cards = parsed;
        }
      } catch (geminiErr) {
        console.warn('Gemini generate cards temporary issue, using database enrichment:', geminiErr instanceof Error ? geminiErr.message : String(geminiErr));
      }
    }

    // Enrich or fill any missing cards from 10,500 CEFR database
    if (cards.length === 0) {
      cards = selectedWords.map((sw: any) => {
        const engClean = (sw.english || '').toLowerCase().trim();
        const cefrItem = cefrWordMap.get(engClean);
        if (cefrItem) {
          return {
            english: cefrItem.english,
            uzbek: sw.uzbek || cefrItem.uzbek,
            transcription: cefrItem.transcription || `/${cefrItem.english.toLowerCase()}/`,
            exampleSentence: cefrItem.exampleSentence || `The word "${cefrItem.english}" is useful in daily communication.`,
            exampleSentenceUz: cefrItem.exampleUzbek || `"${cefrItem.english}" so‘zi kundalik muloqotda foydali.`,
            level: cefrItem.level || level || 'B1',
            partOfSpeech: cefrItem.partOfSpeech || sw.partOfSpeech || 'noun',
          };
        }
        return {
          english: sw.english,
          uzbek: sw.uzbek || 'Lug‘at so‘zi',
          transcription: `/${sw.english.toLowerCase()}/`,
          exampleSentence: `Practice using "${sw.english}" in everyday English sentences.`,
          exampleSentenceUz: `"${sw.english}" so‘zini har kungi inglizcha gaplarda qo‘llashni mashq qiling.`,
          level: sw.level || level || 'B1',
          partOfSpeech: sw.partOfSpeech || 'noun',
        };
      });
    }

    return res.json({ cards });
  } catch (err: unknown) {
    console.error('Error in /api/ai/generate-selected-cards:', err);
    return res.status(500).json({
      error: 'Failed to generate flashcards for selected words',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// 2c. Backward-compatible AI Flashcard Batch Generator
app.post('/api/ai/flashcards', async (req: Request, res: Response) => {
  try {
    const { prompt: userPrompt, text: userText, imageBase64, imageMime = 'image/jpeg', count = 5, level = 'B1' } = req.body;

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const targetCount = Math.min(Math.max(Number(count) || 5, 1), 20);

    const systemPrompt = `You are the AI Flashcard Generator for Verbo.uz (English-Uzbek vocabulary learning app).
The user wants ${targetCount} vocabulary flashcards at target level ${level}.
${userPrompt ? `Topic/Request: "${userPrompt}"` : ''}
${userText ? `Source Text to extract vocabulary from:\n"""\n${userText.slice(0, 3000)}\n"""` : ''}
${imageBase64 ? 'Extract key English words and useful expressions found in the attached image.' : ''}

Generate an array of exactly ${targetCount} vocabulary items. Each item must have:
- english: the English term (high-utility, accurate spelling)
- uzbek: natural Uzbek translation (in Latin alphabet)
- transcription: accurate IPA phonetic transcription e.g. [ˈbæləns]
- exampleSentence: contextual English example sentence
- exampleSentenceUz: Uzbek translation of the example sentence
- level: CEFR level (A1, A2, B1, B2, or C1)
- partOfSpeech: noun, verb, adjective, adverb, or phrase

Return ONLY valid JSON format (an array of objects), no markdown commentary.`;

    const contents: any[] = [];
    if (imageBase64) {
      const pureBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents.push({
        inlineData: {
          data: pureBase64,
          mimeType: imageMime,
        },
      });
    }
    contents.push(systemPrompt);

    const response = await generateContentWithRetry(ai, contents);
    const cards = extractJsonFromText(response.text || '');

    return res.json({ cards });
  } catch (err: unknown) {
    console.error('Error in /api/ai/flashcards:', err);
    return res.status(500).json({
      error: 'Failed to generate flashcards',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// 3. AI Tutor Chat
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userMessage } = req.body;

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const conversationHistory = Array.isArray(messages)
      ? messages.slice(-8).map((m: { sender: string; text: string }) => `${m.sender === 'user' ? 'Foydalanuvchi' : 'Verbo AI'}: ${m.text}`).join('\n')
      : '';

    const prompt = `Siz Verbo.uz ta'limiy ilovasining mehribon, bilimdon va samimiy ingliz tili repetitorisiz ("Verbo AI").
O'zbek tilida ravon, chiroyli va tushunarli tilda javob berasiz.
Vazifangiz:
- Ingliz tili so'z boyligi, sinonimlar orasidagi nozik farqlar (masalan, look vs see vs watch, high vs tall);
- IELTS Speaking va Writing kollokatsiyalari;
- Grammatika qoidalari va o'zbek/rus tilida so'zlashuvchilar eng ko'p qiladigan xatolarni tushuntirish;
- Interaktiv savol-javoblar va misollar keltirish.

Javobingiz ixcham (1-3 qisqa paragraf), formatlangan (bullet pointlar bilan), amaliy va ruhlantiruvchi bo'lsin.

Avvalgi suhbat:
${conversationHistory}

Foydalanuvchi savoli:
${userMessage}

Javobingiz:`;

    const response = await generateContentWithRetry(ai, prompt);

    return res.json({ reply: response.text });
  } catch (err: unknown) {
    console.error('Error in /api/ai/chat:', err);
    return res.status(500).json({
      error: 'Failed to generate chat response',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// 4. Native Uzbek & English TTS Audio (Gemini Preview TTS with natural human voice)
app.get('/api/tts', async (req: Request, res: Response) => {
  try {
    const text = String(req.query.text || '').trim();
    const lang = String(req.query.lang || 'en').toLowerCase();
    if (!text) {
      return res.status(400).send('Text query param is required');
    }

    // Limit length to avoid abuse
    const cleanText = text.slice(0, 350);
    const cacheKey = `${lang}:${cleanText.toLowerCase()}`;

    // Check cache
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(cached);
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).send('AI service unavailable');
    }

    const isUzbek = lang === 'uz' || /[ʻ’‘ʼ]/.test(cleanText) || /[\u0400-\u04FF]/.test(cleanText);

    const ttsPrompt = isUzbek
      ? `You are an authentic, warm native Uzbek speaker. Read aloud ONLY the exact Uzbek text enclosed in quotes with pure, natural, melodic human Uzbek pronunciation, standard literary dialect (Toshkent/Farg'ona adabiy talaffuzi). Do NOT add any preamble, conversational introductions, greetings, translations, or explanations. Say ONLY: "${cleanText}"`
      : `Read aloud ONLY the exact English text enclosed in quotes with natural, articulate human pronunciation and clear phonetic stress. Do NOT add any introductory words or commentary. Say ONLY: "${cleanText}"`;

    const response = await ai.models.generateContent({
      model: GEMINI_TTS_MODEL,
      contents: ttsPrompt,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Kore',
            },
          },
        },
      },
    });

    const pcmBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!pcmBase64) {
      return res.status(502).send('No audio returned by TTS model');
    }

    const pcmBuffer = Buffer.from(pcmBase64, 'base64');
    const wavBuffer = pcmToWav(pcmBuffer, 24000);

    // Cache up to 150 items
    if (audioCache.size > 150) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, wavBuffer);

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(wavBuffer);
  } catch (err: unknown) {
    const errorObj = err as any;
    const isQuota = errorObj?.status === 429 || (errorObj?.message && String(errorObj.message).includes('429'));
    if (isQuota) {
      return res.status(429).json({ error: 'TTS quota exceeded' });
    }
    console.error('Error in /api/tts:', err);
    return res.status(500).send(err instanceof Error ? err.message : 'TTS Error');
  }
});

// --- Vite Middleware & Production Static Serving ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v5 syntax:
    app.get('*all', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
