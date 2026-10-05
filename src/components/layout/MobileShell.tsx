import React, { useState, ReactNode } from 'react';
import {
  Maximize2,
  Minimize2,
  Bell,
  Sparkles,
  ShieldAlert,
  Flame,
  Star,
  Settings,
  Sun,
  Moon,
  Home,
  BookOpen,
  Gamepad2,
  CheckSquare,
  Trophy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { GoalProgressToast } from './GoalProgressToast';
import { LockedFeatureModal } from '../modals/LockedFeatureModal';
import { LockedProgressionModal } from '../modals/LockedProgressionModal';
import { TopicMasteryQuizModal } from '../modals/TopicMasteryQuizModal';
import { PlacementTestModal } from '../modals/PlacementTestModal';

interface MobileShellProps {
  children: ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const {
    currentScreen,
    setCurrentScreen,
    activeTab,
    setActiveTab,
    notificationAlert,
    dismissNotification,
    lockedFeatureModal,
    closeLockedFeatureModal,
    user,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  // Desktop container width mode: 'compact' (~440px phone view) or 'wide' (~1024px responsive desktop)
  const [containerWidth, setContainerWidth] = useState<'compact' | 'wide'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return 'wide';
    }
    return 'compact';
  });

  // Hide bottom nav on full-immersion screens
  const hideBottomNav = [
    'onboarding',
    'auth',
    'flashcards',
    'game_matching',
    'game_anagram',
    'game_sprint',
    'game_audio',
    'audio_game',
    'test_run',
    'ielts_test',
    'certificate_test',
    'cefr_diagnostic',
    'admin',
    'audio_player',
    'sentence_builder',
  ].includes(currentScreen);

  const desktopNavLinks = [
    { label: 'Bosh sahifa', action: () => { setActiveTab('home'); setCurrentScreen('home'); }, active: currentScreen === 'home' && activeTab === 'home', icon: Home },
    { label: 'Lug‘at', action: () => { setActiveTab('vocabulary'); setCurrentScreen('vocabulary'); }, active: currentScreen === 'vocabulary' || activeTab === 'vocabulary', icon: BookOpen },
    { label: 'O‘yinlar', action: () => { setActiveTab('games'); setCurrentScreen('games'); }, active: currentScreen === 'games' || activeTab === 'games', icon: Gamepad2 },
    { label: 'Testlar', action: () => { setActiveTab('test'); setCurrentScreen('test_select'); }, active: currentScreen === 'test_select' || currentScreen === 'test_run' || activeTab === 'test', icon: CheckSquare },
    { label: 'Xizmatlar', action: () => setCurrentScreen('services'), active: currentScreen === 'services', icon: Sparkles },
    { label: 'Reyting', action: () => setCurrentScreen('leaderboard'), active: currentScreen === 'leaderboard', icon: Trophy },
  ];

  return (
    <div className="min-h-screen w-full bg-stone-100/70 dark:bg-slate-950 text-stone-900 dark:text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Application Desktop Navigation Bar - Top Bar Contract compliant */}
      <header className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800 sticky top-0 z-50 shadow-2xs transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Zone 1: Brand title & level mark */}
          <div
            onClick={() => {
              setActiveTab('home');
              setCurrentScreen('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white shadow-2xs border border-stone-200/90 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Verbo School"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
                VERBO <span className="text-indigo-600 dark:text-indigo-400">SCHOOL</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                {user.level}
              </span>
            </div>
          </div>

          {/* Zone 2: Desktop clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {desktopNavLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  item.active
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Zone 3: Stats, Theme toggle, View mode & Admin */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {user.isRankFrozen && (
              <button
                onClick={() => setCurrentScreen('profile')}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Muzlatilgan</span>
              </button>
            )}

            {/* Streak & Stars Badges */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setCurrentScreen('progress')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 text-xs font-bold transition-colors cursor-pointer"
                title="Streak holati"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="tabular-nums">{user.streak} k</span>
              </button>

              <button
                onClick={() => setCurrentScreen('premium')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-400/30 text-xs font-bold transition-colors cursor-pointer"
                title="Yulduzlar balansi"
              >
                <Star className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                <span className="tabular-nums">{user.stars}</span>
              </button>
            </div>

            {/* Dark Mode Theme Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200/80 dark:border-slate-700 transition-colors cursor-pointer"
              title={isDarkMode ? 'Kunduzgi rejim' : 'Tungi rejim'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Desktop Layout switch (Compact mobile / Wide full width) */}
            <div className="hidden md:flex items-center pl-1 border-l border-stone-200 dark:border-slate-800 gap-1">
              <button
                onClick={() => setContainerWidth(containerWidth === 'compact' ? 'wide' : 'compact')}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-stone-200/80 dark:border-slate-700 cursor-pointer"
                title={containerWidth === 'compact' ? 'Keng ko‘rinishga o‘tish' : 'Mobil formatga o‘tish'}
              >
                {containerWidth === 'compact' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-stone-600 dark:text-slate-300" />
                    <span>Keng</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-stone-600 dark:text-slate-300" />
                    <span>Ixcham</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCurrentScreen('admin')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-600 hover:text-stone-900 dark:text-slate-300 dark:hover:text-white transition-colors border border-stone-200/80 dark:border-slate-700 cursor-pointer"
                title="Admin panel"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Alert Notification Banner */}
        {notificationAlert && (
          <div
            id="streak-alert-banner"
            className="bg-amber-500 text-stone-950 px-3.5 py-2 text-xs font-semibold flex items-center justify-between gap-2 shadow-xs transition-all animate-in slide-in-from-top-2"
          >
            <div className="flex items-center gap-2 min-w-0 max-w-5xl mx-auto w-full">
              <Bell className="w-4 h-4 shrink-0 text-stone-950 animate-bounce" />
              <span className="truncate flex-1 font-medium text-stone-950">{notificationAlert}</span>
              <button
                onClick={() => {
                  dismissNotification();
                  setCurrentScreen('flashcards');
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-950 text-white text-[11px] font-extrabold shrink-0 hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer"
              >
                Mashg‘ulotni boshlash
              </button>
              <button
                onClick={dismissNotification}
                className="text-[11px] font-bold text-stone-950 hover:text-stone-800 underline shrink-0 ml-1 cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Responsive Viewport Container */}
      <div className="w-full flex-1 flex flex-col items-center py-0 sm:py-5 px-0 sm:px-4">
        <div
          id="main-app-viewport"
          className={`w-full bg-white dark:bg-slate-900 flex flex-col relative transition-all duration-300 min-h-[calc(100vh-57px)] sm:min-h-[820px] ${
            containerWidth === 'compact'
              ? 'max-w-md sm:rounded-3xl sm:border sm:border-stone-200/90 dark:sm:border-slate-800 sm:shadow-md sm:shadow-stone-200/50 dark:sm:shadow-black/40'
              : 'max-w-4xl lg:max-w-5xl sm:rounded-3xl sm:border sm:border-stone-200/90 dark:sm:border-slate-800 sm:shadow-md sm:shadow-stone-200/50 dark:sm:shadow-black/40'
          } overflow-hidden`}
        >
          {/* Scrollable Screen Body */}
          <main className="flex-1 flex flex-col bg-stone-50/50 dark:bg-slate-900/60">
            {children}
          </main>

          {/* Bottom Navigation for mobile or quick navigation */}
          {!hideBottomNav && <BottomNav />}

          {/* Goal & Progress subtle toast notification */}
          {!['onboarding', 'auth', 'test_run'].includes(currentScreen) && <GoalProgressToast />}

          {/* Locked Feature Benefits Modal */}
          <LockedFeatureModal
            isOpen={Boolean(lockedFeatureModal)}
            featureId={lockedFeatureModal || 'certificate_test'}
            onClose={closeLockedFeatureModal}
          />

          {/* Sequential Progression Lock Modal */}
          <LockedProgressionModal />

          {/* Topic 100% Mastery Quiz Prompt Modal */}
          <TopicMasteryQuizModal />

          {/* CEFR Level Placement Test Modal */}
          <PlacementTestModal />
        </div>
      </div>
    </div>
  );
};
