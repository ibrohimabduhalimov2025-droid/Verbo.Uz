import React from 'react';
import {
  Flame,
  Star,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  Gamepad2,
  CheckSquare,
  Volume2,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Mic,
  Headphones,
  Layers,
  Printer,
  MessageSquareQuote,
  GraduationCap,
  Lock,
  Trophy,
  AlertTriangle,
  WifiOff,
  Target,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakWord } from '../utils/srs';
import { CEFRLevel } from '../types';
import { CEFR_LEVELS_META } from '../services/cefrService';

export const HomeScreen: React.FC = () => {
  const {
    user,
    todayLearnedCount,
    dailyGoal,
    wordsDueToday,
    setCurrentScreen,
    setActiveTab,
    setSelectedTopicId,
    selectedCefrLevel,
    setSelectedCefrLevel,
    getCefrLevelStats,
    words,
    openLockedFeatureModal,
    openPlacementTestModal,
    userLeague,
    leagueMeta,
    userWeeklyRank,
    pastErrors,
    isOnline,
  } = useApp();

  const progressPercent = Math.min(100, Math.round((todayLearnedCount / dailyGoal) * 100));

  // Word of the day
  const featuredWord = words[0] || {
    english: 'Accomplish',
    uzbek: 'Bajarmoq, erishmoq',
    transcription: '/əˈkʌmplɪʃ/',
    exampleSentence: 'You can accomplish anything with consistent daily practice.',
  };

  const handleStartReview = () => {
    setSelectedTopicId(null);
    setCurrentScreen('flashcards');
  };

  return (
    <div id="home-screen" className="flex-1 flex flex-col p-4 sm:p-6 space-y-5">
      {/* Top Bar / User Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-stone-200/90 shadow-2xs shrink-0 bg-white">
            <img src="/logo.png" alt="Verbo School" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span>Daraja:</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/70">
                {user.level} → {user.targetLevel}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900 tracking-tight mt-0.5">
              Salom, {user.name} 👋
            </h1>
          </div>
        </div>

        {/* Badges: Streak & Stars for compact mobile screens */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={() => setCurrentScreen('progress')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold">{user.streak}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('premium')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700"
          >
            <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span className="text-xs font-bold">{user.stars}</span>
          </button>
        </div>
      </div>

      {/* Offline Status indicator if offline */}
      {!isOnline && (
        <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-900 text-xs flex items-center justify-between shadow-2xs">
          <span className="flex items-center gap-1.5 font-semibold">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Oflayn rejim: Lug‘at va progress xotirada saqlanmoqda</span>
          </span>
          <span className="text-[10px] font-extrabold bg-amber-200/80 px-2 py-0.5 rounded-md text-amber-950">
            Offline Sync
          </span>
        </div>
      )}

      {/* Gamification: League & Weekly Leaderboard Widget */}
      <div
        onClick={() => setCurrentScreen('leaderboard')}
        className={`rounded-3xl p-4 sm:p-5 border text-white bg-linear-to-r ${leagueMeta.gradient} shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-xs">{leagueMeta.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-white/80">
                  Amaldagi Liga
                </span>
                <span className="px-2 py-0.2 rounded-full bg-white/20 text-[10px] font-bold backdrop-blur-xs">
                  Haftalik Top-10
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{leagueMeta.name}</span>
                <span className="text-xs font-normal text-white/80">• #{userWeeklyRank}-o‘rin</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-sm font-black font-display block text-amber-300">
                {user.weeklyXp ?? 520} XP
              </span>
              <span className="text-[10px] text-white/80">haftalik</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Weakness Practice Shortcut if user has errors */}
      {pastErrors.length > 0 && (() => {
        const isUserPremium = Boolean(user.premiumStatus || user.isPremium);
        return (
          <div
            onClick={() => {
              if (!isUserPremium) {
                openLockedFeatureModal('weak_words');
              } else {
                setCurrentScreen('weak_words');
              }
            }}
            className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs group ${
              !isUserPremium
                ? 'bg-amber-50/70 border-amber-300/80 hover:border-amber-400'
                : 'bg-rose-50 border-rose-200/80 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  !isUserPremium
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {!isUserPremium ? <Lock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-stone-900">Mening xatolarim</span>
                  <span className="text-[10px] font-black bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded-full">
                    {pastErrors.length} ta
                  </span>
                  {!isUserPremium && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-200 text-amber-950">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  {!isUserPremium
                    ? 'Premium orqali xatolar ustida adaptiv mashq qiling (+20 XP)'
                    : 'Xatolar ustida adaptiv test topshiring va +20 XP oling'}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0 ${
                !isUserPremium ? 'text-amber-800' : 'text-rose-600'
              }`}
            >
              <span>{!isUserPremium ? 'Ochish' : 'Mashq qilish'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        );
      })()}

      {/* Ranking Frozen Warning Banner if applicable */}
      {user.isRankFrozen && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block mb-0.5">Reytingingiz vaqtincha muzlatildi</span>
            1 oydan ortiq takrorlamaganingiz sababli reyting muzlatilgan. Faollashtirish uchun 1200 ta so‘zlik diagnostik testni topshiring.
            <button
              onClick={() => setCurrentScreen('profile')}
              className="mt-2 text-xs font-bold text-indigo-700 hover:text-indigo-800 underline block"
            >
              Test orqali muzdan tushirish →
            </button>
          </div>
        </div>
      )}

      {/* Main Goal Progress Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-500 tracking-tight">Bugungi o‘rganish maqsadi</span>
          <span className="text-xs font-extrabold text-stone-900">
            {todayLearnedCount} / {dailyGoal} so‘z ({progressPercent}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2.5 font-medium">
          <span>O‘zlashtirilgan: <strong className="text-stone-800">{user.wordsLearned}</strong> ta so‘z</span>
          <span>Global reyting: <strong className="text-stone-800">#{user.rank}</strong></span>
        </div>
      </div>

      {/* PRIMARY CTA: BUGUNGI TAKRORLASHNI BOSHLASH */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-950 text-white p-5 sm:p-6 border border-indigo-900 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <RotateCcw className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">
                Spaced Repetition (SM-2)
              </span>
              <h2 className="text-lg font-display font-extrabold leading-tight text-white">
                Bugungi takrorlash
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold shadow-xs">
            {wordsDueToday.length} ta so‘z
          </span>
        </div>

        <p className="text-xs text-indigo-200/90 leading-relaxed mb-4">
          Xotiradagi so‘zlarni uzoq muddatli xotiraga o‘tkazish uchun 5 daqiqa takrorlang.
        </p>

        <button
          id="btn-start-daily-review"
          type="button"
          onClick={handleStartReview}
          className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-stone-50 active:scale-[0.99] text-indigo-950 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-indigo-950" />
          <span>Bugungi takrorlashni boshlash</span>
        </button>
      </div>

      {/* 4 Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Yangi so'zlar */}
        <button
          onClick={() => setActiveTab('vocabulary')}
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-300 hover:bg-indigo-50/10 text-left transition-all shadow-xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-blue-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-stone-900">Yangi so‘zlar</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Mavzular & CEFR</div>
        </button>

        {/* Test */}
        <button
          onClick={() => setActiveTab('test')}
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-300 hover:bg-indigo-50/10 text-left transition-all shadow-xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-100">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-stone-900">Test topshirish</div>
          <div className="text-[11px] text-stone-500 mt-0.5">4 ta test rejimi</div>
        </button>

        {/* O'yinlar */}
        <button
          onClick={() => setActiveTab('games')}
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-300 hover:bg-indigo-50/10 text-left transition-all shadow-xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-100">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-stone-900">O‘yinlar</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Audio, Sprint & Match</div>
        </button>

        {/* Multiplayer Quiz */}
        <button
          onClick={() => setCurrentScreen('multiplayer')}
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-300 hover:bg-indigo-50/10 text-left transition-all shadow-xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-purple-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-stone-900">Multiplayer Quiz</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Do‘stlar bilan musobaqa</div>
        </button>
      </div>

      {/* CEFR 10,000 Database Quick Levels Strip */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                CEFR Lug‘at Bazasi (10,000 ta so‘z)
              </h3>
              <p className="text-[10px] text-stone-400">A1 dan C2 gacha tartiblangan rasmiy baza</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('vocabulary');
              setSelectedCefrLevel(null);
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Darajani aniqlash testi (Placement Test) Quick Banner */}
        <div
          onClick={() => openPlacementTestModal()}
          className="p-3.5 rounded-2xl bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xs cursor-pointer hover:shadow-md transition-all flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-amber-300 shrink-0 border border-white/20 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-white">Darajani aniqlash testi</span>
                <span className="text-[9px] font-black bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-md">
                  80%+ o‘tish
                </span>
              </div>
              <p className="text-[11px] text-purple-100 line-clamp-1 mt-0.5">
                O‘z darajangizni tasdiqlang va keyingi mavzularni bir zumda oching!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-purple-950 px-2.5 py-1.5 rounded-xl shrink-0 group-hover:bg-stone-100 transition-colors">
            Test topshirish →
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
            const meta = CEFR_LEVELS_META[lvl];
            const stats = getCefrLevelStats(lvl);
            return (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedCefrLevel(lvl);
                  setActiveTab('vocabulary');
                  setCurrentScreen('vocabulary');
                }}
                className="p-2.5 rounded-2xl border border-stone-100 bg-stone-50/70 hover:border-indigo-400 hover:bg-white transition-all text-center group flex flex-col items-center justify-between"
              >
                <span
                  className={`w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center bg-linear-to-r ${meta.gradient} shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  {lvl}
                </span>
                <span className="font-bold text-[11px] text-stone-900 mt-1.5">
                  {meta.count} ta
                </span>
                <span className="text-[9px] font-semibold text-stone-500 mt-0.5">
                  {stats.percent > 0 ? `${stats.percent}%` : '0%'} tayyor
                </span>
                <div className="w-full bg-stone-200/80 rounded-full h-1 mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(stats.percent > 0 ? 5 : 0, stats.percent))}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Qo'shimcha Xizmatlar Hub Widget */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
              Qo‘shimcha Xizmatlar
            </h3>
          </div>
          <button
            onClick={() => setCurrentScreen('services')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Barchasi (9)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Horizontal Services Carousel / Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setCurrentScreen('pronunciation')}
            className="p-3 rounded-2xl bg-rose-50/60 hover:bg-rose-50 border border-rose-100 text-left transition-all flex items-start gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">AI Talaffuz</div>
              <div className="text-[10px] text-stone-500">Ovozni tekshirish</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('audio_player')}
            className="p-3 rounded-2xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 text-left transition-all flex items-start gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">Audio Pleyer</div>
              <div className="text-[10px] text-stone-500">Hands-free rejim</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('stories')}
            className="p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 text-left transition-all flex items-start gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">Hikoyalar</div>
              <div className="text-[10px] text-stone-500">Kontekstli o‘qish</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (!user.premiumStatus) {
                openLockedFeatureModal('certificate_test');
              } else {
                setCurrentScreen('certificate_test');
              }
            }}
            className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 group relative ${
              !user.premiumStatus
                ? 'bg-amber-50/60 hover:bg-amber-50/90 border-amber-200/80'
                : 'bg-purple-50/60 hover:bg-purple-50 border-purple-100'
            }`}
          >
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${
                  !user.premiumStatus ? 'bg-amber-600' : 'bg-purple-600'
                }`}
              >
                <Award className="w-4 h-4" />
              </div>
              {!user.premiumStatus && (
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center border border-white">
                  <Lock className="w-2 h-2 stroke-[2.5]" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs text-stone-900">Sertifikat</span>
                {!user.premiumStatus && (
                  <span className="text-[8px] font-black px-1 rounded bg-amber-200 text-amber-900">PRO</span>
                )}
              </div>
              <div className="text-[10px] text-stone-500">CEFR diagnostika</div>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Word of the Day */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400">Kunning namunaviy so‘zi</span>
          </div>
          <button
            onClick={() => speakWord(featuredWord.english)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Talaffuzni tinglash"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold font-display tracking-tight text-white">
            {featuredWord.english}
          </span>
          <span className="text-xs text-stone-400 font-mono">
            {featuredWord.transcription}
          </span>
        </div>

        <p className="text-sm font-semibold text-amber-300 mb-2">
          {featuredWord.uzbek}
        </p>

        <p className="text-xs text-stone-300 leading-relaxed italic border-t border-stone-800 pt-2.5">
          "{featuredWord.exampleSentence}"
        </p>
      </div>

      {/* Star Progress to Premium Banner */}
      <div
        onClick={() => setCurrentScreen('premium')}
        className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between cursor-pointer hover:bg-indigo-100/70 transition-colors shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            ⭐
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-950">
              {user.stars} / 200 yulduz to‘plandi
            </div>
            <div className="text-[11px] text-indigo-700 font-medium mt-0.5">
              200 yulduzda Premium bepul faollashadi!
            </div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-indigo-600" />
      </div>
    </div>
  );
};
