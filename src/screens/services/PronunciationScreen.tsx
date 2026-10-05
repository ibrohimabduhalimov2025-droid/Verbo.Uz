import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
  Sparkles,
  Star,
  ChevronRight,
  Info,
  BookMarked,
  FolderKanban,
  Zap,
  PlayCircle,
  Headphones,
  Gauge,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { speakWord, speakUzbek, stopSpeech } from '../../utils/srs';

interface WordPracticeItem {
  word: string;
  transcription: string;
  uzbek: string;
  difficulty?: 'Oson' | 'O‘rtacha' | 'Qiyin';
  tip?: string;
  source?: string;
}

const DEFAULT_PHONETIC_WORDS: WordPracticeItem[] = [
  {
    word: 'Comfortable',
    transcription: '/ˈkʌmftəbl/',
    uzbek: 'Qulay, shinam',
    difficulty: 'Qiyin',
    tip: 'Diqqat: "com-for-ta-ble" deb 4 bo‘g‘in emas, "KUMF-tə-bl" deb 3 bo‘g‘inda aytiladi.',
  },
  {
    word: 'Thoroughly',
    transcription: '/ˈθʌrəli/',
    uzbek: 'Mukammal, har tomonlama',
    difficulty: 'Qiyin',
    tip: '"th" tovushida til tishlar orasiga qo‘yiladi, so‘ng "ruh-li" deb o‘qiladi.',
  },
  {
    word: 'Schedule',
    transcription: '/ˈskedʒuːl/',
    uzbek: 'Jadval, reja',
    difficulty: 'O‘rtacha',
    tip: 'Amerikancha talaffuzda: "sked-jool", Britancha talaffuzda esa "shed-yool".',
  },
  {
    word: 'Entrepreneur',
    transcription: '/ˌɒntrəprəˈnɜːr/',
    uzbek: 'Tadbirkor',
    difficulty: 'Qiyin',
    tip: 'Fransuzcha ildizga ega: oxirgi urg‘u "nɜːr" bo‘g‘iniga tushadi.',
  },
  {
    word: 'Vegetable',
    transcription: '/ˈvedʒtəbl/',
    uzbek: 'Sabzavot',
    difficulty: 'O‘rtacha',
    tip: '"ve-ge-ta-ble" emas, "VEDJ-tə-bl" deb ikkinchi "e" harfi tushirib qoldiriladi.',
  },
  {
    word: 'Development',
    transcription: '/dɪˈveləpmənt/',
    uzbek: 'Rivojlanish',
    difficulty: 'O‘rtacha',
    tip: 'Urg‘u ikkinchi bo‘g‘inga "VEL" ga tushadi: di-VEL-op-ment.',
  },
  {
    word: 'Pronunciation',
    transcription: '/prəˌnʌnsiˈeɪʃn/',
    uzbek: 'Talaffuz',
    difficulty: 'Qiyin',
    tip: '"pronounce" emas, "pro-NUN-ci-a-tion" deb o‘rtasi "nun" aytiladi.',
  },
];

// Helper: Levenshtein distance for realistic pronunciation accuracy
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;

  const matrix: number[][] = [];
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const distance = matrix[s1.length][s2.length];
  const maxLen = Math.max(s1.length, s2.length);
  const ratio = Math.max(0, 1 - distance / maxLen);
  return Math.round(ratio * 100);
}

