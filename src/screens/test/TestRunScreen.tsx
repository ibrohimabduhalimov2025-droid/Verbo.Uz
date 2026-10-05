import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  X,
  Volume2,
  ArrowRight,
  GraduationCap,
  Headphones,
  Sparkles,
  Trophy,
  Target,
  PenTool,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Word, TestResult, CEFRLevel } from '../../types';
import { speakWord, playChime } from '../../utils/srs';

export const TestRunScreen: React.FC = () => {
  const {
    words,
    testMode,
    saveTestResult,
    setCurrentScreen,
    user,
    selectedCefrLevel,
    selectedTopicId,
    cefrLevelWords,
    loadCefrWordsForLevel,
    pastErrors,
    practiceMistakesWords,
  } = useApp();

  const isCefrTest = testMode.startsWith('cefr_');
  const isWeakWordsTest = testMode === 'weak_words';
  const isMistakesPracticeTest = testMode === 'practice_mistakes';
  const isPlacementTest = testMode.startsWith('placement_test_');
  const isMasteryTest = testMode.startsWith('topic_mastery_');
  const masteryTopicId = isMasteryTest ? testMode.replace('topic_mastery_', '') : null;

  const placementTargetLevel = isPlacementTest
    ? (testMode.replace('placement_test_', '').toUpperCase() as CEFRLevel)
    : null;

  const cefrTargetLevel = (
    isPlacementTest
      ? placementTargetLevel
      : isCefrTest
      ? testMode.replace('cefr_', '').toUpperCase()
      : selectedCefrLevel || (isMasteryTest ? 'A1' : null)
  ) as CEFRLevel | null;

  useEffect(() => {
    if (cefrTargetLevel) {
      loadCefrWordsForLevel(cefrTargetLevel);
    }
  }, [cefrTargetLevel]);

  // Convert pastErrors to standard Word format for weak_words test
  const weakWordsAsWords: Word[] = useMemo(() => {
    return pastErrors.map((pe, idx) => ({
      id: pe.wordId || pe.id,
      english: pe.english,
      uzbek: pe.uzbek,
      transcription: pe.transcription || '',
      exampleSentence: `${pe.english} is a key word to master.`,
      exampleUzbek: `${pe.uzbek} - ma'nosini eslab qoling.`,
      level: pe.level,
      orderNumber: idx + 1,
    }));
  }, [pastErrors]);

  // Topic specific words for mastery test
  const masteryWords: Word[] = useMemo(() => {
    if (!isMasteryTest || !masteryTopicId) return [];
    const pool = cefrLevelWords.length > 0 ? cefrLevelWords : words;
    const filtered = pool.filter(
      (w) => w.topicId === masteryTopicId || w.category === masteryTopicId
    );
    return filtered.length > 0 ? filtered : pool.slice(0, 15);
  }, [isMasteryTest, masteryTopicId, cefrLevelWords, words]);

  // Pool of words to test
  const testPool = useMemo(() => {
    if (isMistakesPracticeTest && practiceMistakesWords.length > 0) {
      return practiceMistakesWords;
    }
    if (isPlacementTest && cefrLevelWords.length > 0) {
      return cefrLevelWords;
    }
    if (isMasteryTest && masteryWords.length >= 4) {
      return masteryWords;
    }
    if (isWeakWordsTest) {
      return [...weakWordsAsWords, ...words, ...cefrLevelWords];
    }
    if (cefrTargetLevel && cefrLevelWords.length > 0) {
      if (selectedTopicId) {
        const topicWords = cefrLevelWords.filter(
          (w) => w.topicId === selectedTopicId || w.category === selectedTopicId
        );
        if (topicWords.length >= 4) {
          return topicWords;
        }
      }
      return cefrLevelWords;
    }
    if (selectedTopicId) {
      const topicWords = words.filter((w) => w.topicId === selectedTopicId);
      if (topicWords.length >= 4) {
        return topicWords;
      }
    }
    return words;
  }, [
    isMistakesPracticeTest,
    practiceMistakesWords,
    isPlacementTest,
    isMasteryTest,
    masteryWords,
    isWeakWordsTest,
    weakWordsAsWords,
    cefrTargetLevel,
    cefrLevelWords,
    selectedTopicId,
    words,
  ]);

  // Pick questions based on mode
  const testWords = useMemo(() => {
    if (isMistakesPracticeTest && practiceMistakesWords.length > 0) {
      return [...practiceMistakesWords].sort(() => 0.5 - Math.random()).slice(0, 20);
    }
    if (isPlacementTest && cefrLevelWords.length > 0) {
      return [...cefrLevelWords].sort(() => 0.5 - Math.random()).slice(0, 20);
    }
    if (isMasteryTest && masteryWords.length > 0) {
      return [...masteryWords].sort(() => 0.5 - Math.random()).slice(0, Math.min(25, masteryWords.length));
    }
    if (isWeakWordsTest) {
      if (weakWordsAsWords.length > 0) {
        return [...weakWordsAsWords].sort(() => 0.5 - Math.random()).slice(0, 15);
      }
      return [...words].sort(() => 0.5 - Math.random()).slice(0, 10);
    }
    return [...testPool].sort(() => 0.5 - Math.random()).slice(0, 15);
  }, [
    testPool,
    isMistakesPracticeTest,
    practiceMistakesWords,
    isPlacementTest,
    cefrLevelWords,
    isMasteryTest,
    masteryWords,
    isWeakWordsTest,
    weakWordsAsWords,
    words,
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Results tracker
  const [correctList, setCorrectList] = useState<Word[]>([]);
  const [incorrectList, setIncorrectList] = useState<Word[]>([]);

  const currentWord = testWords[currentIndex] || testWords[0];

  // 60% Multiple Choice (Uzbek translation), 20% Listening, 20% Spelling / Writing
  // mod 0, 1, 2 = mcq (60%), mod 3 = listening (20%), mod 4 = write (20%)
  const questionType: 'mcq' | 'listening' | 'write' = useMemo(() => {
    const mod = currentIndex % 5;
    if (mod === 3) return 'listening';
    if (mod === 4) return 'write';
    return 'mcq';
  }, [currentIndex]);

  // When a listening question mounts or changes, auto-play audio
  useEffect(() => {
    if (questionType === 'listening' && currentWord?.english) {
      const timer = setTimeout(() => {
        speakWord(currentWord.english);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [questionType, currentIndex, currentWord?.english]);

  // Generate 4 options for MCQ / Listening
  const mcqOptions = useMemo(() => {
    if (!currentWord) return [];
    const pool = testPool.length >= 4 ? testPool : words;
    const others = pool
      .filter((w) => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [currentWord, ...others].sort(() => 0.5 - Math.random());
  }, [currentWord, testPool, words]);

  const handleMcqSelect = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
    setIsAnswerChecked(true);

    const chosenWord = mcqOptions[index];
    const isCorrect = chosenWord.id === currentWord.id;

    if (isCorrect) {
      playChime('correct');
      setCorrectList((prev) => [...prev, currentWord]);
    } else {
      playChime('wrong');
      setIncorrectList((prev) => [...prev, currentWord]);
    }
  };

  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswerChecked || !writtenAnswer.trim()) return;

    setIsAnswerChecked(true);
    const cleanUser = writtenAnswer.trim().toLowerCase().replace(/[.,!?'"-]/g, '');
    const cleanTarget = currentWord.english.trim().toLowerCase().replace(/[.,!?'"-]/g, '');
    const isCorrect = cleanUser === cleanTarget;

    if (isCorrect) {
      playChime('correct');
      setCorrectList((prev) => [...prev, currentWord]);
    } else {
      playChime('wrong');
      setIncorrectList((prev) => [...prev, currentWord]);
    }
  };

  const handleNext = () => {
    setIsAnswerChecked(false);
    setSelectedAnswer(null);
    setWrittenAnswer('');

    if (currentIndex + 1 < testWords.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Test completed!
      const total = testWords.length;
      const correctCount = correctList.length;
      const incorrectCount = incorrectList.length;
      const accuracy = Math.round((correctCount / total) * 100);

      const result: TestResult = {
        id: `test_${Date.now()}`,
        userId: user.id,
        date: new Date().toISOString(),
        mode: testMode,
        totalQuestions: total,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        accuracy,
        wellLearnedWords: correctList,
        needReviewWords: incorrectList,
        score: correctCount * 10,
      };

      saveTestResult(result);
      setCurrentScreen('test_results');
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / Math.max(1, testWords.length)) * 100);

  return (
    <div id="test-run-screen" className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-stone-50 min-h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentScreen('vocabulary')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Chiqish</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-stone-900">
            Savol {currentIndex + 1} / {testWords.length}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">
            {questionType === 'mcq'
              ? 'Tarjimasini tanlang (MCQ)'
              : questionType === 'listening'
              ? 'Tinglang va so‘zni tanlang (Listening)'
              : 'So‘zni to‘g‘ri yozing (Spelling)'}
          </span>
        </div>

        <div className="w-12 text-right">
          <span className="text-xs font-extrabold text-indigo-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Mode Specific Alert Banners */}
      {isPlacementTest && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-purple-900 my-1">
          <span className="font-bold flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-600" />
            <span>Darajani aniqlash testi ({placementTargetLevel})</span>
          </span>
          <span className="text-[10px] font-black bg-purple-200/80 text-purple-950 px-2 py-0.5 rounded-full border border-purple-300">
            O‘tish: 80%+ talab
          </span>
        </div>
      )}

      {isMasteryTest && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-amber-900 my-1">
          <span className="font-bold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Mavzu O‘zlashtirish Testi</span>
          </span>
          <span className="text-[10px] font-black bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
            O‘tish: 85%+ talab
          </span>
        </div>
      )}

      {isMistakesPracticeTest && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-rose-900 my-1">
          <span className="font-bold flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Xatolar ustida ishlash testi</span>
          </span>
          <span className="text-[10px] font-black bg-rose-200/80 text-rose-950 px-2 py-0.5 rounded-full">
            Takrorlash rejimi
          </span>
        </div>
      )}

      {isWeakWordsTest && !isMistakesPracticeTest && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-rose-800 my-1">
          <span className="font-bold flex items-center gap-1.5">
            <span>🎯</span>
            <span>Kuchsiz tomonlar ustida adaptiv test</span>
          </span>
          <span className="text-[10px] font-black bg-rose-200/60 text-rose-900 px-1.5 py-0.5 rounded">
            +20 XP
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden my-3">
        <div
          className="h-full bg-linear-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Body */}
      <div className="my-auto max-w-sm mx-auto w-full">
        {/* MODE 1: MCQ (60% of test) */}
        {questionType === 'mcq' && (
          <div>
            {/* Question Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                Tarjimani tanlash (60%)
              </span>

              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-3xl font-display font-extrabold text-stone-900 tracking-tight">
                  {currentWord.english}
                </h2>
                <button
                  type="button"
                  onClick={() => speakWord(currentWord.english)}
                  className="p-1.5 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Talaffuzni tinglash"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {currentWord.transcription && (
                <p className="text-xs font-mono text-stone-400 mb-2">
                  {currentWord.transcription}
                </p>
              )}

              <p className="text-xs text-stone-500 mt-1">
                Ushbu so‘zning to‘g‘ri o‘zbekcha ma’nosi qaysi?
              </p>
            </div>

            {/* MCQ Options (Uzbek translations) */}
            <div className="space-y-2.5">
              {mcqOptions.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = opt.id === currentWord.id;

                let style = 'bg-white border-stone-200 text-stone-800 hover:border-indigo-300';
                if (isAnswerChecked) {
                  if (isCorrect) {
                    style = 'bg-emerald-600 border-emerald-600 text-white shadow-xs';
                  } else if (isSelected) {
                    style = 'bg-rose-600 border-rose-600 text-white';
                  } else {
                    style = 'bg-white/50 border-stone-200 text-stone-400';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isAnswerChecked}
                    onClick={() => handleMcqSelect(idx)}
                    className={`w-full p-3.5 rounded-2xl border font-semibold text-xs sm:text-sm text-left flex items-center justify-between transition-all active:scale-[0.99] shadow-2xs cursor-pointer ${style}`}
                  >
                    <span>{opt.uzbek}</span>
                    {isAnswerChecked && isCorrect && <Check className="w-4 h-4 stroke-[3]" />}
                    {isAnswerChecked && isSelected && !isCorrect && (
                      <X className="w-4 h-4 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: LISTENING (20% of test) */}
        {questionType === 'listening' && (
          <div>
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
                <Headphones className="w-3 h-3" />
                <span>Eshitish qobiliyati (20%)</span>
              </span>

              {/* Large Animated Audio Speaker Button */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => speakWord(currentWord.english)}
                  className="w-18 h-18 mx-auto rounded-3xl bg-linear-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-purple-500/25 transition-all cursor-pointer group"
                >
                  <Volume2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider text-purple-100">
                    Tinglash
                  </span>
                </button>
              </div>

              {isAnswerChecked ? (
                <div className="mt-3 animate-in fade-in">
                  <h3 className="text-2xl font-black text-stone-900">
                    {currentWord.english}
                  </h3>
                  <p className="text-xs font-mono text-stone-400 mt-0.5">
                    {currentWord.transcription}
                  </p>
                  <p className="text-xs font-bold text-emerald-700 mt-1">
                    {currentWord.uzbek}
                  </p>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="text-xl font-bold tracking-widest text-stone-400">
                    • • • • •
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Talaffuz qilingan inglizcha so‘zni tanlang:
                  </p>
                </div>
              )}
            </div>

            {/* Listening Options (English words) */}
            <div className="space-y-2.5">
              {mcqOptions.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = opt.id === currentWord.id;

                let style = 'bg-white border-stone-200 text-stone-800 hover:border-purple-300';
                if (isAnswerChecked) {
                  if (isCorrect) {
                    style = 'bg-emerald-600 border-emerald-600 text-white shadow-xs';
                  } else if (isSelected) {
                    style = 'bg-rose-600 border-rose-600 text-white';
                  } else {
                    style = 'bg-white/50 border-stone-200 text-stone-400';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isAnswerChecked}
                    onClick={() => handleMcqSelect(idx)}
                    className={`w-full p-3.5 rounded-2xl border font-semibold text-xs sm:text-sm text-left flex items-center justify-between transition-all active:scale-[0.99] shadow-2xs cursor-pointer ${style}`}
                  >
                    <div>
                      <span className="font-bold">{opt.english}</span>
                      {isAnswerChecked && (
                        <span className="text-xs ml-2 opacity-90">({opt.uzbek})</span>
                      )}
                    </div>
                    {isAnswerChecked && isCorrect && <Check className="w-4 h-4 stroke-[3]" />}
                    {isAnswerChecked && isSelected && !isCorrect && (
                      <X className="w-4 h-4 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: WRITE / SPELLING (20% of test) */}
        {questionType === 'write' && (
          <form onSubmit={handleWriteSubmit} className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <PenTool className="w-3 h-3" />
                <span>Yozma imlo / Spelling (20%)</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-3 mb-1">
                {currentWord.uzbek}
              </h2>

              <div className="flex items-center justify-center gap-1.5 my-2">
                <button
                  type="button"
                  onClick={() => speakWord(currentWord.english)}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Talaffuzni eshitish</span>
                </button>
              </div>

              <p className="text-xs text-stone-500 mt-1 mb-4">
                Ushbu so‘zning to‘g‘ri inglizcha yozilishini kiriting:
              </p>

              <input
                type="text"
                autoFocus
                disabled={isAnswerChecked}
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                placeholder="Inglizcha so‘zni yozing..."
                className={`w-full text-center font-bold text-base border rounded-2xl p-3.5 focus:outline-hidden transition-all ${
                  isAnswerChecked
                    ? writtenAnswer.trim().toLowerCase().replace(/[.,!?'"-]/g, '') ===
                      currentWord.english.trim().toLowerCase().replace(/[.,!?'"-]/g, '')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-stone-300 bg-white text-stone-900 focus:border-indigo-500'
                }`}
              />

              {isAnswerChecked && (
                <div className="mt-3 text-xs font-semibold">
                  To‘g‘ri javob:{' '}
                  <span className="font-bold text-emerald-700 text-sm">
                    {currentWord.english}
                  </span>
                  {currentWord.transcription && (
                    <span className="font-mono text-stone-400 ml-1">
                      {currentWord.transcription}
                    </span>
                  )}
                </div>
              )}
            </div>

            {!isAnswerChecked && (
              <button
                type="submit"
                disabled={!writtenAnswer.trim()}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Tekshirish</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </form>
        )}
      </div>

      {/* Next Question / Finish CTA button */}
      <div className="pt-2">
        {isAnswerChecked ? (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors animate-in zoom-in-95 cursor-pointer"
          >
            <span>
              {currentIndex + 1 === testWords.length ? 'Natijalarni ko‘rish' : 'Keyingi savol'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="h-12" />
        )}
      </div>
    </div>
  );
};
