import React from 'react';
import {
  ArrowLeft,
  Trophy,
  Crown,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Shield,
  Clock,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserLeague, RankingUser } from '../types';
import { LEAGUES_CONFIG, getLeagueProgress } from '../utils/league';

export const LeaderboardScreen: React.FC = () => {
  const {
    user,
    setCurrentScreen,
    weeklyLeaderboard,
    userWeeklyRank,
    activeLeagueFilter,
    setActiveLeagueFilter,
    leagueMeta,
    userLeague,
  } = useApp();

  const leagueProgress = getLeagueProgress(user.xp ?? 980);
  const topThree = weeklyLeaderboard.slice(0, 3);
  const restList = weeklyLeaderboard.slice(3, 10);

  const leagueTabs: Array<{ id: UserLeague | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'Barchasi', icon: '🏆' },
    { id: 'gold', label: 'Gold Liga', icon: '🥇' },
    { id: 'silver', label: 'Silver Liga', icon: '🥈' },
    { id: 'bronze', label: 'Bronze Liga', icon: '🥉' },
  ];

  return (
    <div id="leaderboard-screen" className="flex-1 flex flex-col p-4 sm:p-6 space-y-5">
      {/* Top Header */}
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
              <span>Haftalik Top-10</span>
              <span className="text-lg">🏆</span>
            </h1>
            <p className="text-xs text-stone-500">
              XP ballari bo‘yicha ligalararo haftalik reyting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>3 kun qoldi</span>
        </div>
      </div>

      {/* User Current League Banner */}
      <div className={`rounded-3xl p-5 border text-white bg-linear-to-r ${leagueMeta.gradient} shadow-md relative overflow-hidden`}>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{leagueMeta.icon}</span>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-white/80 block">
                  Sizning amaldagi ligangiz
                </span>
                <h3 className="text-base font-extrabold tracking-tight">
                  {leagueMeta.name}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-white/80 block">
                Haftalik o‘rningiz
              </span>
              <span className="text-xl font-black font-display text-white">
                #{userWeeklyRank}
              </span>
            </div>
          </div>

          {/* XP details & League promotion bar */}
          <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white/90">Haftalik to‘plangan XP:</span>
              <span className="font-black text-amber-300 font-display text-sm">
                {user.weeklyXp ?? 520} XP
              </span>
            </div>

            {leagueProgress.nextLeague ? (
              <div>
                <div className="flex items-center justify-between text-[11px] text-white/80 mb-1">
                  <span>{leagueProgress.nextLeague.name} sari</span>
                  <span>{leagueProgress.remainingXp} XP qoldi</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${leagueProgress.percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-amber-200 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Siz eng yuqori Gold ligasidasiz!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* League Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {leagueTabs.map((tab) => {
          const isActive = activeLeagueFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLeagueFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200/90 hover:bg-stone-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Podium for Top 3 */}
      {topThree.length >= 3 && (
        <div className="bg-linear-to-b from-amber-50/70 to-white rounded-3xl p-4 border border-amber-200/60 shadow-xs">
          <div className="flex items-end justify-center gap-2 sm:gap-4 pt-4 pb-2">
            {/* 2nd Place (Silver) */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <div className="relative mb-2">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="%2394a3b8"/><text x="40" y="48" font-size="28" font-family="sans-serif" font-weight="900" fill="white" text-anchor="middle">${encodeURIComponent(topThree[1].name.charAt(0))}</text></svg>`;
                  }}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover ring-3 ring-slate-300 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-800 border-2 border-white flex items-center justify-center font-black text-xs">
                  2
                </span>
              </div>
              <span className="text-[11px] font-bold text-stone-900 truncate w-full text-center">
                {topThree[1].name.split(' ')[0]}
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600">
                {topThree[1].weeklyXp} XP
              </span>
              <div className="w-full h-16 bg-slate-100 rounded-t-xl mt-2 flex items-center justify-center text-slate-400 font-black text-sm border-t border-x border-slate-200">
                🥈
              </div>
            </div>

            {/* 1st Place (Gold) */}
            <div className="flex flex-col items-center flex-1 max-w-[110px] -mt-4">
              <Crown className="w-6 h-6 text-amber-500 mb-1 animate-bounce" />
              <div className="relative mb-2">
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="%23f59e0b"/><text x="40" y="48" font-size="30" font-family="sans-serif" font-weight="900" fill="white" text-anchor="middle">${encodeURIComponent(topThree[0].name.charAt(0))}</text></svg>`;
                  }}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover ring-4 ring-amber-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-yellow-950 border-2 border-white flex items-center justify-center font-black text-xs shadow-xs">
                  1
                </span>
              </div>
              <span className="text-xs font-black text-stone-900 truncate w-full text-center">
                {topThree[0].name.split(' ')[0]}
              </span>
              <span className="text-[11px] font-black text-amber-600 font-display">
                {topThree[0].weeklyXp} XP
              </span>
              <div className="w-full h-22 bg-amber-100/90 rounded-t-xl mt-2 flex items-center justify-center text-amber-700 font-black text-base border-t border-x border-amber-300">
                🥇
              </div>
            </div>

            {/* 3rd Place (Bronze) */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <div className="relative mb-2">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="%23b45309"/><text x="40" y="48" font-size="28" font-family="sans-serif" font-weight="900" fill="white" text-anchor="middle">${encodeURIComponent(topThree[2].name.charAt(0))}</text></svg>`;
                  }}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover ring-3 ring-amber-700/40 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white border-2 border-white flex items-center justify-center font-black text-xs">
                  3
                </span>
              </div>
              <span className="text-[11px] font-bold text-stone-900 truncate w-full text-center">
                {topThree[2].name.split(' ')[0]}
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600">
                {topThree[2].weeklyXp} XP
              </span>
              <div className="w-full h-12 bg-amber-100/60 rounded-t-xl mt-2 flex items-center justify-center text-amber-800 font-black text-sm border-t border-x border-amber-200">
                🥉
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Zone Notice */}
      <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <span className="text-base">🚀</span>
          <span className="font-semibold">
            Top-3 o‘quvchilar haftalik mavsum yakunida keyingi ligaga ko‘tariladi!
          </span>
        </div>
      </div>

      {/* Full Top 10 List */}
      <div className="space-y-2 pb-6">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
          Haftalik Reyting Jadvali (1–10)
        </div>

        {weeklyLeaderboard.map((item) => {
          const isCurrentUser = item.name.includes('(Siz)') || item.id === user.id;
          const leagueInfo = item.league ? LEAGUES_CONFIG[item.league] : LEAGUES_CONFIG.silver;

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-3 transition-all flex items-center justify-between gap-3 border ${
                isCurrentUser
                  ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-stone-200/90 hover:border-stone-300'
              }`}
            >
              {/* Rank & Avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    item.rank === 1
                      ? 'bg-amber-400 text-yellow-950 font-display'
                      : item.rank === 2
                      ? 'bg-slate-200 text-slate-800 font-display'
                      : item.rank === 3
                      ? 'bg-amber-700 text-white font-display'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {item.rank}
                </div>

                <img
                  src={item.avatar}
                  alt={item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="%236366f1"/><text x="40" y="48" font-size="28" font-family="sans-serif" font-weight="900" fill="white" text-anchor="middle">${encodeURIComponent(item.name.charAt(0))}</text></svg>`;
                  }}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-stone-200"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isCurrentUser ? 'text-indigo-950 font-extrabold' : 'text-stone-900'
                      }`}
                    >
                      {item.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[9px] font-black uppercase bg-indigo-600 text-white px-1.5 py-0.2 rounded">
                        Siz
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 font-medium">
                    <span className="flex items-center gap-0.5">
                      <span>{leagueInfo.icon}</span>
                      <span>{leagueInfo.name}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{item.streak} kun</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* XP and trend */}
              <div className="text-right shrink-0 flex items-center gap-2">
                <div>
                  <span className="font-extrabold text-xs text-stone-900 font-display block">
                    {item.weeklyXp || 450} XP
                  </span>
                  <span className="text-[10px] text-stone-400">haftalik</span>
                </div>

                <div className="w-5 flex items-center justify-center">
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  ) : item.trend === 'down' ? (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-stone-300" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
