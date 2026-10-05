import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import {
  User,
  Word,
  Topic,
  Deck,
  UserWordProgress,
  Achievement,
  RankingUser,
  TestResult,
  CEFRLevel,
  NotificationReminder,
  PastErrorItem,
  UserLeague,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TOPICS,
  INITIAL_WORDS,
  INITIAL_DECKS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_RANKINGS,
} from '../data/initialData';
import { calculateSrsNextReview, RatingChoice, playChime } from '../utils/srs';
import {
  getCefrLevelWords,
  CEFR_LEVELS_META,
  TOTAL_CEFR_WORDS,
  groupCefrWordsByTopic,
  getNextTopicInLevel,
  getNextCefrLevel,
  CEFR_TOPIC_ORDER,
} from '../services/cefrService';
import {
  getLeagueByXp,
  getLeagueProgress,
  buildWeeklyLeaderboard,
  LeagueMeta,
  LEAGUES_CONFIG,
} from '../utils/league';
import {
  subscribeNetworkStatus,
  syncProgressOffline,
  preloadAllEssentialVocabulary,
  invalidateCefrCacheIfOutdated,
} from '../services/offlineSyncService';
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendBrowserNotification,
  isReminderActiveForDay,
  getTimeUntilReminder,
  generatePracticeReminderText,
  playReminderChime,
} from '../utils/notifications';

export type ScreenType =
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'vocabulary'
  | 'topic_detail'
  | 'deck_detail'
  | 'add_word'
  | 'flashcards'
  | 'games'
  | 'game_matching'
  | 'game_anagram'
  | 'game_sprint'
  | 'game_audio'
  | 'audio_game'
  | 'test_select'
  | 'test_run'
  | 'test_results'
  | 'progress'
  | 'profile'
  | 'multiplayer'
  | 'premium'
  | 'admin'
  | 'settings'
  | 'privacy_policy'
  | 'notifications'
  | 'services'
  | 'pronunciation'
  | 'audio_player'
  | 'stories'
  | 'sentence_builder'
  | 'certificate_test'
  | 'cefr_diagnostic'
  | 'ielts_test'
  | 'export_tools'
  | 'ai_tutor'
  | 'leaderboard'
  | 'weak_words';

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  activeTab: 'home' | 'vocabulary' | 'games' | 'test' | 'profile';
  setActiveTab: (tab: 'home' | 'vocabulary' | 'games' | 'test' | 'profile') => void;
  addWordDefaultTab: 'single' | 'ai_batch';
  setAddWordDefaultTab: (tab: 'single' | 'ai_batch') => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  selectedDeckId: string | null;
  setSelectedDeckId: (id: string | null) => void;
  selectedCefrLevel: CEFRLevel | null;
  setSelectedCefrLevel: (level: CEFRLevel | null) => void;
  cefrLevelWords: Word[];
  isLoadingCefrWords: boolean;
  loadCefrWordsForLevel: (level: CEFRLevel) => Promise<Word[]>;
  getCefrLevelStats: (level: CEFRLevel) => {
    total: number;
    learned: number;
    learning: number;
    newCount: number;
    percent: number;
  };
  getTotalCefrStats: () => {
    totalWords: number;
    totalLearned: number;
    totalLearning: number;
    totalNew: number;
    totalPercent: number;
  };
  testMode: string;
  setTestMode: (mode: string) => void;
  lastTestResult: TestResult | null;
  setLastTestResult: (result: TestResult | null) => void;

  // Data
  words: Word[];
  topics: Topic[];
  decks: Deck[];
  wordProgress: Record<string, UserWordProgress>;
  achievements: Achievement[];
  rankings: RankingUser[];

  // Computed SRS & Daily Stats
  wordsDueToday: Word[];
  todayLearnedCount: number;
  dailyGoal: number;

  // Actions
  rateWordSRS: (wordId: string, rating: RatingChoice) => void;
  addNewWord: (newWord: Omit<Word, 'id' | 'orderNumber'>, targetDeckId?: string) => Word;
  addBatchWords: (newWords: Array<Omit<Word, 'id' | 'orderNumber'>>, targetDeckId?: string) => Word[];
  addNewDeck: (name: string, description?: string) => Deck;
  addWordToDeck: (deckId: string, wordId: string) => void;
  deleteDeck: (deckId: string) => void;
  removeWordFromDeck: (deckId: string, wordId: string) => void;
  saveTestResult: (result: TestResult) => void;
  claimDailyStars: () => void;
  redeemPremiumWithStars: () => boolean;
  toggleRankFreeze: () => void;
  unfreezeRankingViaTest: () => void;
  resetOnboarding: () => void;
  notificationAlert: string | null;
  dismissNotification: () => void;
  showSimulatedNotification: (text: string) => void;

  // Push Notification Reminders & Scheduling
  reminders: NotificationReminder[];
  addReminder: (reminder: Omit<NotificationReminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<NotificationReminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  triggerTestNotification: (reminderId?: string) => void;
  notificationPermission: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<NotificationPermission | 'unsupported'>;
  soundAlertsEnabled: boolean;
  setSoundAlertsEnabled: (enabled: boolean) => void;
  nextScheduledReminder: { reminder: NotificationReminder; text: string } | null;

  // Locked feature modal management
  lockedFeatureModal: string | null;
  openLockedFeatureModal: (featureId: string) => void;
  closeLockedFeatureModal: () => void;

  // Admin capabilities
  adminDeleteWord: (wordId: string) => void;
  adminToggleUserBlock: (userId: string) => void;

  // Words mastery actions
  markWordAsMastered: (wordId: string) => void;
  markWordAsLearning: (wordId: string) => void;

  // Past Errors & Pedagogical AI Tracking
  pastErrors: PastErrorItem[];
  recordWordError: (
    wordData: { id?: string; english: string; uzbek: string; transcription?: string; level?: CEFRLevel; partOfSpeech?: string },
    source?: 'test' | 'flashcard' | 'quiz' | 'game'
  ) => void;
  clearPastErrors: () => void;
  resolveWordError: (errorIdOrWordId: string) => void;
  startWeaknessPractice: () => void;

  // Gamification & Weekly League Leaderboard
  awardXp: (amount: number, reason?: string) => void;
  userLeague: UserLeague;
  leagueMeta: LeagueMeta;
  weeklyLeaderboard: RankingUser[];
  userWeeklyRank: number;
  activeLeagueFilter: UserLeague | 'all';
  setActiveLeagueFilter: (filter: UserLeague | 'all') => void;

  // Offline Sync State
  isOnline: boolean;
  isSyncing: boolean;
  syncOfflineData: () => Promise<void>;

  // Dark Mode Theme
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: () => void;

  // Sequential Progression & Mastery-Based Unlocking System
  isLevelUnlocked: (level: CEFRLevel) => boolean;
  isTopicUnlocked: (topicId: string, level?: CEFRLevel) => boolean;
  isTopicMastered: (topicId: string) => boolean;
  getTopicMasteryScore: (topicId: string) => number;
  unlockTopic: (topicId: string) => void;
  unlockLevel: (level: CEFRLevel) => void;
  unlockLevelAndPrior: (targetLevel: CEFRLevel) => void;
  startTopicMasteryQuiz: (topicId: string, topicName: string, level: CEFRLevel) => void;
  activeMasteryModalTopic: {
    topicId: string;
    topicName: string;
    level: CEFRLevel;
    totalWords: number;
  } | null;
  setActiveMasteryModalTopic: (
    topic: { topicId: string; topicName: string; level: CEFRLevel; totalWords: number } | null
  ) => void;
  lockedProgressionModal: {
    type: 'topic' | 'level';
    id: string;
    title: string;
    subtitle?: string;
    requirement: string;
  } | null;
  openLockedProgressionModal: (info: {
    type: 'topic' | 'level';
    id: string;
    title: string;
    subtitle?: string;
    requirement?: string;
  }) => void;
  closeLockedProgressionModal: () => void;

  // Placement Test (Darajani aniqlash testi)
  isPlacementTestModalOpen: boolean;
  placementTestTargetLevel: CEFRLevel | null;
  openPlacementTestModal: (targetLevel?: CEFRLevel) => void;
  closePlacementTestModal: () => void;
  startPlacementTest: (targetLevel: CEFRLevel) => void;

  // Mistakes Practice (Xatolar ustida ishlash)
  practiceMistakesWords: Word[];
  startMistakesPractice: (wordsToPractice?: Word[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe storage utilities with error handling
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`[Verbo Storage] Error reading key "${key}" from localStorage:`, err);
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`[Verbo Storage] Error writing key "${key}" to localStorage:`, err);
    return false;
  }
}

