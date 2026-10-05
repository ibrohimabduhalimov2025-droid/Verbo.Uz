import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Award,
  BookOpen,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CEFRLevel } from '../types';
import { speakWord, playChime } from '../utils/srs';

interface A1InteractiveOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTesting?: () => void;
}

export const A1InteractiveOnboarding: React.FC<A1InteractiveOnboardingProps> = ({
  isOpen,
  onClose,
  onStartTesting,
}) => {
  const { user, setUser, selectedCefrLevel, setSelectedCefrLevel, markWordAsMastered, markWordAsLearning } = useApp();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Demo card state in Step 2
  const [demoState, setDemoState] = useState<'neutral' | 'known' | 'learning'>('neutral');
  const [demoAudioPlaying, setDemoAudioPlaying] = useState(false);

  if (!isOpen) return null;

  const handleLevelSelect = (lvl: CEFRLevel) => {
    setSelectedCefrLevel(lvl);
    setUser((prev) => ({ ...prev, level: lvl }));
  };

  const handleDemoAudio = () => {
    setDemoAudioPlaying(true);
    speakWord('water', () => setDemoAudioPlaying(false));
  };

  const handleDemoKnown = () => {
    playChime('correct');
    setDemoState('known');
    markWordAsMastered('cefr_a1_demo_water');
  };

  const handleDemoLearning = () => {
    playChime('flip');
    setDemoState('learning');
    markWordAsLearning('cefr_a1_demo_water');
  };

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem('verbo_a1_onboarding_completed', 'true');
    } catch {}
    onClose();
  };

  const levels: { level: CEFRLevel; title: string; desc: string; isRecommended?: boolean }[] = [
    { level: 'A1', title: 'A1 - Boshlang‘ich', desc: '1,500 ta asosiy so‘z (Tavsiya etiladi)', isRecommended: true },
    { level: 'A2', title: 'A2 - Elementar', desc: '1,500 ta kundalik muloqot so‘zi' },
    { level: 'B1', title: 'B1 - O‘rta', desc: '2,000 ta erkin so‘zlashuv leksikasi' },
    { level: 'B2', title: 'B2 - Yuqori o‘rta', desc: '2,500 ta akademik va ish leksikasi' },
    { level: 'C1', title: 'C1 - Ilg‘or', desc: '1,500 ta murakkab va professional so‘z' },
    { level: 'C2', title: 'C2 - Mukammal', desc: '1,000 ta ilmiy va adabiy so‘zlar' },
  ];

  return (
    <div
      id="a1-interactive-onboarding-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        id="a1-onboarding-modal"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 shadow-2xs shrink-0 bg-white">
              <img src="/logo.png" alt="Verbo School" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900">Verbo School • O‘quv qo‘llanmasi</h3>
              <p className="text-[11px] text-stone-500 font-medium">3 ta oddiy qadamda ingliz tilini o‘rganing</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompleteOnboarding}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="px-5 pt-3 pb-1 bg-white">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-1.5">
            <span className={currentStep === 1 ? 'text-indigo-600' : 'text-stone-600'}>1. Darajani tanlash</span>
            <span className={currentStep === 2 ? 'text-indigo-600' : 'text-stone-600'}>2. So‘z kartochkasi</span>
            <span className={currentStep === 3 ? 'text-indigo-600' : 'text-stone-600'}>3. Test va Natija</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 h-1.5 rounded-full overflow-hidden bg-stone-100">
            <div className={`h-full transition-all duration-300 ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-stone-200'}`} />
            <div className={`h-full transition-all duration-300 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-stone-200'}`} />
            <div className={`h-full transition-all duration-300 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-stone-200'}`} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* STEP 1: Choose Level */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold mb-1 border border-indigo-100">
                    <span>1-Qadam</span>
                  </div>
                  <h4 className="text-lg font-black text-stone-900">Darajangizni tanlang</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Ingliz tilini endi boshlayotgan bo‘lsangiz, <strong>A1 (Boshlang‘ich)</strong> darajasidan boshlash tavsiya etiladi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {levels.map((item) => {
                    const isSelected = (selectedCefrLevel || user.level || 'A1') === item.level;
                    return (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => handleLevelSelect(item.level)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {item.isRecommended && (
                          <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Tavsiya
                          </span>
                        )}
                        <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                          <span>{item.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Interactive Word Card Practice */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-1 border border-emerald-100">
                    <span>2-Qadam</span>
                  </div>
                  <h4 className="text-lg font-black text-stone-900">So‘z kartochkasini bosing</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Har bir so‘zni tinglang, misol jumlani o‘qing va pastdagi tugmalar orqali belgilang:
                  </p>
                </div>

                {/* Interactive Demo Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border-2 border-indigo-200/80 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-stone-900 tracking-tight">water</span>
                        <span className="text-xs font-mono text-stone-500">/ˈwɔːtər/</span>
                        <button
                          type="button"
                          onClick={handleDemoAudio}
                          className={`p-1.5 rounded-xl border transition-all ${
                            demoAudioPlaying
                              ? 'bg-indigo-600 text-white border-indigo-600 scale-105'
                              : 'bg-white text-indigo-600 border-stone-200 hover:bg-indigo-50'
                          }`}
                          title="Talaffuzni eshitish"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-emerald-800 mt-1">suv</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">ot • A1 daraja</div>
                    </div>

                    {demoState === 'known' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg animate-in zoom-in-95">
                        <Check className="w-3.5 h-3.5" />
                        <span>O‘zlashtirildi! (+1)</span>
                      </span>
                    )}
                    {demoState === 'learning' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg animate-in zoom-in-95">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>O‘rganilmoqda</span>
                      </span>
                    )}
                  </div>

                  {/* A1 Clear Example Sentence Box */}
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 space-y-1">
                    <div className="text-xs font-medium text-stone-800 italic">
                      "I drink fresh water every morning."
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-800">
                      ↳ Men har tong toza suv ichaman.
                    </div>
                  </div>

                  {/* Demo Interactive Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDemoKnown}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        demoState === 'known'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs active:scale-98'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Bilaman (+1)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDemoLearning}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        demoState === 'learning'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-98'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Bilmadim (O‘rganish)</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-indigo-900 leading-relaxed">
                    <strong>Real-vaqtda yangilanish:</strong> «Bilaman (+1)» bosilganda foiz va statistika darhol oshadi, «Bilmadim» bosilganda esa so‘z ertangi takrorlash (SRS) jadvaliga tushadi.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Test and Reinforcement */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold mb-1 border border-amber-100">
                    <span>3-Qadam</span>
                  </div>
                  <h4 className="text-lg font-black text-stone-900">Test orqali bilamingizni sinang</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Har bir mavzu yoki hikoya so‘ngida maxsus test topshirib, so‘zlarni xotirada mustahkamlang:
                  </p>
                </div>

                {/* Visual Test Mock Preview */}
                <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono">Savol 1 / 5</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      +10 Yulduz
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    "water" so‘zining to‘g‘ri ma’nosini toping:
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div className="p-2.5 rounded-xl bg-emerald-600/90 text-white flex items-center justify-between border border-emerald-400/40">
                      <span>A) Suv</span>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-800 text-stone-400 border border-stone-700">
                      B) Non
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-800 text-stone-400 border border-stone-700">
                      C) Choy
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-800 text-stone-400 border border-stone-700">
                      D) Kitob
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Hikoyalar</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      Har bir mavzuning barcha so‘zlari hikoya ichida rangli belgilangan.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reyting va Yulduzlar</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      Har kuni test topshiring, yulduzlar to‘plang va yetakchilar safidan o‘rin oling.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Keyingi qadam</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {onStartTesting && (
                <button
                  type="button"
                  onClick={() => {
                    handleCompleteOnboarding();
                    onStartTesting();
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Test topshirish</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>O‘rganishni boshlash</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
