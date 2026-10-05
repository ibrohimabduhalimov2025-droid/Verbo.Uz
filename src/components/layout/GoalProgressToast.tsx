import React, { useState, useEffect } from 'react';
import { Target, Flame, X, ChevronRight, Crown, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GoalProgressToast: React.FC = () => {
  const { user, dailyGoal, todayLearnedCount, setCurrentScreen, wordsDueToday } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissedThisSession = sessionStorage.getItem('verbo_goal_toast_dismissed');
    if (!dismissedThisSession) {
      // Subtle delay after app launch for smooth entrance
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 900);

      // Auto-dismiss after 8 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 8900);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('verbo_goal_toast_dismissed', 'true');
  };

  const handleAction = () => {
    handleDismiss();
    setCurrentScreen('flashcards');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  const remaining = Math.max(0, dailyGoal - todayLearnedCount);
  const progressPercent = Math.min(100, Math.round((todayLearnedCount / Math.max(1, dailyGoal)) * 100));
  const isGoalDone = todayLearnedCount >= dailyGoal;

  return (
    <aside
      id="goal-progress-toast"
      aria-label="Kunlik maqsad bildirishnomasi"
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-xl shadow-stone-950/20 border border-stone-800/90 flex flex-col gap-2.5">
        {/* Top header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              {isGoalDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Target className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-xs font-bold text-stone-200">
              {isGoalDone ? 'Kunlik marra bajarildi! 🎉' : 'Bugungi o‘rganish maqsadi'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400">
              <Flame className="w-3 h-3 fill-amber-400" />
              <span>{user.streak} kun</span>
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Yopish"
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Middle: Progress and message */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1 font-medium">
            <span>
              {isGoalDone
                ? `${todayLearnedCount} ta so‘z o‘zlashtirildi`
                : `${todayLearnedCount} / ${dailyGoal} so‘z (${remaining} ta qoldi)`}
            </span>
            <span className="font-bold text-indigo-400">{progressPercent}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isGoalDone ? 'bg-emerald-500' : 'bg-linear-to-r from-indigo-500 to-indigo-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bottom row: Action button & Premium trigger */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {!user.premiumStatus ? (
            <button
              onClick={() => {
                handleDismiss();
                setCurrentScreen('premium');
              }}
              className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 hover:text-amber-200 hover:underline transition-colors"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Premiumga o‘tish</span>
            </button>
          ) : (
            <span className="text-[10px] text-stone-400">
              {wordsDueToday.length > 0 ? `${wordsDueToday.length} ta takrorlash bor` : 'Rejangiz a’lo darajada'}
            </span>
          )}

          <button
            onClick={handleAction}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
          >
            <span>{isGoalDone ? 'Qo‘shimcha mashq' : 'Boshlash'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