export const PronunciationScreen: React.FC = () => {
  const {
    setCurrentScreen,
    user,
    updateUserProfile,
    words,
    topics,
    cefrLevelWords,
    selectedCefrLevel,
    loadCefrWordsForLevel,
  } = useApp();

  useEffect(() => {
    if (cefrLevelWords.length === 0) {
      loadCefrWordsForLevel(selectedCefrLevel || user.level || 'A1');
    }
  }, [cefrLevelWords.length, selectedCefrLevel, user.level]);

  // Word Source: 'phonetics' | 'my_vocab' | 'topic'
  const [sourceType, setSourceType] = useState<'phonetics' | 'my_vocab' | 'topic'>('phonetics');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>(topics[0]?.id || '');

  // Derived list of words to practice
  const [practiceList, setPracticeList] = useState<WordPracticeItem[]>(DEFAULT_PHONETIC_WORDS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Playback & Speed
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Recording & Evaluation
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);

  // Update practice list whenever source changes
  useEffect(() => {
    if (sourceType === 'phonetics') {
      setPracticeList(DEFAULT_PHONETIC_WORDS);
    } else if (sourceType === 'my_vocab') {
      const pool = words.length > 0 ? words : cefrLevelWords;
      if (pool.length > 0) {
        setPracticeList(
          pool.slice(0, 30).map((w) => ({
            word: w.english,
            transcription: w.transcription,
            uzbek: w.uzbek,
            difficulty: w.level === 'C1' || w.level === 'B2' ? 'Qiyin' : 'O‘rtacha',
            tip: w.exampleSentence ? `Kontekst: "${w.exampleSentence}"` : `Lug‘atdagi so‘z: ${w.uzbek}`,
            source: 'Lug‘at bazasi',
          }))
        );
      } else {
        setPracticeList(DEFAULT_PHONETIC_WORDS);
      }
    } else if (sourceType === 'topic') {
      const pool = words.length > 0 ? words : cefrLevelWords;
      const filtered = pool.filter(
        (w) => w.topicId === selectedTopicFilter || w.category === selectedTopicFilter
      );
      const listToUse = filtered.length > 0 ? filtered : pool.slice(0, 30);
      if (listToUse.length > 0) {
        setPracticeList(
          listToUse.map((w) => ({
            word: w.english,
            transcription: w.transcription,
            uzbek: w.uzbek,
            difficulty: 'O‘rtacha',
            tip: w.exampleSentence ? `Misol: "${w.exampleSentence}"` : undefined,
            source: 'Mavzu bo‘yicha',
          }))
        );
      } else {
        setPracticeList(DEFAULT_PHONETIC_WORDS);
      }
    }
    setCurrentIndex(0);
    resetState();
  }, [sourceType, selectedTopicFilter, words, cefrLevelWords]);

  const currentItem = practiceList[currentIndex] || DEFAULT_PHONETIC_WORDS[0];

  const resetState = () => {
    stopSpeech();
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setIsPlayingAudio(false);
    setCountdown(null);
    setIsRecording(false);
    setSpokenText(null);
    setScore(null);
    setFeedback(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    resetState();
  }, [currentIndex]);

  // Handle Speech Recognition
  const startRecording = () => {
    stopSpeech();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setIsPlayingAudio(false);
    setCountdown(null);
    setIsRecording(true);
    setSpokenText(null);
    setScore(null);
    setFeedback(null);
    setErrorMessage(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;

        recognition.onresult = (event: any) => {
          const results = event.results[0];
          // Check best alternative
          let bestTranscript = results[0].transcript;
          let bestScore = -1;

          for (let i = 0; i < results.length; i++) {
            const transcript = results[i].transcript;
            const sim = evaluateTranscriptScore(transcript, currentItem.word);
            if (sim > bestScore) {
              bestScore = sim;
              bestTranscript = transcript;
            }
          }

          processSpokenWord(bestTranscript, bestScore);
        };

        recognition.onerror = (event: any) => {
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            setErrorMessage('Mikrofon ruxsati berilmadi. Iltimos brauzer sozlamalaridan mikrofonga ruxsat bering.');
          } else if (event.error === 'no-speech') {
            setErrorMessage('Ovoz eshitilmadi. Iltimos, mikrofonga yaqinroq kelib aniq gapiring.');
          } else {
            setErrorMessage(`Mikrofon xatosi: ${event.error}. Qayta urinib ko‘ring.`);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch (err) {
        console.warn('SpeechRecognition start error:', err);
        setIsRecording(false);
        setErrorMessage('Brauzeringizda ovoz tanish xizmati ishga tushmadi. Mikrofonni tekshiring.');
      }
    } else {
      setIsRecording(false);
      setErrorMessage('Ushbu brauzerda Web Speech API qo‘llab-quvvatlanmaydi. Chrome yoki Edge brauzeridan foydalaning.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  };

  const evaluateTranscriptScore = (spoken: string, target: string): number => {
    const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/gi, '').trim();
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();

    if (cleanSpoken === cleanTarget) return 98;

    // Check if target is inside multi-word utterance (e.g. "a comfortable", "comfortable please")
    const words = cleanSpoken.split(/\s+/);
    let maxTokenSim = 0;
    for (const w of words) {
      const sim = calculateSimilarity(w, cleanTarget);
      if (sim > maxTokenSim) maxTokenSim = sim;
    }

    const fullSim = calculateSimilarity(cleanSpoken, cleanTarget);
    return Math.max(maxTokenSim, fullSim);
  };

  const processSpokenWord = (spoken: string, calculatedScore: number) => {
    setIsRecording(false);
    setSpokenText(spoken);

    // Bound score
    const finalScore = Math.min(100, Math.max(30, calculatedScore));
    setScore(finalScore);

    if (finalScore >= 90) {
      setFeedback('A’lo darajada! Talaffuz, urg‘u va bo‘g‘inlar to‘liq to‘g‘ri aytildi.');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {}
      updateUserProfile({ stars: user.stars + 3 });
    } else if (finalScore >= 75) {
      setFeedback('Yaxshi! Asosiy fonetika to‘g‘ri, urg‘u berilgan bo‘g‘inni biroz aniqroq ayting.');
    } else if (finalScore >= 50) {
      setFeedback('O‘rtacha. Namunani sekinroq (0.8x) eshitib ko‘rib, qaytadan urinib ko‘ring.');
    } else {
      setFeedback('Talaffuzda noaniqlik bor. Namunadagi tovushlarga diqqat qilib takrorlang.');
    }
  };

  // Listen sample then auto-activate mic with polite countdown
  const handleListenThenSpeak = () => {
    setIsPlayingAudio(true);
    setSpokenText(null);
    setScore(null);
    setFeedback(null);
    setErrorMessage(null);
    setCountdown(null);

    speakWord(
      currentItem.word,
      () => {
        // Audio finished -> 3, 2, 1 countdown before listening
        setIsPlayingAudio(false);
        let count = 2;
        setCountdown(count);

        countdownTimerRef.current = setInterval(() => {
          count -= 1;
          if (count > 0) {
            setCountdown(count);
          } else {
            clearInterval(countdownTimerRef.current);
            setCountdown(null);
            startRecording();
          }
        }, 600);
      },
      'en',
      playbackSpeed
    );
  };

  const handleNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % practiceList.length);
  };

  return (
    <div id="pronunciation-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopSpeech();
            setCurrentScreen('services');
          }}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-stone-800">AI Talaffuz Murabbiyi</span>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>+3 yulduz</span>
        </div>
      </div>

      {/* Word Source Selection */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mashq qilish manbasi:</span>
          </span>
          <span className="text-stone-400">
            {practiceList.length} ta so‘z
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSourceType('phonetics')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              sourceType === 'phonetics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Qiyin so‘zlar</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType('my_vocab')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              sourceType === 'my_vocab'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <BookMarked className="w-3 h-3" />
            <span>Mening lug‘atim</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType('topic')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              sourceType === 'topic'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FolderKanban className="w-3 h-3" />
            <span>Mavzu bo‘yicha</span>
          </button>
        </div>

        {sourceType === 'topic' && (
          <select
            value={selectedTopicFilter}
            onChange={(e) => setSelectedTopicFilter(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:border-indigo-500 mt-1"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Progress & Speed Selector Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-stone-500">
          So‘z {currentIndex + 1} / {practiceList.length}
        </span>

        {/* Speed switch: 1.0x vs 0.8x */}
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
          <Gauge className="w-3 h-3 text-stone-500 ml-1" />
          <button
            type="button"
            onClick={() => setPlaybackSpeed(1.0)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              playbackSpeed === 1.0
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            1.0x
          </button>
          <button
            type="button"
            onClick={() => setPlaybackSpeed(0.8)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              playbackSpeed === 0.8
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            0.8x Sekin
          </button>
        </div>
      </div>

      {/* Main Flashcard: Word Spelling, Phonetics, and Uzbek Native Audio */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-600">
            Talaffuz qilinayotgan so‘z
          </span>
          {currentItem.difficulty && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              {currentItem.difficulty}
            </span>
          )}
        </div>

        {/* Clear, High-Contrast Large Spelling */}
        <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-900 tracking-tight my-1">
          {currentItem.word}
        </h2>

        {/* Phonetic Transcription */}
        <div className="text-base font-mono font-semibold text-indigo-600/90 mt-1">
          {currentItem.transcription}
        </div>

        {/* Uzbek Meaning */}
        <div className="text-sm font-semibold text-stone-600 mt-2">
          {currentItem.uzbek}
        </div>

        {/* Listen Audio Buttons: Both English and Native Uzbek */}
        <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
          <button
            type="button"
            onClick={() => speakWord(currentItem.word, undefined, 'en', playbackSpeed)}
            className="px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-indigo-200/60"
            title="Inglizcha to‘g‘ri talaffuz"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>Inglizcha eshitish ({playbackSpeed}x)</span>
          </button>

          <button
            type="button"
            onClick={() => speakUzbek(currentItem.uzbek)}
            className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-200/60"
            title="O‘zbekcha samimiy inson ovozida eshitish"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>O‘zbekcha ma’nosi</span>
          </button>
        </div>

        {/* Tip / Context */}
        {currentItem.tip && (
          <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {currentItem.tip}
            </p>
          </div>
        )}
      </div>

      {/* Auto-Sequenced Microphone Panel */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col items-center justify-center space-y-4">
        {/* Status text */}
        {isPlayingAudio ? (
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs bg-indigo-50 px-3.5 py-1.5 rounded-full animate-pulse border border-indigo-200">
            <Headphones className="w-4 h-4" />
            <span>Namunani tinglang... tugagach navbat sizga o‘tadi</span>
          </div>
        ) : countdown !== null ? (
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs bg-amber-50 px-3.5 py-1.5 rounded-full animate-bounce border border-amber-200">
            <span>Tayyorlaning: {countdown}...</span>
          </div>
        ) : isRecording ? (
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs bg-rose-50 px-3.5 py-1.5 rounded-full animate-pulse border border-rose-200">
            <Mic className="w-4 h-4" />
            <span>Mikrofon yoniq! "{currentItem.word}" so‘zini ayting</span>
          </div>
        ) : errorMessage ? (
          <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-xs bg-rose-50 p-2 rounded-xl text-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <div className="text-xs font-semibold text-stone-500">
            {score !== null ? 'Qayta mashq qilish uchun tugmani bosing' : 'Namunani eshitib, ketidan o‘zingiz takrorlang'}
          </div>
        )}

        {/* Waveform animation while speaking */}
        {isRecording && (
          <div className="flex items-center gap-1.5 h-10">
            {[35, 75, 25, 95, 60, 85, 45, 90, 50, 70].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Action Buttons: 1-Click "Eshitish va Takrorlash" OR Direct Mic */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isPlayingAudio || countdown !== null || isRecording}
            onClick={handleListenThenSpeak}
            className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Eshitish va Takrorlash</span>
          </button>

          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 active:scale-95 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
            }`}
            title={isRecording ? 'To‘xtatish' : 'To‘g‘ridan-to‘g‘ri gapirish'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Results & Accuracy Feedback */}
      {score !== null && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm animate-in fade-in zoom-in-95 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Talaffuz aniqligi</span>
            <span
              className={`text-2xl font-display font-black ${
                score >= 90
                  ? 'text-emerald-600'
                  : score >= 75
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {score}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 90
                  ? 'bg-emerald-500'
                  : score >= 75
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          <p className="text-xs font-semibold text-stone-800">{feedback}</p>

          {spokenText && (
            <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                Eshitilgan ovoz: <span className="text-stone-900 font-bold">"{spokenText}"</span>
              </div>
              <div className="text-stone-400">
                Kutilgan: <span className="text-indigo-700 font-semibold">{currentItem.word}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleListenThenSpeak}
              className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Qayta urinish</span>
            </button>
            <button
              onClick={handleNextWord}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Keyingi so‘z</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