const DEFAULT_REMINDERS: NotificationReminder[] = [
  {
    id: 'morning',
    time: '08:00',
    title: 'Tonggi takrorlash',
    desc: 'Tonggi 5 daqiqa takrorlash so‘zlarni uzoq muddatli xotiraga o‘tkazadi ☀️',
    enabled: true,
    practiceType: 'spaced_repetition',
    frequency: 'daily',
    soundEnabled: true,
  },
  {
    id: 'lunch',
    time: '13:00',
    title: 'Tushlik tanaffusi',
    desc: 'Tushlik paytida 5 ta yangi so‘z o‘rganing va lug‘at zaxirangizni oshiring 🥪',
    enabled: true,
    practiceType: 'new_words',
    frequency: 'daily',
    soundEnabled: true,
  },
  {
    id: 'evening',
    time: '20:00',
    title: 'Kechki asosiy mashg‘ulot',
    desc: 'Kechki xotirani mustahkamlash va mini-viktorina vaqti 🌙',
    enabled: true,
    practiceType: 'quick_quiz',
    frequency: 'daily',
    soundEnabled: true,
  },
  {
    id: 'streak_warning',
    time: '22:00',
    title: 'Streak saqlash ogohlantirishi',
    desc: 'Diqqat: Bugungi o‘quv seriyangiz uzilib qolishiga oz vaqt qoldi! 🔥',
    enabled: true,
    practiceType: 'streak_saver',
    frequency: 'daily',
    soundEnabled: true,
    isWarning: true,
  },
];

