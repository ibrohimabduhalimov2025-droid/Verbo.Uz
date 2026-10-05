import { UserLeague, RankingUser, User } from '../types';

export interface LeagueMeta {
  id: UserLeague;
  name: string;
  nameUz: string;
  icon: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  gradient: string;
  minXp: number;
  maxXp: number;
  nextLeagueId: UserLeague | null;
  description: string;
}

export const LEAGUES_CONFIG: Record<UserLeague, LeagueMeta> = {
  bronze: {
    id: 'bronze',
    name: 'Bronze Liga',
    nameUz: 'Bronza Ligasi',
    icon: '🥉',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-300',
    textColor: 'text-amber-900',
    gradient: 'from-amber-700 via-amber-600 to-amber-800',
    minXp: 0,
    maxXp: 499,
    nextLeagueId: 'silver',
    description: 'Boshlang‘ich bosqich: 500 XP to‘plab Silver ligasiga ko‘tariling',
  },
  silver: {
    id: 'silver',
    name: 'Silver Liga',
    nameUz: 'Kumush Ligasi',
    icon: '🥈',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-300',
    textColor: 'text-slate-800',
    gradient: 'from-slate-400 via-slate-500 to-slate-700',
    minXp: 500,
    maxXp: 1499,
    nextLeagueId: 'gold',
    description: 'Faol o‘quvchilar: 1500 XP to‘plab Gold chempionlar ligasiga chiqing',
  },
  gold: {
    id: 'gold',
    name: 'Gold Liga',
    nameUz: 'Oltin Ligasi',
    icon: '🥇',
    badgeBg: 'bg-amber-100',
    badgeBorder: 'border-amber-400',
    textColor: 'text-yellow-950',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    minXp: 1500,
    maxXp: Infinity,
    nextLeagueId: null,
    description: 'Oliy liga: Eng kuchli Top-10 o‘quvchilar chempionati',
  },
};

/**
 * Determine league by total or weekly XP
 */
export function getLeagueByXp(xp: number): LeagueMeta {
  if (xp >= 1500) return LEAGUES_CONFIG.gold;
  if (xp >= 500) return LEAGUES_CONFIG.silver;
  return LEAGUES_CONFIG.bronze;
}

/**
 * Calculate progress percentage towards next league
 */
export function getLeagueProgress(xp: number): {
  currentLeague: LeagueMeta;
  nextLeague: LeagueMeta | null;
  percent: number;
  remainingXp: number;
} {
  const currentLeague = getLeagueByXp(xp);
  if (!currentLeague.nextLeagueId) {
    return {
      currentLeague,
      nextLeague: null,
      percent: 100,
      remainingXp: 0,
    };
  }

  const nextLeague = LEAGUES_CONFIG[currentLeague.nextLeagueId];
  const range = nextLeague.minXp - currentLeague.minXp;
  const currentOffset = Math.max(0, xp - currentLeague.minXp);
  const percent = Math.min(100, Math.round((currentOffset / range) * 100));
  const remainingXp = Math.max(0, nextLeague.minXp - xp);

  return {
    currentLeague,
    nextLeague,
    percent,
    remainingXp,
  };
}

/**
 * Pre-defined weekly top 10 competitors across leagues
 */
