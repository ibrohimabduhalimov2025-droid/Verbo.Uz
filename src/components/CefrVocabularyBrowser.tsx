import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Volume2,
  RotateCw,
  RotateCcw,
  CheckCircle2,
  Clock,
  CircleDot,
  Layers,
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
  Gamepad2,
  Check,
  Eye,
  EyeOff,
  Folder,
  FolderOpen,
  Sparkles,
  ArrowRight,
  BookmarkPlus,
  ListFilter,
  CheckCheck,
  Lock,
  Trophy,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Word, CEFRLevel } from '../types';
import { useApp } from '../context/AppContext';
import {
  CEFR_LEVELS_META,
  TOTAL_CEFR_WORDS,
  groupCefrWordsByTopic,
  CefrTopicGroup,
} from '../services/cefrService';
import { speakWord, playChime } from '../utils/srs';
import { A1InteractiveOnboarding } from './A1InteractiveOnboarding';
import { getWordVisualMeta, generateWordArtworkSvg } from '../utils/cefrVisualEngine';

interface Props {
  level: CEFRLevel;
  onBack: () => void;
}

export const CefrVocabularyBrowser: React.FC<Props> = ({ level, onBack }) => {
  const {
    cefrLevelWords,
    isLoadingCefrWords,
    loadCefrWordsForLevel,
    setSelectedCefrLevel,
    setSelectedTopicId,
    setCurrentScreen,
    setTestMode,
    wordProgress,
    decks,
    addNewWord,
    markWordAsMastered,
    markWordAsLearning,
    isTopicUnlocked,
    isTopicMastered,
    getTopicMasteryScore,
    openLockedProgressionModal,
    startTopicMasteryQuiz,
    setActiveMasteryModalTopic,
    openPlacementTestModal,
    getTotalCefrStats,
  } = useApp();

  const meta = CEFR_LEVELS_META[level];

  // Primary view mode: 'topics' (grouped by topic cards/sections) vs 'words' (all words list)
  const [viewMode, setViewMode] = useState<'topics' | 'words'>('topics');
  // Currently opened topic ID (null = show all topic cards of this level)
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'az' | 'status'>('order');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUzbekTranslations, setShowUzbekTranslations] = useState(true);
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);
  const [addedToDeckId, setAddedToDeckId] = useState<string | null>(null);
  const [showAddToDeckModal, setShowAddToDeckModal] = useState<Word | null>(null);
  const [groupWordsInAllView, setGroupWordsInAllView] = useState(true);
  const [microToast, setMicroToast] = useState<{ id: number; text: string; type: 'success' | 'info' } | null>(null);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(false);

  const PAGE_SIZE = 40;

  // Auto-clear micro toast
  useEffect(() => {
    if (microToast) {
      const t = setTimeout(() => setMicroToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [microToast]);

  // Load words for this CEFR level on mount or level change
  useEffect(() => {
    loadCefrWordsForLevel(level);
    setActiveTopicId(null);
    setCurrentPage(1);
  }, [level]);

  // Group level words into rich thematic topics
  const topicGroups: CefrTopicGroup[] = useMemo(() => {
    return groupCefrWordsByTopic(cefrLevelWords, wordProgress);
  }, [cefrLevelWords, wordProgress]);

  // Active topic object (if a topic is selected)
  const activeTopic = useMemo(() => {
    if (!activeTopicId) return null;
    return (
      topicGroups.find(
        (t) => t.id === activeTopicId || t.category === activeTopicId
      ) || null
    );
  }, [topicGroups, activeTopicId]);

  // Overall level statistics with sensitive decimal for immediate visual feedback
  const stats = useMemo(() => {
    let learned = 0;
    let learning = 0;

    cefrLevelWords.forEach((w) => {
      const p = wordProgress[w.id];
      if (p?.masteryLevel === 'ozlashtirilgan') learned++;
      else if (p?.masteryLevel === 'organilmoqda') learning++;
    });

    const total = cefrLevelWords.length || meta.count;
    const newCount = Math.max(0, total - learned - learning);
    const weighted = learned + learning * 0.5;
    let percent = 0;
    if (total > 0 && weighted > 0) {
      const calc = (weighted / total) * 100;
      percent = calc < 1 ? Math.max(0.1, Number(calc.toFixed(1))) : Math.round(calc);
    }

    return { total, learned, learning, newCount, percent };
  }, [cefrLevelWords, wordProgress, meta.count]);

  // Instant action handlers for real-time progress update
  const handleMarkMastered = (e: React.MouseEvent, word: Word) => {
    e.stopPropagation();
    markWordAsMastered(word.id);
    playChime('correct');
    setMicroToast({
      id: Date.now(),
      text: `«${word.english}» o‘zlashtirildi! (+1) 🎉`,
      type: 'success',
    });

    // Check if user reached 100% completion in the active topic to prompt the mastery quiz
    if (activeTopic) {
      const alreadyMastered = activeTopic.words.filter(
        (w) => w.id !== word.id && wordProgress[w.id]?.masteryLevel === 'ozlashtirilgan'
      ).length;
      const willBeMastered = alreadyMastered + 1;

      if (willBeMastered >= activeTopic.totalWords && !isTopicMastered(activeTopic.id)) {
        setTimeout(() => {
          setActiveMasteryModalTopic({
            topicId: activeTopic.id,
            topicName: activeTopic.nameUz,
            level,
            totalWords: activeTopic.totalWords,
          });
        }, 500);
      }
    }
  };

  const handleMarkLearning = (e: React.MouseEvent, word: Word) => {
    e.stopPropagation();
    markWordAsLearning(word.id);
    playChime('flip');
    setMicroToast({
      id: Date.now(),
      text: `«${word.english}» takrorlash ro‘yxatiga qo‘shildi ⏳`,
      type: 'info',
    });
  };

  // Parts of speech available for filtering (either in level or inside active topic)
  const partsOfSpeech = useMemo(() => {
    const pool = activeTopic ? activeTopic.words : cefrLevelWords;
    const set = new Set<string>();
    pool.forEach((w) => {
      if (w.partOfSpeech) set.add(w.partOfSpeech);
    });
    return Array.from(set).sort();
  }, [activeTopic, cefrLevelWords]);

  // Filtered words for current view (Topic detail OR All words list)
  const filteredWords = useMemo(() => {
    const baseList = activeTopic ? activeTopic.words : cefrLevelWords;
    let list = [...baseList];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (w) =>
          w.english.toLowerCase().includes(q) ||
          w.uzbek.toLowerCase().includes(q) ||
          (w.transcription && w.transcription.toLowerCase().includes(q))
      );
    }

    // Part of speech filter
    if (selectedPos !== 'all') {
      list = list.filter((w) => w.partOfSpeech === selectedPos);
    }

    // Sorting
    if (sortBy === 'order') {
      list.sort((a, b) => a.orderNumber - b.orderNumber);
    } else if (sortBy === 'az') {
      list.sort((a, b) => a.english.localeCompare(b.english));
    } else if (sortBy === 'status') {
      const getWeight = (id: string) => {
        const p = wordProgress[id]?.masteryLevel;
        if (p === 'ozlashtirilgan') return 1;
        if (p === 'organilmoqda') return 2;
        return 3;
      };
      list.sort((a, b) => getWeight(a.id) - getWeight(b.id));
    }

    return list;
  }, [activeTopic, cefrLevelWords, searchQuery, selectedPos, sortBy, wordProgress]);

  // Pagination for words
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / PAGE_SIZE));
  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredWords.slice(start, start + PAGE_SIZE);
  }, [filteredWords, currentPage]);

  // Filter topic cards by search query when on topics overview
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topicGroups;
    const q = searchQuery.toLowerCase().trim();
    return topicGroups.filter(
      (t) =>
        t.nameUz.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.words.some(
          (w) =>
            w.english.toLowerCase().includes(q) ||
            w.uzbek.toLowerCase().includes(q)
        )
    );
  }, [topicGroups, searchQuery]);

  // Reset pagination on search or POS changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPos, sortBy, activeTopicId, viewMode]);

  // Navigation handlers
  const handleStartAllFlashcards = () => {
    setSelectedCefrLevel(level);
    setSelectedTopicId(null);
    setCurrentScreen('flashcards');
  };

  const handleStartAllTest = () => {
    setSelectedCefrLevel(level);
    setSelectedTopicId(null);
    setTestMode(`cefr_${level.toLowerCase()}`);
    setCurrentScreen('test_run');
  };

  const handleStartTopicFlashcards = (topic: CefrTopicGroup, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCefrLevel(level);
    setSelectedTopicId(topic.id);
    setCurrentScreen('flashcards');
  };

  const handleStartTopicTest = (topic: CefrTopicGroup, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCefrLevel(level);
    setSelectedTopicId(topic.id);
    setTestMode(`cefr_${level.toLowerCase()}`);
    setCurrentScreen('test_run');
  };

  const handlePlayAudio = (e: React.MouseEvent, word: Word) => {
    e.stopPropagation();
    if (word.audioUrl) {
      const audio = new Audio(word.audioUrl);
      audio.play().catch(() => speakWord(word.english));
    } else {
      speakWord(word.english);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lug‘atlarga qaytish</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black text-white bg-linear-to-r ${meta.gradient}`}
            >
              {level} • {meta.count} ta so‘z
            </span>
          </div>
        </div>

        {/* Level Title and Quick Actions */}
        <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <h1 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <span>{meta.nameUz}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                IELTS {meta.ieltsBand}
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{meta.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => openPlacementTestModal(level)}
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1.5 border border-purple-200 transition-all cursor-pointer shadow-2xs"
              title="Darajani aniqlash testi (Placement Test)"
            >
              <Target className="w-3.5 h-3.5 text-purple-600" />
              <span>Darajani aniqlash (80%+)</span>
            </button>

            <button
              onClick={() => setShowOnboardingGuide(true)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 border border-indigo-200 transition-all cursor-pointer"
              title="Boshlovchilar uchun 3 qadamli interaktiv qo‘llanma"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Qo‘llanma (3 qadam)</span>
            </button>

            <button
              onClick={handleStartAllFlashcards}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Ushbu darajaning barcha so‘zlari bo‘yicha kartochkalar"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartochkalar</span>
            </button>

            <button
              onClick={handleStartAllTest}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Ushbu daraja bo‘yicha test topshirish"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Test</span>
            </button>

            <button
              onClick={() => {
                setSelectedCefrLevel(level);
                setCurrentScreen('games');
              }}
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-emerald-600 transition-all cursor-pointer"
              title="So‘z o‘yinlarida mashq qilish"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Welcoming A1 Beginner Helper Banner */}
        {level === 'A1' && (
          <div className="mt-2.5 p-2.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-emerald-50 to-amber-50 border border-indigo-100/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <span className="text-sm">🌱</span>
              <span>
                <strong>A1 Boshlovchi:</strong> So‘zlarni tinglang, misolni ko‘ring va «Bilaman (+1)» ni bosing.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowOnboardingGuide(true)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs shrink-0 cursor-pointer"
            >
              Qo‘llanmani ochish
            </button>
          </div>
        )}

        {/* Floating Real-time Micro Toast Feedback */}
        {microToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
            <div className="px-4 py-2 rounded-2xl bg-stone-900/95 text-white shadow-xl border border-stone-700 text-xs font-bold flex items-center gap-2 backdrop-blur-xs">
              {microToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400" />
              )}
              <span>{microToast.text}</span>
            </div>
          </div>
        )}

        {/* Level Progress Stats & Visual Progress Bar */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2.5">
          {/* Visual Progress Bar for this level */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-medium text-[11px]">{level} Progressi:</span>
                <span className="font-extrabold text-stone-900 font-display">{stats.learned}</span>
                <span className="text-stone-400 text-[11px]">/ {stats.total} ta so‘z</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">
                  10,000 so‘zdan {getTotalCefrStats().totalLearned} ta ({getTotalCefrStats().totalPercent}%)
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {stats.percent}%
                </span>
              </div>
            </div>

            {/* Progress track */}
            <div className="w-full h-3.5 bg-stone-100 rounded-full p-0.5 border border-stone-200/80 relative overflow-hidden shadow-inner">
              <div
                className="absolute top-0 bottom-0 w-[1.5px] bg-stone-300 z-10"
                style={{ left: '85%' }}
                title="85% - Qulf ochish marrasi"
              />
              <div
                className={`h-full rounded-full bg-linear-to-r ${meta.gradient} transition-all duration-500`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(stats.learned > 0 ? 3 : 0, (stats.learned / stats.total) * 100)
                  )}%`,
                }}
              />
              {stats.learning > 0 && (
                <div
                  className="h-full rounded-full bg-amber-400/80 transition-all duration-500 absolute top-0.5 bottom-0.5"
                  style={{
                    left: `${Math.min(95, (stats.learned / stats.total) * 100)}%`,
                    width: `${Math.min(
                      100 - (stats.learned / stats.total) * 100,
                      (stats.learning / stats.total) * 100
                    )}%`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Level Progress Stats Pill Bar */}
          <div className="flex items-center justify-between gap-2 text-center text-xs">
            <div className="flex-1 bg-stone-50 rounded-xl py-1.5 px-2 border border-stone-200/60">
              <div className="text-stone-400 text-[10px] font-bold uppercase">Jami so‘z</div>
              <div className="font-black text-stone-900">{stats.total}</div>
            </div>
            <div className="flex-1 bg-emerald-50 rounded-xl py-1.5 px-2 border border-emerald-200/60">
              <div className="text-emerald-700 text-[10px] font-bold uppercase">O‘zlashtirildi</div>
              <div className="font-black text-emerald-700">
                {stats.learned} <span className="text-[10px] font-normal">({stats.percent}%)</span>
              </div>
            </div>
            <div className="flex-1 bg-amber-50 rounded-xl py-1.5 px-2 border border-amber-200/60">
              <div className="text-amber-700 text-[10px] font-bold uppercase">O‘rganilmoqda</div>
              <div className="font-black text-amber-700">{stats.learning}</div>
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl py-1.5 px-2 border border-blue-200/60">
              <div className="text-blue-700 text-[10px] font-bold uppercase">Mavzular</div>
              <div className="font-black text-blue-700">{topicGroups.length} ta</div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="mt-3 flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => {
              setViewMode('topics');
              setActiveTopicId(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'topics' && !activeTopicId
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mavzular bo‘yicha ({topicGroups.length} ta mavzu)</span>
          </button>

          <button
            onClick={() => {
              setViewMode('words');
              setActiveTopicId(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'words'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-amber-600" />
            <span>Barcha so‘zlar ro‘yxati ({stats.total})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 max-w-5xl mx-auto w-full space-y-4">
        {/* Loading Spinner */}
        {isLoadingCefrWords ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
            <RotateCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">
              CEFR {level} bazasi yuklanmoqda ({meta.count} ta so‘z)...
            </p>
          </div>
        ) : (
          <>
            {/* VIEW 1: THEMATIC TOPICS OVERVIEW (Default) */}
            {viewMode === 'topics' && !activeTopic && (
              <div className="space-y-4">
                {/* Search Topics Bar */}
                <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-2xs flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Mavzular yoki so‘zlarni qidiring (masalan: Oziq-ovqat, Sayohat, Oila)..."
                      className="w-full pl-9 pr-8 py-2 bg-stone-50 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Subheader info text */}
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>
                    CEFR <strong>{level}</strong> darajasida <strong>{topicGroups.length}</strong> ta tematik mavzu mavjud:
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Mavzuni tanlab alohida o‘rganing
                  </span>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredTopics.map((topic) => {
                    const isUnlocked = isTopicUnlocked(topic.id, level);
                    const isMastered = isTopicMastered(topic.id);
                    const masteryScore = getTopicMasteryScore(topic.id);
                    const isReadyForMasteryQuiz = topic.percent === 100 && !isMastered;

                    if (!isUnlocked) {
                      return (
                        <div
                          key={topic.id}
                          onClick={() => {
                            openLockedProgressionModal({
                              type: 'topic',
                              id: topic.id,
                              title: topic.nameUz,
                              subtitle: `${topic.nameEn} • ${topic.totalWords} ta so‘z`,
                              requirement: 'Oldingi mavzu/darajani 85%+ natija bilan yakunlang',
                            });
                          }}
                          className="bg-stone-50/90 rounded-2xl p-4 border border-stone-200/90 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group select-none"
                        >
                          <div className="absolute inset-0 bg-stone-100/40 pointer-events-none" />
                          <div className="absolute top-0 left-0 right-0 h-1 bg-stone-300" />

                          <div>
                            {/* Card Header: Icon + Lock Badge */}
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <div className="w-11 h-11 rounded-2xl bg-stone-200/80 border border-stone-300 flex items-center justify-center text-xl grayscale opacity-70">
                                {topic.emoji}
                              </div>

                              <span className="px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-900 font-extrabold text-[10px] flex items-center gap-1 border border-amber-300/80 shadow-2xs">
                                <Lock className="w-3 h-3 text-amber-800" />
                                <span>Qulflangan</span>
                              </span>
                            </div>

                            {/* Topic Titles */}
                            <h3 className="font-extrabold text-stone-700 text-sm flex items-center gap-1.5">
                              <span>{topic.nameUz}</span>
                              <Lock className="w-3.5 h-3.5 text-stone-400" />
                            </h3>
                            <div className="text-[11px] font-medium text-stone-400 mt-0.5">
                              {topic.nameEn} • {topic.totalWords} ta so‘z
                            </div>

                            {/* Requirement Notice */}
                            <div className="mt-3 p-2 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 font-medium flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span className="line-clamp-1">Oldingi mavzuni 85%+ bilan yakunlang</span>
                            </div>
                          </div>

                          {/* Footer Action Lock State */}
                          <div className="mt-3.5 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-400">
                            <span className="font-medium text-amber-900/80">🔒 85%+ talab</span>
                            <span className="font-bold text-amber-700 group-hover:underline">Ochish shartlari</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={topic.id}
                        onClick={() => {
                          setActiveTopicId(topic.id);
                          setSearchQuery('');
                          setSelectedPos('all');
                        }}
                        className="bg-white rounded-2xl p-4 border border-stone-200/90 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                      >
                        {/* Top Accent Gradient Bar */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${topic.gradient}`}
                        />

                        <div>
                          {/* Card Header: Icon + Word Count Pill / Mastery Badge */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div
                              className={`w-11 h-11 rounded-2xl ${topic.bgLight} border ${topic.borderLight} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                            >
                              {topic.emoji}
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              {isMastered ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1 border border-emerald-300">
                                  <Trophy className="w-3 h-3 text-emerald-600" />
                                  <span>O‘zlashtirildi ({masteryScore}%)</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMasteryModalTopic({
                                      topicId: topic.id,
                                      topicName: topic.nameUz,
                                      level,
                                      totalWords: topic.totalWords,
                                    });
                                  }}
                                  className="px-2 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-indigo-600 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-2xs hover:scale-105 transition-transform"
                                  title="To‘g‘ridan-to‘g‘ri test topshirish"
                                >
                                  <Award className="w-3 h-3" />
                                  <span>Test (85%+)</span>
                                </button>
                              )}

                              {!isMastered && topic.percent > 0 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                  {topic.percent}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Topic Titles */}
                          <h3 className="font-extrabold text-stone-900 text-sm group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <span>{topic.nameUz}</span>
                            {isMastered && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                          </h3>
                          <div className="text-[11px] font-medium text-stone-400 mt-0.5">
                            {topic.nameEn}
                          </div>

                          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {topic.description}
                          </p>
                        </div>

                        {/* Progress Bar & Actions */}
                        <div className="mt-3.5 pt-2.5 border-t border-stone-100">
                          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                            <span>
                              O‘zlashtirildi: {topic.learnedCount} / {topic.totalWords}
                            </span>
                            <span className="font-bold text-indigo-600">{topic.percent}%</span>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-2.5">
                            <div
                              className={`h-full bg-linear-to-r ${topic.gradient} transition-all duration-500`}
                              style={{ width: `${Math.min(100, topic.percent)}%` }}
                            />
                          </div>

                          {/* Card Footer Actions */}
                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleStartTopicFlashcards(topic, e)}
                                className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Ushbu mavzuni kartochkada mashq qilish"
                              >
                                <Layers className="w-3 h-3" />
                                <span>Flashcard</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMasteryModalTopic({
                                    topicId: topic.id,
                                    topicName: topic.nameUz,
                                    level,
                                    totalWords: topic.totalWords,
                                  });
                                }}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                  isMastered
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                                }`}
                                title="To‘g‘ridan-to‘g‘ri mavzu o‘zlashtirish testini topshirish (85%+)"
                              >
                                <Award className="w-3 h-3" />
                                <span>{isMastered ? 'Qayta Test' : 'Mastery (85%+)'}</span>
                              </button>
                            </div>

                            <div className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-0.5">
                              <span className="text-[11px]">Ko‘rish</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 2: SINGLE ACTIVE TOPIC VIEW */}
            {activeTopic && (
              <div className="space-y-4">
                {/* Back to Topics Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveTopicId(null);
                      setSearchQuery('');
                      setSelectedPos('all');
                    }}
                    className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <ArrowLeft className="w-4 h-4 text-indigo-600" />
                    <span>Barcha {level} mavzulariga qaytish</span>
                  </button>

                  <span className="text-xs text-stone-400 font-medium">
                    {activeTopic.totalWords} ta so‘z jamlangan
                  </span>
                </div>

                {/* Active Topic Banner Showcase */}
                <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${activeTopic.gradient}`}
                  />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-14 h-14 rounded-2xl ${activeTopic.bgLight} border ${activeTopic.borderLight} flex items-center justify-center text-3xl shrink-0 shadow-2xs`}
                      >
                        {activeTopic.emoji}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-black text-stone-900">
                            {activeTopic.nameUz}
                          </h2>
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-bold">
                            {level} • {activeTopic.totalWords} so‘z
                          </span>
                        </div>
                        <div className="text-xs text-stone-400 font-medium mt-0.5">
                          {activeTopic.nameEn}
                        </div>
                        <p className="text-xs text-stone-600 mt-1 max-w-xl">
                          {activeTopic.description}
                        </p>
                      </div>
                    </div>

                    {/* Topic Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartTopicFlashcards(activeTopic)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Mavzu kartochkalari</span>
                      </button>

                      <button
                        onClick={() => handleStartTopicTest(activeTopic)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Mavzu testi</span>
                      </button>
                    </div>
                  </div>

                  {/* Topic Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-3">
                      <span>
                        O‘zlashtirildi: <strong className="text-emerald-700">{activeTopic.learnedCount}</strong> / {activeTopic.totalWords}
                      </span>
                      <span>•</span>
                      <span>
                        O‘rganilmoqda: <strong className="text-amber-700">{activeTopic.learningCount}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Yangi: <strong className="text-blue-700">{activeTopic.newCount}</strong>
                      </span>
                    </div>
                    <span className="font-bold text-indigo-600">{activeTopic.percent}%</span>
                  </div>

                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full bg-linear-to-r ${activeTopic.gradient} transition-all duration-500`}
                      style={{ width: `${Math.min(100, activeTopic.percent)}%` }}
                    />
                  </div>

                  {/* Active Topic Mastery / Quiz Status */}
                  {isTopicMastered(activeTopic.id) ? (
                    <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Mavzu to‘liq o‘zlashtirildi (Mastered)!</span>
                        <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-[11px] font-black">
                          {getTopicMasteryScore(activeTopic.id)}% natija
                        </span>
                      </div>
                      <button
                        onClick={() => startTopicMasteryQuiz(activeTopic.id, activeTopic.nameUz, level)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer text-left sm:text-right"
                      >
                        Qayta test topshirish
                      </button>
                    </div>
                  ) : activeTopic.percent === 100 ? (
                    <div className="mt-3.5 p-4 rounded-2xl bg-linear-to-r from-amber-500 via-amber-600 to-indigo-600 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
                      <div>
                        <div className="font-black text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-200" />
                          <span>🎉 Barcha so‘zlar «Bilaman» deb belgilandi!</span>
                        </div>
                        <p className="text-xs text-amber-100 mt-0.5">
                          Keyingi mavzuni ochish uchun 85%+ natija bilan Mavzu Testini muvaffaqiyatli topshiring.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveMasteryModalTopic({
                            topicId: activeTopic.id,
                            topicName: activeTopic.nameUz,
                            level,
                            totalWords: activeTopic.totalWords,
                          });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-black text-xs hover:bg-stone-100 shadow-xs shrink-0 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>Mavzu Testini topshirish (85%+)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="font-extrabold text-xs text-indigo-950 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>To‘g‘ridan-to‘g‘ri Mavzu Testini topshirish (85%+)</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          So‘zlarni birma-bir ochib chiqish shart emas! Testdan 85%+ to‘plang va keyingi mavzuni darhol oching.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveMasteryModalTopic({
                            topicId: activeTopic.id,
                            topicName: activeTopic.nameUz,
                            level,
                            totalWords: activeTopic.totalWords,
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Mavzu Testi (85%+)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Horizontal Quick Topic Switcher Carousel */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-1">
                    Boshqa mavzuga tezkor o‘tish:
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                    <button
                      onClick={() => setActiveTopicId(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-200/80 text-stone-700 hover:bg-stone-300 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Folder className="w-3.5 h-3.5 text-stone-500" />
                      <span>Barcha mavzular</span>
                    </button>

                    {topicGroups.map((tg) => {
                      const isSelected = tg.id === activeTopic.id;
                      const isUnlocked = isTopicUnlocked(tg.id, level);
                      const isMastered = isTopicMastered(tg.id);

                      return (
                        <button
                          key={tg.id}
                          onClick={() => {
                            if (!isUnlocked) {
                              openLockedProgressionModal({
                                type: 'topic',
                                id: tg.id,
                                title: tg.nameUz,
                                subtitle: `${tg.nameEn} • ${tg.totalWords} ta so‘z`,
                                requirement: 'Oldingi mavzu/darajani 85%+ natija bilan yakunlang',
                              });
                              return;
                            }
                            setActiveTopicId(tg.id);
                            setSearchQuery('');
                            setSelectedPos('all');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            !isUnlocked
                              ? 'bg-stone-100/90 border border-stone-200 text-stone-400'
                              : isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white border border-stone-200 text-stone-700 hover:border-indigo-300'
                          }`}
                        >
                          <span>{tg.emoji}</span>
                          <span>{tg.nameUz}</span>
                          {!isUnlocked ? (
                            <Lock className="w-3 h-3 text-amber-700" />
                          ) : isMastered ? (
                            <Trophy className="w-3 h-3 text-amber-500" />
                          ) : (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                isSelected
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {tg.totalWords}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search and Filters inside Active Topic */}
                <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`"${activeTopic.nameUz}" ichidan so‘z qidirish...`}
                      className="w-full pl-9 pr-8 py-2 bg-stone-50 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filter Pills & Options */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Part of Speech tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                      <button
                        onClick={() => setSelectedPos('all')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 ${
                          selectedPos === 'all'
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        Hammasi ({activeTopic.totalWords})
                      </button>
                      {partsOfSpeech.map((pos) => {
                        const countInPos = activeTopic.words.filter(
                          (w) => w.partOfSpeech === pos
                        ).length;
                        return (
                          <button
                            key={pos}
                            onClick={() => setSelectedPos(pos)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 flex items-center gap-1 ${
                              selectedPos === pos
                                ? 'bg-indigo-600 text-white'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            <span>{pos}</span>
                            <span className="text-[10px] opacity-75">({countInPos})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Sort & Translation visibility toggle */}
                    <div className="flex items-center gap-2 justify-end">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-700 font-medium focus:outline-hidden"
                      >
                        <option value="order"># Tartib raqam</option>
                        <option value="az">A–Z Alifbo</option>
                        <option value="status">O‘zlashtirish holati</option>
                      </select>

                      <button
                        onClick={() => setShowUzbekTranslations((p) => !p)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          showUzbekTranslations
                            ? 'bg-stone-100 border-stone-300 text-stone-700'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        }`}
                        title={showUzbekTranslations ? "Tarjimalarni yashirish (O‘zingizni sinang)" : "Tarjimalarni ko‘rsatish"}
                      >
                        {showUzbekTranslations ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>
                    Topilgan so‘zlar: <strong className="text-stone-900">{filteredWords.length}</strong> ta
                    {filteredWords.length > PAGE_SIZE && ` (${currentPage} / ${totalPages}-sahifa)`}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Bosib to‘liq misol va ovozini eshiting
                  </span>
                </div>

                {/* Word Cards Grid */}
                {filteredWords.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200 p-6">
                    <Search className="w-10 h-10 text-stone-300 mx-auto" />
                    <h3 className="font-bold text-sm text-stone-800">Ushbu mavzuda so‘z topilmadi</h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Qidiruv so‘zini o‘zgartiring yoki filtrlarni tozalang.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedPos('all');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                    >
                      Filtrlarni tozalash
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paginatedWords.map((word) => {
                      const prog = wordProgress[word.id];
                      const isMastered = prog?.masteryLevel === 'ozlashtirilgan';
                      const isLearning = prog?.masteryLevel === 'organilmoqda';
                      const isExpanded = expandedWordId === word.id;

                      return (
                        <div
                          key={word.id}
                          onClick={() => setExpandedWordId(isExpanded ? null : word.id)}
                          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer group ${
                            isMastered
                              ? 'border-emerald-200 bg-emerald-50/20'
                              : isLearning
                              ? 'border-amber-200 bg-amber-50/20'
                              : 'border-stone-200 hover:border-indigo-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Visual Word Thumbnail */}
                            {(() => {
                              const vMeta = getWordVisualMeta(word);
                              if (vMeta.isConcreteObject) {
                                return (
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/90 shrink-0 shadow-2xs">
                                    <img
                                      src={vMeta.imageUrl}
                                      alt={word.english}
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = generateWordArtworkSvg(word);
                                      }}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                );
                              }
                              return (
                                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${vMeta.accentGradient} flex flex-col items-center justify-center text-white shrink-0 shadow-2xs border border-white/20 select-none`}>
                                  <span className="text-base font-black leading-none">{word.english.charAt(0).toUpperCase()}</span>
                                  <span className="text-[9px] font-extrabold opacity-85 mt-0.5">{word.level}</span>
                                </div>
                              );
                            })()}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-bold text-stone-400">
                                  #{word.orderNumber}
                                </span>
                                <h3 className="text-base font-black text-stone-900 group-hover:text-indigo-600 transition-colors">
                                  {word.english}
                                </h3>
                                {word.partOfSpeech && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold">
                                    {word.partOfSpeech}
                                  </span>
                                )}
                                {word.transcription && (
                                  <span className="text-xs text-indigo-600 font-mono">
                                    {word.transcription}
                                  </span>
                                )}
                              </div>

                              {/* Uzbek translation */}
                              <div className="mt-1 text-sm font-semibold text-stone-800">
                                {showUzbekTranslations ? (
                                  <span>{word.uzbek}</span>
                                ) : (
                                  <span className="text-xs text-stone-400 italic">
                                    (Ko‘rish uchun bosing)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Audio button and Add to deck */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => handlePlayAudio(e, word)}
                                className="p-2 rounded-xl text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Talaffuzni eshitish"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAddToDeckModal(word);
                                }}
                                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                                title="Shaxsiy to‘plamga qo‘shish"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Example sentence with clear, prominent styling for A1 beginners */}
                          {word.exampleSentence && (
                            <div className="mt-2.5 pt-2.5 border-t border-stone-100 bg-stone-50/80 rounded-xl p-2.5 space-y-1">
                              <div className="flex items-start gap-1.5 text-xs text-stone-800">
                                <span className="text-indigo-600 font-bold shrink-0">Misol:</span>
                                <span className="italic font-medium">"{word.exampleSentence}"</span>
                              </div>
                              {showUzbekTranslations && word.exampleUzbek && (
                                <div className="flex items-start gap-1.5 text-[11px] text-emerald-800 font-semibold pl-4">
                                  <span>↳</span>
                                  <span>{word.exampleUzbek}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Footer status pill & direct mastery trigger */}
                          <div className="mt-3 flex items-center justify-between text-[11px] flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isMastered ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>O‘zlashtirilgan</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkLearning(e, word)}
                                    className="inline-flex items-center gap-1 text-stone-500 hover:text-amber-700 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer"
                                    title="Qayta o‘rganish ro‘yxatiga o‘tkazish"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Bilmadim</span>
                                  </button>
                                </>
                              ) : isLearning ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                                    <Clock className="w-3 h-3" />
                                    <span>O‘rganilmoqda</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkMastered(e, word)}
                                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                    title="O‘zlashtirdim deb belgilash"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Bilaman (+1)</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="inline-flex items-center gap-1 text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                                    <CircleDot className="w-3 h-3" />
                                    <span>Yangi so‘z</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkMastered(e, word)}
                                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                    title="O‘zlashtirdim deb belgilash"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Bilaman (+1)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkLearning(e, word)}
                                    className="inline-flex items-center gap-1 text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                    title="Takrorlashga qo‘shish"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Bilmadim</span>
                                  </button>
                                </>
                              )}
                            </div>

                            <span className="text-[10px] text-stone-400">
                              {word.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Oldingi</span>
                    </button>

                    <span className="text-xs font-semibold text-stone-600">
                      {currentPage} / {totalPages} sahifa
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Keyingi</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Active Topic Knowledge Check CTA */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">
                        «{activeTopic.nameUz}» mavzusi bo‘yicha bilimingizni sinang!
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Test topshiring va o‘zlashtirilgan so‘zlarni mustahkamlab, ball to‘plang.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartTopicTest(activeTopic)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Award className="w-4 h-4" />
                    <span>Mavzu testini topshirish</span>
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: ALL WORDS LIST */}
            {viewMode === 'words' && (
              <div className="space-y-4">
                {/* Search and Filters Bar */}
                <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Inglizcha yoki o‘zbekcha so‘z qidiring..."
                      className="w-full pl-9 pr-8 py-2 bg-stone-50 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Part of Speech tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                      <button
                        onClick={() => setSelectedPos('all')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 ${
                          selectedPos === 'all'
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        Hammasi
                      </button>
                      {partsOfSpeech.map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setSelectedPos(pos)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 ${
                            selectedPos === pos
                              ? 'bg-indigo-600 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-700 font-medium focus:outline-hidden"
                      >
                        <option value="order"># Tartib raqam</option>
                        <option value="az">A–Z Alifbo</option>
                        <option value="status">O‘zlashtirish holati</option>
                      </select>

                      <button
                        onClick={() => setShowUzbekTranslations((p) => !p)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          showUzbekTranslations
                            ? 'bg-stone-100 border-stone-300 text-stone-700'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        }`}
                        title={showUzbekTranslations ? "Tarjimalarni yashirish" : "Tarjimalarni ko‘rsatish"}
                      >
                        {showUzbekTranslations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>
                    Topilgan so‘zlar: <strong className="text-stone-900">{filteredWords.length}</strong> ta
                    {filteredWords.length > PAGE_SIZE && ` (${currentPage} / ${totalPages}-sahifa)`}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    O‘rganish tartibi: #{meta.count === 500 ? '1–500' : `1–${meta.count}`}
                  </span>
                </div>

                {/* Words Grid */}
                {filteredWords.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200 p-6">
                    <Search className="w-10 h-10 text-stone-300 mx-auto" />
                    <h3 className="font-bold text-sm text-stone-800">Hech qanday so‘z topilmadi</h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Qidiruv so‘zini o‘zgartiring yoki filtrlarni tozalang.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedPos('all');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                    >
                      Filtrlarni tozalash
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paginatedWords.map((word) => {
                      const prog = wordProgress[word.id];
                      const isMastered = prog?.masteryLevel === 'ozlashtirilgan';
                      const isLearning = prog?.masteryLevel === 'organilmoqda';
                      const isExpanded = expandedWordId === word.id;

                      return (
                        <div
                          key={word.id}
                          onClick={() => setExpandedWordId(isExpanded ? null : word.id)}
                          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer group ${
                            isMastered
                              ? 'border-emerald-200 bg-emerald-50/20'
                              : isLearning
                              ? 'border-amber-200 bg-amber-50/20'
                              : 'border-stone-200 hover:border-indigo-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Visual Word Thumbnail */}
                            {(() => {
                              const vMeta = getWordVisualMeta(word);
                              if (vMeta.isConcreteObject) {
                                return (
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/90 shrink-0 shadow-2xs">
                                    <img
                                      src={vMeta.imageUrl}
                                      alt={word.english}
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = generateWordArtworkSvg(word);
                                      }}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                );
                              }
                              return (
                                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${vMeta.accentGradient} flex flex-col items-center justify-center text-white shrink-0 shadow-2xs border border-white/20 select-none`}>
                                  <span className="text-base font-black leading-none">{word.english.charAt(0).toUpperCase()}</span>
                                  <span className="text-[9px] font-extrabold opacity-85 mt-0.5">{word.level}</span>
                                </div>
                              );
                            })()}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-bold text-stone-400">
                                  #{word.orderNumber}
                                </span>
                                <h3 className="text-base font-black text-stone-900 group-hover:text-indigo-600 transition-colors">
                                  {word.english}
                                </h3>
                                {word.partOfSpeech && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold">
                                    {word.partOfSpeech}
                                  </span>
                                )}
                                {word.transcription && (
                                  <span className="text-xs text-indigo-600 font-mono">
                                    {word.transcription}
                                  </span>
                                )}
                              </div>

                              <div className="mt-1 text-sm font-semibold text-stone-800">
                                {showUzbekTranslations ? (
                                  <span>{word.uzbek}</span>
                                ) : (
                                  <span className="text-xs text-stone-400 italic">
                                    (Ko‘rish uchun bosing)
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => handlePlayAudio(e, word)}
                                className="p-2 rounded-xl text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Talaffuzni eshitish"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAddToDeckModal(word);
                                }}
                                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                                title="Shaxsiy to‘plamga qo‘shish"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Example sentence with clear, prominent styling for A1 beginners */}
                          {word.exampleSentence && (
                            <div className="mt-2.5 pt-2.5 border-t border-stone-100 bg-stone-50/80 rounded-xl p-2.5 space-y-1">
                              <div className="flex items-start gap-1.5 text-xs text-stone-800">
                                <span className="text-indigo-600 font-bold shrink-0">Misol:</span>
                                <span className="italic font-medium">"{word.exampleSentence}"</span>
                              </div>
                              {showUzbekTranslations && word.exampleUzbek && (
                                <div className="flex items-start gap-1.5 text-[11px] text-emerald-800 font-semibold pl-4">
                                  <span>↳</span>
                                  <span>{word.exampleUzbek}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Footer status pill & direct mastery trigger */}
                          <div className="mt-3 flex items-center justify-between text-[11px] flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isMastered ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>O‘zlashtirilgan</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkLearning(e, word)}
                                    className="inline-flex items-center gap-1 text-stone-500 hover:text-amber-700 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer"
                                    title="Qayta o‘rganish ro‘yxatiga o‘tkazish"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Bilmadim</span>
                                  </button>
                                </>
                              ) : isLearning ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                                    <Clock className="w-3 h-3" />
                                    <span>O‘rganilmoqda</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkMastered(e, word)}
                                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                    title="O‘zlashtirdim deb belgilash"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Bilaman (+1)</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="inline-flex items-center gap-1 text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                                    <CircleDot className="w-3 h-3" />
                                    <span>Yangi so‘z</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkMastered(e, word)}
                                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                    title="O‘zlashtirdim deb belgilash"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Bilaman (+1)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkLearning(e, word)}
                                    className="inline-flex items-center gap-1 text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                    title="Takrorlashga qo‘shish"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Bilmadim</span>
                                  </button>
                                </>
                              )}
                            </div>

                            <span className="text-[10px] text-stone-400">
                              {word.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Oldingi</span>
                    </button>

                    <span className="text-xs font-semibold text-stone-600">
                      {currentPage} / {totalPages} sahifa
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Keyingi</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Level Test Knowledge Check CTA */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-emerald-500/10 border border-indigo-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">
                        {level} daraja bo‘yicha umumiy test topshirish
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Tasodifiy savollar orqali bilimingizni mustahkamlang va ball to‘plang.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartAllTest}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Award className="w-4 h-4" />
                    <span>{level} umumiy testini boshlash</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Onboarding Guide for Beginners */}
      <A1InteractiveOnboarding
        isOpen={showOnboardingGuide}
        onClose={() => setShowOnboardingGuide(false)}
        onStartTesting={handleStartAllTest}
      />

      {/* Add To Deck Modal */}
      {showAddToDeckModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">To‘plamga qo‘shish</h3>
              <button
                onClick={() => setShowAddToDeckModal(null)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70">
              <div className="text-sm font-black text-stone-900">
                {showAddToDeckModal.english}
              </div>
              <div className="text-xs text-stone-600 mt-0.5">
                {showAddToDeckModal.uzbek}
              </div>
            </div>

            <p className="text-xs text-stone-500 font-medium">
              Ushbu so‘zni qaysi shaxsiy kartotekangizga qo‘shmoqchisiz?
            </p>

            {decks.length === 0 ? (
              <div className="text-center py-5 px-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                <p className="font-semibold text-stone-700 mb-1">Shaxsiy to‘plamlar topilmadi</p>
                <p className="text-[11px] text-stone-400">
                  Avval «Lug‘atlarim» &rarr; «Shaxsiy to‘plamlar» sahifasida yangi to‘plam yarating.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {decks.map((deck) => (
                  <button
                    key={deck.id}
                    onClick={() => {
                      addNewWord(
                        {
                          english: showAddToDeckModal.english,
                          uzbek: showAddToDeckModal.uzbek,
                          transcription: showAddToDeckModal.transcription,
                          exampleSentence: showAddToDeckModal.exampleSentence,
                          exampleUzbek: showAddToDeckModal.exampleUzbek,
                          audioUrl: showAddToDeckModal.audioUrl,
                          image: showAddToDeckModal.image,
                          topicId: showAddToDeckModal.topicId,
                          level: showAddToDeckModal.level,
                          partOfSpeech: showAddToDeckModal.partOfSpeech,
                          category: showAddToDeckModal.category,
                        },
                        deck.id
                      );
                      playChime('correct');
                      setShowAddToDeckModal(null);
                    }}
                    className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-left flex items-center justify-between text-xs font-bold text-stone-800"
                  >
                    <span>{deck.name}</span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      {deck.words.length} ta so‘z
                    </span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddToDeckModal(null)}
              className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
