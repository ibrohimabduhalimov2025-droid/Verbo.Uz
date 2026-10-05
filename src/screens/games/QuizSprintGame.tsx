import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Trophy, Timer, Check, X, RotateCcw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Word } from '../../types';
import { playChime, speakWord } from '../../utils/srs';

export const QuizSprintGame: React.FC = () => {
  const {
    words,
    setCurrentScreen,
    rateWordSRS,
    selectedCefrLevel,
    cefrLevelWords,
    loadCefrWordsForLevel,
    user,
  } = useApp();

  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  useEffect(() => {
    if (cefrLevelWords.length === 0) {
      loadCefrWordsForLevel(selectedCefrLevel || user.level || 'A1');
    }
  }, [cefrLevelWords.length, selectedCefrLevel, user.level]);

  const wordPool = cefrLevelWords.length > 0 ? cefrLevelWords : words;

  // Generate question list with 4 multiple choice options each
  const questions = React.useMemo(() => {
    if (wordPool.length === 0) return [];
    return wordPool.slice(0, 20).map((targetWord) => {
      const wrongWords = wordPool
        .filter((w) => w.id !== targetWord.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const allOptions = [targetWord, ...wrongWords].sort(() => 0.5 - Math.random());
      const correctIndex = allOptions.findIndex((o) => o.id === targetWord.id);
      return {
        word: targetWord,
        options: allOptions.map((o) => o.uzbek),
        correctIndex,
      };
    });
  }, [wordPool]);

  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Countdown timer
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          playChime('win');
          try {
            confetti({ particleCount: 60, spread: 60 });
          } catch {}
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked || isGameOver) return;

    setSelectedOption(index);
    setIsAnswerChecked(true);

    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      playChime('correct');
      // Score = 50 base + (timeLeft * 5) * (1 + streak * 0.2)
      const earned = Math.round((50 + timeLeft * 3) * (1 + streak * 0.25));
      setScore((s) => s + earned);
      setStreak((st) => st + 1);
      rateWordSRS(currentQ.word.id, 'bildim');
    } else {
      playChime('wrong');
      setStreak(0);
      rateWordSRS(currentQ.word.id, 'bilmadim');
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsAnswerChecked(false);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((q) => q + 1);
      } else {
        setIsGameOver(true);
      }
    }, 500);
  };

  const handleRestart = () => {
    setTimeLeft(30);
    setIsGameOver(false);
    setScore(0);
    setStreak(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  return (
    <div id="quiz-sprint-game" className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-stone-50 min-h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentScreen('games')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
              timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-stone-950'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <Zap className="w-3.5 h-3.5" />
            <span>{score}</span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="p-2 -mr-2 rounded-xl text-stone-500 hover:text-stone-900"
          title="Qaytadan boshlash"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Sprint question card */}
      <div className="my-auto max-w-sm mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center mb-4">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Savol {currentQuestionIndex + 1}</span>
            {streak > 1 && (
              <span className="font-bold text-amber-600 animate-pulse">
                ⚡ {streak}x Tezkor Ketma-ketlik!
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-3xl font-display font-extrabold text-stone-900 tracking-tight">
              {currentQ.word.english}
            </h2>
            <button
              type="button"
              onClick={() => speakWord(currentQ.word.english)}
              className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-50"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-mono text-stone-400 mb-4">{currentQ.word.transcription}</p>
          <p className="text-xs text-stone-500">To‘g‘ri o‘zbekcha ma’nosini tezroq tanlang:</p>
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-2.5">
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnStyle = 'bg-white border-stone-200 text-stone-800 hover:border-indigo-300';
            if (isAnswerChecked) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-600 border-emerald-600 text-white shadow-md';
              } else if (isSelected) {
                btnStyle = 'bg-rose-600 border-rose-600 text-white';
              } else {
                btnStyle = 'bg-white/50 border-stone-200 text-stone-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswerChecked || isGameOver}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-2xl border font-semibold text-xs sm:text-sm text-left flex items-center justify-between transition-all active:scale-[0.99] shadow-2xs ${btnStyle}`}
              >
                <span>{optionText}</span>
                {isAnswerChecked && isCorrect && <Check className="w-4 h-4 stroke-[3]" />}
                {isAnswerChecked && isSelected && !isCorrect && <X className="w-4 h-4 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs border border-stone-200 shadow-2xl text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-1">Vaqt tugadi!</h3>
            <p className="text-xs text-stone-500 mb-4">Sprint natijangiz hisoblandi</p>

            <div className="bg-stone-50 rounded-xl p-3 mb-4 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>To‘plangan ball:</span>
                <span className="font-extrabold text-base text-amber-600">{score}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Javoblar soni:</span>
                <span className="font-bold text-stone-900">{currentQuestionIndex} ta</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRestart}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Qaytadan o‘ynash
              </button>
              <button
                onClick={() => setCurrentScreen('games')}
                className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
              >
                O‘yinlar ro‘yxati
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
