import React from 'react';
import {
  Gamepad2,
  Sparkles,
  Zap,
  Layers,
  Volume2,
  Trophy,
  Play,
  ArrowRight,
  Flame,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CEFRLevel } from '../types';
import { CEFR_LEVELS_META } from '../services/cefrService';

export const GamesScreen: React.FC = () => {
  const {
    setCurrentScreen,
    user,
    selectedCefrLevel,
    setSelectedCefrLevel,
    loadCefrWordsForLevel,
  } = useApp();

  const handleSelectCefrLevel = (lvl: CEFRLevel | null) => {
    setSelectedCefrLevel(lvl);
    if (lvl) {
      loadCefrWordsForLevel(lvl);
    }
  };

  const games = [
    {
      id: 'game_matching' as const,
      title: 'Matching (Moslik)',
      subtitle: 'Inglizcha so‘zni o‘zbekcha tarjimasi bilan juftlang',
      icon: Layers,
      badge: 'Eng ommabop',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'game_anagram' as const,
      title: 'Anagram (Harflar)',
      subtitle: 'Aralashgan harflardan to‘g‘ri so‘zni yig‘ing',
      icon: Sparkles,
      badge: 'Xotira mashqi',
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'game_sprint' as const,
      title: 'Quiz Sprint',
      subtitle: '30 soniyada maksimal to‘g‘ri javob bering',
      icon: Zap,
      badge: 'Tezkor',
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'game_audio' as const,
      title: 'Audio Game (Tinglab top)',
      subtitle: 'Talaffuzni tinglab to‘g‘ri ma’nosini yoki yozilishini toping',
      icon: Volume2,
      badge: 'Listening & Audio',
      color: 'from-purple-600 to-violet-600',
      bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
      isComingSoon: false,
    },
  ];

  return (
    <div id="games-screen" className="flex-1 flex flex-col p-4 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
            O‘yinlar
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            So‘zlarni interaktiv o‘yinlar orqali mustahkamlang
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>Chempionat</span>
        </div>
      </div>

      {/* Multiplayer Challenge Highlight Banner */}
      <div
        onClick={() => setCurrentScreen('multiplayer')}
        className="rounded-3xl bg-indigo-950 text-white p-5 border border-indigo-900 shadow-md cursor-pointer hover:border-indigo-700 transition-all relative overflow-hidden"
      >
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-white/10 px-2 py-0.5 rounded-md">
              Do‘stlar bilan musobaqa
            </span>
            <h3 className="text-base font-display font-bold text-white mt-1.5">
              Multiplayer Quiz (Kahoot uslubida)
            </h3>
            <p className="text-xs text-indigo-200/85 mt-1 leading-relaxed">
              6 xonali PIN bilan xonaga kiring yoki o‘zingiz musobaqa yarating!
            </p>
          </div>
          <button className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shrink-0 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer">
            <span>Kirish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CEFR Level Selector for Games */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>O‘yin so‘zlar darajasi (CEFR)</span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            {selectedCefrLevel ? `${selectedCefrLevel} darajasi tanlandi` : 'Barcha so‘zlar'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleSelectCefrLevel(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              !selectedCefrLevel
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            Barchasi
          </button>

          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
            const isSelected = selectedCefrLevel === lvl;
            const meta = CEFR_LEVELS_META[lvl];
            return (
              <button
                key={lvl}
                onClick={() => handleSelectCefrLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? `text-white bg-linear-to-r ${meta.gradient} shadow-xs`
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {lvl} ({meta.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-3">
        {games.map((game) => {
          const Icon = game.icon;

          return (
            <div
              key={game.id}
              onClick={() => {
                if (!game.isComingSoon) {
                  setCurrentScreen(game.id as any);
                }
              }}
              className={`bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center justify-between group ${
                game.isComingSoon ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-linear-to-br ${game.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-indigo-600 transition-colors">
                      {game.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${game.bgColor}`}
                    >
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{game.subtitle}</p>
                </div>
              </div>

              {!game.isComingSoon && (
                <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-indigo-600 group-hover:text-white text-stone-500 flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
