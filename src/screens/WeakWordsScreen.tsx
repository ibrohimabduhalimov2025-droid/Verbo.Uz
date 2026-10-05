import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Volume2,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Filter,
  Check,
  Award,
  Lock,
  Crown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PastErrorItem } from '../types';
import { speakWord } from '../utils/srs';

export const WeakWordsScreen: React.FC = () => {
  const {
    pastErrors,
    resolveWordError,
    startWeaknessPractice,
    setCurrentScreen,
    clearPastErrors,
    userLeague,
    user,
    openLockedFeatureModal,
  } = useApp();

  const isUserPremium = Boolean(user.premiumStatus || user.isPremium);

  const [activeFilter, setActiveFilter] = useState<'all' | 'high_error' | 'single'>('all');
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  const filteredErrors = useMemo(() => {
    if (activeFilter === 'high_error') {
      return pastErrors.filter((e) => e.errorCount >= 2);
    }
    if (activeFilter === 'single') {
      return pastErrors.filter((e) => e.errorCount === 1);
    }
    return pastErrors;
  }, [pastErrors, activeFilter]);

  const handleSpeak = (text: string, id: string) => {
    setSpeakingWordId(id);
    speakWord(text, () => {
      setSpeakingWordId(null);
    });
  };

  if (!isUserPremium) {
    return (
      <div id="weak-words-screen" className="flex-1 flex flex-col p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Mening xatolarim</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                PRO QULFLANGAN
              </span>
            </h1>
            <p className="text-xs text-stone-500">
              Kuchsiz tomonlaringiz bo‘yicha adaptiv mashg‘ulot to‘plami
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-white rounded-3xl border border-amber-200/80 shadow-sm space-y-4 max-w-lg mx-auto my-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Verbo Premium Eksklyuziv Imkoniyati
            </span>
            <h2 className="text-xl font-display font-extrabold text-stone-900">
              Mening xatolarim (Smart Weakness Practice)
            </h2>
            <p className="text-xs text-stone-600 max-w-md leading-relaxed">
              Fleshkarta va testlarda ko‘p xato qilingan so‘zlarni alohida to‘plab, adaptiv test rejimida xatolarni bartaraf qilish va +20 XP to‘plash faqat <strong>Verbo Premium</strong> obunachilariga taqdim etiladi.
            </p>
          </div>

          <div className="w-full bg-stone-50 rounded-2xl p-4 border border-stone-100 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-stone-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Xato qilingan so‘zlardan avtomatik to‘plam</span>
            </div>
            <div className="flex items-center gap-2 text-stone-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Har bir to‘g‘ri javob uchun +20 XP ball</span>
            </div>
            <div className="flex items-center gap-2 text-stone-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Spaced Repetition (SM-2) avtomatik moslashuv</span>
            </div>
          </div>

          <div className="w-full space-y-2 pt-2">
            <button
              onClick={() => openLockedFeatureModal('weak_words')}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
            >
              <Crown className="w-4 h-4 fill-stone-950" />
              <span>Verbo Premium bilan ochish</span>
            </button>
            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full py-2.5 text-center text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="weak-words-screen" className="flex-1 flex flex-col p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Mening xatolarim</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                {pastErrors.length} ta
              </span>
            </h1>
            <p className="text-xs text-stone-500">
              Kuchsiz tomonlaringiz bo‘yicha adaptiv mashg‘ulot to‘plami
            </p>
          </div>
        </div>

        {pastErrors.length > 0 && (
          <button
            onClick={clearPastErrors}
            className="text-[11px] font-semibold text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Tozalash"
          >
            Barchasini tozalash
          </button>
        )}
      </div>

      {/* Primary Adaptive CTA Banner */}
      {pastErrors.length > 0 ? (
        <div className="bg-linear-to-br from-rose-500 via-rose-600 to-amber-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-white/20 backdrop-blur-xs text-amber-200">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-rose-100">
                Smart Weakness Practice
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold">Xatolar ustida tezkor test</h2>
              <p className="text-xs text-rose-100 mt-1 max-w-sm leading-relaxed">
                Ushbu to‘plamdagi har bir to‘g‘ri javob xatoliklar sonini kamaytiradi va sizga{' '}
                <strong className="text-amber-200 font-bold">+20 XP</strong> beradi!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={startWeaknessPractice}
                className="px-4 py-2.5 rounded-xl bg-white text-rose-900 font-bold text-xs flex items-center gap-2 hover:bg-rose-50 transition-all shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-rose-900" />
                <span>Tezkor testni boshlash</span>
              </button>

              <button
                onClick={() => setCurrentScreen('flashcards')}
                className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Fleshkartada ko‘rish</span>
              </button>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-stone-900 text-base">Mukammal natija!</h2>
          <p className="text-xs text-stone-600 max-w-xs mx-auto">
            Sizda hozircha xato qilingan so‘zlar yo‘q. Yangi so‘zlarni o‘rganish yoki CEFR testlarini topshirishda davom eting!
          </p>
          <button
            onClick={() => setCurrentScreen('test_select')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <span>Yangi test topshirish</span>
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      {pastErrors.length > 0 && (
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Barchasi ({pastErrors.length})
          </button>

          <button
            onClick={() => setActiveFilter('high_error')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'high_error'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Ko‘p xato qilingan ({pastErrors.filter((e) => e.errorCount >= 2).length})
          </button>

          <button
            onClick={() => setActiveFilter('single')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'single'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            1 marta xato ({pastErrors.filter((e) => e.errorCount === 1).length})
          </button>
        </div>
      )}

      {/* Word Cards List */}
      <div className="space-y-2.5 pb-6">
        {filteredErrors.map((item) => {
          const isSpeaking = speakingWordId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3.5 border border-stone-200/90 hover:border-rose-300 transition-all shadow-2xs flex items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => handleSpeak(item.english, item.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-600 text-white border-rose-600 scale-95'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200/80'
                  }`}
                  title="Tinglash"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-stone-900 tracking-tight">
                      {item.english}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {item.transcription}
                    </span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                      {item.level}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-medium mt-0.5 truncate">
                    {item.uzbek}
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{item.errorCount}x xato</span>
                    </span>
                    <span className="text-stone-400 capitalize">
                      Manba: {item.source === 'flashcard' ? 'Fleshkarta' : item.source === 'test' ? 'Test' : 'Mashq'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => resolveWordError(item.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="O‘rganildi deb belgilash (+20 XP)"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tuzatildi</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
