import React from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Volume2,
  RotateCcw,
  Home,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  Target,
  PenTool,
  BookmarkCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { speakWord } from '../../utils/srs';

export const TestResultsScreen: React.FC = () => {
  const {
    lastTestResult,
    setCurrentScreen,
    setTestMode,
    startMistakesPractice,
  } = useApp();

  const isMasteryMode = Boolean(lastTestResult?.mode?.startsWith('topic_mastery_'));
  const isMasteryPassed = isMasteryMode && (lastTestResult?.accuracy || 0) >= 85;

  const isPlacementMode = Boolean(lastTestResult?.mode?.startsWith('placement_test_'));
  const placementLevel = isPlacementMode
    ? lastTestResult?.mode?.replace('placement_test_', '').toUpperCase()
    : null;
  const isPlacementPassed = isPlacementMode && (lastTestResult?.accuracy || 0) >= 80;

  const isPracticeMistakesMode = lastTestResult?.mode === 'practice_mistakes';

  React.useEffect(() => {
    if (
      lastTestResult &&
      (lastTestResult.accuracy >= 70 || isMasteryPassed || isPlacementPassed)
    ) {
      try {
        confetti({
          particleCount: isMasteryPassed || isPlacementPassed ? 140 : 80,
          spread: isMasteryPassed || isPlacementPassed ? 100 : 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [lastTestResult, isMasteryPassed, isPlacementPassed]);

  // Fallback demo result if navigated directly
  const result = lastTestResult || {
    id: 'demo_result',
    userId: 'user_01',
    date: new Date().toISOString(),
    mode: 'Bugungi yangi so‘zlar',
    totalQuestions: 20,
    correctAnswers: 16,
    incorrectAnswers: 4,
    accuracy: 80,
    wellLearnedWords: [],
    needReviewWords: [],
    score: 160,
  };

  const hasMistakes = result.needReviewWords && result.needReviewWords.length > 0;

  const handlePracticeMistakes = () => {
    if (hasMistakes) {
      startMistakesPractice(result.needReviewWords);
    }
  };

  return (
    <div id="test-results-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('vocabulary')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lug‘atlar</span>
        </button>
        <span className="text-xs font-bold text-stone-700">
          {isPlacementMode
            ? 'Darajani aniqlash natijasi'
            : isMasteryMode
            ? 'Mavzu O‘zlashtirish Natijasi'
            : isPracticeMistakesMode
            ? 'Xatolar tahlili natijasi'
            : 'Test natijalari'}
        </span>
        <button
          onClick={() => setCurrentScreen('home')}
          className="p-2 -mr-2 rounded-xl text-stone-500 hover:text-stone-900 cursor-pointer"
          title="Bosh sahifa"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* 1. Placement Test Specific Status Banner */}
      {isPlacementMode && (
        <div
          className={`p-4 rounded-3xl mb-4 border flex items-start gap-3.5 shadow-xs ${
            isPlacementPassed
              ? 'bg-linear-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white border-purple-400'
              : 'bg-purple-50 border-purple-200 text-purple-950'
          }`}
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isPlacementPassed ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
            }`}
          >
            {isPlacementPassed ? (
              <Target className="w-6 h-6 text-amber-300" />
            ) : (
              <Lock className="w-6 h-6 text-purple-800" />
            )}
          </div>

          <div className="flex-1">
            <h2 className={`font-black text-sm ${isPlacementPassed ? 'text-white' : 'text-purple-950'}`}>
              {isPlacementPassed
                ? `🎉 ${placementLevel} DARAJASI VA OLDINGI MAVZULAR OCHILDI!`
                : `⚠️ 80%+ Talabi Bajarilmadi (${placementLevel})`}
            </h2>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isPlacementPassed ? 'text-purple-100' : 'text-purple-900/90'
              }`}
            >
              {isPlacementPassed
                ? `Tabriklaymiz! Siz ${result.accuracy}% to‘pladingiz (80%+ talab) va ${placementLevel} darajasi hamda unga tegishli barcha oldingi mavzular to‘liq qulfdan ochildi!`
                : `Darajani avtomatik ochish uchun kamida 80% to‘g‘ri javob kerak. Sizning natijangiz: ${result.accuracy}%. Xatolarni takrorlab, qayta urinib ko‘ring.`}
            </p>

            {isPlacementPassed && (
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                  +100 XP Berildi
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                  +20 ⭐ Yulduz
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-purple-900 text-[11px] font-extrabold shadow-2xs">
                  {placementLevel} to‘liq ochildi 🔓
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Mastery Result Specific Status Banner (85%+ threshold) */}
      {isMasteryMode && (
        <div
          className={`p-4 rounded-3xl mb-4 border flex items-start gap-3.5 shadow-xs ${
            isMasteryPassed
              ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white border-emerald-400'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isMasteryPassed ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
            }`}
          >
            {isMasteryPassed ? (
              <Unlock className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6 text-amber-800" />
            )}
          </div>

          <div className="flex-1">
            <h2 className={`font-black text-sm ${isMasteryPassed ? 'text-white' : 'text-amber-950'}`}>
              {isMasteryPassed
                ? '🎉 MAVZU TO‘LIQ O‘ZLASHTIRILDI (MASTERED)!'
                : '⚠️ 85%+ Talabi Bajarilmadi'}
            </h2>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isMasteryPassed ? 'text-emerald-100' : 'text-amber-900/90'
              }`}
            >
              {isMasteryPassed
                ? `Siz ${result.accuracy}% natija bilan talab qilingan 85% chegarani muvaffaqiyatli zabt etdingiz! Keyingi ketma-ket mavzu qulfi ochildi.`
                : `Keyingi mavzuni ochish uchun kamida 85% natija kerak. Sizning natijangiz: ${result.accuracy}%. Xatolarni takrorlab, qayta urinib ko‘ring.`}
            </p>

            {isMasteryPassed && (
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                  +50 XP Berildi
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                  +10 ⭐ Yulduz
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-800 text-[11px] font-extrabold shadow-2xs">
                  Keyingi mavzu ochildi 🔓
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Score Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm text-center mb-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <Trophy className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-display font-extrabold text-stone-900 mb-1">
          Test yakunlandi
        </h1>
        <p className="text-xs text-stone-500 mb-5">
          {result.accuracy >= 85
            ? 'A’lo darajadagi natija! Bilimingiz yuqori darajada mustahkamlandi.'
            : result.accuracy >= 70
            ? 'Yaxshi natija! Bir nechta xatolarni tuzatib, 85%+ ga yetishingiz mumkin.'
            : 'Xatolarni ko‘rib chiqib, «Xatolar ustida ishlash» orqali qayta urinib ko‘ring!'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
            <span className="text-[11px] text-emerald-700 font-semibold block">To‘g‘ri</span>
            <span className="text-xl font-bold font-display text-emerald-800">
              {result.correctAnswers}
            </span>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3">
            <span className="text-[11px] text-rose-700 font-semibold block">Noto‘g‘ri</span>
            <span className="text-xl font-bold font-display text-rose-800">
              {result.incorrectAnswers}
            </span>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
            <span className="text-[11px] text-indigo-700 font-semibold block">Aniqlik</span>
            <span className="text-xl font-bold font-display text-indigo-800">
              {result.accuracy}%
            </span>
          </div>
        </div>

        {result.accuracy >= 70 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>⭐ +5 Yulduz qo‘shildi!</span>
          </div>
        )}
      </div>

      {/* POST-QUIZ ERROR REVIEW: Missed Words Summary & Practice Mistakes Button */}
      {hasMistakes && (
        <div className="mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Xato qilingan so‘zlar ({result.needReviewWords.length} ta)</span>
            </div>
            <button
              onClick={handlePracticeMistakes}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xatolar ustida ishlash</span>
            </button>
          </div>

          {/* Quick Action Highlight Box */}
          <div className="p-3.5 bg-rose-50/90 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="text-xs text-rose-950 leading-relaxed">
              <span className="font-bold block mb-0.5">
                Xatolar ustida ishlash (Practice Mistakes):
              </span>
              Ushbu {result.needReviewWords.length} ta so‘zni qayta topshiring va bilimlaringizni 100% mustahkamlang!
            </div>
            <button
              onClick={handlePracticeMistakes}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hozir mashq qilish</span>
            </button>
          </div>

          {/* List of exact missed words */}
          <div className="space-y-2">
            {result.needReviewWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-2xl p-3.5 border border-stone-200 flex items-center justify-between shadow-2xs hover:border-rose-300 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 font-display">
                      {word.english}
                    </span>
                    {word.transcription && (
                      <span className="text-[11px] font-mono text-stone-400">
                        {word.transcription}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-rose-600 font-semibold mt-0.5">
                    {word.uzbek}
                  </div>
                </div>
                <button
                  onClick={() => speakWord(word.english)}
                  className="p-2 rounded-xl text-stone-400 hover:text-indigo-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Talaffuzni tinglash"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Well Learned Words Section */}
      {result.wellLearnedWords && result.wellLearnedWords.length > 0 && (
        <div className="mb-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>To‘g‘ri topilgan so‘zlar</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {result.wellLearnedWords.length} ta
            </span>
          </div>

          <div className="space-y-2">
            {result.wellLearnedWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-2xl p-3 border border-stone-200 flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="font-bold text-sm text-stone-900 font-display">
                    {word.english}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">{word.uzbek}</div>
                </div>
                <button
                  onClick={() => speakWord(word.english)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA Actions */}
      <div className="pt-2 pb-6 space-y-2.5">
        {hasMistakes && (
          <button
            onClick={handlePracticeMistakes}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xatolar ustida ishlash ({result.needReviewWords.length} ta so‘z)</span>
          </button>
        )}

        {isPlacementMode ? (
          <>
            {isPlacementPassed ? (
              <button
                onClick={() => setCurrentScreen('vocabulary')}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ochilgan darajani ko‘rish</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setTestMode(result.mode);
                  setCurrentScreen('test_run');
                }}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta test topshirish (80%+ talab)</span>
              </button>
            )}
          </>
        ) : isMasteryMode ? (
          <>
            {isMasteryPassed ? (
              <button
                onClick={() => setCurrentScreen('vocabulary')}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Keyingi mavzuga o‘tish (Ochilgan)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setTestMode(result.mode);
                  setCurrentScreen('test_run');
                }}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta test topshirish (85%+ talab)</span>
              </button>
            )}

            <button
              onClick={() => setCurrentScreen('vocabulary')}
              className="w-full py-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Mavzular ro‘yxatiga qaytish
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentScreen('flashcards')}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Fleshkartada takrorlash
            </button>

            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full py-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Bosh sahifaga qaytish
            </button>
          </>
        )}
      </div>
    </div>
  );
};
