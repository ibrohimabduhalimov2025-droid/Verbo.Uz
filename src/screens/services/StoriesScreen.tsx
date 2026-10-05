import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  VolumeX,
  CheckCircle2,
  Plus,
  Sparkles,
  Star,
  Check,
  ChevronRight,
  Filter,
  Flame,
  Languages,
  RotateCcw,
  CheckCheck,
  Headphones,
  Award,
  Layers,
  Search,
  CheckCircle,
  Compass,
  HelpCircle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { speakWord, stopSpeech, playChime } from '../../utils/srs';
import {
  CEFR_TOPIC_STORIES,
  CefrTopicStory,
  StoryWordAnnotation,
  StoryChapter,
} from '../../data/cefrStories';
import { CEFR_LEVELS_META, CEFR_TOPIC_CATEGORIES } from '../../services/cefrService';
import { CEFRLevel } from '../../types';
import { A1InteractiveOnboarding } from '../../components/A1InteractiveOnboarding';

export const StoriesScreen: React.FC = () => {
  const {
    user,
    updateUserProfile,
    setCurrentScreen,
    addNewWord,
    markWordAsMastered,
    markWordAsLearning,
    wordProgress,
  } = useApp();

  // Filters
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(
    (user.level as CEFRLevel) || 'A1'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Active Story & Reader State
  const [selectedStory, setSelectedStory] = useState<CefrTopicStory | null>(null);
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>(1);
  const [showUzbekTranslations, setShowUzbekTranslations] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [playingParagraphIdx, setPlayingParagraphIdx] = useState<number | null>(null);

  // Word inspect modal / sheet
  const [inspectWord, setInspectWord] = useState<StoryWordAnnotation | null>(null);
  const [wordToast, setWordToast] = useState<string | null>(null);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState<boolean>(false);

  // Vocabulary search/filter inside active story
  const [vocabSearchQuery, setVocabSearchQuery] = useState<string>('');

  // Quiz State
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Read Stories Tracker (saved in localStorage for persistence)
  const [completedStoryIds, setCompletedStoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('verbo_completed_stories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Filter stories based on level and category
  const filteredStories = CEFR_TOPIC_STORIES.filter((story) => {
    const matchLevel = story.level === selectedLevel;
    const matchCategory = selectedCategory === 'all' || story.topicCategory === selectedCategory;
    return matchLevel && matchCategory;
  });

  // Count available stories per level
  const storyCountByLevel = CEFR_TOPIC_STORIES.reduce((acc, story) => {
    acc[story.level] = (acc[story.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Unique categories available for the selected level
  const levelCategories = Array.from(
    new Set(
      CEFR_TOPIC_STORIES.filter((s) => s.level === selectedLevel).map(
        (s) => s.topicCategory
      )
    )
  );

  const showToast = (msg: string) => {
    setWordToast(msg);
    setTimeout(() => setWordToast(null), 2500);
  };

  // Determine active paragraphs & vocabulary depending on chapter selection
  const currentChapter: StoryChapter | undefined =
    selectedStory?.chapters && selectedChapterNum !== 'all'
      ? selectedStory.chapters.find((c) => c.num === selectedChapterNum) ||
        selectedStory.chapters[0]
      : undefined;

  const activeParagraphs: string[] = currentChapter
    ? currentChapter.paragraphs
    : selectedStory?.paragraphs || [];

  const activeParagraphsUz: string[] = currentChapter
    ? currentChapter.paragraphsUz
    : selectedStory?.paragraphsUz || [];

  const activeVocabulary: StoryWordAnnotation[] = currentChapter
    ? currentChapter.words
    : selectedStory?.vocabulary || [];

  const activeQuestions = currentChapter
    ? currentChapter.questions
    : selectedStory?.questions || [];

  // Calculate mastery progress for active words
  const masteredCount = activeVocabulary.filter(
    (w) => wordProgress[w.id]?.masteryLevel === 'ozlashtirilgan'
  ).length;
  const learningCount = activeVocabulary.filter(
    (w) => wordProgress[w.id]?.masteryLevel === 'organilmoqda'
  ).length;
  const weighted = masteredCount + learningCount * 0.5;
  let masteredPercent = 0;
  if (activeVocabulary.length > 0 && weighted > 0) {
    const calc = (weighted / activeVocabulary.length) * 100;
    masteredPercent = calc < 1 ? Math.max(0.1, Number(calc.toFixed(1))) : Math.round(calc);
  }

  const handlePlayFullAudio = () => {
    if (!selectedStory) return;
    if (isAudioPlaying) {
      stopSpeech();
      setIsAudioPlaying(false);
      setPlayingParagraphIdx(null);
    } else {
      setIsAudioPlaying(true);
      const fullText = activeParagraphs.join('. ');
      speakWord(fullText, () => {
        setIsAudioPlaying(false);
        setPlayingParagraphIdx(null);
      });
    }
  };

  const handlePlayParagraph = (idx: number, text: string) => {
    stopSpeech();
    setPlayingParagraphIdx(idx);
    setIsAudioPlaying(true);
    speakWord(text, () => {
      setIsAudioPlaying(false);
      setPlayingParagraphIdx(null);
    });
  };

  const handleAddWordToVocabulary = (wordItem: StoryWordAnnotation) => {
    addNewWord({
      english: wordItem.english,
      uzbek: wordItem.uzbek,
      transcription: wordItem.transcription,
      partOfSpeech: wordItem.partOfSpeech,
      level: wordItem.level,
      exampleSentence: `From story "${selectedStory?.title}": ${wordItem.english}`,
      category: selectedStory?.topicCategory || 'Mavzuli Hikoyalar',
    });
    playChime('correct');
    showToast(`"${wordItem.english}" so‘zi shaxsiy lug‘atingizga qo‘shildi!`);
  };

  const handleMarkMastered = (wordItem: StoryWordAnnotation) => {
    markWordAsMastered(wordItem.id);
    playChime('correct');
    showToast(`"${wordItem.english}" so‘zi o‘zlashtirildi deb belgilandi! (+1)`);
  };

  const handleMarkLearning = (wordItem: StoryWordAnnotation) => {
    markWordAsLearning(wordItem.id);
    playChime('flip');
    showToast(`"${wordItem.english}" takrorlashga olindi (O‘rganilmoqda ⏳)`);
  };

  const handleStartQuiz = () => {
    stopSpeech();
    setIsAudioPlaying(false);
    setShowQuiz(true);
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizScore(null);
  };

  const handleSelectQuizAnswer = (optionIdx: number) => {
    if (!selectedStory) return;
    const newAnswers = [...quizAnswers, optionIdx];
    setQuizAnswers(newAnswers);

    if (quizIndex + 1 < activeQuestions.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      let correct = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans === activeQuestions[idx]?.correctIndex) correct++;
      });
      setQuizScore(correct);

      // Mark story as completed
      if (!completedStoryIds.includes(selectedStory.id)) {
        const updated = [...completedStoryIds, selectedStory.id];
        setCompletedStoryIds(updated);
        try {
          localStorage.setItem('verbo_completed_stories', JSON.stringify(updated));
        } catch {}
      }

      if (correct === activeQuestions.length) {
        try {
          confetti({ particleCount: 70, spread: 60 });
        } catch {}
        playChime('win');
        updateUserProfile({ stars: user.stars + 15 });
      } else {
        playChime('correct');
        updateUserProfile({ stars: user.stars + 5 });
      }
    }
  };

  // Helper to render paragraph with highlighted CEFR words
  const renderInteractiveParagraph = (text: string, vocabList: StoryWordAnnotation[]) => {
    const vocabMap = new Map<string, StoryWordAnnotation>();
    vocabList.forEach((v) => {
      vocabMap.set(v.english.toLowerCase().trim(), v);
    });

    const tokens = text.split(/(\s+|[.,!?;:()"])/);

    return tokens.map((token, index) => {
      const clean = token.toLowerCase().replace(/[^a-z]/g, '').trim();
      const matched = vocabMap.get(clean);

      if (matched) {
        const isMastered = wordProgress[matched.id]?.masteryLevel === 'ozlashtirilgan';

        return (
          <button
            key={index}
            type="button"
            onClick={() => setInspectWord(matched)}
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 mx-0.5 rounded-md font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 shadow-2xs border ${
              isMastered
                ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                : 'bg-amber-100/90 text-amber-950 border-amber-300 hover:bg-amber-200'
            }`}
            title={`${matched.uzbek} (Batafsil ko‘rish uchun bosing)`}
          >
            <span>{token}</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                isMastered
                  ? 'bg-emerald-200 text-emerald-800'
                  : 'bg-amber-200 text-amber-800'
              }`}
            >
              {matched.level}
            </span>
          </button>
        );
      }

      return <span key={index}>{token}</span>;
    });
  };

  const filteredVocabList = activeVocabulary.filter((v) => {
    if (!vocabSearchQuery.trim()) return true;
    const q = vocabSearchQuery.toLowerCase().trim();
    return (
      v.english.toLowerCase().includes(q) ||
      v.uzbek.toLowerCase().includes(q) ||
      v.partOfSpeech.toLowerCase().includes(q)
    );
  });

  const fontClass =
    fontSize === 'sm'
      ? 'text-xs sm:text-sm leading-relaxed'
      : fontSize === 'lg'
      ? 'text-base sm:text-lg leading-loose'
      : 'text-sm sm:text-base leading-relaxed';

  return (
    <div id="stories-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            stopSpeech();
            if (selectedStory) {
              setSelectedStory(null);
              setShowQuiz(false);
              setQuizScore(null);
              setIsAudioPlaying(false);
              setPlayingParagraphIdx(null);
            } else {
              setCurrentScreen('services');
            }
          }}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors"
          title="Orqaga"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span className="text-xs sm:text-sm font-bold text-stone-900 truncate max-w-xs">
            {selectedStory ? selectedStory.title : 'Mavzuli CEFR Hikoyalar'}
          </span>
        </div>

        <div className="w-8" />
      </div>

      {/* Toast alert */}
      {wordToast && (
        <div className="fixed top-5 left-4 right-4 z-50 max-w-sm mx-auto p-3 bg-stone-900 text-white rounded-2xl shadow-xl text-xs font-bold text-center border border-stone-700 animate-in slide-in-from-top-2">
          {wordToast}
        </div>
      )}

      {!selectedStory ? (
        /* Stories Selection Dashboard */
        <div className="space-y-4 pb-8">
          {/* Hero Banner */}
          <div className="bg-linear-to-br from-emerald-900 via-stone-900 to-teal-950 text-white p-5 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>100% Lug‘at qamrovi • Barcha so‘zlar hikoya ichida</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOnboardingGuide(true)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Qo‘llanma (Onboarding)</span>
                </button>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Darajangiz: {user.level || 'A1'}
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold font-display text-white mb-1">
              Mavzuli CEFR Hikoyalar
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-xl">
              Lug‘at bazamizdagi har bir mavzuning 100% so‘zlari hikoyalar matniga to‘liq singdirilgan.
              Misol uchun, A1 «Kundalik hayot va muloqot» mavzusining barcha 360 ta so‘zi 10 ta bobda o‘rgatiladi!
            </p>
          </div>

          {/* CEFR Level Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
              <span>CEFR Darajani tanlang:</span>
              <span className="text-[11px] text-emerald-700">
                {storyCountByLevel[selectedLevel] || 0} ta mavzuli hikoya
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
                const count = storyCountByLevel[lvl] || 0;
                const isSelected = selectedLevel === lvl;

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setSelectedCategory('all');
                    }}
                    className={`px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm scale-102'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{lvl}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Chips for Selected Level */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-stone-500 px-1">Mavzuli yo‘nalish:</div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                Barchasi ({filteredStories.length})
              </button>

              {levelCategories.map((catName) => {
                const meta = CEFR_TOPIC_CATEGORIES[catName];
                const isSelected = selectedCategory === catName;

                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{meta?.emoji || '📚'}</span>
                    <span>{catName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stories Cards Grid */}
          <div className="space-y-3">
            {filteredStories.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-medium">Ushbu sohada hikoyalar hozircha mavjud emas.</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100"
                >
                  Barcha mavzularni ko‘rish
                </button>
              </div>
            ) : (
              filteredStories.map((story) => {
                const isCompleted = completedStoryIds.includes(story.id);

                return (
                  <div
                    key={story.id}
                    onClick={() => {
                      stopSpeech();
                      setSelectedStory(story);
                      setSelectedChapterNum(story.chapters ? 1 : 'all');
                      setShowQuiz(false);
                      setQuizIndex(0);
                      setQuizAnswers([]);
                      setQuizScore(null);
                      setIsAudioPlaying(false);
                      setPlayingParagraphIdx(null);
                      setVocabSearchQuery('');
                    }}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        {story.topicEmoji}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-emerald-700 transition-colors">
                            {story.title}
                          </h3>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                            {story.level}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                            100% qamrov
                          </span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              <CheckCheck className="w-3 h-3" />
                              <span>O‘qilgan</span>
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-600 font-medium">
                          {story.titleUz}
                        </div>

                        <p className="text-[11px] text-stone-400 line-clamp-1">
                          {story.summaryUz}
                        </p>

                        <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-stone-500 flex-wrap">
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {story.topicCategory}
                          </span>
                          <span>⏱ {story.duration}</span>
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                            ✨ {story.totalWordsInTopic} ta CEFR so‘z
                          </span>
                          {story.chapters && (
                            <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                              📖 {story.chapters.length} ta bob
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-50 group-hover:bg-emerald-50 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : showQuiz ? (
        /* Reading Comprehension Quiz */
        <div className="space-y-4 pb-8 animate-in fade-in">
          {quizScore !== null ? (
            /* Quiz Results */
            <div className="bg-white rounded-3xl p-6 text-center border border-stone-200 shadow-lg space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
                🏆
              </div>
              <h2 className="text-xl font-bold font-display text-stone-900">
                Hikoyani yakunladingiz!
              </h2>
              <div className="text-3xl font-display font-extrabold text-emerald-600">
                {quizScore} / {activeQuestions.length}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {quizScore === activeQuestions.length
                  ? 'Mukammal natija! Barcha savollarga to‘g‘ri javob berdingiz va +15 yulduz qo‘lga kiritdingiz ⭐'
                  : 'Yaxshi natija! Yangi so‘zlarni kartochkalar orqali takrorlashda davom eting.'}
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuiz(false)}
                  className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
                >
                  Hikoyani qayta o‘qish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStory(null);
                    setShowQuiz(false);
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Boshqa hikoyalarga qaytish
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Questions */
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                <span>
                  Savol {quizIndex + 1} / {activeQuestions.length}
                </span>
                <span className="text-emerald-700">Matnni tushunish tekshiruvi</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {activeQuestions[quizIndex]?.question}
                </h3>

                <div className="space-y-2">
                  {activeQuestions[quizIndex]?.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectQuizAnswer(oIdx)}
                      className="w-full p-3.5 text-left rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs sm:text-sm font-semibold text-stone-800 transition-all cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Reading Mode */
        <div className="space-y-4 pb-12">
          {/* Story Top Info Banner */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xl">{selectedStory.topicEmoji}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedStory.level} • {selectedStory.topicCategory}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                  100% qamrov ({selectedStory.totalWordsInTopic} ta so‘z)
                </span>
              </div>

              {/* Action Buttons: Audio & Translation Switch */}
              <div className="flex items-center gap-1.5">
                {/* Full Audio Play */}
                <button
                  type="button"
                  onClick={handlePlayFullAudio}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isAudioPlaying
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                  }`}
                  title="Matnni ovoz chiqarib eshitish"
                >
                  {isAudioPlaying ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>{isAudioPlaying ? 'To‘xtatish' : 'Tinglash'}</span>
                </button>

                {/* Uzbek translation toggle */}
                <button
                  type="button"
                  onClick={() => setShowUzbekTranslations((prev) => !prev)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    showUzbekTranslations
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  title="O‘zbekcha tarjimasini yoqish / o‘chirish"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>Tarjima</span>
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
                {currentChapter ? `${currentChapter.num}-bob: ${currentChapter.title}` : selectedStory.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {currentChapter ? currentChapter.titleUz : selectedStory.titleUz}
              </p>
            </div>

            {/* Chapter Selector (if multi-chapter story) */}
            {selectedStory.chapters && (
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Boblar bo‘yicha o‘qish (360 ta so‘z):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedChapterNum(selectedChapterNum === 'all' ? 1 : 'all')}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    {selectedChapterNum === 'all' ? 'Boblar ro‘yxatiga qaytish' : 'To‘liq barchasini o‘qish'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {selectedStory.chapters.map((ch) => {
                    const isChSelected = selectedChapterNum === ch.num;
                    return (
                      <button
                        key={ch.num}
                        type="button"
                        onClick={() => setSelectedChapterNum(ch.num)}
                        className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isChSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {ch.num}-bob ({ch.words.length} so‘z)
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Topic Vocabulary Mastery Live Progress Bar */}
            <div className="pt-2 border-t border-stone-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">
                  Mavzu so‘zlarini o‘zlashtirish:
                </span>
                <span className="text-emerald-700 font-mono">
                  {masteredCount} / {activeVocabulary.length} so‘z ({masteredPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${masteredPercent}%` }}
                />
              </div>
            </div>

            {/* Reading Hint & Font Size */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
              <span className="flex items-center gap-1 text-amber-800 font-medium">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Ajratilgan har bir so‘zni bosib, tarjima va talaffuzini ko‘ring
              </span>

              <div className="flex items-center gap-1">
                <span className="text-stone-400">Shrift:</span>
                <button
                  type="button"
                  onClick={() => setFontSize('sm')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    fontSize === 'sm' ? 'bg-stone-900 text-white' : 'bg-stone-100'
                  }`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('md')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    fontSize === 'md' ? 'bg-stone-900 text-white' : 'bg-stone-100'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('lg')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    fontSize === 'lg' ? 'bg-stone-900 text-white' : 'bg-stone-100'
                  }`}
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Story Content Body */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
            {activeParagraphs.map((para, pIdx) => {
              const uzbekPara = activeParagraphsUz[pIdx];
              const isPlayingThis = isAudioPlaying && playingParagraphIdx === pIdx;

              return (
                <div key={pIdx} className="space-y-2 group">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-stone-800 ${fontClass}`}>
                      {renderInteractiveParagraph(para, activeVocabulary)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handlePlayParagraph(pIdx, para)}
                      className={`p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0 ${
                        isPlayingThis ? 'text-indigo-600 bg-indigo-50' : ''
                      }`}
                      title="Ushbu xatboshini eshitish"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Uzbek translation */}
                  {showUzbekTranslations && uzbekPara && (
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100/90 text-xs sm:text-sm text-stone-600 italic">
                      {uzbekPara}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dedicated Section: Hikoyadagi Barcha CEFR lug'atlari */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-stone-900">
                  Ushbu qismdagi CEFR so‘zlari ({activeVocabulary.length} ta)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                100% lug‘at bazasi
              </span>
            </div>

            {/* Quick Search inside story vocabulary */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={vocabSearchQuery}
                onChange={(e) => setVocabSearchQuery(e.target.value)}
                placeholder="Hikoya ichidagi so‘zlardan qidirish..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-500 bg-stone-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredVocabList.map((wItem) => {
                const isMastered = wordProgress[wItem.id]?.masteryLevel === 'ozlashtirilgan';

                return (
                  <div
                    key={wItem.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      isMastered
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-stone-50 hover:bg-stone-100/70 border-stone-200/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-stone-900">
                          {wItem.english}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {wItem.transcription}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakWord(wItem.english)}
                          className="p-1 rounded-md text-stone-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Talaffuz"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs text-emerald-800 font-semibold mt-0.5">
                        {wItem.uzbek}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {wItem.partOfSpeech} • {wItem.level}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isMastered ? (
                        <>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-lg">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>O‘zlashtirildi</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMarkLearning(wItem)}
                            className="p-1 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Bilmadim deb belgilash (Takrorlashga)"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMarkMastered(wItem)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Bilaman deb belgilash"
                          >
                            <Check className="w-3 h-3" />
                            <span>Bilaman (+1)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkLearning(wItem)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white border border-amber-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Bilmadim deb belgilash"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Bilmadim</span>
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddWordToVocabulary(wItem)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Shaxsiy to‘plamga qo‘shish"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Trigger Button */}
          <button
            type="button"
            onClick={handleStartQuiz}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ushbu qism bo‘yicha test topshirish ({activeQuestions.length} savol • +10 ⭐)</span>
          </button>

          {/* Interactive Word Inspection Modal */}
          {inspectWord && (() => {
            const isWordMastered = wordProgress[inspectWord.id]?.masteryLevel === 'ozlashtirilgan';
            // Find contextual example sentence from story paragraphs
            const matchIdx = activeParagraphs.findIndex((p) =>
              new RegExp(`\\b${inspectWord.english}\\b`, 'i').test(p)
            );
            const contextSentenceEn = matchIdx >= 0 ? activeParagraphs[matchIdx] : activeParagraphs[0];
            const contextSentenceUz = matchIdx >= 0 && activeParagraphsUz[matchIdx] ? activeParagraphsUz[matchIdx] : null;

            return (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
                <div className="bg-stone-900 text-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-stone-700 animate-in slide-in-from-bottom-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold font-display text-white">
                          {inspectWord.english}
                        </h4>
                        <button
                          type="button"
                          onClick={() => speakWord(inspectWord.english)}
                          className="p-1.5 rounded-xl bg-stone-800 text-indigo-300 hover:text-white"
                          title="Talaffuzni eshitish"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs font-mono text-stone-400 mt-0.5">
                        {inspectWord.transcription}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectWord(null)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-800/90 border border-stone-700/80 space-y-1.5">
                    <div className="text-xs text-stone-400">O‘zbekcha tarjimasi:</div>
                    <div className="text-base font-bold text-amber-300">
                      {inspectWord.uzbek}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Turkumi: {inspectWord.partOfSpeech} • Darajasi: {inspectWord.level}
                    </div>
                  </div>

                  {/* Contextual Story Example */}
                  {contextSentenceEn && (
                    <div className="p-3 rounded-2xl bg-stone-800/50 border border-stone-700/60 text-xs space-y-1">
                      <div className="text-[10px] uppercase font-bold text-indigo-400">
                        Hikoyadagi namunaviy jumla:
                      </div>
                      <p className="text-stone-200 italic">
                        "{contextSentenceEn}"
                      </p>
                      {contextSentenceUz && (
                        <p className="text-stone-400 text-[11px] pt-0.5 border-t border-stone-700/40">
                          {contextSentenceUz}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleMarkMastered(inspectWord);
                        setInspectWord(null);
                      }}
                      className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isWordMastered
                          ? 'bg-emerald-700/80 text-emerald-200 border border-emerald-500'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Bilaman (+1)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleMarkLearning(inspectWord);
                        setInspectWord(null);
                      }}
                      className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Bilmadim</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleAddWordToVocabulary(inspectWord);
                        setInspectWord(null);
                      }}
                      className="py-2.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Lug‘atga</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Interactive Onboarding Guide Modal */}
      <A1InteractiveOnboarding
        isOpen={showOnboardingGuide}
        onClose={() => setShowOnboardingGuide(false)}
        onStartTesting={() => {
          setShowOnboardingGuide(false);
          if (selectedStory) {
            handleStartQuiz();
          } else if (filteredStories.length > 0) {
            setSelectedStory(filteredStories[0]);
          }
        }}
      />
    </div>
  );
};
