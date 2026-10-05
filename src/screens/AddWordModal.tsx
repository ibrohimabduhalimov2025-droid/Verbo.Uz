import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Check,
  UploadCloud,
  BrainCircuit,
  Loader2,
  Trash2,
  BookOpen,
  Layers,
  FileUp,
  X as XIcon,
  CheckCheck,
  Bookmark,
  Plus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCheck,
  RotateCcw,
  FolderHeart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { speakWord, speakUzbek, playChime } from '../utils/srs';

interface ExtractedCandidate {
  english: string;
  uzbek: string;
  partOfSpeech?: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  selected: boolean;
}

interface GeneratedCard {
  english: string;
  uzbek: string;
  transcription: string;
  exampleSentence: string;
  exampleSentenceUz?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  partOfSpeech?: string;
  selected: boolean;
}

export const AddWordModal: React.FC = () => {
  const {
    setCurrentScreen,
    addNewWord,
    addBatchWords,
    topics,
    selectedTopicId,
    decks,
    addNewDeck,
    selectedDeckId,
    setSelectedDeckId,
    addWordDefaultTab,
  } = useApp();

  // Mode: 'single' | 'ai_batch' (defaults to 'ai_batch' if opened from AI generator)
  const [activeTab, setActiveTab] = useState<'single' | 'ai_batch'>(
    addWordDefaultTab || 'ai_batch'
  );

  // Target Personal Collection (Deck) State
  const [targetDeckId, setTargetDeckId] = useState<string>(() => {
    if (selectedDeckId) return selectedDeckId;
    const personal = decks.find((d) => d.isPersonal);
    return personal?.id || decks[0]?.id || '';
  });
  const [isCreatingNewDeck, setIsCreatingNewDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');

  const handleCreateNewDeckInline = () => {
    if (!newDeckName.trim()) return;
    const created = addNewDeck(newDeckName.trim(), newDeckDesc.trim() || undefined);
    setTargetDeckId(created.id);
    setNewDeckName('');
    setNewDeckDesc('');
    setIsCreatingNewDeck(false);
  };

  // Single word state
  const [english, setEnglish] = useState('');
  const [uzbek, setUzbek] = useState('');
  const [transcription, setTranscription] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [exampleUzbek, setExampleUzbek] = useState('');
  const [singleTopicId, setSingleTopicId] = useState(selectedTopicId || topics[0]?.id || 'topic_1');
  const [singleLevel, setSingleLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1'>('B1');
  const [isAiAutoFilling, setIsAiAutoFilling] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Batch AI Generator state (Strictly: 'text' | 'image' | 'file')
  const [aiSourceMode, setAiSourceMode] = useState<'text' | 'image' | 'file'>('text');
  const [sourceText, setSourceText] = useState('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileText, setUploadedFileText] = useState<string | null>(null);

  // Verification & Decision State ('idle' | 'analyzing' | 'valid' | 'invalid')
  const [validationStatus, setValidationStatus] = useState<
    'idle' | 'analyzing' | 'valid' | 'invalid'
  >('idle');
  const [validationSummary, setValidationSummary] = useState('');
  const [candidates, setCandidates] = useState<ExtractedCandidate[]>([]);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Save to Collection dialog state for AI Flashcards
  const [showSaveDeckModal, setShowSaveDeckModal] = useState(false);
  const [collectionSaveMode, setCollectionSaveMode] = useState<'new' | 'existing'>('new');
  const [collectionNameInput, setCollectionNameInput] = useState('Grammar 1');
  const [collectionDescInput, setCollectionDescInput] = useState('');
  const [chosenExistingDeckId, setChosenExistingDeckId] = useState<string>(() => {
    const personal = decks.filter((d) => d.isPersonal);
    return targetDeckId || selectedDeckId || personal[0]?.id || '';
  });

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const anyFileInputRef = useRef<HTMLInputElement | null>(null);

  // Single Word AI Auto-Fill via Gemini
  const handleAiAutoFill = async () => {
    if (!english.trim()) return;
    setIsAiAutoFilling(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/word-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: english.trim() }),
      });

      if (!res.ok) {
        throw new Error('AI ma’lumot olishda xatolik yuz berdi');
      }

      const data = await res.json();
      if (data.english) setEnglish(data.english);
      if (data.uzbek) setUzbek(data.uzbek);
      if (data.transcription) setTranscription(data.transcription);
      if (data.exampleSentence) setExampleSentence(data.exampleSentence);
      if (data.exampleSentenceUz) setExampleUzbek(data.exampleSentenceUz);
      if (data.level) setSingleLevel(data.level);

      playChime('correct');
    } catch (err: unknown) {
      console.warn('AI auto fill error:', err);
      setAiError('AI javob berishda kechikish bo‘ldi. Iltimos qaytadan bosing.');
    } finally {
      setIsAiAutoFilling(false);
    }
  };

  // Handle Any File Upload (PDF, DOCX, TXT, CSV, JSON, MD)
  const handleAnyFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setGenerationError(null);
    setValidationStatus('idle');
    setCandidates([]);
    setGeneratedCards([]);

    try {
      if (
        file.type.includes('text') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.json')
      ) {
        const text = await file.text();
        setUploadedFileText(text.slice(0, 15000));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const cleanMatches = content.match(/[A-Za-z]{3,30}/g);
          if (cleanMatches && cleanMatches.length > 0) {
            setUploadedFileText(cleanMatches.slice(0, 800).join(' '));
          } else {
            setUploadedFileText(`Fayl: ${file.name}`);
          }
        };
        reader.readAsBinaryString(file);
      }
    } catch (err) {
      console.warn('File read error:', err);
      setUploadedFileText(`Fayl yuklandi: ${file.name}`);
    }
  };

  // Image upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGenerationError(null);
    setValidationStatus('idle');
    setCandidates([]);
    setGeneratedCards([]);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImagePreview(result);
      setUploadedImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // STEP 1: AI Analyzes & Validates Input ("x yoki true belgisi chiqsin")
  const handleAnalyzeInput = async () => {
    if (aiSourceMode === 'text' && !sourceText.trim()) {
      setGenerationError('Iltimos, matn nusxasini kiriting');
      return;
    }
    if (aiSourceMode === 'image' && !uploadedImageBase64) {
      setGenerationError('Iltimos, rasm yoki skan yuklang');
      return;
    }
    if (aiSourceMode === 'file' && !uploadedFileText && !uploadedFileName) {
      setGenerationError('Iltimos, fayl (PDF, DOCX, TXT va h.k.) yuklang');
      return;
    }

    setValidationStatus('analyzing');
    setGenerationError(null);
    setCandidates([]);
    setGeneratedCards([]);

    try {
      const payload: Record<string, any> = {};

      if (aiSourceMode === 'text') {
        payload.text = sourceText.trim();
      } else if (aiSourceMode === 'image') {
        payload.imageBase64 = uploadedImageBase64;
      } else if (aiSourceMode === 'file') {
        payload.fileText = uploadedFileText || uploadedFileName;
      }

      const res = await fetch('/api/ai/extract-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Tahlil jarayonida xatolik yuz berdi');
      }

      const data = await res.json();

      // Check validation result from AI
      if (data.isValid === true && Array.isArray(data.words) && data.words.length > 0) {
        const mapped: ExtractedCandidate[] = data.words.map((w: any) => ({
          english: w.english || '',
          uzbek: w.uzbek || '',
          partOfSpeech: w.partOfSpeech || 'noun',
          level: w.level || 'B1',
          selected: true, // Marked as true by default
        }));

        setCandidates(mapped);
        setValidationSummary(data.summary || `${mapped.length} ta so‘z aniqlandi`);
        setValidationStatus('valid');
        playChime('correct');
      } else {
        setValidationStatus('invalid');
        setValidationSummary(
          data.summary || 'Kiritilgan materialda o‘rganish uchun mos inglizcha so‘zlar aniqlanmadi'
        );
        playChime('wrong');
      }
    } catch (err: unknown) {
      console.error('Extract error:', err);
      setValidationStatus('invalid');
      setValidationSummary(
        err instanceof Error ? err.message : 'Tahlil jarayonida xatolik yuz berdi'
      );
      playChime('wrong');
    }
  };

  // STEP 2: Generate Flashcards ONLY after user marks / confirms "✓ True"
  const handleGenerateCardsForSelected = async () => {
    const selected = candidates.filter((c) => c.selected);
    if (selected.length === 0) {
      setGenerationError('Iltimos, kamida bitta so‘z uchun ✓ True belgisini qoldiring');
      return;
    }

    setIsGeneratingCards(true);
    setGenerationError(null);
    setGeneratedCards([]);

    try {
      const payload = {
        selectedWords: selected.map((s) => ({
          english: s.english,
          uzbek: s.uzbek,
          level: s.level,
          partOfSpeech: s.partOfSpeech,
        })),
      };

      const res = await fetch('/api/ai/generate-selected-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Flashcardlarni shakllantirishda xatolik yuz berdi');
      }

      const data = await res.json();
      if (Array.isArray(data.cards) && data.cards.length > 0) {
        const mapped: GeneratedCard[] = data.cards.map((c: any) => ({
          english: c.english || '',
          uzbek: c.uzbek || '',
          transcription: c.transcription || `/${(c.english || '').toLowerCase()}/`,
          exampleSentence: c.exampleSentence || '',
          exampleSentenceUz: c.exampleSentenceUz || '',
          level: c.level || 'B1',
          partOfSpeech: c.partOfSpeech || 'noun',
          selected: true,
        }));

        setGeneratedCards(mapped);
        playChime('win');
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        } catch {}
      } else {
        throw new Error('Flashcardlar shakllanmadi. Qaytadan urinib ko‘ring.');
      }
    } catch (err: unknown) {
      console.error('Generate cards error:', err);
      setGenerationError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setIsGeneratingCards(false);
    }
  };

  // Candidate Selection (Toggle ✓ True vs ✕)
  const toggleCandidateTrue = (index: number) => {
    setCandidates((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const removeCandidateRow = (index: number) => {
    setCandidates((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleAllCandidates = (select: boolean) => {
    setCandidates((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  // Reset verification to analyze another material
  const handleResetAnalysis = () => {
    setValidationStatus('idle');
    setCandidates([]);
    setGeneratedCards([]);
    setGenerationError(null);
  };

  // Save single word (Tab 1)
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!english.trim() || !uzbek.trim()) return;

    let finalDeckId = targetDeckId;
    if (isCreatingNewDeck && newDeckName.trim()) {
      const created = addNewDeck(newDeckName.trim(), newDeckDesc.trim() || undefined);
      finalDeckId = created.id;
    }

    addNewWord(
      {
        english: english.trim(),
        uzbek: uzbek.trim(),
        transcription: transcription.trim() || `/${english.toLowerCase()}/`,
        exampleSentence: exampleSentence.trim(),
        exampleUzbek: exampleUzbek.trim() || undefined,
        topicId: singleTopicId,
        level: singleLevel,
      },
      finalDeckId
    );

    if (finalDeckId) {
      setSelectedDeckId(finalDeckId);
    }

    playChime('correct');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {}
    setCurrentScreen('vocabulary');
  };

  // Save generated batch flashcards directly to named collection
  const handleSaveBatchCards = (startSession: boolean = true) => {
    const selected = generatedCards.filter((c) => c.selected);
    if (selected.length === 0) return;

    let effectiveDeckId = '';
    if (collectionSaveMode === 'new') {
      const finalName = collectionNameInput.trim() || 'Grammar 1';
      const createdDeck = addNewDeck(
        finalName,
        collectionDescInput.trim() || 'AI orqali yaratilgan shaxsiy to‘plam'
      );
      effectiveDeckId = createdDeck.id;
    } else {
      effectiveDeckId =
        chosenExistingDeckId ||
        decks.find((d) => d.isPersonal)?.id ||
        decks[0]?.id ||
        '';
      if (!effectiveDeckId) {
        const createdDeck = addNewDeck(
          'Grammar 1',
          'AI orqali yaratilgan shaxsiy to‘plam'
        );
        effectiveDeckId = createdDeck.id;
      }
    }

    const wordPayloads = selected.map((c) => ({
      english: c.english,
      uzbek: c.uzbek,
      transcription: c.transcription,
      exampleSentence: c.exampleSentence,
      exampleUzbek: c.exampleSentenceUz,
      topicId: singleTopicId || 'topic_1',
      level: c.level,
      partOfSpeech: c.partOfSpeech,
    }));

    addBatchWords(wordPayloads, effectiveDeckId);

    if (effectiveDeckId) {
      setSelectedDeckId(effectiveDeckId);
    }

    playChime('win');
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
    } catch {}

    setShowSaveDeckModal(false);

    if (startSession) {
      setCurrentScreen('flashcards');
    } else {
      setCurrentScreen('vocabulary');
    }
  };

  const selectedCandidateCount = candidates.filter((c) => c.selected).length;

  return (
    <div id="add-word-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('vocabulary')}
          className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga</span>
        </button>

        <span className="text-xs font-bold text-stone-900">
          {activeTab === 'single' ? 'Yagona so‘z qo‘shish' : 'AI Flashcard Generator'}
        </span>
        <div className="w-10" />
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-stone-200/80 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('single')}
          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'single'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Yagona so‘z</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ai_batch')}
          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'ai_batch'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-700 hover:text-indigo-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Flashcard Generator</span>
        </button>
      </div>

      {/* ================= TAB 1: SINGLE WORD ================= */}
      {activeTab === 'single' && (
        <form
          onSubmit={handleSingleSubmit}
          className="space-y-3.5 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs"
        >
          {/* Quick AI Info Banner */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600 shrink-0" />
              <p className="text-[11px] text-indigo-950 font-medium leading-tight">
                Inglizcha so‘zni yozib, <span className="font-bold">"Avto-to‘ldirish"</span> tugmasini bosing — AI qolgan barcha ma’lumotlarni to‘ldirib beradi.
              </p>
            </div>
          </div>

          {/* English Word */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Inglizcha so‘z *
              </label>
              {english.trim() && (
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={isAiAutoFilling}
                  className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 cursor-pointer"
                >
                  {isAiAutoFilling ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                      <span>Aniqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>AI Avto-to‘ldirish</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="Masalan: Resilient"
                className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-semibold focus:outline-hidden focus:border-indigo-500 shadow-2xs pr-12"
              />
              {english.trim() && (
                <button
                  type="button"
                  onClick={() => speakWord(english.trim(), undefined, 'en')}
                  className="absolute right-2 p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                  title="Inglizcha talaffuz"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {aiError && <p className="text-[11px] text-rose-500 mt-1">{aiError}</p>}
          </div>

          {/* Uzbek Translation */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              O‘zbekcha tarjimasi *
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={uzbek}
                onChange={(e) => setUzbek(e.target.value)}
                placeholder="Masalan: Bosh egmas, chidamli"
                className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs pr-12"
              />
              {uzbek.trim() && (
                <button
                  type="button"
                  onClick={() => speakUzbek(uzbek.trim())}
                  className="absolute right-2 p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer"
                  title="O‘zbekcha talaffuz"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                </button>
              )}
            </div>
          </div>

          {/* Pronunciation / Transcription */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Transkripsiya / Talaffuz belgisi (IPA)
            </label>
            <input
              type="text"
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder="Masalan: /rɪˈzɪl.jənt/"
              className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-mono focus:outline-hidden focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* Example Sentence */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Misol jumla (Inglizcha kontekst)
            </label>
            <textarea
              rows={2}
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
              placeholder="He is a resilient person who never gives up."
              className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs resize-none"
            />
          </div>

          {/* Example Sentence Uzbek */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Misol jumlasi tarjimasi (O‘zbekcha)
            </label>
            <textarea
              rows={2}
              value={exampleUzbek}
              onChange={(e) => setExampleUzbek(e.target.value)}
              placeholder="U hech qachon taslim bo‘lmaydigan chidamli insondir."
              className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs resize-none"
            />
          </div>

          {/* Topic and Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mavzu
              </label>
              <select
                value={singleTopicId}
                onChange={(e) => setSingleTopicId(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Daraja (CEFR)
              </label>
              <select
                value={singleLevel}
                onChange={(e) => setSingleLevel(e.target.value as 'A1' | 'A2' | 'B1' | 'B2' | 'C1')}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
              >
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper-Int</option>
                <option value="C1">C1 - Advanced</option>
              </select>
            </div>
          </div>

          {/* Shaxsiy to'plam tanlash */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-indigo-600" />
                <span>To‘plam (Kartoteka)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingNewDeck(!isCreatingNewDeck)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi to‘plam</span>
              </button>
            </div>

            {isCreatingNewDeck && (
              <div className="bg-white p-3 rounded-xl border border-indigo-300 shadow-2xs space-y-2 animate-in fade-in">
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Yangi to‘plam nomi (masalan: IELTS 2026)"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-indigo-500 font-medium"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDeckDesc}
                    onChange={(e) => setNewDeckDesc(e.target.value)}
                    placeholder="Qisqa tavsif (ixtiyoriy)"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleCreateNewDeckInline}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shrink-0 cursor-pointer"
                  >
                    Yaratish
                  </button>
                </div>
              </div>
            )}

            {decks.length === 0 ? (
              <div className="text-center py-4 px-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs">
                <p className="font-semibold text-stone-700 mb-1">Shaxsiy to‘plamlar mavjud emas</p>
                <p className="text-[11px] text-stone-400 mb-2">
                  So‘zni saqlash uchun yuqoridagi «+ Yangi to‘plam yaratish» tugmasini bosing
                </p>
                {!isCreatingNewDeck && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewDeck(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Yangi to‘plam yaratish
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-0.5">
                {decks.map((deck) => {
                  const isSelected = targetDeckId === deck.id;
                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => setTargetDeckId(deck.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xs'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-stone-900 truncate flex items-center gap-1.5">
                          <span>{deck.name}</span>
                          {deck.isPersonal && (
                            <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
                              Shaxsiy
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          {deck.words.length} ta so‘z
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>So‘zni lug‘atga saqlash</span>
          </button>
        </form>
      )}

      {/* ================= TAB 2: AI FLASHCARD GENERATOR ================= */}
      {activeTab === 'ai_batch' && (
        <div className="space-y-4">
          {/* Main Controls Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Flashcard Generator</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Matn nusxasi, rasm skan yoki istalgan faylni kiriting. Sun’iy intellekt tahlil qilib x yoki true belgisini ko‘rsatadi, siz faqat <span className="font-bold text-emerald-600">✓ True</span> belgilaganingizdan keyin fleshkartalar yasaladi.
              </p>
            </div>

            {/* 3 Source Selectors ONLY: Text | Image | File */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAiSourceMode('text');
                  handleResetAnalysis();
                }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  aiSourceMode === 'text'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Matn nusxasi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAiSourceMode('image');
                  handleResetAnalysis();
                }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  aiSourceMode === 'image'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Rasm / Skan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAiSourceMode('file');
                  handleResetAnalysis();
                }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  aiSourceMode === 'file'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <FileUp className="w-4 h-4 text-indigo-600" />
                <span>Istalgan fayl</span>
              </button>
            </div>

            {/* Dynamic Input based on source */}
            {aiSourceMode === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Inglizcha matn, maqola, darslik yoki dialog nusxasi
                </label>
                <textarea
                  rows={5}
                  value={sourceText}
                  onChange={(e) => {
                    setSourceText(e.target.value);
                    if (validationStatus !== 'idle') {
                      setValidationStatus('idle');
                    }
                  }}
                  placeholder="Ixtiyoriy inglizcha matnni bu yerga qo‘ying. AI tahlil qiladi va x yoki true belgisini ko‘rsatadi..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>
            )}

            {aiSourceMode === 'image' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kitob sahifasi, konspekt yoki lug‘at rasmi/skani
                </label>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer bg-stone-50 hover:bg-indigo-50/30 transition-colors"
                >
                  {uploadedImagePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={uploadedImagePreview}
                        alt="Uploaded preview"
                        className="max-h-36 rounded-xl object-contain shadow-xs mb-2"
                      />
                      <span className="text-xs text-indigo-600 font-bold">
                        Boshqa rasm tanlash
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-stone-500">
                      <UploadCloud className="w-7 h-7 text-stone-400" />
                      <span className="text-xs font-semibold text-stone-700">
                        Rasmni yuklash yoki skanni tanlash
                      </span>
                      <span className="text-[11px] text-stone-400">
                        PNG, JPG yoki WebP (Kitob sahifasi, lug‘at yoki konspekt)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {aiSourceMode === 'file' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Istalgan faylni yuklang (PDF, DOCX, TXT, CSV, EPUB, JSON)
                </label>
                <input
                  type="file"
                  ref={anyFileInputRef}
                  accept=".pdf,.docx,.doc,.txt,.csv,.json,.md,.epub"
                  onChange={handleAnyFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => anyFileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer bg-stone-50 hover:bg-indigo-50/30 transition-colors"
                >
                  {uploadedFileName ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <FileCheck className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-stone-900">{uploadedFileName}</span>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        ✓ Fayl yuklandi va AI tahliliga tayyor
                      </span>
                      <span className="text-[10px] text-indigo-600 underline mt-1">
                        Boshqa fayl tanlash
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-stone-500">
                      <FileUp className="w-7 h-7 text-stone-400" />
                      <span className="text-xs font-semibold text-stone-700">
                        Faylni tanlash yoki shu yerga tashlash
                      </span>
                      <span className="text-[11px] text-stone-400">
                        PDF darslik, Word konspekt, TXT lug‘at yoki maqola
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analysis Action Button */}
            {validationStatus !== 'valid' && (
              <button
                type="button"
                disabled={validationStatus === 'analyzing'}
                onClick={handleAnalyzeInput}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {validationStatus === 'analyzing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sun’iy intellekt tahlil qilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Sun’iy intellekt orqali tahlil qilish</span>
                  </>
                )}
              </button>
            )}

            {generationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{generationError}</span>
              </div>
            )}
          </div>

          {/* ================= STEP 2A: AI REJECTED / INVALID (✕) ================= */}
          {validationStatus === 'invalid' && (
            <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <XIcon className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-600 text-white">
                      ✕ Yaroqsiz material
                    </span>
                    <span className="text-xs font-bold text-rose-900">
                      Sun’iy intellekt xulosasi
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 font-medium mt-1 leading-relaxed">
                    {validationSummary ||
                      'Kiritilgan matn, rasm yoki faylda o‘rganish uchun inglizcha so‘zlar aniqlanmadi.'}
                  </p>
                  <p className="text-[11px] text-rose-600 mt-1">
                    Iltimos, inglizcha matn, boshqa sifatli kitob fotosurati yoki hujjat yuklab qaytadan urinib ko‘ring.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAnalysis}
                className="w-full py-2.5 rounded-xl bg-white border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-100/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Qaytadan boshqa material kiritish</span>
              </button>
            </div>
          )}

          {/* ================= STEP 2B: AI VALIDATED (✓ True) REVIEW ================= */}
          {/* User must explicitly confirm "✓ True" before AI generates cards */}
          {validationStatus === 'valid' && candidates.length > 0 && generatedCards.length === 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4 animate-in fade-in">
              {/* Validation Status Badge & Explanatory Card */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>✓ True</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-950">
                      Material yaroqli deb topildi
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    {candidates.length} ta so‘z aniqlandi
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-snug">
                  Sun’iy intellekt materialni tahlil qildi. Flashcardlarni yasash uchun{' '}
                  <span className="font-bold underline">✓ True</span> belgisini tasdiqlang.
                </p>
              </div>

              {/* Explicit User Decision Options: [✕ Bekor qilish] and [✓ True: Fleshkartalar yasalsin] */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleResetAnalysis}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <XIcon className="w-4 h-4 text-stone-500" />
                  <span>✕ Bekor qilish</span>
                </button>

                <button
                  type="button"
                  disabled={isGeneratingCards || selectedCandidateCount === 0}
                  onClick={handleGenerateCardsForSelected}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingCards ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Fleshkartalarni yasamoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>
                        ✓ True — Fleshkartalar yasalsin ({selectedCandidateCount} ta)
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Table / List of Detected Words with ✓ True / ✕ Toggles */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-stone-800">
                    Aniqlangan so‘zlar ro‘yxati:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAllCandidates(true)}
                      className="text-[11px] font-bold text-emerald-700 hover:underline px-2 py-0.5 bg-emerald-50 rounded-md cursor-pointer"
                    >
                      Barchasini True qilish
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAllCandidates(false)}
                      className="text-[11px] font-bold text-stone-500 hover:underline px-2 py-0.5 bg-stone-100 rounded-md cursor-pointer"
                    >
                      Barchasini bekor qilish
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto pr-1">
                  {candidates.map((cand, idx) => (
                    <div
                      key={idx}
                      className={`py-2.5 px-2.5 flex items-center justify-between gap-3 rounded-xl transition-colors ${
                        cand.selected
                          ? 'bg-emerald-50/50 hover:bg-emerald-50/80 border border-emerald-100'
                          : 'bg-stone-50/60 opacity-60 border border-transparent'
                      }`}
                    >
                      {/* Left: English & Listen button */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => speakWord(cand.english, undefined, 'en')}
                          className="p-1 rounded-md text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0 cursor-pointer"
                          title="Tinglash"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-stone-900 block truncate">
                            {cand.english}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {cand.level && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700">
                                {cand.level}
                              </span>
                            )}
                            {cand.partOfSpeech && (
                              <span className="text-[10px] text-stone-400 italic">
                                {cand.partOfSpeech}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Uzbek translation */}
                      <div className="flex-1 min-w-0 text-right sm:text-left">
                        <span className="text-xs font-semibold text-stone-700 block truncate">
                          {cand.uzbek}
                        </span>
                      </div>

                      {/* Right: ✓ True toggle and ✕ remove */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleCandidateTrue(idx)}
                          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                            cand.selected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-200 text-stone-500 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                          title={cand.selected ? 'True (Tanlangan)' : 'True qilish'}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>True</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeCandidateRow(idx)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Olib tashlash"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: GENERATED RICH FLASHCARDS ================= */}
          {generatedCards.length > 0 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-900">
                    Tayyor flashcardlar: {generatedCards.length} ta
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allSelected = generatedCards.every((c) => c.selected);
                    setGeneratedCards((prev) =>
                      prev.map((c) => ({ ...c, selected: !allSelected }))
                    );
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  {generatedCards.every((c) => c.selected)
                    ? 'Barchasini bekor qilish'
                    : 'Barchasini tanlash'}
                </button>
              </div>

              {/* Cards List */}
              <div className="space-y-2">
                {generatedCards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl p-3.5 border transition-all ${
                      card.selected
                        ? 'border-indigo-300 shadow-2xs'
                        : 'border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={card.selected}
                          onChange={() => {
                            setGeneratedCards((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, selected: !c.selected } : c))
                            );
                          }}
                          className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          {/* English word & transcription */}
                          <div className="flex items-baseline gap-2 flex-wrap mb-1">
                            <span className="font-display font-extrabold text-stone-900 text-sm">
                              {card.english}
                            </span>
                            <span className="font-mono text-stone-400 text-xs">
                              {card.transcription}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              {card.level}
                            </span>
                            {card.partOfSpeech && (
                              <span className="text-[10px] text-stone-400 italic">
                                {card.partOfSpeech}
                              </span>
                            )}
                          </div>

                          {/* Uzbek translation */}
                          <div className="text-xs font-bold text-indigo-700 mb-1.5 flex items-center gap-2">
                            <span>{card.uzbek}</span>
                          </div>

                          {/* Contextual example */}
                          {card.exampleSentence && (
                            <div className="text-[11px] text-stone-600 bg-stone-50 rounded-lg p-2 border border-stone-100">
                              <p className="italic font-medium text-stone-800">
                                "{card.exampleSentence}"
                              </p>
                              {card.exampleSentenceUz && (
                                <p className="text-stone-500 text-[10px] mt-0.5">
                                  "{card.exampleSentenceUz}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons: EN Audio, UZ Audio, Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => speakWord(card.english, undefined, 'en')}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Inglizcha talaffuz"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => speakUzbek(card.uzbek)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="O‘zbekcha talaffuz"
                        >
                          <Volume2 className="w-4 h-4 text-amber-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedCards((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Ro‘yxatdan o‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Save Action Button (Prompts user for collection name e.g. Grammar 1) */}
              <button
                type="button"
                onClick={() => setShowSaveDeckModal(true)}
                className="w-full mt-3 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  ✓ Fleshkartalarni to‘plamga saqlash (
                  {generatedCards.filter((c) => c.selected).length} ta)
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: To'plam nomini belgilash va saqlash */}
      {showSaveDeckModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-stone-200 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <FolderHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Shaxsiy to‘plamga saqlash
                  </h3>
                  <p className="text-xs text-stone-500">
                    Flashcardlar qaysi to‘plam ichida saqlansin?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveDeckModal(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Mode: Yangi to'plam vs Mavjud to'plam */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setCollectionSaveMode('new')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  collectionSaveMode === 'new'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Yangi to‘plam
              </button>
              <button
                type="button"
                onClick={() => setCollectionSaveMode('existing')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  collectionSaveMode === 'existing'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Mavjud to‘plam ({decks.filter((d) => d.isPersonal).length})
              </button>
            </div>

            {collectionSaveMode === 'new' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    To‘plam nomi (Masalan: Grammar 1) *
                  </label>
                  <input
                    type="text"
                    required
                    value={collectionNameInput}
                    onChange={(e) => setCollectionNameInput(e.target.value)}
                    placeholder="Masalan: Grammar 1"
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  />
                  {/* Quick suggestion chips */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[11px] text-stone-400">Takliflar:</span>
                    {['Grammar 1', 'IELTS Vocab', 'Daily English', 'Medical Terms', 'Grammar 2'].map(
                      (suggest) => (
                        <button
                          key={suggest}
                          type="button"
                          onClick={() => setCollectionNameInput(suggest)}
                          className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-medium text-stone-600 transition-colors cursor-pointer"
                        >
                          {suggest}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Qisqacha tavsif (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={collectionDescInput}
                    onChange={(e) => setCollectionDescInput(e.target.value)}
                    placeholder="Masalan: Grammatika va yangi so‘zlar"
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mavjud shaxsiy to‘plamni tanlang:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {decks.filter((d) => d.isPersonal).length === 0 ? (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                      Mavjud to‘plamlar yo‘q. Yuqoridagi «Yangi to‘plam yaratish» orqali nom bering (masalan: <strong>Grammar 1</strong>).
                    </div>
                  ) : (
                    decks
                      .filter((d) => d.isPersonal)
                      .map((deck) => {
                        const isSel = chosenExistingDeckId === deck.id;
                        return (
                          <button
                            key={deck.id}
                            type="button"
                            onClick={() => setChosenExistingDeckId(deck.id)}
                            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSel
                                ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                                : 'bg-white border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div>
                              <span className="text-xs font-bold text-stone-900 block truncate">
                                {deck.name}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                {deck.words.length} ta so‘z
                              </span>
                            </div>
                            {isSel && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </button>
                        );
                      })
                  )}
                </div>
              </div>
            )}

            {/* Info badge */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Tanlangan <strong>{generatedCards.filter((c) => c.selected).length} ta flashcard</strong> ushbu to‘plamga joylanadi.
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleSaveBatchCards(true)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saqlash va Fleshkartalarni boshlash</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveBatchCards(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-200"
              >
                <FolderHeart className="w-4 h-4 text-indigo-600" />
                <span>Shaxsiy to‘plamga saqlash (Lug‘atda ko‘rish)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
