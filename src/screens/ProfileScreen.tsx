import React, { useState } from 'react';
import {
  Trophy,
  Star,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Settings as SettingsIcon,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
  Crown,
  Share2,
  RefreshCw,
  Shield,
  HelpCircle,
  Printer,
  Headphones,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { getLeagueProgress } from '../utils/league';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    rankings,
    toggleRankFreeze,
    unfreezeRankingViaTest,
    claimDailyStars,
    setCurrentScreen,
    logout,
    reminders,
    userLeague,
    leagueMeta,
    userWeeklyRank,
    pastErrors,
    isOnline,
    isSyncing,
    syncOfflineData,
  } = useApp();

  const leagueProgress = getLeagueProgress(user.xp ?? 980);

  const [rankingTab, setRankingTab] = useState<'global' | 'weekly'>('global');
  const [claimedNotice, setClaimedNotice] = useState(false);

  const handleClaimStars = () => {
    claimDailyStars();
    setClaimedNotice(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    setTimeout(() => setClaimedNotice(false), 3000);
  };

  const handleUnfreezeTest = () => {
    unfreezeRankingViaTest();
    try {
      confetti({ particleCount: 80, spread: 70 });
    } catch {}
  };

  return (
    <div id="profile-screen" className="flex-1 flex flex-col p-4 sm:p-6 space-y-5 overflow-y-auto pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
            Profil va Reyting
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Shaxsiy statistika va o‘quvchilar chempionati
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('settings')}
          className="p-2.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200/80 cursor-pointer"
          title="Sozlamalar"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-display font-black text-2xl shadow-xs border border-indigo-200/70 shrink-0">
            {user.avatar || user.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-bold text-stone-900 truncate">
                {user.name}
              </h2>
              {user.isPremium && (
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-stone-500 truncate mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                Daraja: {user.level} → {user.targetLevel}
              </span>
              <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                Yosh: {user.age} yosh
              </span>
            </div>
          </div>
        </div>

        {/* 4 User Metric Badges */}
        <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-stone-100 text-center">
          <div className="p-2 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[9px] text-stone-500 font-semibold block">So‘zlar</span>
            <span className="text-xs font-bold text-stone-900 font-display mt-0.5 block">
              {user.wordsLearned} ta
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200/60">
            <span className="text-[9px] text-amber-800 font-semibold block">Streak</span>
            <span className="text-xs font-bold text-amber-900 font-display flex items-center justify-center gap-0.5 mt-0.5">
              🔥 {user.streak}
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-indigo-50 border border-indigo-200/60">
            <span className="text-[9px] text-indigo-800 font-semibold block">Liga</span>
            <span className="text-xs font-bold text-indigo-950 font-display mt-0.5 block flex items-center justify-center gap-0.5">
              <span>{leagueMeta.icon}</span>
              <span className="capitalize">{userLeague}</span>
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-emerald-50 border border-emerald-200/60">
            <span className="text-[9px] text-emerald-800 font-semibold block">Haftalik</span>
            <span className="text-xs font-bold text-emerald-950 font-display mt-0.5 block">
              {user.weeklyXp ?? 520} XP
            </span>
          </div>
        </div>
      </div>

      {/* Gamification: League & Weekly Leaderboard Status Card */}
      <div className={`rounded-3xl p-5 border text-white bg-linear-to-r ${leagueMeta.gradient} shadow-md relative overflow-hidden`}>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-shadow-xs">{leagueMeta.icon}</span>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-white/80 block">
                  Amaldagi Ligangiz
                </span>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {leagueMeta.name}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-white/80 block">
                Haftalik o‘rin
              </span>
              <span className="text-lg font-black font-display text-white">
                #{userWeeklyRank}
              </span>
            </div>
          </div>

          {/* XP details & League progress */}
          <div className="bg-black/20 rounded-2xl p-3.5 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white/90">Umumiy tajriba:</span>
              <span className="font-black text-amber-300 font-display text-sm">
                {user.xp ?? 980} XP
              </span>
            </div>

            {leagueProgress.nextLeague ? (
              <div>
                <div className="flex items-center justify-between text-[11px] text-white/80 mb-1">
                  <span>{leagueProgress.nextLeague.name} sari</span>
                  <span>{leagueProgress.remainingXp} XP qoldi</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${leagueProgress.percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-amber-200 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Siz oliy Gold ligasidasiz!</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentScreen('leaderboard')}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-stone-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-stone-50 transition-all shadow-xs cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Haftalik Top-10 Reyting jadvali</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-stone-400" />
          </button>
        </div>
      </div>

      {/* Smart Weakness Practice Shortcut */}
      <div
        onClick={() => setCurrentScreen('weak_words')}
        className="bg-white rounded-3xl p-4 border border-stone-200/80 hover:border-rose-300 transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/70 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-rose-600 transition-colors">
                Mening xatolarim
              </h3>
              <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-rose-100 text-rose-700">
                {pastErrors.length} ta so‘z
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Test va mashqlarda qilingan xatolar ustida adaptiv ishlash (+20 XP)
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-rose-600 group-hover:text-white text-stone-400 flex items-center justify-center transition-colors shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Offline Sync Status & Manual Trigger */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isOnline ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900">
                {isOnline ? 'Onlayn (IndexedDB sinxron)' : 'Oflayn rejim faol'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-stone-500">
              Lug‘at va progress ma’lumotlari internetsiz ham ishlaydi
            </p>
          </div>
        </div>

        <button
          onClick={() => syncOfflineData()}
          disabled={isSyncing}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
          <span>{isSyncing ? 'Sinxronlanmoqda...' : 'Sinxronlash'}</span>
        </button>
      </div>

      {/* Daily Login Reward & Stars Card */}
      <div className="bg-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-indigo-900 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Kunlik kirish mukofoti
            </span>
          </div>
          <span className="text-xs font-bold text-amber-300">
            {user.stars} / 200 yulduz
          </span>
        </div>

        <p className="text-xs text-indigo-200/90 mb-4 leading-relaxed relative z-10">
          Har kuni kirganingizda +5 yulduz beriladi. 200 yulduz to‘plab, 1 oylik bepul Premium obunani faollashtiring!
        </p>

        {/* Progress bar to 200 stars */}
        <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden mb-4 relative z-10">
          <div
            className="h-full bg-linear-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (user.stars / 200) * 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={handleClaimStars}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white text-indigo-950 text-xs font-bold hover:bg-stone-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Bugungi +5 yulduzni olish</span>
          </button>

          {user.stars >= 200 && (
            <button
              onClick={() => setCurrentScreen('premium')}
              className="py-2.5 px-4 rounded-xl bg-amber-400 text-stone-950 text-xs font-bold hover:bg-amber-300 transition-all shadow-xs cursor-pointer"
            >
              Premium ochish
            </button>
          )}
        </div>

        {claimedNotice && (
          <div className="mt-2 text-center text-xs font-bold text-emerald-300 animate-in fade-in">
            ✓ +5 yulduz hisobingizga qo‘shildi!
          </div>
        )}
      </div>

      {/* RANKING FREEZE RULE SIMULATION SECTION */}
      <div
        className={`rounded-2xl p-4 border transition-all ${
          user.isRankFrozen
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="flex items-start gap-3">
          <ShieldAlert
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              user.isRankFrozen ? 'text-rose-600' : 'text-emerald-600'
            }`}
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm">
                {user.isRankFrozen
                  ? 'Reytingingiz vaqtincha muzlatildi'
                  : 'Reyting holati: Faol'}
              </span>
              <button
                onClick={toggleRankFreeze}
                className="text-[10px] font-bold text-indigo-700 bg-white border border-stone-300 px-2 py-0.5 rounded-md hover:bg-stone-50"
                title="Qoidani sinab ko‘rish uchun simulyatsiya"
              >
                {user.isRankFrozen ? 'Faollashtirish' : 'Muzlatish simulyatsiyasi'}
              </button>
            </div>

            <p className="text-stone-600 text-[11px] leading-relaxed">
              {user.isRankFrozen
                ? 'Foydalanuvchi 1 oydan ortiq takrorlamasa, reytingi avtomatik muzlatiladi. Faollashtirish uchun 1200 ta so‘zlik umumiy testni topshiring.'
                : '1 oy davomida takrorlash qilinmasa, reyting muzlatiladi va boshqa faol o‘rganuvchilarga joy beriladi.'}
            </p>

            {user.isRankFrozen && (
              <button
                onClick={handleUnfreezeTest}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>1200 ta so‘zlik testni topshirib muzdan tushirish</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Leaderboard Table */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-stone-900">Yetakchilar reytingi</h3>
          </div>

          <div className="flex p-0.5 bg-stone-100 rounded-lg">
            <button
              onClick={() => setRankingTab('global')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                rankingTab === 'global' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setRankingTab('weekly')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                rankingTab === 'weekly' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400'
              }`}
            >
              Haftalik
            </button>
          </div>
        </div>

        {/* Top 3 & Users Near Current User */}
        <div className="space-y-2">
          {rankings.map((r) => {
            const isMe = r.id === user.id || r.id === 'rank_64' || r.name.includes('(Siz)');

            return (
              <div
                key={r.id}
                className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  isMe
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-2xs'
                    : 'bg-white border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank badge */}
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-display font-bold text-xs ${
                      r.rank === 1
                        ? 'bg-amber-400 text-stone-950 shadow-2xs'
                        : r.rank === 2
                        ? 'bg-slate-300 text-stone-900'
                        : r.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'text-stone-500 bg-stone-100'
                    }`}
                  >
                    {r.rank}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-stone-900">
                        {r.name}
                      </span>
                      {r.isFrozen && (
                        <span className="px-1.5 py-0.2 rounded-md bg-stone-200 text-stone-700 text-[9px] font-bold">
                          ❄️ Muzlatilgan
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Daraja: {r.level} • {r.streak} kunlik streak
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-display font-extrabold text-xs text-stone-900">
                    {r.wordsLearned}
                  </div>
                  <div className="text-[10px] text-stone-400">so‘z</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu / Settings / Admin Links */}
      <div className="bg-white rounded-3xl p-2 border border-stone-200 shadow-xs divide-y divide-stone-100">
        <button
          onClick={() => setCurrentScreen('services')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-stone-900">
              Qo‘shimcha Xizmatlar Markazi (7 ta vosita)
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setCurrentScreen('certificate_test')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-stone-800">
              CEFR Diagnostika & Rasmiy Sertifikat
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setCurrentScreen('export_tools')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-sky-600" />
            <span className="text-xs font-semibold text-stone-800">
              PDF Fleshkarta & Excel/Anki Eksport
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setCurrentScreen('notifications')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                Bildirishnomalar va Eslatmalar
              </span>
              <span className="text-[10px] text-stone-400">
                Push-xabarnomalar va kunlik mashg‘ulot vaqtlari
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {reminders && reminders.filter((r) => r.enabled).length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {reminders.filter((r) => r.enabled).length} faol
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </button>

        <button
          onClick={() => setCurrentScreen('settings')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 text-stone-500" />
            <span className="text-xs font-semibold text-stone-800">
              Ilova sozlamalari
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setCurrentScreen('privacy_policy')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-stone-500" />
            <span className="text-xs font-semibold text-stone-800">
              Maxfiylik siyosati (COPPA / Bolalar himoyasi)
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {user.role === 'admin' && (
          <button
            onClick={() => setCurrentScreen('admin')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900">
                Admin boshqaruv paneli (CMS)
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        )}

        <button
          onClick={logout}
          className="w-full p-3.5 flex items-center justify-between hover:bg-rose-50 rounded-2xl text-left transition-colors text-rose-600"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-semibold">Tizimdan chiqish</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      {/* Verbo School Brand Badge Footer */}
      <div className="pt-4 pb-2 text-center flex flex-col items-center justify-center space-y-2">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-stone-200/90 shadow-2xs bg-white">
          <img src="/logo.png" alt="Verbo School" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-display font-extrabold text-sm text-stone-800 tracking-tight">
            VERBO SCHOOL
          </div>
          <div className="text-[11px] text-stone-400 font-medium">
            Ingliz tili ta’lim tizimi • EST. 2026 • v2.3.0
          </div>
        </div>
      </div>
    </div>
  );
};
