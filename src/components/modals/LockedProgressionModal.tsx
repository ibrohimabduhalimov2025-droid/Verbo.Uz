import React from 'react';
import { Lock, ArrowRight, X, ShieldAlert, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LockedProgressionModal: React.FC = () => {
  const {
    lockedProgressionModal,
    closeLockedProgressionModal,
    setCurrentScreen,
    setActiveTab,
    setSelectedCefrLevel,
    setSelectedTopicId,
    user,
  } = useApp();

  if (!lockedProgressionModal) return null;

  const { type, title, subtitle, requirement } = lockedProgressionModal;

  const handleGoToActiveContent = () => {
    closeLockedProgressionModal();
    // Navigate to the user's active unlocked level & topic
    const activeLevel = user.unlockedCefrLevels?.[user.unlockedCefrLevels.length - 1] || 'A1';
    setSelectedCefrLevel(activeLevel);
    setSelectedTopicId(null);
    setActiveTab('vocabulary');
    setCurrentScreen('vocabulary');
  };

  return (
    <div
      id="locked-progression-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeLockedProgressionModal}
    >
      <div
        id="locked-progression-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-500 via-rose-500 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={closeLockedProgressionModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Emblem */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 mb-3 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <span>🔒 Qulflangan {type === 'level' ? 'Daraja' : 'Mavzu'}</span>
          </div>

          <h3 className="text-lg font-black text-stone-900 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Mandatory Unlock Requirement Highlight Box */}
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block mb-0.5">
                Ochilish talabi:
              </span>
              <p className="text-xs font-bold text-amber-950 leading-relaxed">
                «{requirement || 'Oldingi mavzu/darajani 85%+ natija bilan yakunlang'}»
              </p>
            </div>
          </div>
        </div>

        {/* Progression Steps Guide */}
        <div className="space-y-2.5 mb-5 text-xs text-stone-600">
          <div className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">
            Ketma-ket o‘zlashtirish bosqichlari:
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              1
            </div>
            <span>
              Mavzu so‘zlarini o‘rganing yoki to‘g‘ridan-to‘g‘ri <strong>Mavzu Testi</strong>ga kiring.
            </span>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              2
            </div>
            <span>
              <strong>«Mavzu O‘zlashtirish Testi»</strong> (Mastery Quiz)ni topshiring.
            </span>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              3
            </div>
            <span>
              <strong>85% yoki undan yuqori</strong> ball oling va keyingi mavzu avtomatik ochiladi!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleGoToActiveContent}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Hozirgi ochiq darsga o‘tish</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={closeLockedProgressionModal}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
};
