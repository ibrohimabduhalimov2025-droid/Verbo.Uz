export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Word {
  id: string;
  english: string;
  uzbek: string;
  transcription: string;
  exampleSentence: string;
  exampleUzbek?: string;
  audioUrl?: string;
  image?: string;
  topicId: string;
  level: CEFRLevel;
  orderNumber: number;
  partOfSpeech?: string;
  category?: string;
}

export interface Topic {
  id: string;
  name: string;
  nameEn: string;
  level: CEFRLevel;
  cover: string;
  order: number;
  description: string;
  wordCount: number;
  color: string;
  iconName: string;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  owner: string; // 'system' | 'user'
  words: string[]; // word IDs
  isPersonal: boolean;
  color: string;
  icon: string;
}

export type MasteryLevel = 'yangi' | 'organilmoqda' | 'ozlashtirilgan';

export interface UserWordProgress {
  userId: string;
  wordId: string;
  masteryLevel: MasteryLevel;
  nextReviewDate: string; // ISO string
  intervalDays: number;
  consecutiveKnownCount: number;
  lastActivityTime: string; // ISO string
  reviewCount: number;
}

export type UserLeague = 'bronze' | 'silver' | 'gold';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  level: CEFRLevel;
  targetLevel: CEFRLevel;
  targetGoal: string; // e.g. 'IELTS', 'Universitet', 'Ish', 'Kundalik ingliz tili'
  dailyGoal: number; // e.g. 15 words
  targetDeadline: string; // e.g. '60 kun'
  reminderTime: string; // e.g. '20:00'
  registrationDate: string;
  ageConfirmation: boolean;
  privacyPolicyAccepted: boolean;
  premiumStatus: boolean;
  isPremium?: boolean;
  stars: number;
  streak: number;
  rank: number;
  wordsLearned: number;
  isRankFrozen?: boolean;
  frozenSince?: string;
  age?: number;
  avatar?: string;
  xp?: number;
  weeklyXp?: number;
  league?: UserLeague;
  unlockedTopicIds?: string[];
  masteredTopicIds?: string[];
  topicMasteryScores?: Record<string, number>;
  unlockedCefrLevels?: CEFRLevel[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  max: number;
  unlocked: boolean;
  category: 'words' | 'streak' | 'games';
}

export interface RankingUser {
  id: string;
  name: string;
  avatar: string;
  wordsLearned: number;
  rank: number;
  streak: number;
  isFrozen: boolean;
  level: string;
  xp?: number;
  weeklyXp?: number;
  league?: UserLeague;
  trend?: 'up' | 'down' | 'same';
}

export interface QuizRoom {
  id: string;
  pin: string;
  hostId: string;
  hostName: string;
  questions: {
    wordId: string;
    question: string;
    options: string[];
    correctIndex: number;
    timeLimitSec: number;
  }[];
  participants: {
    id: string;
    name: string;
    avatar: string;
    score: number;
    lastAnswerCorrect?: boolean;
    lastAnswerSpeed?: number;
    active: boolean;
  }[];
  status: 'waiting' | 'in_progress' | 'paused' | 'ended';
  currentQuestionIndex: number;
  createdAt: string;
}

export interface TestResult {
  id: string;
  userId: string;
  date: string;
  mode: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  wellLearnedWords: Word[];
  needReviewWords: Word[];
  score: number;
}

export type ReminderFrequency = 'daily' | 'weekdays' | 'weekends';

export type ReminderPracticeType =
  | 'spaced_repetition'
  | 'new_words'
  | 'quick_quiz'
  | 'word_of_day'
  | 'streak_saver';

export interface NotificationReminder {
  id: string;
  time: string; // 'HH:MM' (24-hour format)
  title: string;
  desc: string;
  enabled: boolean;
  practiceType: ReminderPracticeType;
  frequency: ReminderFrequency;
  customWordCount?: number;
  soundEnabled?: boolean;
  lastTriggeredDate?: string; // YYYY-MM-DD to avoid duplicate daily firing
  isWarning?: boolean;
}

export interface PastErrorItem {
  id: string;
  wordId?: string;
  english: string;
  uzbek: string;
  transcription?: string;
  level: CEFRLevel;
  partOfSpeech?: string;
  source: 'test' | 'flashcard' | 'quiz' | 'game';
  errorCount: number;
  lastMistakeDate: string; // ISO string
  resolved?: boolean;
}

export interface DailyWordSuggestion {
  id: string;
  english: string;
  uzbek: string;
  transcription: string;
  partOfSpeech: string;
  level: CEFRLevel;
  reason: string;
  exampleSentence: string;
  exampleSentenceUz: string;
  connectionToError?: string;
  addedToVocabulary?: boolean;
}