const DEFAULT_PAST_ERRORS: PastErrorItem[] = [
  {
    id: 'err_init_1',
    english: 'Consequence',
    uzbek: 'Oqibat, natija',
    transcription: '/ˈkɒnsɪkwəns/',
    level: 'B1',
    partOfSpeech: 'noun',
    source: 'test',
    errorCount: 2,
    lastMistakeDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'err_init_2',
    english: 'Reluctant',
    uzbek: 'Ikkilanuvchi, istaksiz',
    transcription: '/rɪˈlʌktənt/',
    level: 'B2',
    partOfSpeech: 'adjective',
    source: 'flashcard',
    errorCount: 3,
    lastMistakeDate: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'err_init_3',
    english: 'Ambiguous',
    uzbek: 'Ikki ma’noli, noaniq',
    transcription: '/æmˈbɪɡjuəs/',
    level: 'B2',
    partOfSpeech: 'adjective',
    source: 'test',
    errorCount: 1,
    lastMistakeDate: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved user state or initial
  const [user, setUser] = useState<User>(() => {
    const saved = safeGetItem('verbo_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER,
          ...parsed,
          unlockedCefrLevels:
            parsed.unlockedCefrLevels && parsed.unlockedCefrLevels.length > 0
              ? parsed.unlockedCefrLevels
              : ['A1'],
          unlockedTopicIds:
            parsed.unlockedTopicIds && parsed.unlockedTopicIds.length > 0
              ? parsed.unlockedTopicIds
              : ['cefr_a1_greetings', 'cefr_a1_daily'],
          masteredTopicIds: parsed.masteredTopicIds || [],
          topicMasteryScores: parsed.topicMasteryScores || {},
        };
      } catch (err) {
        console.warn('Failed to parse verbo_user:', err);
      }
    }
    return INITIAL_USER;
  });

  const [words, setWords] = useState<Word[]>(() => {
    const saved = safeGetItem('verbo_words');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn('Failed to parse verbo_words:', err);
      }
    }
    return INITIAL_WORDS;
  });

  const [topics] = useState<Topic[]>(INITIAL_TOPICS);
  const [decks, setDecks] = useState<Deck[]>(() => {
    const saved = safeGetItem('verbo_decks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((d: Deck) => {
            if (!d || !d.id) return false;
            if (
              d.id === 'deck_personal_01' ||
              d.id === 'deck_personal_02' ||
              d.id === 'deck_personal_03'
            ) {
              return false;
            }
            const nameLower = (d.name || '').toLowerCase();
            if (
              nameLower.includes('qiyin') ||
              nameLower.includes('ielts essential') ||
              nameLower.includes('ielts essensial') ||
              nameLower.includes('medical english')
            ) {
              return false;
            }
            return true;
          });
          safeSetItem('verbo_decks', JSON.stringify(filtered));
          return filtered;
        }
      } catch (err) {
        console.warn('Failed to parse verbo_decks:', err);
      }
    }
    return INITIAL_DECKS;
  });

  // Word Progress records
  const [wordProgress, setWordProgress] = useState<Record<string, UserWordProgress>>(() => {
    const saved = safeGetItem('verbo_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      } catch (err) {
        console.warn('Failed to parse verbo_progress:', err);
      }
    }
    // Initialize initial progress for sample words across CEFR A1 and A2
    const initialProg: Record<string, UserWordProgress> = {};
    // Seed A1: 280 mastered, 45 learning (out of 500)
    for (let i = 1; i <= 280; i++) {
      const id = `cefr_a1_${String(i).padStart(4, '0')}`;
      initialProg[id] = {
        userId: INITIAL_USER.id,
        wordId: id,
        masteryLevel: 'ozlashtirilgan',
        nextReviewDate: new Date(Date.now() + 86400000 * 14).toISOString(),
        intervalDays: 14,
        consecutiveKnownCount: 3,
        lastActivityTime: new Date().toISOString(),
        reviewCount: 4,
      };
    }
    for (let i = 281; i <= 325; i++) {
      const id = `cefr_a1_${String(i).padStart(4, '0')}`;
      initialProg[id] = {
        userId: INITIAL_USER.id,
        wordId: id,
        masteryLevel: 'organilmoqda',
        nextReviewDate: new Date().toISOString(),
        intervalDays: 2,
        consecutiveKnownCount: 1,
        lastActivityTime: new Date().toISOString(),
        reviewCount: 2,
      };
    }
    // Seed A2: 120 mastered, 35 learning (out of 1000)
    for (let i = 1; i <= 120; i++) {
      const id = `cefr_a2_${String(i).padStart(4, '0')}`;
      initialProg[id] = {
        userId: INITIAL_USER.id,
        wordId: id,
        masteryLevel: 'ozlashtirilgan',
        nextReviewDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        intervalDays: 10,
        consecutiveKnownCount: 2,
        lastActivityTime: new Date().toISOString(),
        reviewCount: 3,
      };
    }
    for (let i = 121; i <= 155; i++) {
      const id = `cefr_a2_${String(i).padStart(4, '0')}`;
      initialProg[id] = {
        userId: INITIAL_USER.id,
        wordId: id,
        masteryLevel: 'organilmoqda',
        nextReviewDate: new Date().toISOString(),
        intervalDays: 1,
        consecutiveKnownCount: 1,
        lastActivityTime: new Date().toISOString(),
        reviewCount: 1,
      };
    }
    return initialProg;
  });

  // Achievements & Rankings persistence
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = safeGetItem('verbo_achievements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn('Failed to parse verbo_achievements:', err);
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [rankings, setRankings] = useState<RankingUser[]>(() => {
    const saved = safeGetItem('verbo_rankings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn('Failed to parse verbo_rankings:', err);
      }
    }
    return INITIAL_RANKINGS;
  });

  // CEFR words memory & local cache for Spaced Repetition lookup
  const [cefrWordsCache, setCefrWordsCache] = useState<Record<string, Word>>(() => {
    const saved = safeGetItem('verbo_cefr_cache');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  // Past errors tracking for AI recommendations & weak-point remediation
  const [pastErrors, setPastErrors] = useState<PastErrorItem[]>(() => {
    const saved = safeGetItem('verbo_past_errors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (err) {
        console.warn('Failed to parse verbo_past_errors:', err);
      }
    }
    return DEFAULT_PAST_ERRORS;
  });

  const recordWordError = (
    wordData: { id?: string; english: string; uzbek: string; transcription?: string; level?: CEFRLevel; partOfSpeech?: string },
    source: 'test' | 'flashcard' | 'quiz' | 'game' = 'test'
  ) => {
    if (!wordData || !wordData.english) return;
    const cleanEnglish = wordData.english.trim();
    setPastErrors((prev) => {
      const existingIdx = prev.findIndex(
        (e) => e.english.toLowerCase() === cleanEnglish.toLowerCase()
      );
      if (existingIdx !== -1) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        updated[existingIdx] = {
          ...existing,
          errorCount: existing.errorCount + 1,
          lastMistakeDate: new Date().toISOString(),
          source,
          uzbek: wordData.uzbek || existing.uzbek,
        };
        return updated;
      }

      const newErrorItem: PastErrorItem = {
        id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        wordId: wordData.id,
        english: cleanEnglish,
        uzbek: wordData.uzbek || '',
        transcription: wordData.transcription || '',
        level: wordData.level || user.level || 'B1',
        partOfSpeech: wordData.partOfSpeech || 'noun',
        source,
        errorCount: 1,
        lastMistakeDate: new Date().toISOString(),
      };
      return [newErrorItem, ...prev].slice(0, 50);
    });
  };

  const clearPastErrors = () => {
    setPastErrors([]);
  };

  // Online / Offline synchronization state
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const syncOfflineData = async () => {
    setIsSyncing(true);
    try {
      await syncProgressOffline(wordProgress);
    } catch (e) {
      console.warn('[Verbo Offline] Sync error:', e);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  useEffect(() => {
    invalidateCefrCacheIfOutdated();

    const unsub = subscribeNetworkStatus((online) => {
      setIsOnline(online);
      if (online) {
        syncOfflineData();
      }
    });

    preloadAllEssentialVocabulary();
    return unsub;
  }, []);

  useEffect(() => {
    syncProgressOffline(wordProgress);
  }, [wordProgress]);

  // Gamification & League State
  const [activeLeagueFilter, setActiveLeagueFilter] = useState<UserLeague | 'all'>('all');

  const awardXp = (amount: number, reason?: string) => {
    if (amount <= 0) return;
    setUser((prev) => {
      const currentXp = prev.xp ?? 980;
      const currentWeeklyXp = prev.weeklyXp ?? 520;
      const newXp = currentXp + amount;
      const newWeeklyXp = currentWeeklyXp + amount;
      const newLeague = getLeagueByXp(newXp).id;

      return {
        ...prev,
        xp: newXp,
        weeklyXp: newWeeklyXp,
        league: newLeague,
      };
    });
  };

  const userLeague: UserLeague = user.league || getLeagueByXp(user.xp ?? 980).id;
  const leagueMeta: LeagueMeta = LEAGUES_CONFIG[userLeague] || LEAGUES_CONFIG.silver;

  const { topTen: weeklyLeaderboard, userRank: userWeeklyRank } = useMemo(() => {
    return buildWeeklyLeaderboard(user, activeLeagueFilter);
  }, [user, activeLeagueFilter]);

  // Weakness Practice actions
  const resolveWordError = (errorIdOrWordId: string) => {
    setPastErrors((prev) => {
      const matchIdx = prev.findIndex(
        (e) =>
          e.id === errorIdOrWordId ||
          e.wordId === errorIdOrWordId ||
          e.english.toLowerCase() === errorIdOrWordId.toLowerCase()
      );
      if (matchIdx === -1) return prev;
      const target = prev[matchIdx];
      if (target.errorCount > 1) {
        const updated = [...prev];
        updated[matchIdx] = { ...target, errorCount: target.errorCount - 1, resolved: true };
        return updated;
      }
      return prev.filter((_, i) => i !== matchIdx);
    });

    // Reward for remediating weak word
    awardXp(20, "Xatolar ustida muvaffaqiyatli ishlandi");
    playChime('win');
  };

  const startWeaknessPractice = () => {
    setTestMode('weak_words');
    setCurrentScreen('test_run');
  };

  // Dark Mode Theme State & Persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = safeGetItem('verbo_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    safeSetItem('verbo_dark_mode', String(isDarkMode));
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'vocabulary' | 'games' | 'test' | 'profile'>('home');
  const [addWordDefaultTab, setAddWordDefaultTab] = useState<'single' | 'ai_batch'>('ai_batch');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [selectedCefrLevel, setSelectedCefrLevel] = useState<CEFRLevel | null>(null);
  const [cefrLevelWords, setCefrLevelWords] = useState<Word[]>([]);
  const [isLoadingCefrWords, setIsLoadingCefrWords] = useState(false);
  const [lockedFeatureModal, setLockedFeatureModal] = useState<string | null>(null);

  const openLockedFeatureModal = (featureId: string) => {
    setLockedFeatureModal(featureId);
  };

  const closeLockedFeatureModal = () => {
    setLockedFeatureModal(null);
  };

  // Progression & Mastery Modals & State
  const [activeMasteryModalTopic, setActiveMasteryModalTopic] = useState<{
    topicId: string;
    topicName: string;
    level: CEFRLevel;
    totalWords: number;
  } | null>(null);

  const [lockedProgressionModal, setLockedProgressionModal] = useState<{
    type: 'topic' | 'level';
    id: string;
    title: string;
    subtitle?: string;
    requirement: string;
  } | null>(null);

  const openLockedProgressionModal = (info: {
    type: 'topic' | 'level';
    id: string;
    title: string;
    subtitle?: string;
    requirement?: string;
  }) => {
    setLockedProgressionModal({
      type: info.type,
      id: info.id,
      title: info.title,
      subtitle: info.subtitle,
      requirement: info.requirement || 'Oldingi mavzu/darajani 85%+ natija bilan yakunlang',
    });
  };

  const closeLockedProgressionModal = () => {
    setLockedProgressionModal(null);
  };

  // Placement Test State (Darajani aniqlash testi)
  const [isPlacementTestModalOpen, setIsPlacementTestModalOpen] = useState<boolean>(false);
  const [placementTestTargetLevel, setPlacementTestTargetLevel] = useState<CEFRLevel | null>(null);

  const openPlacementTestModal = (targetLevel?: CEFRLevel) => {
    setPlacementTestTargetLevel(targetLevel || 'A2');
    setIsPlacementTestModalOpen(true);
  };

  const closePlacementTestModal = () => {
    setIsPlacementTestModalOpen(false);
  };

  const startPlacementTest = (targetLevel: CEFRLevel) => {
    setIsPlacementTestModalOpen(false);
    setSelectedCefrLevel(targetLevel);
    loadCefrWordsForLevel(targetLevel);
    setTestMode(`placement_test_${targetLevel.toLowerCase()}`);
    setCurrentScreen('test_run');
  };

  // Mistakes Practice State (Xatolar ustida ishlash)
  const [practiceMistakesWords, setPracticeMistakesWords] = useState<Word[]>([]);

  const startMistakesPractice = (wordsToPractice?: Word[]) => {
    const list = wordsToPractice && wordsToPractice.length > 0 ? wordsToPractice : pastErrors.map((pe, idx) => ({
      id: pe.wordId || pe.id,
      english: pe.english,
      uzbek: pe.uzbek,
      transcription: pe.transcription || '',
      exampleSentence: `${pe.english} is a key word to master.`,
      exampleUzbek: `${pe.uzbek} - ma'nosini eslab qoling.`,
      level: pe.level,
      orderNumber: idx + 1,
    } as Word));

    if (list.length === 0) return;

    // Record to pastErrors if not already there
    list.forEach((w) => {
      recordWordError(w, 'test');
    });

    setPracticeMistakesWords(list);
    setTestMode('practice_mistakes');
    setCurrentScreen('test_run');
  };

  const isLevelUnlocked = (level: CEFRLevel): boolean => {
    if (level === 'A1') return true; // Level A1 is unlocked by default
    const unlocked = user.unlockedCefrLevels || ['A1'];
    return unlocked.includes(level);
  };

  const isTopicUnlocked = (topicId: string, level?: CEFRLevel): boolean => {
    // If level is provided and locked, topics in it are locked
    if (level && !isLevelUnlocked(level)) return false;
    // If all topics in this level are unlocked (e.g. via Placement Test)
    const unlocked = user.unlockedTopicIds || ['cefr_a1_daily'];
    if (level && unlocked.includes(`all_${level.toLowerCase()}`)) {
      return true;
    }
    // By default, Level A1, Topic 1 is ALWAYS unlocked for a new user
    if (
      topicId === 'cefr_a1_greetings' ||
      topicId === 'cefr_a1_daily' ||
      topicId.includes('greetings') ||
      topicId.includes('Salomlashuv') ||
      topicId === 'cefr_topic_Kundalik%20hayot%20va%20Muloqot' ||
      topicId === 'cefr_topic_Salomlashuv%20va%20Kundalik%20muloqot' ||
      topicId === 'Salomlashuv va Kundalik muloqot' ||
      topicId === 'Kundalik hayot va Muloqot'
    ) {
      return true;
    }
    return unlocked.includes(topicId);
  };

  const isTopicMastered = (topicId: string): boolean => {
    return (user.masteredTopicIds || []).includes(topicId);
  };

  const getTopicMasteryScore = (topicId: string): number => {
    return user.topicMasteryScores?.[topicId] || 0;
  };

  const unlockTopic = (topicId: string) => {
    setUser((prev) => {
      const current = prev.unlockedTopicIds || ['cefr_a1_daily'];
      if (current.includes(topicId)) return prev;
      return {
        ...prev,
        unlockedTopicIds: [...current, topicId],
      };
    });
  };

  const unlockLevel = (level: CEFRLevel) => {
    setUser((prev) => {
      const current = prev.unlockedCefrLevels || ['A1'];
      if (current.includes(level)) return prev;
      return {
        ...prev,
        unlockedCefrLevels: [...current, level],
      };
    });
  };

  const unlockLevelAndPrior = (targetLevel: CEFRLevel) => {
    const order: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const targetIdx = order.indexOf(targetLevel);
    if (targetIdx < 0) return;
    const levelsToUnlock = order.slice(0, targetIdx + 1);
    const allTopicKeys = levelsToUnlock.map((lvl) => `all_${lvl.toLowerCase()}`);

    setUser((prev) => {
      const currentLevels = prev.unlockedCefrLevels || ['A1'];
      const newLevels = Array.from(new Set([...currentLevels, ...levelsToUnlock]));
      const currentTopics = prev.unlockedTopicIds || ['cefr_a1_daily'];
      const newTopics = Array.from(new Set([...currentTopics, ...allTopicKeys]));
      const userLevelIdx = order.indexOf(prev.level);
      const updatedLevel = userLevelIdx < targetIdx ? targetLevel : prev.level;

      return {
        ...prev,
        level: updatedLevel,
        unlockedCefrLevels: newLevels,
        unlockedTopicIds: newTopics,
      };
    });
  };

  const startTopicMasteryQuiz = (topicId: string, topicName: string, level: CEFRLevel) => {
    setSelectedCefrLevel(level);
    setSelectedTopicId(topicId);
    setTestMode(`topic_mastery_${topicId}`);
    setCurrentScreen('test_run');
  };

  const loadCefrWordsForLevel = async (level: CEFRLevel): Promise<Word[]> => {
    setIsLoadingCefrWords(true);
    try {
      const data = await getCefrLevelWords(level);
      setCefrLevelWords(data);
      setSelectedCefrLevel(level);
      setCefrWordsCache((prev) => {
        const next = { ...prev };
        data.forEach((w) => {
          next[w.id] = w;
        });
        return next;
      });
      return data;
    } catch (err) {
      console.error('Failed to load CEFR level words:', err);
      return [];
    } finally {
      setIsLoadingCefrWords(false);
    }
  };

  useEffect(() => {
    const targetLvl = user.level || 'A1';
    if (!selectedCefrLevel) {
      setSelectedCefrLevel(targetLvl);
    }
    loadCefrWordsForLevel(targetLvl);
  }, []);

  const getCefrLevelStats = (level: CEFRLevel) => {
    const meta = CEFR_LEVELS_META[level];
    const total = meta ? meta.count : 0;
    const prefix = `cefr_${level.toLowerCase()}_`;
    let learned = 0;
    let learning = 0;

    Object.entries(wordProgress).forEach(([id, p]) => {
      const progress = p as UserWordProgress;
      if (id.startsWith(prefix) && progress) {
        if (progress.masteryLevel === 'ozlashtirilgan') learned++;
        else if (progress.masteryLevel === 'organilmoqda') learning++;
      }
    });

    const newCount = Math.max(0, total - learned - learning);
    // Weighted progress: fully mastered = 1.0, learning in progress = 0.5
    const weighted = learned + learning * 0.5;
    let percent = 0;
    if (total > 0 && weighted > 0) {
      const raw = (weighted / total) * 100;
      percent = raw < 1 ? Math.max(0.1, Number(raw.toFixed(1))) : Math.round(raw);
    }
    return { total, learned, learning, newCount, percent };
  };

  const getTotalCefrStats = () => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const totalWords = TOTAL_CEFR_WORDS;
    let totalLearned = 0;
    let totalLearning = 0;

    levels.forEach((lvl) => {
      const s = getCefrLevelStats(lvl);
      totalLearned += s.learned;
      totalLearning += s.learning;
    });

    const totalNew = Math.max(0, totalWords - totalLearned - totalLearning);
    const totalPercent = totalWords > 0 ? Math.round((totalLearned / totalWords) * 1000) / 10 : 0;
    return { totalWords, totalLearned, totalLearning, totalNew, totalPercent };
  };

  const [testMode, setTestMode] = useState<string>('today');
  const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);

  // Notifications State
  const [notificationAlert, setNotificationAlert] = useState<string | null>(
    "Eslatma: Bugungi streakingiz uzilib qolishi mumkin! 🔥 (22:00 gacha 7 ta so'z qoldi)"
  );

  // Reminders State
  const [reminders, setReminders] = useState<NotificationReminder[]>(() => {
    const saved = safeGetItem('verbo_reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse verbo_reminders:', e);
      }
    }
    return DEFAULT_REMINDERS;
  });

  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(() => {
    const saved = safeGetItem('verbo_sound_alerts');
    return saved !== null ? saved === 'true' : true;
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    return getNotificationPermission();
  });

  const triggeredLogRef = useRef<Set<string>>(new Set());

  // Listen to window focus to sync notification permission if user changes it in browser settings
  useEffect(() => {
    const syncPermission = () => {
      setNotificationPermission(getNotificationPermission());
    };
    window.addEventListener('focus', syncPermission);
    return () => window.removeEventListener('focus', syncPermission);
  }, []);

  useEffect(() => {
    safeSetItem('verbo_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    safeSetItem('verbo_sound_alerts', soundAlertsEnabled ? 'true' : 'false');
  }, [soundAlertsEnabled]);

  // Persist App States with error handling
  useEffect(() => {
    safeSetItem('verbo_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    safeSetItem('verbo_words', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    safeSetItem('verbo_decks', JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    safeSetItem('verbo_progress', JSON.stringify(wordProgress));
  }, [wordProgress]);

  useEffect(() => {
    safeSetItem('verbo_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    safeSetItem('verbo_rankings', JSON.stringify(rankings));
  }, [rankings]);

  useEffect(() => {
    safeSetItem('verbo_cefr_cache', JSON.stringify(cefrWordsCache));
  }, [cefrWordsCache]);

  useEffect(() => {
    safeSetItem('verbo_past_errors', JSON.stringify(pastErrors));
  }, [pastErrors]);

  // Sync activeTab with currentScreen when main tabs are clicked
  const handleTabChange = (tab: 'home' | 'vocabulary' | 'games' | 'test' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'vocabulary') setCurrentScreen('vocabulary');
    else if (tab === 'games') setCurrentScreen('games');
    else if (tab === 'test') setCurrentScreen('test_select');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  // Words due today for review (Spaced Repetition) - includes custom words AND CEFR words
  const wordsDueToday = useMemo(() => {
    const now = new Date().getTime();
    const resultWords: Word[] = [];
    const addedIds = new Set<string>();

    // 1. Check custom & initial words
    words.forEach((w) => {
      const prog = wordProgress[w.id];
      const isDue = !prog || new Date(prog.nextReviewDate).getTime() <= now + 86400000;
      if (isDue && !addedIds.has(w.id)) {
        addedIds.add(w.id);
        resultWords.push(w);
      }
    });

    // 2. Check CEFR words tracked in wordProgress
    Object.entries(wordProgress).forEach(([wordId, prog]) => {
      if (addedIds.has(wordId)) return;
      const p = prog as UserWordProgress;
      if (!p || !p.nextReviewDate) return;
      const reviewDate = new Date(p.nextReviewDate).getTime();
      if (reviewDate <= now + 86400000) {
        // Find word in cefrWordsCache or cefrLevelWords
        const foundWord = cefrWordsCache[wordId] || cefrLevelWords.find((cw) => cw.id === wordId);
        if (foundWord) {
          addedIds.add(wordId);
          resultWords.push(foundWord);
        }
      }
    });

    return resultWords;
  }, [words, wordProgress, cefrWordsCache, cefrLevelWords]);

  // Helper for today's date string (YYYY-MM-DD)
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  // Daily learned count - resets daily, persists across page reloads
  const [todayLearnedCount, setTodayLearnedCount] = useState<number>(() => {
    const savedDate = safeGetItem('verbo_today_learned_date');
    const savedCount = safeGetItem('verbo_today_learned_count');
    const today = getTodayDateString();
    if (savedDate === today && savedCount !== null) {
      const parsed = parseInt(savedCount, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  });

  useEffect(() => {
    const today = getTodayDateString();
    safeSetItem('verbo_today_learned_date', today);
    safeSetItem('verbo_today_learned_count', String(todayLearnedCount));
  }, [todayLearnedCount]);

  const dailyGoal = user.dailyGoal || 15;

  // Dynamic ranking calculation based on wordsLearned against competitors
  const calculateDynamicRank = (learnedCount: number, allRankings: RankingUser[]): number => {
    const competitors = allRankings.filter(
      (r) => r.id !== user.id && r.id !== 'rank_64' && !r.name.includes('(Siz)')
    );
    // Count how many other users have strictly more words learned
    const higherUsers = competitors.filter((r) => r.wordsLearned > learnedCount).length;
    return Math.max(1, higherUsers + 1);
  };

  // Rate word in Spaced Repetition (Flashcard / test / games)
  const rateWordSRS = (wordId: string, rating: RatingChoice) => {
    const currentProg = wordProgress[wordId];
    const srsResult = calculateSrsNextReview(currentProg, rating);

    setWordProgress((prev) => ({
      ...prev,
      [wordId]: {
        userId: user.id,
        wordId,
        masteryLevel: srsResult.masteryLevel,
        nextReviewDate: srsResult.nextReviewDate,
        intervalDays: srsResult.intervalDays,
        consecutiveKnownCount: srsResult.consecutiveKnownCount,
        lastActivityTime: new Date().toISOString(),
        reviewCount: (currentProg?.reviewCount || 0) + 1,
      },
    }));

    // Cache CEFR word if it is currently in active level
    const cefrMatch = cefrLevelWords.find((w) => w.id === wordId);
    if (cefrMatch && !cefrWordsCache[wordId]) {
      setCefrWordsCache((prev) => ({ ...prev, [wordId]: cefrMatch }));
    }

    // Update daily progress
    setTodayLearnedCount((prev) => Math.min(dailyGoal, prev + 1));

    // Update user stats with dynamic rank calculation
    setUser((prev) => {
      const newLearned = prev.wordsLearned + (rating === 'bildim' ? 1 : 0);
      const newRank = calculateDynamicRank(newLearned, rankings);
      return {
        ...prev,
        wordsLearned: newLearned,
        rank: newRank,
      };
    });

    // Update current user entry in rankings table dynamically
    if (rating === 'bildim') {
      awardXp(10, 'Fleshkarta takrorlash (+10 XP)');
      setRankings((prevRankings) => {
        return prevRankings.map((r) => {
          if (r.id === user.id || r.id === 'rank_64' || r.name.includes('(Siz)')) {
            const updatedWords = r.wordsLearned + 1;
            return {
              ...r,
              wordsLearned: updatedWords,
              rank: calculateDynamicRank(updatedWords, prevRankings),
            };
          }
          return r;
        });
      });
    } else if (rating === 'bilmadim' || rating === 'qiyin') {
      // Record in past errors for AI daily word recommendation
      const targetWord =
        words.find((w) => w.id === wordId) ||
        cefrLevelWords.find((w) => w.id === wordId) ||
        cefrWordsCache[wordId];
      if (targetWord) {
        recordWordError(targetWord, 'flashcard');
      }
    }
  };

  // Add custom word
  const addNewWord = (newWordData: Omit<Word, 'id' | 'orderNumber'>, targetDeckId?: string): Word => {
    const newWord: Word = {
      ...newWordData,
      id: `w_custom_${Date.now()}`,
      orderNumber: words.length + 1,
    };

    setWords((prev) => [newWord, ...prev]);

    // set initial progress
    setWordProgress((prev) => ({
      ...prev,
      [newWord.id]: {
        userId: user.id,
        wordId: newWord.id,
        masteryLevel: 'yangi',
        nextReviewDate: new Date().toISOString(),
        intervalDays: 1,
        consecutiveKnownCount: 0,
        lastActivityTime: new Date().toISOString(),
        reviewCount: 0,
      },
    }));

    // If added to personal deck
    const effectiveDeckId = targetDeckId || selectedDeckId;
    if (effectiveDeckId) {
      setDecks((prev) =>
        prev.map((d) =>
          d.id === effectiveDeckId ? { ...d, words: [newWord.id, ...d.words.filter((id) => id !== newWord.id)] } : d
        )
      );
    }

    return newWord;
  };

  // Add batch of custom words (e.g. from AI generator)
  const addBatchWords = (
    wordsList: Array<Omit<Word, 'id' | 'orderNumber'>>,
    targetDeckId?: string
  ): Word[] => {
    const timestamp = Date.now();
    const createdWords: Word[] = wordsList.map((w, idx) => ({
      ...w,
      id: `w_custom_${timestamp}_${idx}`,
      orderNumber: words.length + idx + 1,
    }));

    setWords((prev) => [...createdWords, ...prev]);

    const newProgressEntries: Record<string, UserWordProgress> = {};
    createdWords.forEach((cw) => {
      newProgressEntries[cw.id] = {
        userId: user.id,
        wordId: cw.id,
        masteryLevel: 'yangi',
        nextReviewDate: new Date().toISOString(),
        intervalDays: 1,
        consecutiveKnownCount: 0,
        lastActivityTime: new Date().toISOString(),
        reviewCount: 0,
      };
    });

    setWordProgress((prev) => ({ ...prev, ...newProgressEntries }));

    const effectiveDeckId = targetDeckId || selectedDeckId;
    if (effectiveDeckId) {
      const createdIds = createdWords.map((cw) => cw.id);
      setDecks((prev) =>
        prev.map((d) =>
          d.id === effectiveDeckId ? { ...d, words: [...createdIds, ...d.words] } : d
        )
      );
    }

    return createdWords;
  };

  // Add custom deck
  const addNewDeck = (name: string, description?: string): Deck => {
    const newDeck: Deck = {
      id: `deck_${Date.now()}`,
      name,
      description: description || 'Mening shaxsiy lug‘at to‘plamim',
      owner: user.id,
      words: [],
      isPersonal: true,
      color: 'from-sky-500 to-blue-600',
      icon: 'FolderHeart',
    };
    setDecks((prev) => [newDeck, ...prev]);
    return newDeck;
  };

  const addWordToDeck = (deckId: string, wordId: string) => {
    setDecks((prev) => {
      const updated = prev.map((d) =>
        d.id === deckId ? { ...d, words: Array.from(new Set([wordId, ...d.words])) } : d
      );
      safeSetItem('verbo_decks', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteDeck = (deckId: string) => {
    setDecks((prev) => {
      const updated = prev.filter((d) => d.id !== deckId);
      safeSetItem('verbo_decks', JSON.stringify(updated));
      return updated;
    });
    if (selectedDeckId === deckId) setSelectedDeckId(null);
  };

  const removeWordFromDeck = (deckId: string, wordId: string) => {
    setDecks((prev) => {
      const updated = prev.map((d) =>
        d.id === deckId ? { ...d, words: d.words.filter((id) => id !== wordId) } : d
      );
      safeSetItem('verbo_decks', JSON.stringify(updated));
      return updated;
    });
  };

  // Save Test results & update SRS progress for both correct and wrong answers
  const saveTestResult = (result: TestResult) => {
    setLastTestResult(result);

    // 1. Any incorrect words are reset in SRS to repeat after 1 day (tomorrow)
    if (result.needReviewWords.length > 0) {
      result.needReviewWords.forEach((word) => {
        recordWordError(word, 'test');
      });

      setWordProgress((prev) => {
        const next = { ...prev };
        result.needReviewWords.forEach((word) => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          next[word.id] = {
            userId: user.id,
            wordId: word.id,
            masteryLevel: 'organilmoqda',
            nextReviewDate: tomorrow.toISOString(),
            intervalDays: 1,
            consecutiveKnownCount: 0,
            lastActivityTime: new Date().toISOString(),
            reviewCount: (next[word.id]?.reviewCount || 0) + 1,
          };
        });
        return next;
      });
    }

    // 2. Any correct answers directly promote SRS mastery and user stats!
    if (result.wellLearnedWords && result.wellLearnedWords.length > 0) {
      setWordProgress((prev) => {
        const next = { ...prev };
        result.wellLearnedWords.forEach((word) => {
          const currentProg = next[word.id];
          const newConsecutive = (currentProg?.consecutiveKnownCount || 0) + 1;
          const isMastered = newConsecutive >= 2;
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + (isMastered ? 7 : 3));

          next[word.id] = {
            userId: user.id,
            wordId: word.id,
            masteryLevel: isMastered ? 'ozlashtirilgan' : 'organilmoqda',
            nextReviewDate: nextDate.toISOString(),
            intervalDays: isMastered ? 7 : 3,
            consecutiveKnownCount: newConsecutive,
            lastActivityTime: new Date().toISOString(),
            reviewCount: (currentProg?.reviewCount || 0) + 1,
          };
        });
        return next;
      });

      // If this was a weak words or mistakes practice test, resolve successfully answered mistakes!
      if (result.mode === 'weak_words' || result.mode === 'practice_mistakes') {
        result.wellLearnedWords.forEach((word) => {
          resolveWordError(word.id);
        });
      }

      // Update daily learned count and user total wordsLearned
      setTodayLearnedCount((prev) => Math.min(dailyGoal, prev + result.wellLearnedWords.length));
      setUser((prev) => {
        const newLearned = prev.wordsLearned + result.wellLearnedWords.length;
        const newRank = calculateDynamicRank(newLearned, rankings);
        return {
          ...prev,
          wordsLearned: newLearned,
          rank: newRank,
        };
      });
    }

    // Award XP based on correct answers and accuracy
    const earnedXp = result.correctAnswers * 15 + (result.accuracy >= 70 ? 40 : 10);
    awardXp(earnedXp, `Test yakunlandi (${result.accuracy}%)`);

    // Award 5 stars if completed with >70%
    if (result.accuracy >= 70) {
      setUser((prev) => ({
        ...prev,
        stars: prev.stars + 5,
      }));
    }

    // 3. Placement Test Evaluation (Darajani aniqlash testi >= 80%)
    if (result.mode.startsWith('placement_test_')) {
      const targetLevel = result.mode.replace('placement_test_', '').toUpperCase() as CEFRLevel;
      if (result.accuracy >= 80) {
        unlockLevelAndPrior(targetLevel);
        awardXp(100, `Darajani aniqlash testi topshirildi (${targetLevel} darajasi va mavzulari ochildi)`);
        setUser((prev) => ({
          ...prev,
          stars: prev.stars + 20,
        }));
        playChime('win');
      }
    }

    // 4. Topic Mastery Quiz Completion Evaluation (Sequential Progression System >= 85%)
    if (result.mode.startsWith('topic_mastery_')) {
      const topicId = result.mode.replace('topic_mastery_', '');
      const currentLevel = selectedCefrLevel || 'A1';

      setUser((prev) => {
        const scores = { ...(prev.topicMasteryScores || {}) };
        scores[topicId] = Math.max(scores[topicId] || 0, result.accuracy);

        // Step C: Passing Condition (IF Quiz Score >= 85%)
        if (result.accuracy >= 85) {
          const mastered = Array.from(new Set([...(prev.masteredTopicIds || []), topicId]));
          const unlockedTopics = new Set(prev.unlockedTopicIds || ['cefr_a1_daily']);
          const unlockedLevels = new Set(prev.unlockedCefrLevels || ['A1']);

          // Determine next sequential topic in the current level
          const currentTopics = groupCefrWordsByTopic(cefrLevelWords);
          const { nextTopic, isLastTopic } = getNextTopicInLevel(topicId, currentTopics);

          if (nextTopic) {
            unlockedTopics.add(nextTopic.id);
          }

          // If all topics in the current level are mastered or this was the last topic
          const allCurrentMastered =
            currentTopics.length > 0 && currentTopics.every((t) => mastered.includes(t.id));

          if (isLastTopic || allCurrentMastered) {
            const nextLvl = getNextCefrLevel(currentLevel);
            if (nextLvl) {
              unlockedLevels.add(nextLvl);
              unlockedTopics.add(`cefr_${nextLvl.toLowerCase()}_daily`);
            }
          }

          return {
            ...prev,
            topicMasteryScores: scores,
            masteredTopicIds: mastered,
            unlockedTopicIds: Array.from(unlockedTopics),
            unlockedCefrLevels: Array.from(unlockedLevels),
            stars: prev.stars + 10,
          };
        }

        // IF Quiz Score < 85%: Keep next topic locked, record attempt
        return {
          ...prev,
          topicMasteryScores: scores,
        };
      });

      if (result.accuracy >= 85) {
        awardXp(50, 'Mavzu a’lo darajada o‘zlashtirildi (85%+)');
        playChime('win');
      }
    }
  };

  // Direct word mastery marker (1-click "O'zlashtirdim / Bilaman" in browser or detail)
  const markWordAsMastered = (wordId: string) => {
    const currentProg = wordProgress[wordId];
    const isAlreadyMastered = currentProg?.masteryLevel === 'ozlashtirilgan';

    setWordProgress((prev) => {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 14);
      return {
        ...prev,
        [wordId]: {
          userId: user.id,
          wordId,
          masteryLevel: 'ozlashtirilgan',
          nextReviewDate: nextDate.toISOString(),
          intervalDays: 14,
          consecutiveKnownCount: Math.max(2, (currentProg?.consecutiveKnownCount || 0) + 1),
          lastActivityTime: new Date().toISOString(),
          reviewCount: (currentProg?.reviewCount || 0) + 1,
        },
      };
    });

    if (!isAlreadyMastered) {
      setTodayLearnedCount((prev) => Math.min(dailyGoal, prev + 1));
      setUser((prev) => {
        const newLearned = prev.wordsLearned + 1;
        const newRank = calculateDynamicRank(newLearned, rankings);
        return {
          ...prev,
          wordsLearned: newLearned,
          rank: newRank,
        };
      });
    }
  };

  // Direct word learning / review marker (1-click "Bilmadim / O'rganish" in browser or stories)
  const markWordAsLearning = (wordId: string) => {
    const currentProg = wordProgress[wordId];
    const wasMastered = currentProg?.masteryLevel === 'ozlashtirilgan';

    setWordProgress((prev) => {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);
      return {
        ...prev,
        [wordId]: {
          userId: user.id,
          wordId,
          masteryLevel: 'organilmoqda',
          nextReviewDate: nextDate.toISOString(),
          intervalDays: 1,
          consecutiveKnownCount: 0,
          lastActivityTime: new Date().toISOString(),
          reviewCount: (currentProg?.reviewCount || 0) + 1,
        },
      };
    });

    if (wasMastered) {
      setUser((prev) => {
        const newLearned = Math.max(0, prev.wordsLearned - 1);
        const newRank = calculateDynamicRank(newLearned, rankings);
        return {
          ...prev,
          wordsLearned: newLearned,
          rank: newRank,
        };
      });
    }

    // Record error for SRS review
    const targetWord =
      words.find((w) => w.id === wordId) ||
      cefrLevelWords.find((w) => w.id === wordId) ||
      cefrWordsCache[wordId];
    if (targetWord) {
      recordWordError(targetWord, 'flashcard');
    }
  };

  // Claim 5 stars for daily streak/activity
  const claimDailyStars = () => {
    setUser((prev) => ({
      ...prev,
      stars: prev.stars + 5,
    }));
  };

  // Redeem 200 stars for Premium access
  const redeemPremiumWithStars = (): boolean => {
    if (user.stars >= 200) {
      setUser((prev) => ({
        ...prev,
        stars: prev.stars - 200,
        premiumStatus: true,
      }));
      return true;
    }
    return false;
  };

  // Toggle rank freeze for demonstration
  const toggleRankFreeze = () => {
    setUser((prev) => ({
      ...prev,
      isRankFrozen: !prev.isRankFrozen,
      frozenSince: !prev.isRankFrozen ? '1 oydan ortiq takrorlanmagan' : undefined,
    }));
  };

  // Unfreeze ranking by passing review test
  const unfreezeRankingViaTest = () => {
    setUser((prev) => ({
      ...prev,
      isRankFrozen: false,
      frozenSince: undefined,
    }));
  };

  const resetOnboarding = () => {
    setCurrentScreen('onboarding');
  };

  const dismissNotification = () => {
    setNotificationAlert(null);
  };

  const showSimulatedNotification = (text: string) => {
    setNotificationAlert(text);
  };

  const requestPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    return perm;
  };

  const addReminder = (newRem: Omit<NotificationReminder, 'id'>) => {
    const id = `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullReminder: NotificationReminder = { ...newRem, id };
    setReminders((prev) => [...prev, fullReminder]);
  };

  const updateReminder = (id: string, updates: Partial<NotificationReminder>) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const triggerTestNotification = (reminderId?: string) => {
    const target = reminderId ? reminders.find((r) => r.id === reminderId) : reminders[0];
    const practiceType = target?.practiceType || 'spaced_repetition';
    const dynamic = generatePracticeReminderText(practiceType, {
      dueReviewCount: wordsDueToday.length,
      dailyGoalRemaining: Math.max(0, dailyGoal - todayLearnedCount),
      streak: user.streak,
      randomWord: words[Math.floor(Math.random() * words.length)]?.english,
    });

    const title = target?.title ? `Verbo • ${target.title}` : dynamic.title;
    const body = target?.desc || dynamic.body;

    sendBrowserNotification(title, {
      body,
      playSound: soundAlertsEnabled && target?.soundEnabled !== false,
    });

    setNotificationAlert(`${title}: ${body}`);
  };

  // Background timer to schedule and trigger user-defined reminders at the exact user-specified time
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, '0');
      const currentM = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentH}:${currentM}`;
      const todayStr = now.toISOString().split('T')[0];
      const dayOfWeek = now.getDay();

      reminders.forEach((r) => {
        if (!r.enabled) return;
        if (r.time !== currentTime) return;
        if (!isReminderActiveForDay(r.frequency, dayOfWeek)) return;

        const triggerKey = `${r.id}_${todayStr}_${currentTime}`;
        if (triggeredLogRef.current.has(triggerKey)) return;
        triggeredLogRef.current.add(triggerKey);

        const dynamic = generatePracticeReminderText(r.practiceType, {
          dueReviewCount: wordsDueToday.length,
          dailyGoalRemaining: Math.max(0, dailyGoal - todayLearnedCount),
          streak: user.streak,
          randomWord: words[Math.floor(Math.random() * words.length)]?.english,
        });

        const title = r.title ? `Verbo • ${r.title}` : dynamic.title;
        const body = r.desc || dynamic.body;

        sendBrowserNotification(title, {
          body,
          playSound: soundAlertsEnabled && r.soundEnabled !== false,
        });

        setNotificationAlert(`${title}: ${body}`);
      });
    };

    checkSchedules();
    const timer = setInterval(checkSchedules, 15000);
    return () => clearInterval(timer);
  }, [reminders, wordsDueToday.length, dailyGoal, todayLearnedCount, user.streak, words, soundAlertsEnabled]);

  const nextScheduledReminder = useMemo(() => {
    const activeReminders = reminders.filter((r) => r.enabled);
    if (activeReminders.length === 0) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let closest: { reminder: NotificationReminder; minutesDiff: number } | null = null;

    activeReminders.forEach((r) => {
      const [h, m] = r.time.split(':').map(Number);
      let remMinutes = h * 60 + m;
      let diff = remMinutes - currentMinutes;
      if (diff <= 0) {
        diff += 24 * 60;
      }

      if (!closest || diff < closest.minutesDiff) {
        closest = { reminder: r, minutesDiff: diff };
      }
    });

    if (!closest) return null;

    const hours = Math.floor(closest.minutesDiff / 60);
    const mins = closest.minutesDiff % 60;
    let text = '';
    if (hours > 0 && mins > 0) text = `${hours} soat ${mins} daqiqa`;
    else if (hours > 0) text = `${hours} soat`;
    else text = `${mins} daqiqa`;

    return { reminder: closest.reminder, text };
  }, [reminders]);

  // Admin functions with RBAC enforcement
  const adminDeleteWord = (wordId: string) => {
    if (user.role !== 'admin') {
      console.warn('Unauthorized: adminDeleteWord requires admin role');
      return;
    }
    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  const adminToggleUserBlock = (userId: string) => {
    if (user.role !== 'admin') {
      console.warn('Unauthorized: adminToggleUserBlock requires admin role');
      return;
    }
    setRankings((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFrozen: !u.isFrozen } : u))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab: handleTabChange,
        addWordDefaultTab,
        setAddWordDefaultTab,
        selectedTopicId,
        setSelectedTopicId,
        selectedDeckId,
        setSelectedDeckId,
        selectedCefrLevel,
        setSelectedCefrLevel,
        cefrLevelWords,
        isLoadingCefrWords,
        loadCefrWordsForLevel,
        getCefrLevelStats,
        getTotalCefrStats,
        testMode,
        setTestMode,
        lastTestResult,
        setLastTestResult,
        words,
        topics,
        decks,
        wordProgress,
        achievements,
        rankings,
        wordsDueToday,
        todayLearnedCount,
        dailyGoal,
        rateWordSRS,
        addNewWord,
        addBatchWords,
        addNewDeck,
        addWordToDeck,
        deleteDeck,
        removeWordFromDeck,
        saveTestResult,
        claimDailyStars,
        redeemPremiumWithStars,
        toggleRankFreeze,
        unfreezeRankingViaTest,
        resetOnboarding,
        notificationAlert,
        dismissNotification,
        showSimulatedNotification,
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminder,
        triggerTestNotification,
        notificationPermission,
        requestPermission,
        soundAlertsEnabled,
        setSoundAlertsEnabled,
        nextScheduledReminder,
        lockedFeatureModal,
        openLockedFeatureModal,
        closeLockedFeatureModal,
        adminDeleteWord,
        adminToggleUserBlock,
        markWordAsMastered,
        markWordAsLearning,
        pastErrors,
        recordWordError,
        clearPastErrors,
        resolveWordError,
        startWeaknessPractice,
        awardXp,
        userLeague,
        leagueMeta,
        weeklyLeaderboard,
        userWeeklyRank,
        activeLeagueFilter,
        setActiveLeagueFilter,
        isOnline,
        isSyncing,
        syncOfflineData,
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        // Sequential Progression & Mastery-Based Unlocking System
        isLevelUnlocked,
        isTopicUnlocked,
        isTopicMastered,
        getTopicMasteryScore,
        unlockTopic,
        unlockLevel,
        unlockLevelAndPrior,
        startTopicMasteryQuiz,
        activeMasteryModalTopic,
        setActiveMasteryModalTopic,
        lockedProgressionModal,
        openLockedProgressionModal,
        closeLockedProgressionModal,
        // Placement Test (Darajani aniqlash testi)
        isPlacementTestModalOpen,
        placementTestTargetLevel,
        openPlacementTestModal,
        closePlacementTestModal,
        startPlacementTest,
        // Mistakes Practice (Xatolar ustida ishlash)
        practiceMistakesWords,
        startMistakesPractice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
