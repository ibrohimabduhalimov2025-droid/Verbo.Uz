import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CEFRLevel } from '../../types';
import { CEFR_LEVELS_META } from '../../services/cefrService';

export const PlacementTestModal: React.FC = () => {
  const {
    isPlacementTestModalOpen,
    closePlacementTestModal,
    placementTestTargetLevel,
    startPlacementTest,
    user,
    isLevelUnlocked,
  } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A2');

  useEffect(() => {
    if (placementTestTargetLevel) {
      setSelectedLevel(placementTestTargetLevel);
    }
  }, [placementTestTargetLevel]);

  if (!isPlacementTestModalOpen) return null;

  const levels: {
    level: CEFRLevel;
    title: string;
    ielts: string;
    description: string;
    wordCount: number;
    color: string;
  }[] = [
    {
      level: 'A2',
      title: 'Elementary (Boshlang‘ich)',
      ielts: '3.0 - 3.5',
      description: 'Kundalik odatlar, do‘kon, oila va sayohat bo‘yicha bazaviy so‘zlar',
      wordCount: 1500,
      color: 'from-sky-500 to-blue-600',
    },
    {
      level: 'B1',
      title: 'Pre-Intermediate (O‘rta)',
      ielts: '4.0 - 5.0',
      description: 'Ish, ta’lim, shaxsiy qiziqishlar va erkin muloqot so‘zlari',
      wordCount: 2000,
      color: 'from-teal-500 to-emerald-600',
    },
    {
      level: 'B2',
      title: 'Upper-Intermediate (Yetakchi)',
      ielts: '5.5 - 6.5',
      description: 'Murakkab mavzular, kasbiy va akademik tushunchalar',
      wordCount: 2500,
      color: 'from-amber-500 to-orange-600',
    },
    {
      level: 'C1',
      title: 'Advanced (Yuqori daraja)',
      ielts: '7.0 - 8.0',
      description: 'Keng ko‘lamli ijtimoiy, akademik va ilmiy professional iboralar',
      wordCount: 1500,
      color: 'from-rose-500 to-pink-600',
    },
    {
      level: 'C2',
      title: 'Proficiency (Mukammal daraja)',
      ielts: '8.5 - 9.0',
      description: 'Mahalliy so‘zlashuvchi kabi nozik farqlar va murakkab lug‘at boyligi',
      wordCount: 1000,
      color: 'from-purple-600 to-indigo-700',
    },
  ];

  const handleStart = () => {
    startPlacementTest(selectedLevel);
  };

  const selectedMeta = CEFR_LEVELS_META[selectedLevel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={closePlacementTestModal}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 mb-4 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                Placement Test
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                80%+ talab
              </span>
            </div>
            <h2 className="text-xl font-display font-extrabold text-stone-900 leading-tight">
              Darajani aniqlash testi
            </h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Boshidan boshlash shart emas! Qaysi darajani tasdiqlamoqchisiz? 80%+ natija bilan o‘tsangiz, ushbu daraja va barcha oldingi mavzular to‘liq ochiladi.
            </p>
          </div>
        </div>

        {/* Level Selector Options */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 py-1">
          {levels.map((item) => {
            const isSelected = selectedLevel === item.level;
            const alreadyUnlocked = isLevelUnlocked(item.level);

            return (
              <div
                key={item.level}
                onClick={() => setSelectedLevel(item.level)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-xl text-white font-black text-xs flex items-center justify-center bg-linear-to-r ${item.color} shadow-2xs shrink-0`}
                  >
                    {item.level}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{item.title}</span>
                      <span className="text-[10px] font-semibold text-stone-400">
                        IELTS {item.ielts}
                      </span>
                      {alreadyUnlocked && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-bold">
                          Ochilgan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefit Summary Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block text-amber-900 mb-0.5">
              Avtomatik ochilish qoidasi (80%+):
            </span>
            Agar siz <strong className="text-amber-950">{selectedLevel}</strong> darajasi testidan{' '}
            <strong>80% yoki undan yuqori</strong> ball to‘plasangiz, {selectedLevel} darajasi hamda undan oldingi barcha mavzular bir zumda ochiladi!
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2.5">
          <button
            onClick={closePlacementTestModal}
            className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleStart}
            className="flex-2 py-3 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <span>{selectedLevel} Testini Boshlash (80%+)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
