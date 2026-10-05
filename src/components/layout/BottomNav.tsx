import React from 'react';
import { Home, BookOpen, Gamepad2, CheckSquare, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'home' as const, label: 'Bosh sahifa', icon: Home },
    { id: 'vocabulary' as const, label: 'Lug‘at', icon: BookOpen },
    { id: 'games' as const, label: 'O‘yinlar', icon: Gamepad2 },
    { id: 'test' as const, label: 'Testlar', icon: CheckSquare },
    { id: 'profile' as const, label: 'Profil', icon: User },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="sticky bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-slate-800 px-2 sm:px-4 py-2 z-40 flex items-center justify-around shadow-xs transition-colors"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 group ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-stone-400 dark:text-slate-400 hover:text-stone-600 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-2 w-7 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-active:scale-90 ${
                  isActive ? 'stroke-[2.4] scale-110' : 'stroke-[1.8]'
                }`}
              />
              {tab.id === 'test' && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <span className={`text-[11px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

