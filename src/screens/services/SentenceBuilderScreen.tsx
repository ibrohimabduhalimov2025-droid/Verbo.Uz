import React, { useState } from 'react';
import {
  ArrowLeft,
  Layers,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Star,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { speakWord } from '../../utils/srs';

interface SentenceChallenge {
  id: number;
  uzbek: string;
  targetSentence: string;
  scrambledWords: string[];
  explanation: string;
  level: string;
}

const CHALLENGES: SentenceChallenge[] = [
  {
    id: 1,
    uzbek: 'Men uch oydan beri ingliz tilini o‘rganmoqdaman.',
    targetSentence: 'I have been learning English for three months',
    scrambledWords: ['learning', 'I', 'months', 'have', 'three', 'English', 'been', 'for'],
    explanation: 'Present Perfect Continuous zamoni: Subject + have/has been + V-ing + for/since.',
    level: 'B1',
  },
  {
    id: 2,
    uzbek: 'Ular har doim vaqtida yetib kelishadi.',
    targetSentence: 'They always arrive on time',
    scrambledWords: ['arrive', 'They', 'time', 'always', 'on'],
    explanation: 'Chastotalik ravishlari ("always", "often") asosiy fe’ldan oldin keladi.',
    level: 'A2',
  },
  {
    id: 3,
    uzbek: 'Agar ertaga yomg‘ir yog‘sa, biz uyda qolamiz.',
    targetSentence: 'If it rains tomorrow we will stay at home',
    scrambledWords: ['tomorrow', 'stay', 'rains', 'will', 'If', 'home', 'at', 'it', 'we'],
    explanation: 'First Conditional: If + Present Simple, will + V1.',
    level: 'B1',
  },
  {
    id: 4,
    uzbek: 'Menga yangi so‘zlarni yodlash juda yoqadi.',
    targetSentence: 'I really enjoy memorizing new words',
    scrambledWords: ['words', 'really', 'memorizing', 'I', 'new', 'enjoy'],
    explanation: '"enjoy" fe’lidan keyin doim gerundiy (-ing) qo‘llaniladi.',
    level: 'A2',
  },
];

export const SentenceBuilderScreen: React.FC = () => {
  const { setCurrentScreen, user, updateUserProfile } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const challenge = CHALLENGES[currentIndex];

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(challenge.scrambledWords);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const handlePickWord = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
    const updated = [...availableWords];
    updated.splice(index, 1);
    setAvailableWords(updated);
    setIsCorrect(null);
  };

  const handleRemoveWord = (word: string, index: number) => {
    setAvailableWords([...availableWords, word]);
    const updated = [...selectedWords];
    updated.splice(index, 1);
    setSelectedWords(updated);
    setIsCorrect(null);
  };

  const handleCheck = () => {
    const constructed = selectedWords.join(' ');
    if (constructed === challenge.targetSentence) {
      setIsCorrect(true);
      setStreak((prev) => prev + 1);
      speakWord(challenge.targetSentence);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
      updateUserProfile({ stars: user.stars + 2 });
    } else {
      setIsCorrect(false);
      setStreak(0);
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
    setAvailableWords(challenge.scrambledWords);
    setIsCorrect(null);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % CHALLENGES.length;
    setCurrentIndex(nextIdx);
    setSelectedWords([]);
    setAvailableWords(CHALLENGES[nextIdx].scrambledWords);
    setIsCorrect(null);
  };

  return (
    <div id="sentence-builder-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('services')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-stone-700">Gap Tuzish Mashqlari</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Streak: {streak}</span>
        </div>
      </div>

      {/* Progress & Level */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="font-semibold text-stone-500">
          Mashq {currentIndex + 1} / {CHALLENGES.length}
        </span>
        <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
          {challenge.level}
        </span>
      </div>

      {/* Prompt Card (Uzbek meaning) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
          O‘zbekcha ma’nosi:
        </span>
        <h2 className="text-base sm:text-lg font-bold text-stone-900">
          "{challenge.uzbek}"
        </h2>
      </div>

      {/* Sentence Drop Zone (Constructed words) */}
      <div
        className={`bg-white min-h-[110px] rounded-3xl p-4 border-2 border-dashed flex flex-wrap gap-2 items-center content-center transition-all ${
          isCorrect === true
            ? 'border-emerald-500 bg-emerald-50/20'
            : isCorrect === false
            ? 'border-rose-500 bg-rose-50/20'
            : 'border-stone-300'
        }`}
      >
        {selectedWords.length === 0 ? (
          <span className="text-xs text-stone-400 italic mx-auto">
            Pastdagi so‘zlarni ketma-ketlikda bosing...
          </span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveWord(word, idx)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Feedback & Grammar Tip */}
      {isCorrect !== null && (
        <div
          className={`p-4 rounded-2xl border animate-in fade-in space-y-2 ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>To‘g‘ri yig‘ildi! +2 yulduz ⭐</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Ketma-ketlikda xatolik bor</span>
              </>
            )}
          </div>
          <p className="text-xs leading-relaxed text-stone-700">
            💡 {challenge.explanation}
          </p>
        </div>
      )}

      {/* Available Word Chips Bank */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500">
          <span>Mavjud so‘zlar:</span>
          <button
            onClick={handleReset}
            className="text-[11px] font-bold text-stone-400 hover:text-stone-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Tozalash</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {availableWords.map((word, idx) => (
            <button
              key={idx}
              onClick={() => handlePickWord(word, idx)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-indigo-50 hover:text-indigo-600 text-stone-800 font-bold text-xs border border-stone-200 shadow-2xs active:scale-95 transition-all"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        {isCorrect === true ? (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Keyingi gap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCheck}
            disabled={selectedWords.length === 0}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tekshirish</span>
          </button>
        )}
      </div>
    </div>
  );
};
