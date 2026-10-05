import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Sparkles,
  Trophy,
  Play,
  KeyRound,
  Check,
  Timer,
  Crown,
  Share2,
  Copy,
  Send,
  UserPlus,
  Radio,
  Flame,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { playChime } from '../utils/srs';

const getDailyMultiplayerUsage = (): number => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem('verbo_multiplayer_daily');
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (parsed.date !== today) return 0;
    return typeof parsed.count === 'number' ? parsed.count : 0;
  } catch {
    return 0;
  }
};

const incrementDailyMultiplayerUsage = (): number => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const current = getDailyMultiplayerUsage();
    const nextCount = current + 1;
    localStorage.setItem('verbo_multiplayer_daily', JSON.stringify({ date: today, count: nextCount }));
    return nextCount;
  } catch {
    return 1;
  }
};

interface PublicRoom {
  pin: string;
  title: string;
  host: string;
  playersCount: number;
  maxPlayers: number;
  level: string;
}

export const MultiplayerScreen: React.FC = () => {
  const { setCurrentScreen, user, openLockedFeatureModal } = useApp();
  const isUserPremium = Boolean(user.premiumStatus || user.isPremium);
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState<number>(() => getDailyMultiplayerUsage());

  const [mode, setMode] = useState<'menu' | 'lobby' | 'game' | 'results'>('menu');
  const [activeMenuTab, setActiveMenuTab] = useState<'join' | 'public_rooms' | 'create'>('public_rooms');
  const [roomPin, setRoomPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);

  const [players, setPlayers] = useState<Array<{ name: string; score: number; isHost?: boolean }>>([]);

  // Active public rooms list
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([
    {
      pin: '849210',
      title: 'IELTS Academic Vocabulary Sprint',
      host: 'Ustoz Jasurbek',
      playersCount: 7,
      maxPlayers: 12,
      level: 'B2 / C1',
    },
    {
      pin: '430192',
      title: 'Kundalik eng ko‘p ishlatiladigan 1000 so‘z',
      host: 'Madinabonu',
      playersCount: 4,
      maxPlayers: 8,
      level: 'A2 / B1',
    },
    {
      pin: '619844',
      title: 'IT & Business English Challenge',
      host: 'Farhod (Senior Dev)',
      playersCount: 5,
      maxPlayers: 10,
      level: 'B2',
    },
    {
      pin: '902183',
      title: 'Beginner So‘zlar Musobaqasi',
      host: 'Gulnoza',
      playersCount: 3,
      maxPlayers: 6,
      level: 'A1',
    },
  ]);

  // Simulated online friends for invitation
  const onlineFriends = [
    { name: 'Madinabonu Rahimova', level: 'B2', status: 'Onlayn' },
    { name: 'Javohir Toshmatov', level: 'B1', status: 'Onlayn' },
    { name: 'Temur Aliyev', level: 'C1', status: 'Onlayn' },
    { name: 'Ziyoda Karimova', level: 'B1', status: 'Onlayn' },
    { name: 'Sardorbek Umarov', level: 'A2', status: 'Onlayn' },
  ];

  // In-game state
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [userScore, setUserScore] = useState(0);

  const quizQuestions = [
    {
      word: 'Hospitality',
      options: ['Mehmondo‘stlik', 'Shifoxona', 'Dushmanlik', 'Sayohat'],
      correctIndex: 0,
    },
    {
      word: 'Cerebellum',
      options: ['Yurak', 'Miyacha', 'Qon tomir', 'Suyak'],
      correctIndex: 1,
    },
    {
      word: 'Scholarship',
      options: ['Maktab binosi', 'Kutubxona', 'Stipendiya / Grant', 'Darslik'],
      correctIndex: 2,
    },
    {
      word: 'Resilient',
      options: ['Chidamli, bosh egmas', 'Zaif', 'Dangasa', 'Qo‘rqoq'],
      correctIndex: 0,
    },
  ];

  // Host creates room
  const handleCreateRoom = () => {
    if (!isUserPremium && dailyGamesPlayed >= 2) {
      openLockedFeatureModal('multiplayer_limit');
      return;
    }
    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomPin(generatedPin);
    setIsHost(true);
    setPlayers([
      { name: user.name || 'Siz (Host)', score: 0, isHost: true },
      { name: 'Madinabonu', score: 0 },
      { name: 'Javohir', score: 0 },
    ]);
    setMode('lobby');
  };

  // Join public room directly
  const handleJoinPublicRoom = (r: PublicRoom) => {
    if (!isUserPremium && dailyGamesPlayed >= 2) {
      openLockedFeatureModal('multiplayer_limit');
      return;
    }
    setRoomPin(r.pin);
    setIsHost(false);
    setPlayers([
      { name: r.host, score: 0, isHost: true },
      { name: user.name || 'Siz', score: 0 },
      { name: 'Sardorbek', score: 0 },
      { name: 'Nodira', score: 0 },
    ]);
    setMode('lobby');
  };

  // Join existing room with PIN
  const handleJoinWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserPremium && dailyGamesPlayed >= 2) {
      openLockedFeatureModal('multiplayer_limit');
      return;
    }
    if (inputPin.length === 6) {
      setRoomPin(inputPin);
      setIsHost(false);
      setPlayers([
        { name: 'O‘qituvchi Aziza', score: 0, isHost: true },
        { name: user.name || 'Siz', score: 0 },
        { name: 'Sardorbek', score: 0 },
      ]);
      setMode('lobby');
    }
  };

  // Copy invitation link
  const handleCopyLink = () => {
    const link = `https://verbo.uz/kahoot?pin=${roomPin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Share via Telegram
  const handleShareTelegram = () => {
    const text = `Verbo.uz da ingliz tili jonli musobaqasiga qo‘shil! Xona PIN kodi: ${roomPin}\nKirish: https://verbo.uz/kahoot?pin=${roomPin}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(`https://verbo.uz/kahoot?pin=${roomPin}`)}&text=${encodeURIComponent(text)}`;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url);
      }
    }
  };

  // Invite online friend
  const handleInviteFriend = (friendName: string) => {
    if (invitedFriends.includes(friendName)) return;
    setInvitedFriends((prev) => [...prev, friendName]);
    // Simulate friend joining after 2 seconds
    setTimeout(() => {
      setPlayers((prev) => [...prev, { name: friendName, score: 0 }]);
      playChime('correct');
    }, 2000);
  };

  // Start game from lobby
  const handleStartGame = () => {
    if (!isUserPremium && dailyGamesPlayed >= 2) {
      openLockedFeatureModal('multiplayer_limit');
      return;
    }
    if (!isUserPremium) {
      const nextCount = incrementDailyMultiplayerUsage();
      setDailyGamesPlayed(nextCount);
    }
    setMode('game');
    setQIndex(0);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setHasAnswered(false);
  };

  // Game timer countdown
  useEffect(() => {
    if (mode !== 'game') return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleQuestionTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, qIndex, hasAnswered]);

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
    setHasAnswered(true);

    const isCorrect = index === quizQuestions[qIndex].correctIndex;
    if (isCorrect) {
      playChime('correct');
      const earned = 100 + timeLeft * 10;
      setUserScore((s) => s + earned);
    } else {
      playChime('wrong');
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  const handleQuestionTimeout = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
      setTimeout(() => {
        goToNextQuestion();
      }, 1500);
    }
  };

  const goToNextQuestion = () => {
    if (qIndex + 1 < quizQuestions.length) {
      setQIndex((q) => q + 1);
      setTimeLeft(10);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setMode('results');
      playChime('win');
      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch {}
    }
  };

  return (
    <div id="multiplayer-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('games')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>O‘yinlar</span>
        </button>
        <span className="text-xs font-bold text-stone-800">Jonli Musobaqa (Kahoot)</span>
        <div className="w-10" />
      </div>

      {/* Screen 1: Menu with Tabs: Active Public Rooms, PIN Join, Create */}
      {mode === 'menu' && (
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full space-y-4">
          <div className="text-center">
            <div className="w-14 h-14 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              Jonli musobaqa xonalari
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Ochiq xonalarga qo‘shiling yoki do‘stlaringiz uchun yangi xona oching
            </p>
          </div>

          {/* Daily limit badge for free users */}
          {!isUserPremium && (
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-black text-xs shrink-0">
                  {Math.max(0, 2 - dailyGamesPlayed)}/2
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-stone-900">
                      Kunlik bepul o‘yinlar: {dailyGamesPlayed}/2 ta
                    </span>
                    {dailyGamesPlayed >= 2 ? (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-300">
                        Limit tugadi
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                        {2 - dailyGamesPlayed} ta qoldi
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Bepul foydalanuvchilar kuniga 2 ta o‘yin o‘ynashi mumkin
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openLockedFeatureModal('multiplayer_limit')}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95 shadow-2xs"
              >
                <Crown className="w-3.5 h-3.5 fill-stone-950" />
                <span>Cheksiz qilish</span>
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 p-1 bg-stone-200/80 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMenuTab('public_rooms')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeMenuTab === 'public_rooms'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Ochiq xonalar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenuTab('join')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeMenuTab === 'join'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>PIN orqali</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenuTab('create')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeMenuTab === 'create'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xona ochish</span>
            </button>
          </div>

          {/* TAB 1: ACTIVE PUBLIC ROOMS */}
          {activeMenuTab === 'public_rooms' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 px-1">
                <span>Hozirda jonli xonalar:</span>
                <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Real vaqtda
                </span>
              </div>

              {publicRooms.map((r) => (
                <div
                  key={r.pin}
                  className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs hover:border-purple-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700">
                        {r.level}
                      </span>
                      <span className="font-mono text-[11px] text-stone-400">
                        #{r.pin}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-stone-900 truncate">
                      {r.title}
                    </h4>
                    <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-3">
                      <span>Host: <b className="text-stone-700">{r.host}</b></span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-stone-400" />
                        {r.playersCount}/{r.maxPlayers} o‘yinchi
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleJoinPublicRoom(r)}
                    className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                  >
                    Qo‘shilish
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: JOIN WITH PIN */}
          {activeMenuTab === 'join' && (
            <form onSubmit={handleJoinWithPin} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>6 xonali xona PIN kodini kiriting</span>
              </div>

              <input
                type="text"
                maxLength={6}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="749201"
                className="w-full text-center tracking-widest text-3xl font-mono font-black py-3 bg-stone-50 border border-stone-300 rounded-2xl focus:outline-hidden focus:border-indigo-500 text-stone-900"
              />

              <button
                type="submit"
                disabled={inputPin.length !== 6}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                Xonaga kirish
              </button>
            </form>
          )}

          {/* TAB 3: CREATE ROOM */}
          {activeMenuTab === 'create' && (
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3 text-center">
              <Crown className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-sm text-stone-900">
                Yangi musobaqa xonasi ochish
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Siz xona yetakchisi (Host) bo‘lasiz. PIN kod va havolani do‘stlaringizga yuborib birga musobaqa qilasiz.
              </p>

              <button
                type="button"
                onClick={handleCreateRoom}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Xonani yaratish va PIN olish</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Screen 2: Lobby with Friend Invitations */}
      {mode === 'lobby' && (
        <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full space-y-4">
          <div className="space-y-3">
            {/* PIN Card */}
            <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-stone-950 text-white rounded-3xl p-5 text-center shadow-md relative overflow-hidden">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Xona PIN kodi:
              </span>
              <div className="text-4xl font-mono font-black tracking-widest my-1.5 text-amber-300">
                {roomPin}
              </div>
              <p className="text-xs text-purple-200">
                Ishtirokchilar ushbu PIN kod orqali qo‘shilishlari mumkin
              </p>

              {/* Share & Invite Buttons */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Nusxalandi!' : 'Havolani nusxalash'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareTelegram}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegramda chaqirish</span>
                </button>
              </div>
            </div>

            {/* Friend Invitation Direct Section */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                  <span>Do‘stlarni chaqirish (Onlayn)</span>
                </span>
                <span className="text-[11px] text-stone-400">1 bosishda taklif</span>
              </div>

              <div className="space-y-1.5">
                {onlineFriends.map((friend) => (
                  <div
                    key={friend.name}
                    className="p-2 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-stone-800">{friend.name}</span>
                      <span className="text-[10px] text-stone-400">({friend.level})</span>
                    </div>

                    <button
                      type="button"
                      disabled={invitedFriends.includes(friend.name)}
                      onClick={() => handleInviteFriend(friend.name)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        invitedFriends.includes(friend.name)
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      {invitedFriends.includes(friend.name) ? 'Chaqirildi ✓' : 'Taklif qilish'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Players in Room */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-stone-800">
                <span>Xonadagi ishtirokchilar ({players.length})</span>
                <span className="text-stone-400">Kutilmoqda...</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {players.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-stone-900 truncate">{p.name}</span>
                    </div>
                    {p.isHost && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md shrink-0">
                        Host
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartGame}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${
              !isUserPremium && dailyGamesPlayed >= 2
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {!isUserPremium && dailyGamesPlayed >= 2 ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Kunlik limit tugadi (2/2) — Premium bilan davom etish</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Musobaqani boshlash ({players.length} o‘yinchi)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Screen 3: Game in Progress */}
      {mode === 'game' && (
        <div className="flex-1 flex flex-col justify-between max-w-sm mx-auto w-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-600">
              Savol {qIndex + 1} / {quizQuestions.length}
            </span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                timeLeft <= 3 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-stone-950'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
            <span className="text-xs font-bold text-indigo-600">{userScore} ball</span>
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center my-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              Inglizcha so‘z
            </span>
            <h2 className="text-3xl font-bold font-display text-stone-900 mt-3 mb-2">
              {quizQuestions[qIndex].word}
            </h2>
            <p className="text-xs text-stone-500">To‘g‘ri o‘zbekcha tarjimasini tanlang:</p>
          </div>

          {/* Options (Kahoot 4 Colored Blocks) */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {quizQuestions[qIndex].options.map((opt, idx) => {
              const colors = [
                'bg-rose-500 hover:bg-rose-600 text-white',
                'bg-sky-500 hover:bg-sky-600 text-white',
                'bg-amber-500 hover:bg-amber-600 text-white',
                'bg-emerald-500 hover:bg-emerald-600 text-white',
              ];

              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === quizQuestions[qIndex].correctIndex;

              let style = colors[idx];
              if (hasAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-[1.02]';
                } else if (isSelected) {
                  style = 'bg-rose-600 text-white opacity-80';
                } else {
                  style = 'bg-stone-200 text-stone-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl font-bold text-sm transition-all text-left flex items-center justify-between min-h-[72px] shadow-sm ${style}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrect && <Check className="w-5 h-5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Screen 4: Results & Leaderboard */}
      {mode === 'results' && (
        <div className="flex-1 flex flex-col justify-between max-w-sm mx-auto w-full text-center">
          <div className="my-auto space-y-4">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-display font-extrabold text-stone-900">
              Musobaqa yakunlandi!
            </h2>
            <p className="text-xs text-stone-500">Sizning yakuniy to‘plagan balingiz:</p>
            <div className="text-4xl font-display font-black text-purple-600">
              {userScore} ball
            </div>

            {/* Leaderboard Podium */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2 mt-4 text-left">
              <span className="text-xs font-bold text-stone-800 block mb-2">
                Peshqadamlar jadvali (Top o‘yinchilar)
              </span>

              {[
                { name: user.name || 'Siz', score: userScore, rank: 1 },
                { name: 'Madinabonu', score: Math.max(0, userScore - 40), rank: 2 },
                { name: 'Javohir', score: Math.max(0, userScore - 90), rank: 3 },
                { name: 'Temur', score: Math.max(0, userScore - 150), rank: 4 },
              ]
                .sort((a, b) => b.score - a.score)
                .map((p, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold ${
                      i === 0
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-center font-black">#{i + 1}</span>
                      <span>{p.name}</span>
                    </div>
                    <span>{p.score} ball</span>
                  </div>
                ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMode('menu')}
            className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Yana o‘ynash
          </button>
        </div>
      )}
    </div>
  );
};
