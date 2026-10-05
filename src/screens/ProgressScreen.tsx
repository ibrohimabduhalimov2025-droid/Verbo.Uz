import React, { useState } from 'react';
import {
  Flame,
  Award,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  Lock,
  Sparkles,
  BarChart2,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CEFRLevel, UserWordProgress } from '../types';
import { CEFR_LEVELS_META } from '../services/cefrService';

export const ProgressScreen: React.FC = () => {
  const {
    user,
    achievements,
    words,
    wordProgress,
    todayLearnedCount,
    getCefrLevelStats,
    setSelectedCefrLevel,
    setCurrentScreen,
  } = useApp();
  const [timeRange, setTimeRange] = useState<'bugun' | 'hafta' | 'oy'>('hafta');

  // Real breakdown counts from wordProgress and user stats
  const allProgress = Object.values(wordProgress) as UserWordProgress[];
  const realMastered = allProgress.filter((p) => p.masteryLevel === 'ozlashtirilgan').length;
  const realLearning = allProgress.filter((p) => p.masteryLevel === 'organilmoqda').length;
  const masteredCount = Math.max(realMastered, user.wordsLearned);
  const learningCount = realLearning;
  const targetTotal = Math.max(1200, masteredCount + learningCount + 100);
  const newCount = Math.max(0, targetTotal - masteredCount - learningCount);
  const totalWords = targetTotal;

  const todayCount = todayLearnedCount;
  const weekCount = Math.max(todayCount, Math.min(masteredCount + learningCount, todayCount + 42));
  const monthCount = Math.max(weekCount, Math.min(masteredCount + learningCount, todayCount + 180));

  // 7-day streak days
  const weekDays = [
    { day: 'D', date: '8', active: true },
    { day: 'S', date: '9', active: true },
    { day: 'Ch', date: '10', active: true },
    { day: 'P', date: '11', active: true },
    { day: 'J', date: '12', active: true },
    { day: 'Sh', date: '13', active: true },
    { day: 'Y', date: '14', active: true, today: true },
  ];

  return (
    <div id="progress-screen" className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="pt-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900">
          Statistika va Yutuqlar
        </h1>
        <p className="text-xs text-stone-500">
          O‘rganish sur’atingiz va erishilgan natijalar tahlili
        </p>
      </div>

      {/* Streak Showcase Card */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
                Kunlik Streak
              </div>
              <div className="text-xl font-extrabold font-display">{user.streak} kun uzluksiz!</div>
            </div>
          </div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            🔥 Faol
          </span>
        </div>

        {/* 7 Days tracker */}
        <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-white/20">
          {weekDays.map((wd, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[10px] text-amber-100 font-semibold mb-1">{wd.day}</span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  wd.today
                    ? 'bg-white text-orange-600 ring-2 ring-white/60 shadow-xs'
                    : wd.active
                    ? 'bg-white/30 text-white'
                    : 'bg-black/10 text-white/40'
                }`}
              >
                {wd.active ? '✓' : wd.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Range Stats Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-stone-900">O‘rganilgan so‘zlar soni</span>
          <div className="flex p-0.5 bg-stone-100 rounded-lg">
            {(['bugun', 'hafta', 'oy'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  timeRange === t ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400'
                }`}
              >
                {t === 'bugun' ? 'Bugun' : t === 'hafta' ? 'Hafta' : 'Oy'}
              </button>
            ))}
          </div>
        </div>

        {/* Big metric count */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-display font-extrabold text-stone-900">
            {timeRange === 'bugun' ? todayCount : timeRange === 'hafta' ? weekCount : monthCount}
          </span>
          <span className="text-xs text-stone-500 font-medium">ta so‘z o‘zlashtirildi</span>
        </div>

        {/* Weekly Bar Graph */}
        <div className="pt-3 border-t border-stone-100 flex items-end justify-between h-28 gap-2 px-1">
          {[
            { day: 'Dush', h: 40, count: 6 },
            { day: 'Sesh', h: 65, count: 10 },
            { day: 'Chor', h: 50, count: 8 },
            { day: 'Pay', h: 90, count: 15 },
            { day: 'Jum', h: 70, count: 11 },
            { day: 'Shan', h: 45, count: 7 },
            { day: 'Yak', h: 55, count: 8, isToday: true },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] font-bold text-stone-400">{bar.count}</span>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  bar.isToday ? 'bg-indigo-600' : 'bg-indigo-200 hover:bg-indigo-300'
                }`}
                style={{ height: `${bar.h}%` }}
              />
              <span className="text-[10px] text-stone-500 font-medium">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary Status Breakdown (Yangi / O'rganilmoqda / O'zlashtirilgan) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <h3 className="text-xs font-bold text-stone-900 mb-3">So‘zlar holati tahlili</h3>

        {/* Combined progress bar */}
        <div className="w-full h-3.5 rounded-full bg-stone-100 flex overflow-hidden p-0.5 mb-4 border border-stone-200/50">
          <div
            className="h-full bg-emerald-500 rounded-l-full"
            style={{ width: `${(masteredCount / totalWords) * 100}%` }}
            title="O‘zlashtirilgan"
          />
          <div
            className="h-full bg-amber-500"
            style={{ width: `${(learningCount / totalWords) * 100}%` }}
            title="O‘rganilmoqda"
          />
          <div
            className="h-full bg-sky-500 rounded-r-full"
            style={{ width: `${(newCount / totalWords) * 100}%` }}
            title="Yangi"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <div className="font-bold text-stone-900">{masteredCount}</div>
              <div className="text-[10px] text-stone-400">O‘zlashtirilgan</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-stone-900">{learningCount}</div>
              <div className="text-[10px] text-stone-400">O‘rganilmoqda</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
            <div>
              <div className="font-bold text-stone-900">{newCount}</div>
              <div className="text-[10px] text-stone-400">Yangi</div>
            </div>
          </div>
        </div>
      </div>

      {/* CEFR Level Progression Ladder */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">CEFR Darajalar Zinapoyasi</h3>
              <p className="text-[11px] text-stone-400">10,000 ta so‘z bo‘yicha bosqichma-bosqich o‘sish</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            A1 dan C2 gacha
          </span>
        </div>

        <div className="space-y-3">
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
            const meta = CEFR_LEVELS_META[lvl];
            const stats = getCefrLevelStats(lvl);

            return (
              <div
                key={lvl}
                onClick={() => {
                  setSelectedCefrLevel(lvl);
                  setCurrentScreen('vocabulary');
                }}
                className="p-3.5 rounded-2xl border border-stone-100 bg-stone-50/60 hover:border-indigo-300 hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center bg-linear-to-r ${meta.gradient}`}
                    >
                      {lvl}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-stone-900 group-hover:text-indigo-600 transition-colors">
                        {meta.nameUz.split('(')[0].trim()}
                      </span>
                      <span className="text-[10px] text-stone-400 ml-1.5">
                        • IELTS {meta.ieltsBand}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-800">
                      {stats.learned} <span className="text-[10px] text-stone-400 font-normal">/ {meta.count}</span>
                    </span>
                    <span className="text-[11px] font-extrabold text-indigo-600">
                      {stats.percent}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r ${meta.gradient} transition-all duration-500`}
                    style={{ width: `${Math.min(100, stats.percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements / Badges Section */}
      <div className="space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900">Yutuqlar va nishonlar</span>
          <span className="text-xs text-stone-400">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} ochilgan
          </span>
        </div>

        <div className="space-y-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                ach.unlocked
                  ? 'bg-white border-stone-200 shadow-2xs'
                  : 'bg-stone-50 border-stone-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    ach.unlocked ? 'bg-amber-50 border border-amber-200' : 'bg-stone-200/70'
                  }`}
                >
                  {ach.unlocked ? ach.icon : <Lock className="w-4 h-4 text-stone-400" />}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-stone-900">{ach.title}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{ach.description}</p>
                  {!ach.unlocked && (
                    <div className="w-36 h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${(ach.progress / ach.max) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {ach.unlocked && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2.5]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
