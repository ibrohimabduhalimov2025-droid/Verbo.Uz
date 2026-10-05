import React from 'react';
import { Award, Sparkles, CheckCircle2, Trophy, ArrowRight, X, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopicMasteryQuizModal: React.FC = () => {
  const {
    activeMasteryModalTopic,
    setActiveMasteryModalTopic,
    startTopicMasteryQuiz,
  } = useApp();

  if (!activeMasteryModalTopic) return null;

  const { topicId, topicName, level, totalWords } = activeMasteryModalTopic;

  const handleStartQuiz = () => {
    setActiveMasteryModalTopic(null);
    startTopicMasteryQuiz(topicId, topicName, level);
  };

  const handleClose = () => {
    setActiveMasteryModalTopic(null);
  };

  return (
    <div
      id="topic-mastery-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="topic-mastery-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200 text-center"
      >
        {/* Confetti-like Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-500 via-amber-400 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Trophy Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto mb-3 shadow-sm animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% So‘zlar Yakunlandi!</span>
        </div>

        <h3 className="text-xl font-black text-stone-900 leading-tight mb-1">
          {topicName}
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          CEFR {level} • Ushbu mavzudagi barcha {totalWords} ta so‘zni o‘rganib chiqdingiz!
        </p>

        {/* Challenge Box */}
        <div className="bg-linear-to-br from-indigo-50/90 to-amber-50/90 border border-indigo-200/80 rounded-2xl p-4 text-left mb-4 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Mavzu O‘zlashtirish Testi (Mastery Quiz)</span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            Keyingi mavzuni qulfdan ochish uchun ushbu testdan kamida <strong>85% natija</strong> to‘plashingiz kerak.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-indigo-100 text-[11px]">
            <span className="text-stone-500">O‘tish talabi:</span>
            <span className="font-extrabold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
              85%+ To‘g‘ri javob
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-500">Mukofot:</span>
            <span className="font-extrabold text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>+50 XP & Keyingi mavzu ochiladi!</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleStartQuiz}
            className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <span>Mavzu Testini Boshlash (85%+)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-colors cursor-pointer"
          >
            Keyinroq topshirish
          </button>
        </div>
      </div>
    </div>
  );
};