export const INITIAL_WEEKLY_LEADERBOARD: RankingUser[] = [
  {
    id: 'w_user_1',
    name: 'Madinabonu Rahimova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 1840,
    rank: 1,
    streak: 42,
    isFrozen: false,
    level: 'B2',
    xp: 2350,
    weeklyXp: 920,
    league: 'gold',
    trend: 'same',
  },
  {
    id: 'w_user_2',
    name: 'Javohir Toshpo‘latov',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 1620,
    rank: 2,
    streak: 35,
    isFrozen: false,
    level: 'B2',
    xp: 1980,
    weeklyXp: 860,
    league: 'gold',
    trend: 'up',
  },
  {
    id: 'w_user_3',
    name: 'Shaxzod Normurodov',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 1450,
    rank: 3,
    streak: 21,
    isFrozen: false,
    level: 'B1',
    xp: 1620,
    weeklyXp: 740,
    league: 'gold',
    trend: 'up',
  },
  {
    id: 'w_user_4',
    name: 'Nilufar Karimova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 980,
    rank: 4,
    streak: 15,
    isFrozen: false,
    level: 'A2',
    xp: 1210,
    weeklyXp: 610,
    league: 'silver',
    trend: 'down',
  },
  {
    id: 'w_user_5',
    name: 'Azizbek Rahmonov',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 901,
    rank: 5,
    streak: 11,
    isFrozen: false,
    level: 'A2',
    xp: 980,
    weeklyXp: 540,
    league: 'silver',
    trend: 'up',
  },
  {
    id: 'w_user_6',
    name: 'Dilnoza Usmonova',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 894,
    rank: 6,
    streak: 9,
    isFrozen: false,
    level: 'A1',
    xp: 870,
    weeklyXp: 490,
    league: 'silver',
    trend: 'same',
  },
  {
    id: 'w_user_7',
    name: 'Bekzod Qodirov',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 810,
    rank: 7,
    streak: 7,
    isFrozen: false,
    level: 'A2',
    xp: 750,
    weeklyXp: 430,
    league: 'silver',
    trend: 'up',
  },
  {
    id: 'w_user_8',
    name: 'Shahlo Mirzayeva',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 720,
    rank: 8,
    streak: 6,
    isFrozen: false,
    level: 'A1',
    xp: 610,
    weeklyXp: 380,
    league: 'silver',
    trend: 'down',
  },
  {
    id: 'w_user_9',
    name: 'Bobur Ismoilov',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 590,
    rank: 9,
    streak: 5,
    isFrozen: false,
    level: 'A1',
    xp: 480,
    weeklyXp: 310,
    league: 'bronze',
    trend: 'same',
  },
  {
    id: 'w_user_10',
    name: 'Zuhra Rustamova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    wordsLearned: 510,
    rank: 10,
    streak: 4,
    isFrozen: false,
    level: 'A1',
    xp: 410,
    weeklyXp: 260,
    league: 'bronze',
    trend: 'up',
  },
];

/**
 * Dynamically sort and integrate user into weekly Top-10 leaderboard
 */
export function buildWeeklyLeaderboard(
  currentUser: User,
  activeLeagueFilter: UserLeague | 'all' = 'all'
): {
  topTen: RankingUser[];
  userRank: number;
  userInTopTen: boolean;
  currentUserEntry: RankingUser;
} {
  const userXp = currentUser.xp ?? (currentUser.wordsLearned * 10 + currentUser.stars * 5);
  const userWeeklyXp = currentUser.weeklyXp ?? 450;
  const userLeague = currentUser.league || getLeagueByXp(userXp).id;

  const currentUserEntry: RankingUser = {
    id: currentUser.id || 'current_user',
    name: `${currentUser.name} (Siz)`,
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    wordsLearned: currentUser.wordsLearned,
    rank: 0,
    streak: currentUser.streak,
    isFrozen: Boolean(currentUser.isRankFrozen),
    level: currentUser.level,
    xp: userXp,
    weeklyXp: userWeeklyXp,
    league: userLeague,
    trend: 'up',
  };

  // Combine other competitors without old duplicate "Siz" entries
  const others = INITIAL_WEEKLY_LEADERBOARD.filter(
    (u) => u.id !== currentUser.id && !u.name.includes('(Siz)')
  );

  // Filter if specific league selected
  let pool = [currentUserEntry, ...others];
  if (activeLeagueFilter !== 'all') {
    pool = pool.filter((u) => u.league === activeLeagueFilter);
  }

  // Sort descending by weekly XP
  pool.sort((a, b) => (b.weeklyXp || 0) - (a.weeklyXp || 0));

  // Assign ranked positions
  const ranked = pool.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const userIndex = ranked.findIndex((r) => r.id === currentUserEntry.id);
  const userRank = userIndex !== -1 ? userIndex + 1 : 11;
  const topTen = ranked.slice(0, 10);
  const userInTopTen = userRank <= 10;

  return {
    topTen,
    userRank,
    userInTopTen,
    currentUserEntry: { ...currentUserEntry, rank: userRank },
  };
}
