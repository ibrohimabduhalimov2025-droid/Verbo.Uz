import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Ear,
  Snail,
  Play,
  Check,
  ChevronRight,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Word } from '../../types';
import { playChime, speakWord } from '../../utils/srs';

type GameMode = 'meaning' | 'spelling' | 'dictation';

interface QuestionItem {
  word: Word;
  options: string[]; // 4 options depending on mode
  correctIndex: number;
}

export const AudioGame: React.FC = () => {
  const {
    words,
    setCurrentScreen,
    rateWordSRS,
    selectedCefrLevel,
    selectedTopicId,
    cefrLevelWords,
    loadCefrWordsForLevel,
  } = useApp();

  // Load CEFR words if level is active
  useEffect(() => {
    if (selectedCefrLevel) {
      loadCefrWordsForLevel(selectedCefrLevel);
    }
  }, [selectedCefrLevel]);

  // Game Settings & State
  const [gameMode, setGameMode] = useState<GameMode>('meaning');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<1.0 | 0.75>(1.0);
  const [dictationInput, setDictationInput] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  // Score & Combo
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Results review list
  const [correctList, setCorrectList] = useState<Word[]>([]);
  const [wrongList, setWrongList] = useState<Word[]>([]);

  // Word pool based on CEFR level & topic
  const pool = useMemo(() => {
    let list = words;
    if (selectedCefrLevel && cefrLevelWords.length > 0) {
      list = cefrLevelWords;
      if (selectedTopicId) {
        const topicFiltered = cefrLevelWords.filter(
          (w) => w.topicId === selectedTopicId || w.category === selectedTopicId
        );
        if (topicFiltered.length >= 4) {
          list = topicFiltered;
        }
      }
    }
    return list.length >= 4 ? list : words;
  }, [selectedCefrLevel, cefrLevelWords, selectedTopicId, words]);

  // 10 randomized questions for the round
  const questions: QuestionItem[] = useMemo(() => {
    if (pool.length < 4) return [];
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const targetWords = shuffledPool.slice(0, 10);

    return targetWords.map((target) => {
      // Pick 3 distractors
      const distractors = pool
        .filter((w) => w.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allFour = [target, ...distractors].sort(() => 0.5 - Math.random());
      const correctIdx = allFour.findIndex((w) => w.id === target.id);

      let optionsList: string[] = [];
      if (gameMode === 'meaning') {
        optionsList = allFour.map((w) => w.uzbek);
      } else {
        // Spelling mode: 4 English words
        optionsList = allFour.map((w) => w.english);
      }

      return {
        word: target,
        options: optionsList,
        correctIndex: correctIdx,
      };
    });
  }, [pool, gameMode]);

  const currentQ = questions[currentIndex] || questions[0];

  // Play audio for current question
  const playTargetAudio = (rate: number = audioSpeed) => {
    if (!currentQ?.word) return;
    setIsPlayingAudio(true);
    speakWord(
      currentQ.word.english,
      () => {
        setIsPlayingAudio(false);
      },
      'en',
      rate
    );
  };

  // Auto-play audio when moving to a new question
  useEffect(() => {
    if (!isGameOver && currentQ?.word) {
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setDictationInput('');
      const timer = setTimeout(() => {
        playTargetAudio(1.0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isGameOver, gameMode]);

  // Restart Round
  const startNewGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setDictationInput('');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setCorrectList([]);
    setWrongList([]);
    setIsGameOver(false);
  };

  // Handle Option Selection (Multiple Choice)
  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked || !currentQ) return;

    setSelectedOption(idx);
    setIsAnswerChecked(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      playChime('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      const pointsEarned = 10 + Math.min(newCombo * 5, 25);
      setScore((s) => s + pointsEarned);
      setCorrectCount((c) => c + 1);
      setCorrectList((prev) => [...prev, currentQ.word]);
      rateWordSRS(currentQ.word.id, 'yaxshi');
    } else {
      playChime('wrong');
      setCombo(0);
      setWrongList((prev) => [...prev, currentQ.word]);
      rateWordSRS(currentQ.word.id, 'qaytarish');
    }
  };

  // Handle Dictation Submit
  const handleCheckDictation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswerChecked || !currentQ || !dictationInput.trim()) return;

    setIsAnswerChecked(true);
    const cleanedInput = dictationInput.trim().toLowerCase();
    const targetWord = currentQ.word.english.trim().toLowerCase();

    const isCorrect = cleanedInput === targetWord;
    if (isCorrect) {
      playChime('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setScore((s) => s + 20 + Math.min(newCombo * 5, 30));
      setCorrectCount((c) => c + 1);
      setCorrectList((prev) => [...prev, currentQ.word]);
      rateWordSRS(currentQ.word.id, 'oson');
    } else {
      playChime('wrong');
      setCombo(0);
      setWrongList((prev) => [...prev, currentQ.word]);
      rateWordSRS(currentQ.word.id, 'qaytarish');
    }
  };

  // Go to Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      playChime('win');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const progressPercent =
    questions.length > 0
      ? Math.round(((currentIndex + (isAnswerChecked ? 1 : 0)) / questions.length) * 100)
      : 0;

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Ear className="w-12 h-12 text-stone-400 mb-3" />
        <h2 className="text-base font-bold text-stone-800">
          Yetarli so‘z topilmadi
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-xs">
          Audio o‘yinini boshlash uchun kamida 4 ta so‘z bo‘lishi lozim.
        </p>
        <button
          onClick={() => setCurrentScreen('games')}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          O‘yinlarga qaytish
        </button>
      </div>
    );
  }

  return (
    <div
      id="audio-game-screen"
      className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-stone-50 min-h-screen max-w-3xl mx-auto w-full"
    >
      {/* Top Header */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('games')}
            className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>O‘yinlarga qaytish</span>
          </button>

          <div className="flex items-center gap-2">
            {selectedCefrLevel && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-black border border-indigo-200/60">
                CEFR {selectedCefrLevel}
              </span>
            )}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 font-black text-xs border border-purple-200">
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              <span>{score} ball</span>
            </div>
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 font-black text-xs border border-amber-200 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>{combo}x Combo</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-bold px-1">
            <span className="flex items-center gap-1 text-purple-700">
              <Ear className="w-3.5 h-3.5" />
              <span>Tinglab topish • Audio Game</span>
            </span>
            <span>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Game Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-stone-200/70 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => {
              if (gameMode !== 'meaning') {
                setGameMode('meaning');
                setCurrentIndex(0);
              }
            }}
            className={`py-1.5 rounded-lg transition-all ${
              gameMode === 'meaning'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ma’nosini top
          </button>
          <button
            onClick={() => {
              if (gameMode !== 'spelling') {
                setGameMode('spelling');
                setCurrentIndex(0);
              }
            }}
            className={`py-1.5 rounded-lg transition-all ${
              gameMode === 'spelling'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            So‘zni top
          </button>
          <button
            onClick={() => {
              if (gameMode !== 'dictation') {
                setGameMode('dictation');
                setCurrentIndex(0);
              }
            }}
            className={`py-1.5 rounded-lg transition-all ${
              gameMode === 'dictation'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tinglab yozish
          </button>
        </div>
      </div>

      {/* Main Interactive Audio Player Card */}
      <div className="my-auto py-4 space-y-5">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-radial from-purple-50/50 to-transparent pointer-events-none" />

          {/* Central Big Sound Wave / Play Button */}
          <div className="relative inline-block mb-3">
            {isPlayingAudio && (
              <div className="absolute -inset-3 rounded-full bg-purple-400/25 animate-ping" />
            )}
            <button
              onClick={() => playTargetAudio(1.0)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600 text-white flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all mx-auto group ${
                isPlayingAudio ? 'ring-4 ring-purple-300 ring-offset-2' : ''
              }`}
              title="Talaffuzni tinglash"
            >
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-85">
                {isPlayingAudio ? 'Tinglanmoqda...' : 'Tinglash'}
              </span>
            </button>
          </div>

          {/* Speed Controls: Normal vs Slow 0.75x */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => playTargetAudio(1.0)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
              <span>1.0x (Oddiy)</span>
            </button>

            <button
              onClick={() => playTargetAudio(0.75)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-200/60"
              title="Sekinroq tezlikda har bir bo‘g‘inni aniq eshiting"
            >
              <Snail className="w-3.5 h-3.5 text-amber-600" />
              <span>0.75x (Sekinroq)</span>
            </button>
          </div>

          {/* Hint / Instructions */}
          <div className="mt-3 text-xs text-stone-500 font-medium">
            {gameMode === 'meaning' &&
              "So‘z talaffuzini tinglab, uning to‘g‘ri o‘zbekcha tarjimasini tanlang:"}
            {gameMode === 'spelling' &&
              "Talaffuz qilingan so‘zning to‘g‘ri inglizcha yozilishini tanlang:"}
            {gameMode === 'dictation' &&
              "Talaffuz qilingan so‘zni ingliz tilida aniq yozing:"}
          </div>

          {/* Revealed Info after Answer */}
          {isAnswerChecked && currentQ && (
            <div className="mt-4 pt-4 border-t border-stone-100 text-center animate-in fade-in zoom-in-95 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-black text-stone-900">
                  {currentQ.word.english}
                </span>
                {currentQ.word.transcription && (
                  <span className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    {currentQ.word.transcription}
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-stone-700">
                {currentQ.word.uzbek}
              </div>
              {currentQ.word.exampleSentence && (
                <div className="text-xs text-stone-500 italic mt-1 bg-stone-50 p-2 rounded-xl">
                  "{currentQ.word.exampleSentence}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODE 1 & 2: MULTIPLE CHOICE (Meaning or Spelling) */}
        {gameMode !== 'dictation' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isCorrect = idx === currentQ.correctIndex;
              const isSelected = selectedOption === idx;

              let btnStyle =
                'bg-white border-stone-200 text-stone-800 hover:border-purple-300 hover:bg-purple-50/20';

              if (isAnswerChecked) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                } else {
                  btnStyle = 'bg-stone-50/60 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerChecked}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all active:scale-98 flex items-center justify-between gap-2 shadow-2xs ${btnStyle}`}
                >
                  <span className="flex-1">{option}</span>
                  {isAnswerChecked && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerChecked && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* MODE 3: DICTATION (Tinglab yozish) */}
        {gameMode === 'dictation' && (
          <form onSubmit={handleCheckDictation} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                autoFocus
                disabled={isAnswerChecked}
                value={dictationInput}
                onChange={(e) => setDictationInput(e.target.value)}
                placeholder="Eshitgan so‘zingizni yozing..."
                className={`w-full px-4 py-3.5 bg-white rounded-2xl text-base font-bold text-stone-900 placeholder:text-stone-400 border transition-all focus:outline-hidden ${
                  isAnswerChecked
                    ? dictationInput.trim().toLowerCase() ===
                      currentQ.word.english.trim().toLowerCase()
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                      : 'border-rose-400 bg-rose-50/40 text-rose-900'
                    : 'border-stone-200 focus:border-purple-600 shadow-2xs'
                }`}
              />
              {isAnswerChecked && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {dictationInput.trim().toLowerCase() ===
                  currentQ.word.english.trim().toLowerCase() ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                </div>
              )}
            </div>

            {!isAnswerChecked && (
              <button
                type="submit"
                disabled={!dictationInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <span>Tekshirish</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </form>
        )}
      </div>

      {/* Bottom Footer: Next Question Button */}
      {isAnswerChecked && (
        <div className="pt-3 animate-in slide-in-from-bottom-2">
          <button
            onClick={handleNextQuestion}
            className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>
              {currentIndex + 1 < questions.length
                ? 'Keyingi so‘z'
                : 'Natijalarni ko‘rish'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Round Finished Summary Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900">
                Ajoyib natija! 🎉
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Tinglab topish mashg‘uloti yakunlandi
              </p>
            </div>

            {/* Score & Accuracy Stats */}
            <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase">
                  Ball
                </div>
                <div className="text-base font-black text-purple-600">{score}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase">
                  Aniqlik
                </div>
                <div className="text-base font-black text-emerald-600">
                  {Math.round((correctCount / questions.length) * 100)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase">
                  Max Combo
                </div>
                <div className="text-base font-black text-amber-600">
                  {maxCombo}x
                </div>
              </div>
            </div>

            {/* Misheard words review list (if any) */}
            {wrongList.length > 0 && (
              <div className="text-left space-y-1.5 max-h-36 overflow-y-auto pt-1">
                <div className="text-[11px] font-bold text-stone-400 uppercase">
                  Xato eshitilgan so‘zlar:
                </div>
                {wrongList.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => speakWord(w.english)}
                    className="p-2 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs cursor-pointer hover:bg-rose-100/60 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-stone-900">{w.english}</span>
                      <span className="text-stone-500 ml-1.5">— {w.uzbek}</span>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={startNewGame}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qaytadan o‘ynash</span>
              </button>

              <button
                onClick={() => setCurrentScreen('games')}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
              >
                O‘yinlar menyusiga qaytish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
