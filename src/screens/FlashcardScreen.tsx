import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  Volume1,
  X,
  Check,
  RotateCw,
  ArrowLeft,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Play,
  Pause,
  Maximize2,
  Bookmark,
  BookmarkCheck,
  Headphones,
  Zap,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  FolderPlus,
  RefreshCw,
  Layers,
  ChevronDown,
  Shuffle,
  ArrowLeftRight,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Word, CEFRLevel, Deck } from '../types';
import { speakWord, speakUzbek, playChime } from '../utils/srs';
import {
  CEFR_LEVELS_META,
  CEFR_TOPIC_CATEGORIES,
  CEFR_TOPIC_ORDER,
} from '../services/cefrService';
import { MEDICAL_ENGLISH_WORDS } from '../data/medicalEnglishData';
import {
  getWordVisualMeta,
  generateWordArtworkSvg,
  getClozeSentence,
  generateQuizOptions,
} from '../utils/cefrVisualEngine';

export type StudyMode = 'mixed' | 'visual_object' | 'standard' | 'reverse' | 'audio' | 'quiz';

export const FlashcardScreen: React.FC = () => {
  const {
    words,
    selectedTopicId,
    setSelectedTopicId,
    selectedDeckId,
    setSelectedDeckId,
    selectedCefrLevel,
    setSelectedCefrLevel,
    cefrLevelWords,
    loadCefrWordsForLevel,
    decks,
    addNewDeck,
    addWordToDeck,
    rateWordSRS,
    setCurrentScreen,
    wordProgress,
    awardXp,
    user,
  } = useApp();

  // Study Modes: mixed (Smart bidirectional shuffle), visual_object (What is this?), standard (En->Uz), reverse (Uz->En), audio, quiz
  const [studyMode, setStudyMode] = useState<StudyMode>('mixed');
  const [isCardInverted, setIsCardInverted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSlowAudio, setIsSlowAudio] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [imageZoomUrl, setImageZoomUrl] = useState<string | null>(null);

  // Gamification & Anti-boredom: Consecutive Combo Streak
  const [comboStreak, setComboStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [comboAlert, setComboAlert] = useState<string | null>(null);

  // Interactive Quiz mode selection state
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);

  // Add to personal collection modal state
  const [showAddDeckModal, setShowAddDeckModal] = useState(false);
  const [newDeckNameInput, setNewDeckNameInput] = useState('');
  const [savedToDeckToast, setSavedToDeckToast] = useState<string | null>(null);

  // Session Statistics
  const [sessionStats, setSessionStats] = useState({
    known: 0,
    hard: 0,
    unknown: 0,
  });

  // Track words for review in this session
  const [reviewMistakesOnly, setReviewMistakesOnly] = useState(false);
  const [mistakeWordsList, setMistakeWordsList] = useState<Word[]>([]);

  // Auto-play timer reference
  const autoPlayTimerRef = useRef<any>(null);

  // If a CEFR level is chosen, ensure its words are loaded
  useEffect(() => {
    if (selectedCefrLevel && cefrLevelWords.length === 0) {
      loadCefrWordsForLevel(selectedCefrLevel);
    } else if (!selectedCefrLevel && !selectedTopicId && !selectedDeckId) {
      const defaultLvl = user.level || 'A1';
      setSelectedCefrLevel(defaultLvl);
      loadCefrWordsForLevel(defaultLvl);
    }
  }, [selectedCefrLevel, selectedTopicId, selectedDeckId, user.level]);

  // Dynamic topic categories available in current CEFR level
  const availableLevelTopics = useMemo(() => {
    if (!cefrLevelWords || cefrLevelWords.length === 0) return [];
    const map = new Map<string, { id: string; name: string; icon: string; count: number; isConcrete: boolean }>();
    for (const w of cefrLevelWords) {
      const cat = w.category || 'Umumiy leksika';
      const key = w.topicId || cat;
      if (!map.has(key)) {
        let icon = '📖';
        let isConcrete = false;
        if (cat.includes('Hayvon') || cat.includes('Tabiat')) {
          icon = '🐾';
          isConcrete = true;
        } else if (cat.includes('Oziq-ovqat') || cat.includes('Taom')) {
          icon = '🍎';
          isConcrete = true;
        } else if (cat.includes('Uy') || cat.includes('Mebel')) {
          icon = '🏠';
          isConcrete = true;
        } else if (cat.includes('Kiyim') || cat.includes('Tashqi')) {
          icon = '👗';
          isConcrete = true;
        } else if (cat.includes('Transport') || cat.includes('Sayohat') || cat.includes('Joylar')) {
          icon = '🚗';
          isConcrete = true;
        } else if (cat.includes('Tana') || cat.includes('Salomatlik')) {
          icon = '🩺';
          isConcrete = true;
        } else if (cat.includes('Fe’l') || cat.includes('Harakat')) {
          icon = '⚡';
          isConcrete = false;
        } else if (cat.includes('Sifat') || cat.includes('Hissiyot')) {
          icon = '✨';
          isConcrete = false;
        } else if (cat.includes('Raqam') || cat.includes('Vaqt')) {
          icon = '🔢';
          isConcrete = false;
        } else if (cat.includes('Texnologiya')) {
          icon = '💻';
          isConcrete = true;
        } else if (cat.includes('Sport')) {
          icon = '⚽';
          isConcrete = true;
        } else if (cat.includes('Maktab') || cat.includes('Ta’lim')) {
          icon = '📚';
          isConcrete = true;
        }
        map.set(key, { id: key, name: cat, icon, count: 0, isConcrete });
      }
      map.get(key)!.count += 1;
    }
    return Array.from(map.values()).sort((a, b) => {
      if (a.isConcrete && !b.isConcrete) return -1;
      if (!a.isConcrete && b.isConcrete) return 1;
      return b.count - a.count;
    });
  }, [cefrLevelWords]);

  // Filter pool of words for flashcard session
  const studyWords: Word[] = useMemo(() => {
    if (reviewMistakesOnly && mistakeWordsList.length > 0) {
      return mistakeWordsList;
    }

    if (selectedCefrLevel && cefrLevelWords.length > 0) {
      let pool = cefrLevelWords;
      if (selectedTopicId) {
        const topicWords = cefrLevelWords.filter(
          (w) => w.topicId === selectedTopicId || w.category === selectedTopicId
        );
        if (topicWords.length > 0) {
          pool = topicWords;
        }
      }
      // Prioritize unmastered or review due words, capped to 35 words per session
      const unmastered = pool.filter(
        (w) => wordProgress[w.id]?.masteryLevel !== 'ozlashtirilgan'
      );
      if (unmastered.length > 0) {
        return unmastered.slice(0, 35);
      }
      return pool.slice(0, 35);
    }

    if (selectedTopicId === 'medical_english' || selectedTopicId === 'topic_medical') {
      const unmastered = MEDICAL_ENGLISH_WORDS.filter(
        (w) => wordProgress[w.id]?.masteryLevel !== 'ozlashtirilgan'
      );
      return (unmastered.length > 0 ? unmastered : MEDICAL_ENGLISH_WORDS).slice(0, 25);
    }

    if (selectedTopicId) {
      return words.filter((w) => w.topicId === selectedTopicId);
    }

    if (selectedDeckId) {
      const deck = decks.find((d) => d.id === selectedDeckId);
      if (deck) {
        const deckWords = words.filter((w) => deck.words.includes(w.id));
        return deckWords.length > 0 ? deckWords : words.slice(0, 20);
      }
    }

    // Default: first words from custom or CEFR
    if (words.length > 0) return words.slice(0, 25);
    if (cefrLevelWords.length > 0) return cefrLevelWords.slice(0, 35);
    return [];
  }, [
    words,
    selectedTopicId,
    selectedDeckId,
    selectedCefrLevel,
    cefrLevelWords,
    decks,
    wordProgress,
    reviewMistakesOnly,
    mistakeWordsList,
  ]);

  const currentWord: Word | undefined = studyWords[currentIndex];

  // Reset per-card states when navigating
  useEffect(() => {
    setIsFlipped(false);
    setShowHint(false);
    setIsCardInverted(false);
    setSelectedQuizOption(null);
    setQuizIsAnswered(false);
  }, [currentIndex]);

  // Visual Metadata & Artwork resolver
  const visualMeta = useMemo(() => {
    if (!currentWord) return null;
    return getWordVisualMeta(currentWord);
  }, [currentWord]);

  // Active presentation format for the current card (visual_object | standard | reverse | audio | quiz)
  const activeCardFormat = useMemo<'visual_object' | 'standard' | 'reverse' | 'audio' | 'quiz'>(() => {
    if (studyMode === 'quiz') return 'quiz';
    if (studyMode === 'audio') return 'audio';

    if (studyMode === 'visual_object') {
      if (!visualMeta?.isConcreteObject) {
        return isCardInverted ? 'reverse' : 'standard';
      }
      return isCardInverted ? 'standard' : 'visual_object';
    }

    if (studyMode === 'standard') {
      return isCardInverted ? 'reverse' : 'standard';
    }

    if (studyMode === 'reverse') {
      return isCardInverted ? 'standard' : 'reverse';
    }

    // studyMode === 'mixed' (Aralash rejim)
    // 1. Concrete object words (hayvonlar, ozuqa, buyumlar, tana a'zolari) prominently test "Bu nima?" with visual picture
    if (visualMeta?.isConcreteObject && currentIndex % 2 === 0) {
      return isCardInverted ? 'reverse' : 'visual_object';
    }

    // 2. Alternating between reverse (Uzbek front) and standard (English front)
    if (currentIndex % 3 === 1) {
      return isCardInverted ? 'standard' : 'reverse';
    }

    return isCardInverted ? 'reverse' : 'standard';
  }, [studyMode, visualMeta?.isConcreteObject, currentIndex, isCardInverted]);

  // 4 Quiz options if in Quiz Mode
  const quizOptions = useMemo(() => {
    if (!currentWord || studyMode !== 'quiz') return [];
    return generateQuizOptions(currentWord, studyWords);
  }, [currentWord, studyWords, studyMode]);

  // Cloze masked sentence preview
  const clozeSentence = useMemo(() => {
    if (!currentWord || !currentWord.exampleSentence) return '';
    return getClozeSentence(currentWord.exampleSentence, currentWord.english);
  }, [currentWord]);

  // Audio Playback Handler
  const handlePlayAudio = (rate = isSlowAudio ? 0.75 : 1.0) => {
    if (!currentWord) return;
    speakWord(currentWord.english, undefined, 'en', rate);
  };

  // Uzbek Audio Playback Handler
  const handlePlayUzbek = () => {
    if (!currentWord) return;
    speakUzbek(currentWord.uzbek);
  };

  // Flip card
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    playChime('flip');
  };

  // Auto-play / Slideshow engine
  useEffect(() => {
    if (!autoPlay || isCompleted || !currentWord) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    // Phase 1: Speak primary side
    if (activeCardFormat === 'reverse') {
      handlePlayUzbek();
    } else {
      handlePlayAudio(1.0);
    }

    // Phase 2: Flip after 2.5s
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
      playChime('flip');

      // Phase 3: Speak secondary side & advance
      const nextTimer = setTimeout(() => {
        if (activeCardFormat === 'reverse') {
          handlePlayAudio(1.0);
        } else {
          handlePlayUzbek();
        }
        setTimeout(() => {
          handleRating('bildim', true);
        }, 1200);
      }, 1600);

      autoPlayTimerRef.current = nextTimer;
    }, 2500);

    return () => {
      clearTimeout(flipTimer);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [autoPlay, currentIndex, isCompleted, activeCardFormat]);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === '1') {
        handleRating('bilmadim');
      } else if (e.key === '2') {
        handleRating('qiyin');
      } else if (e.key === '3') {
        handleRating('bildim');
      } else if (e.key.toLowerCase() === 'r') {
        handlePlayAudio(1.0);
      } else if (e.key.toLowerCase() === 's') {
        setIsSlowAudio((p) => !p);
        handlePlayAudio(0.75);
      } else if (e.key.toLowerCase() === 'h') {
        setShowHint((p) => !p);
      } else if (e.key.toLowerCase() === 'a') {
        setAutoPlay((p) => !p);
      } else if (e.key.toLowerCase() === 'x' || e.key.toLowerCase() === 'j') {
        setIsCardInverted((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, isFlipped, isSlowAudio]);

  // Rating and progression handler
  const handleRating = (rating: 'bilmadim' | 'qiyin' | 'bildim', isFromAutoPlay = false) => {
    if (!currentWord) return;

    // Rate in Spaced Repetition System
    rateWordSRS(currentWord.id, rating);

    if (rating === 'bildim') {
      playChime('correct');
      setSessionStats((p) => ({ ...p, known: p.known + 1 }));

      // Combo Engine
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      if (newStreak === 3 || newStreak === 5 || newStreak === 10 || newStreak === 20) {
        awardXp(newStreak * 5, `${newStreak}x Olovli Zanjir! 🔥`);
        setComboAlert(`🔥 ${newStreak}x Combo! Olovli zanjir! (+${newStreak * 5} XP)`);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {}
        setTimeout(() => setComboAlert(null), 2500);
      }
    } else if (rating === 'qiyin') {
      setComboStreak(0);
      setSessionStats((p) => ({ ...p, hard: p.hard + 1 }));
    } else {
      playChime('wrong');
      setComboStreak(0);
      setSessionStats((p) => ({ ...p, unknown: p.unknown + 1 }));
      setMistakeWordsList((prev) => {
        if (!prev.some((w) => w.id === currentWord.id)) {
          return [...prev, currentWord];
        }
        return prev;
      });
    }

    // Reset card front state
    setIsFlipped(false);
    setShowHint(false);
    setSelectedQuizOption(null);
    setQuizIsAnswered(false);

    if (currentIndex + 1 < studyWords.length) {
      setCurrentIndex((p) => p + 1);
    } else {
      setIsCompleted(true);
      setAutoPlay(false);
      playChime('win');
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  // Save current word to a personal collection
  const handleSaveToDeck = (deckId: string) => {
    if (!currentWord) return;
    addWordToDeck(deckId, currentWord.id);
    const targetDeck = decks.find((d) => d.id === deckId);
    setSavedToDeckToast(
      `«${currentWord.english}» «${targetDeck?.name || 'To‘plam'}» ga qo‘shildi! ⭐`
    );
    setShowAddDeckModal(false);
    playChime('win');
    setTimeout(() => setSavedToDeckToast(null), 3000);
  };

  // Create new personal deck on the fly and save word
  const handleCreateAndSaveDeck = () => {
    if (!newDeckNameInput.trim() || !currentWord) return;
    const newDeck = addNewDeck(newDeckNameInput.trim());
    addWordToDeck(newDeck.id, currentWord.id);
    setSavedToDeckToast(
      `«${newDeck.name}» yaratildi va «${currentWord.english}» saqlandi! 🎉`
    );
    setNewDeckNameInput('');
    setShowAddDeckModal(false);
    playChime('win');
    setTimeout(() => setSavedToDeckToast(null), 3000);
  };

  // Check if current word is already bookmarked in any personal deck
  const isBookmarkedInAnyDeck = useMemo(() => {
    if (!currentWord) return false;
    return decks.some((d) => d.isPersonal && d.words.includes(currentWord.id));
  }, [currentWord, decks]);

  // Empty State Guard
  if (!currentWord && !isCompleted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-stone-50 min-h-screen">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-stone-900 mb-1">To‘plamda so‘zlar yo‘q</h3>
        <p className="text-stone-500 text-xs mb-6 max-w-xs leading-relaxed">
          Ushbu CEFR darajasi yoki to‘plamda hali kartochkalar yo‘q. Yangi darajani tanlang yoki lug‘atga qayting.
        </p>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedCefrLevel('A1');
              loadCefrWordsForLevel('A1');
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            A1 Boshlang‘ich so‘zlar
          </button>
          <button
            onClick={() => setCurrentScreen('vocabulary')}
            className="px-4 py-2.5 bg-stone-200/80 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all"
          >
            Lug‘atga qaytish
          </button>
        </div>
      </div>
    );
  }

  // Session Completed Screen
  if (isCompleted) {
    const total = sessionStats.known + sessionStats.hard + sessionStats.unknown;
    const accuracy = total > 0 ? Math.round((sessionStats.known / total) * 100) : 100;

    return (
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-stone-50 min-h-screen max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentScreen('vocabulary')}
            className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-extrabold text-stone-700 tracking-wider uppercase">
            Mashg‘ulot yakunlandi
          </span>
          <div className="w-8" />
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center my-auto py-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-amber-500/25">
            <Trophy className="w-10 h-10 stroke-[2.2]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-1.5 tracking-tight font-display">
            Ajoyib natija! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mb-6 max-w-xs leading-relaxed">
            Spaced Repetition xotira algoritmi bo‘yicha har bir so‘zning oraliq takrorlash sanalari yangilandi.
          </p>

          {/* Stats 3 Columns */}
          <div className="w-full grid grid-cols-3 gap-2.5 mb-5">
            <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 text-center">
              <div className="text-[11px] text-emerald-700 font-bold uppercase tracking-wide">
                Bildim
              </div>
              <div className="text-2xl font-black text-emerald-800 font-display mt-0.5">
                {sessionStats.known}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3 text-center">
              <div className="text-[11px] text-amber-700 font-bold uppercase tracking-wide">
                Qiyin
              </div>
              <div className="text-2xl font-black text-amber-800 font-display mt-0.5">
                {sessionStats.hard}
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-3 text-center">
              <div className="text-[11px] text-rose-700 font-bold uppercase tracking-wide">
                Bilmadim
              </div>
              <div className="text-2xl font-black text-rose-800 font-display mt-0.5">
                {sessionStats.unknown}
              </div>
            </div>
          </div>

          {/* Metrics summary card */}
          <div className="w-full bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-2 text-left mb-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">O‘zlashtirish aniqligi:</span>
              <span className="font-extrabold text-indigo-600 text-sm">{accuracy}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Maksimal Olovli Zanjir (Combo):</span>
              <span className="font-extrabold text-amber-600 flex items-center gap-1">
                🔥 {bestStreak} ta ketma-ket!
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Mukofot XP:</span>
              <span className="font-extrabold text-emerald-600">
                +{sessionStats.known * 10} XP olindi
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-200 space-y-2.5">
          {mistakeWordsList.length > 0 && (
            <button
              onClick={() => {
                setReviewMistakesOnly(true);
                setCurrentIndex(0);
                setIsCompleted(false);
                setSessionStats({ known: 0, hard: 0, unknown: 0 });
              }}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-rose-500 to-amber-600 text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Faqat xato qilingan so‘zlarni takrorlash ({mistakeWordsList.length} ta)</span>
            </button>
          )}

          <button
            onClick={() => {
              setReviewMistakesOnly(false);
              setMistakeWordsList([]);
              setCurrentIndex(0);
              setIsCompleted(false);
              setSessionStats({ known: 0, hard: 0, unknown: 0 });
              setComboStreak(0);
            }}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>To‘plamni qaytadan boshlash</span>
          </button>

          <button
            onClick={() => setCurrentScreen('vocabulary')}
            className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Lug‘atga qaytish
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / studyWords.length) * 100);

  return (
    <div
      id="flashcard-screen"
      className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-stone-50 min-h-screen max-w-xl mx-auto w-full select-none"
    >
      {/* Top Header Controls */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('vocabulary')}
            className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 transition-colors"
            title="Ortga qaytish"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered Counter & Live Combo Flame */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-stone-900 tabular-nums">
                {currentIndex + 1} / {studyWords.length}
              </span>

              {comboStreak >= 2 && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-2 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black flex items-center gap-0.5 shadow-2xs animate-pulse"
                >
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{comboStreak}x</span>
                </motion.span>
              )}
            </div>

            <span className="text-[10px] text-stone-400 font-medium">
              {currentWord.category || 'CEFR Spaced Repetition'}
            </span>
          </div>

          {/* Action Tools: Auto-Play & Flip */}
          <div className="flex items-center gap-1 -mr-1">
            <button
              onClick={() => setAutoPlay((p) => !p)}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                autoPlay
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
              title={autoPlay ? 'Auto-Play to‘xtatish' : 'Auto-Play yoqish (Avtomatik o‘qish)'}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handleFlip}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
              title="Kartani aylantirish (Space)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar with Gradient */}
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Study Mode Selector & CEFR Level Quick Strip */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {/* Modes */}
          <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-xl shrink-0">
            <button
              onClick={() => {
                setStudyMode('mixed');
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                studyMode === 'mixed'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Aralash rejim: Rasmli predmetlar, Inglizcha va O‘zbekcha savollar dinamik aralash holda beriladi"
            >
              <Shuffle className="w-3 h-3" />
              <span>Aralash</span>
            </button>
            <button
              onClick={() => {
                setStudyMode('visual_object');
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                studyMode === 'visual_object'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Predmetlar va Rasmlar: Suratga qarab 'Bu nima?' savoliga javob berish"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Bu nima?</span>
            </button>
            <button
              onClick={() => {
                setStudyMode('standard');
                setIsFlipped(false);
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                studyMode === 'standard'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Inglizcha ➔ O‘zbekcha"
            >
              EN ➔ UZ
            </button>
            <button
              onClick={() => {
                setStudyMode('reverse');
                setIsFlipped(false);
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                studyMode === 'reverse'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="O‘zbekcha ➔ Inglizcha (Teskari)"
            >
              UZ ➔ EN
            </button>
            <button
              onClick={() => {
                setStudyMode('audio');
                setIsFlipped(false);
                handlePlayAudio();
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                studyMode === 'audio'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Tinglab topish rejimi"
            >
              <Headphones className="w-3 h-3" />
              <span>Audio</span>
            </button>
            <button
              onClick={() => {
                setStudyMode('quiz');
                setIsFlipped(false);
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                studyMode === 'quiz'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="4 variantli viktorina"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Test</span>
            </button>
          </div>

          {/* Quick Direction Swap / Aralashtirish Button */}
          <button
            onClick={() => setIsCardInverted((p) => !p)}
            className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              isCardInverted
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-2xs'
                : 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
            }`}
            title="Old va orqa tomonni almashtirish (Klaviatura: X yoki J)"
          >
            <ArrowLeftRight className="w-3 h-3 text-indigo-600" />
            <span className="hidden sm:inline">Aralashtirish</span>
          </button>

          {/* CEFR Level Quick Filter */}
          <div className="flex items-center gap-1 shrink-0">
            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
              const isSelected = selectedCefrLevel === lvl;
              const meta = CEFR_LEVELS_META[lvl];
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedCefrLevel(lvl);
                    setSelectedTopicId(null);
                    loadCefrWordsForLevel(lvl);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    isSelected
                      ? `text-white bg-linear-to-r ${meta.gradient} shadow-2xs`
                      : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Topic / Category Quick Selector */}
        {availableLevelTopics.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => {
                setSelectedTopicId(null);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                !selectedTopicId
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-200/70 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Barchasi ({cefrLevelWords.length})
            </button>
            {availableLevelTopics.map((top) => {
              const isSelected = selectedTopicId === top.id || selectedTopicId === top.name;
              return (
                <button
                  key={top.id}
                  onClick={() => {
                    setSelectedTopicId(top.id);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-stone-200/70 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                  title={`${top.name} (${top.count} ta so‘z)`}
                >
                  <span>{top.icon}</span>
                  <span>{top.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-amber-600 text-white' : 'bg-stone-300/80 text-stone-600'}`}>
                    {top.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Combo Alert */}
      <AnimatePresence>
        {comboAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-stone-900/90 backdrop-blur-md text-amber-400 border border-amber-500/40 px-4 py-2 rounded-2xl text-xs font-black shadow-xl flex items-center gap-2 pointer-events-none"
          >
            <span>{comboAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Flashcard Container with Framer Motion Flip Animation */}
      <div className="flex-1 flex items-center justify-center my-3 perspective-1000">
        <motion.div
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 220, damping: 22 }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full max-w-sm h-[510px] sm:h-[530px] rounded-3xl cursor-pointer relative shadow-xl shadow-stone-200/70 border border-stone-200/90"
        >
          {/* ===================== CARD FRONT ===================== */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-white p-5 sm:p-6 flex flex-col justify-between text-center backface-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {/* Top Bar on Front: CEFR badge + Format Badge + Category info */}
            <div className="w-full flex items-center justify-between text-xs text-stone-400 z-10">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold uppercase tracking-wider text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-lg">
                  {currentWord.level}
                </span>

                {activeCardFormat === 'visual_object' ? (
                  <span className="font-black text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    🖼️ Predmet · Bu nima?
                  </span>
                ) : activeCardFormat === 'reverse' ? (
                  <span className="font-bold text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-lg">
                    🇺🇿 UZ ➔ 🇬🇧 EN
                  </span>
                ) : activeCardFormat === 'audio' ? (
                  <span className="font-bold text-[10px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    🎧 Tinglab toping
                  </span>
                ) : (
                  <span className="font-bold text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-lg">
                    🇬🇧 EN ➔ 🇺🇿 UZ
                  </span>
                )}

                <span className="text-[11px] text-stone-500 font-medium">
                  {visualMeta?.categoryIcon} {visualMeta?.categoryLabel}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Quick Direction Swap / Invert button on card */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCardInverted((p) => !p);
                  }}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Old va orqa tomonni almashtirish (X/J)"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>

                {/* Bookmark button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddDeckModal(true);
                  }}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isBookmarkedInAnyDeck
                      ? 'text-amber-500 bg-amber-50'
                      : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                  }`}
                  title="Shaxsiy to‘plamga saqlash"
                >
                  {isBookmarkedInAnyDeck ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Visual Image / Artwork Container (STRICTLY for concrete objects: hayvonlar, ozuqa, buyumlar, tana a'zolari, etc.) */}
            {visualMeta?.isConcreteObject && visualMeta?.imageUrl && (
              <div
                className={`relative w-full rounded-2xl overflow-hidden my-2 group bg-stone-100 border-2 border-stone-200/90 shrink-0 shadow-2xs ${
                  activeCardFormat === 'visual_object' ? 'h-38 sm:h-42' : 'h-28 sm:h-32'
                }`}
              >
                <img
                  src={visualMeta.imageUrl}
                  alt={currentWord.english}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Zero broken image guarantee: replace with generated dynamic vector artwork
                    (e.target as HTMLImageElement).src = generateWordArtworkSvg(currentWord);
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Visual overlay gradient scrim */}
                <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

                {/* Concrete object badge on image */}
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-black tracking-wide shadow-2xs border border-white/20 flex items-center gap-1.5">
                  <span>{visualMeta.sourceType === 'photo' ? '📸 Haqiqiy Foto' : '🔍 Predmet'}</span>
                  <span className="text-amber-300 font-semibold">• Bu nima?</span>
                </div>

                {/* Image zoom affordance */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (visualMeta) setImageZoomUrl(visualMeta.imageUrl);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="Rasmni to‘liq hajmda ko‘rish"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Part of Speech Pill on Image */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/70 backdrop-blur-xs text-white text-[10px] font-bold">
                  {currentWord.partOfSpeech || 'Ot (Predmet)'}
                </div>
              </div>
            )}

            {/* Central Typography Core */}
            <div className="my-auto flex flex-col items-center z-10 w-full">
              {activeCardFormat === 'visual_object' ? (
                // Visual Object / "Bu nima?" Mode
                <div className="space-y-1.5 w-full flex flex-col items-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Rasmga diqqat qiling
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight">
                    Bu nima? / What is this?
                  </h2>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium max-w-xs">
                    Ushbu narsa yoki predmet nomini ingliz va o‘zbek tilida eslang
                  </p>

                  {/* Masked Word Mystery Box */}
                  <div className="my-1 py-1.5 px-6 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-lg sm:text-xl font-mono tracking-widest shadow-2xs">
                    [ ? ? ? ? ? ]
                  </div>

                  {/* Interactive Clues */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(1.0);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center gap-1 text-[11px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="Talaffuzni tinglash"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Talaffuz</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint((p) => !p);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 flex items-center gap-1 text-[11px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="Harflar ishorasi"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{showHint ? 'Yashirish' : 'Harflar yordami'}</span>
                    </button>
                  </div>

                  {showHint && visualMeta?.letterHint && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 px-3 py-1.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-mono font-bold tracking-wider"
                    >
                      💡 {visualMeta.letterHint}
                    </motion.div>
                  )}
                </div>
              ) : activeCardFormat === 'reverse' ? (
                // Reverse Mode: Show Uzbek on Front
                <div className="space-y-1 w-full flex flex-col items-center">
                  {!visualMeta?.isConcreteObject && currentWord.partOfSpeech && (
                    <div className="mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700 border border-stone-200">
                        {currentWord.partOfSpeech}
                      </span>
                    </div>
                  )}
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
                    Inglizcha ma’nosini toping:
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight">
                    {currentWord.uzbek}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayUzbek();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-700 flex items-center gap-1.5 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="O‘zbekcha talaffuz"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Talaffuz</span>
                    </button>
                  </div>
                </div>
              ) : activeCardFormat === 'audio' ? (
                // Audio Mode: Mask word and prompt to listen
                <div className="space-y-2 w-full flex flex-col items-center">
                  <div className="text-xs text-stone-400">Talaffuzni tinglang va so‘zni eslang:</div>
                  <div className="text-xl font-bold font-mono text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-2xl">
                    [ ??? ]
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAudio(1.0);
                    }}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Qaytadan tinglash</span>
                  </button>
                </div>
              ) : (
                // Standard & Quiz Mode: English Word
                <div className="space-y-1 w-full flex flex-col items-center">
                  {/* Grammatical Tag for Non-Object Words (Sifat, Fe'l, Son, etc.) */}
                  {!visualMeta?.isConcreteObject && currentWord.partOfSpeech && (
                    <div className="mb-2">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                        currentWord.partOfSpeech.includes('Fe’l')
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : currentWord.partOfSpeech.includes('Sifat')
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : currentWord.partOfSpeech.includes('Son')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : currentWord.partOfSpeech.includes('Ravish')
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {currentWord.partOfSpeech.includes('Fe’l') ? '⚡ Fe’l (Harakat)' :
                         currentWord.partOfSpeech.includes('Sifat') ? '✨ Sifat (Belgi-xususiyat)' :
                         currentWord.partOfSpeech.includes('Son') ? '🔢 Son (Miqdor / Tartib)' :
                         currentWord.partOfSpeech.includes('Ravish') ? '💫 Ravish (Holat)' :
                         currentWord.partOfSpeech}
                      </span>
                    </div>
                  )}

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
                    {currentWord.english}
                  </h2>
                  <div className="text-xs font-mono text-stone-400">
                    {currentWord.transcription}
                  </div>

                  {/* Audio Controls (Normal & Slow speech) */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(1.0);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-700 flex items-center gap-1.5 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="Oddiy tezlikda eshitish"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Oddiy</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(0.75);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-700 flex items-center gap-1.5 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="Sekin talaffuz (0.75x)"
                    >
                      <Volume1 className="w-4 h-4" />
                      <span>0.75x</span>
                    </button>
                  </div>

                  {/* Context sentence for Non-Object words (Sifat, Fe'l, Son) */}
                  {!visualMeta?.isConcreteObject && currentWord.exampleSentence && studyMode !== 'quiz' && (
                    <div className="mt-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-left max-w-xs w-full shadow-2xs">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                        Misol:
                      </span>
                      <p className="text-xs text-stone-800 font-medium italic leading-relaxed">
                        "{currentWord.exampleSentence}"
                      </p>
                      {currentWord.exampleUzbek && (
                        <p className="text-[11px] text-stone-500 mt-1 pt-1 border-t border-stone-200/60 leading-normal">
                          {currentWord.exampleUzbek}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Quiz Mode: 4 Choices on Front */}
              {studyMode === 'quiz' && (
                <div className="w-full mt-3 grid grid-cols-2 gap-2 text-left">
                  {quizOptions.map((opt, i) => {
                    const isSelected = selectedQuizOption === opt;
                    const isCorrect = opt === currentWord.uzbek;
                    let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

                    if (quizIsAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (quizIsAnswered) return;
                          setSelectedQuizOption(opt);
                          setQuizIsAnswered(true);
                          if (isCorrect) {
                            playChime('correct');
                            setTimeout(() => handleRating('bildim'), 1200);
                          } else {
                            playChime('wrong');
                            setTimeout(() => setIsFlipped(true), 900);
                          }
                        }}
                        className={`p-2 rounded-xl text-xs border transition-all text-center ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Context cloze preview sentence if available */}
              {clozeSentence && studyMode !== 'quiz' && activeCardFormat !== 'visual_object' && (
                <div className="mt-2 text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-xl border border-stone-100 max-w-xs leading-relaxed">
                  "{clozeSentence}"
                </div>
              )}

              {/* Mnemonic Hint Expander (non-visual_object mode) */}
              {showHint && activeCardFormat !== 'visual_object' && visualMeta?.mnemonicHook && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 text-left w-full max-w-xs"
                >
                  {visualMeta.mnemonicHook}
                </motion.div>
              )}
            </div>

            {/* Bottom bar on Front: Hint toggle + Flip button */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint((p) => !p);
                }}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/70 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Yashirish' : 'Maslahat 💡'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Javobni ko‘rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ===================== CARD BACK ===================== */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-stone-900 border border-stone-800 text-white p-5 sm:p-6 flex flex-col justify-between text-center rotate-y-180 backface-hidden shadow-2xl overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {/* Top Bar on Back */}
            <div className="w-full flex items-center justify-between text-xs text-stone-400">
              <span className="font-extrabold text-stone-300 uppercase tracking-wider text-[10px] bg-white/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                {activeCardFormat === 'visual_object' ? '🎯 Predmet javobi' : 'Javob & Ma’nosi'}
              </span>

              <div className="flex items-center gap-2">
                {/* Direction swap button on back */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCardInverted((p) => !p);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 transition-colors cursor-pointer"
                  title="Old va orqa tomonni almashtirish"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddDeckModal(true);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isBookmarkedInAnyDeck
                      ? 'text-amber-400 bg-amber-400/20'
                      : 'text-stone-300 bg-white/10 hover:bg-white/20'
                  }`}
                  title="Shaxsiy to‘plamga saqlash"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(1.0);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Inglizcha talaffuz"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Back Main Content */}
            <div className="my-auto flex flex-col items-center max-w-xs w-full py-1">
              {/* Visual Object Thumbnail Preview on Back */}
              {visualMeta?.hasSpecificImage && visualMeta?.imageUrl && (
                <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/10 border border-white/15 mb-2.5 text-left w-full shadow-inner">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-800 border border-white/20 shrink-0">
                    <img
                      src={visualMeta.imageUrl}
                      alt={currentWord.english}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = generateWordArtworkSvg(currentWord);
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <span>{visualMeta.sourceType === 'photo' ? '📸 Haqiqiy Foto' : visualMeta.isConcreteObject ? '🔍 Predmet' : '✨ So‘z'}</span>
                    </span>
                    <div className="text-sm font-black text-white truncate">
                      {currentWord.english}
                    </div>
                    <div className="text-xs text-stone-300 font-semibold truncate">
                      {currentWord.uzbek}
                    </div>
                  </div>
                </div>
              )}

              {activeCardFormat === 'visual_object' && (
                <div className="mb-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                  ✨ Predmetning to‘liq nomi:
                </div>
              )}

              <div className="text-xs font-display text-indigo-300 font-semibold mb-1 flex items-center gap-1.5">
                <span>{currentWord.english}</span>
                <span className="text-stone-400 font-mono">({currentWord.transcription})</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(1.0);
                  }}
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
                  title="Inglizcha talaffuz"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Uzbek Translation */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight font-display">
                  {currentWord.uzbek}
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayUzbek();
                  }}
                  className="p-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 transition-colors cursor-pointer"
                  title="O‘zbekcha talaffuz"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Part of Speech */}
              <div className="text-[10px] text-stone-400 font-medium mb-1">
                {currentWord.partOfSpeech || (visualMeta?.isConcreteObject ? 'Ot (Predmet)' : 'So‘z')}
              </div>

              {/* Example Sentences Box */}
              {currentWord.exampleSentence && (
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-left w-full my-2 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-stone-200 font-normal leading-relaxed">
                      "{currentWord.exampleSentence}"
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentWord.exampleSentence!);
                      }}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 transition-colors shrink-0 cursor-pointer"
                      title="Misol jumlasini eshitish"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {currentWord.exampleUzbek && (
                    <p className="text-[11px] text-stone-400 font-normal">
                      "{currentWord.exampleUzbek}"
                    </p>
                  )}
                </div>
              )}

              {/* Mnemonic Memory Hook on Back */}
              {visualMeta?.mnemonicHook && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-300 text-left w-full">
                  {visualMeta.mnemonicHook}
                </div>
              )}
            </div>

            {/* Prompt for rating buttons */}
            <div className="text-[11px] text-stone-400 font-medium pt-1">
              O‘zlashtirish darajasini tanlang:
            </div>
          </div>
        </motion.div>
      </div>

      {/* SRS Rating Action Buttons */}
      <div className="pt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Bilmadim */}
          <button
            id="btn-srs-bilmadim"
            type="button"
            onClick={() => handleRating('bilmadim')}
            className="py-3 px-2 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-95 border border-rose-200 text-rose-800 flex flex-col items-center justify-center transition-all shadow-2xs cursor-pointer"
            title="Klaviatura: 1"
          >
            <span className="text-base mb-0.5">❌</span>
            <span className="text-xs font-extrabold">Bilmadim</span>
            <span className="text-[10px] text-rose-600 font-medium mt-0.5">1 kundan so‘ng</span>
          </button>

          {/* Qiyin */}
          <button
            id="btn-srs-qiyin"
            type="button"
            onClick={() => handleRating('qiyin')}
            className="py-3 px-2 rounded-2xl bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-200 text-amber-800 flex flex-col items-center justify-center transition-all shadow-2xs cursor-pointer"
            title="Klaviatura: 2"
          >
            <span className="text-base mb-0.5">😐</span>
            <span className="text-xs font-extrabold">Qiyin</span>
            <span className="text-[10px] text-amber-700 font-medium mt-0.5">3 kundan so‘ng</span>
          </button>

          {/* Bildim */}
          <button
            id="btn-srs-bildim"
            type="button"
            onClick={() => handleRating('bildim')}
            className="py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 border border-emerald-200 text-emerald-800 flex flex-col items-center justify-center transition-all shadow-2xs cursor-pointer"
            title="Klaviatura: 3"
          >
            <span className="text-base mb-0.5">✅</span>
            <span className="text-xs font-extrabold">Bildim</span>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5">Oraliq × 2.5</span>
          </button>
        </div>
      </div>

      {/* ===================== IMAGE ZOOM LIGHTBOX MODAL ===================== */}
      <AnimatePresence>
        {imageZoomUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImageZoomUrl(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl"
            >
              <img
                src={imageZoomUrl}
                alt="Enlarged Visual"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (currentWord) (e.target as HTMLImageElement).src = generateWordArtworkSvg(currentWord);
                }}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-4 flex items-center justify-between text-white">
                <div>
                  <h4 className="font-extrabold text-base">{currentWord.english}</h4>
                  <p className="text-xs text-stone-400">{currentWord.uzbek}</p>
                </div>
                <button
                  onClick={() => setImageZoomUrl(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== ADD TO DECK MODAL ===================== */}
      <AnimatePresence>
        {showAddDeckModal && currentWord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-5 border border-stone-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-stone-900 text-sm">
                    Shaxsiy to‘plamga saqlash
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddDeckModal(false)}
                  className="p-1 rounded-xl text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{currentWord.english}</span>
                <span className="text-stone-500">{currentWord.uzbek}</span>
              </div>

              {/* Personal decks list */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                  Mavjud to‘plamlar:
                </div>
                {decks.filter((d) => d.isPersonal).length === 0 ? (
                  <div className="p-3 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
                    Hozircha shaxsiy to‘plam yo‘q. Quyida yangi yarating.
                  </div>
                ) : (
                  decks
                    .filter((d) => d.isPersonal)
                    .map((deck) => {
                      const isAlreadyIn = deck.words.includes(currentWord.id);
                      return (
                        <button
                          key={deck.id}
                          type="button"
                          onClick={() => handleSaveToDeck(deck.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                            isAlreadyIn
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-white hover:bg-indigo-50 border-stone-200 text-stone-800'
                          }`}
                        >
                          <span>{deck.name}</span>
                          {isAlreadyIn ? (
                            <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Saqlangan
                            </span>
                          ) : (
                            <span className="text-[10px] text-indigo-600 font-semibold">+ Qo‘shish</span>
                          )}
                        </button>
                      );
                    })
                )}
              </div>

              {/* Create new deck inline */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="text-[11px] font-bold text-stone-400">Yangi to‘plam yaratish:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDeckNameInput}
                    onChange={(e) => setNewDeckNameInput(e.target.value)}
                    placeholder="Masalan: Sayohatchi lug‘ati..."
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleCreateAndSaveDeck}
                    disabled={!newDeckNameInput.trim()}
                    className="px-3 py-2 bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer"
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {savedToDeckToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl border border-stone-700 flex items-center gap-2 pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedToDeckToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
