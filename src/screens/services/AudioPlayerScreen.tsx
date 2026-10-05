import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Headphones,
  Sliders,
  ListMusic,
  Sparkles,
  BookOpen,
  Layers,
  Repeat,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakWord, speakUzbek, stopSpeech } from '../../utils/srs';

export const AudioPlayerScreen: React.FC = () => {
  const {
    setCurrentScreen,
    words,
    topics,
    wordsDueToday,
    cefrLevelWords,
    selectedCefrLevel,
    loadCefrWordsForLevel,
    user,
  } = useApp();

  useEffect(() => {
    if (cefrLevelWords.length === 0) {
      loadCefrWordsForLevel(selectedCefrLevel || user.level || 'A1');
    }
  }, [cefrLevelWords.length, selectedCefrLevel, user.level]);

  const [selectedPlaylistType, setSelectedPlaylistType] = useState<'due' | 'all' | 'topic'>('due');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pauseDuration, setPauseDuration] = useState<number>(2); // seconds between speeches
  const [playMode, setPlayMode] = useState<'en_uz_ex' | 'en_uz' | 'en_only'>('en_uz_ex');
  const [phase, setPhase] = useState<'idle' | 'english' | 'pause1' | 'uzbek' | 'pause2' | 'example' | 'next_pause'>('idle');
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Derived list of words
  const playlistWords = React.useMemo(() => {
    const fallbackPool = words.length > 0 ? words : cefrLevelWords;

    if (selectedPlaylistType === 'due') {
      return wordsDueToday.length > 0 ? wordsDueToday : fallbackPool.slice(0, 25);
    }
    if (selectedPlaylistType === 'topic') {
      const filtered = fallbackPool.filter(
        (w) => w.topicId === selectedTopicId || w.category === selectedTopicId
      );
      return filtered.length > 0 ? filtered : fallbackPool.slice(0, 25);
    }
    return fallbackPool.slice(0, 40);
  }, [selectedPlaylistType, selectedTopicId, wordsDueToday, words, cefrLevelWords]);

  // Ensure index remains in bounds
  const safeIndex = playlistWords.length > 0 ? Math.min(currentIndex, playlistWords.length - 1) : 0;
  const currentWord = playlistWords[safeIndex] || words[0];

  const activePlaybackRef = useRef<boolean>(false);
  const timerRef = useRef<any>(null);

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      activePlaybackRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      stopSpeech();
    };
  }, []);

  const clearExistingTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopSpeech();
  };

  // Robust sequence execution using reliable onEnd events
  const runSequence = (index: number) => {
    if (!activePlaybackRef.current) return;
    const targetWord = playlistWords[index];
    if (!targetWord) return;

    clearExistingTimers();

    // Step 1: Speak English
    setPhase('english');
    speakWord(targetWord.english, () => {
      if (!activePlaybackRef.current) return;

      if (playMode === 'en_only') {
        // Just wait pause and move to next
        setPhase('next_pause');
        timerRef.current = setTimeout(() => {
          if (!activePlaybackRef.current) return;
          const next = (index + 1) % playlistWords.length;
          setCurrentIndex(next);
          runSequence(next);
        }, pauseDuration * 1000);
        return;
      }

      // Step 2: Pause before Uzbek
      setPhase('pause1');
      timerRef.current = setTimeout(() => {
        if (!activePlaybackRef.current) return;

        // Step 3: Speak authentic Uzbek translation
        setPhase('uzbek');
        speakUzbek(targetWord.uzbek, () => {
          if (!activePlaybackRef.current) return;

          if (playMode === 'en_uz' || !targetWord.exampleSentence) {
            setPhase('next_pause');
            timerRef.current = setTimeout(() => {
              if (!activePlaybackRef.current) return;
              const next = (index + 1) % playlistWords.length;
              setCurrentIndex(next);
              runSequence(next);
            }, pauseDuration * 1000);
            return;
          }

          // Step 4: Pause before example
          setPhase('pause2');
          timerRef.current = setTimeout(() => {
            if (!activePlaybackRef.current) return;

            // Step 5: Speak English example sentence
            setPhase('example');
            speakWord(targetWord.exampleSentence!, () => {
              if (!activePlaybackRef.current) return;

              // Step 6: Pause and advance to next word
              setPhase('next_pause');
              timerRef.current = setTimeout(() => {
                if (!activePlaybackRef.current) return;
                const next = (index + 1) % playlistWords.length;
                setCurrentIndex(next);
                runSequence(next);
              }, pauseDuration * 1000);
            }, 'en');
          }, 1200);
        });
      }, 800);
    }, 'en');
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      activePlaybackRef.current = false;
      setIsPlaying(false);
      setPhase('idle');
      clearExistingTimers();
    } else {
      activePlaybackRef.current = true;
      setIsPlaying(true);
      runSequence(safeIndex);
    }
  };

  const handleNext = () => {
    clearExistingTimers();
    const next = (safeIndex + 1) % playlistWords.length;
    setCurrentIndex(next);
    if (isPlaying) {
      activePlaybackRef.current = true;
      runSequence(next);
    }
  };

  const handlePrev = () => {
    clearExistingTimers();
    const prev = (safeIndex - 1 + playlistWords.length) % playlistWords.length;
    setCurrentIndex(prev);
    if (isPlaying) {
      activePlaybackRef.current = true;
      runSequence(prev);
    }
  };

  return (
    <div id="audio-player-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-900 text-white overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            activePlaybackRef.current = false;
            clearExistingTimers();
            setCurrentScreen('services');
          }}
          className="p-2 -ml-2 rounded-xl text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <Headphones className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white tracking-wide">Hands-Free Avto-Pleyer</span>
        </div>
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-2 rounded-xl text-stone-400 hover:text-white transition-colors ${
            showPlaylist ? 'bg-indigo-600/30 text-indigo-300' : ''
          }`}
          title="Pleylist"
        >
          <ListMusic className="w-5 h-5" />
        </button>
      </div>

      {/* Playlist Drawer */}
      {showPlaylist ? (
        <div className="flex-1 flex flex-col bg-stone-800/90 rounded-3xl p-4 border border-stone-700/50 space-y-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-white">Pleylistdagi so‘zlar</h3>
            <span className="text-[11px] text-stone-400 font-mono">{playlistWords.length} ta so‘z</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {playlistWords.map((w, idx) => (
              <div
                key={w.id}
                onClick={() => {
                  clearExistingTimers();
                  setCurrentIndex(idx);
                  setShowPlaylist(false);
                  if (isPlaying) {
                    activePlaybackRef.current = true;
                    runSequence(idx);
                  }
                }}
                className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                  safeIndex === idx
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-stone-800/50 text-stone-300 hover:bg-stone-700/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] opacity-60 w-4">{idx + 1}</span>
                  <span>{w.english}</span>
                </div>
                <span className="text-[11px] opacity-75">{w.uzbek}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {/* Playlist Source Selector */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 p-1 bg-stone-800 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setSelectedPlaylistType('due');
                  setCurrentIndex(0);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedPlaylistType === 'due' ? 'bg-indigo-600 text-white' : 'text-stone-400'
                }`}
              >
                Bugungi SRS ({wordsDueToday.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlaylistType('all');
                  setCurrentIndex(0);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedPlaylistType === 'all' ? 'bg-indigo-600 text-white' : 'text-stone-400'
                }`}
              >
                Barcha so‘zlar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlaylistType('topic');
                  setCurrentIndex(0);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedPlaylistType === 'topic' ? 'bg-indigo-600 text-white' : 'text-stone-400'
                }`}
              >
                Mavzu bo‘yicha
              </button>
            </div>

            {selectedPlaylistType === 'topic' && (
              <select
                value={selectedTopicId}
                onChange={(e) => {
                  setSelectedTopicId(e.target.value);
                  setCurrentIndex(0);
                }}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 focus:outline-hidden"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.level})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Animated Player Showcase */}
          <div className="relative my-auto flex flex-col items-center justify-center text-center p-6 bg-linear-to-b from-stone-800/70 to-stone-800/30 rounded-3xl border border-stone-700/60 shadow-xl">
            {/* Audio Waveform Equalizer */}
            <div className="flex items-center gap-1.5 h-8 mb-5">
              {[30, 65, 45, 90, 70, 85, 40, 95, 60, 80, 50].map((bar, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-stone-700'
                  }`}
                  style={{
                    height: isPlaying ? `${bar}%` : '20%',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* Current Phase Badge */}
            <div className="mb-3">
              <span
                className={`text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                  phase === 'english'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : phase === 'uzbek'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : phase === 'example'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                {phase === 'english'
                  ? 'Inglizcha'
                  : phase === 'uzbek'
                  ? 'O‘zbekcha talaffuz'
                  : phase === 'example'
                  ? 'Misol kontekst'
                  : isPlaying
                  ? 'Pauza...'
                  : 'Tayyor'}
              </span>
            </div>

            {/* Current Word */}
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white mb-1">
              {currentWord?.english}
            </h1>

            <div className="text-xs font-mono text-indigo-400 mb-3">
              {currentWord?.transcription}
            </div>

            <p className="text-lg font-bold text-amber-300 mb-3">
              {currentWord?.uzbek}
            </p>

            {currentWord?.exampleSentence && (
              <p className="text-xs text-stone-300 italic max-w-xs leading-relaxed border-t border-stone-700/50 pt-3">
                "{currentWord?.exampleSentence}"
              </p>
            )}

            <div className="text-[11px] font-mono text-stone-500 mt-4">
              {safeIndex + 1} / {playlistWords.length}
            </div>
          </div>

          {/* Settings & Controls */}
          <div className="space-y-3">
            {/* Play Mode & Pause duration */}
            <div className="bg-stone-800/80 p-2.5 rounded-2xl border border-stone-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPlayMode('en_uz_ex')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    playMode === 'en_uz_ex' ? 'bg-indigo-600 text-white' : 'text-stone-400'
                  }`}
                >
                  To‘liq
                </button>
                <button
                  type="button"
                  onClick={() => setPlayMode('en_uz')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    playMode === 'en_uz' ? 'bg-indigo-600 text-white' : 'text-stone-400'
                  }`}
                >
                  EN + UZ
                </button>
                <button
                  type="button"
                  onClick={() => setPlayMode('en_only')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    playMode === 'en_only' ? 'bg-indigo-600 text-white' : 'text-stone-400'
                  }`}
                >
                  Faqat EN
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-stone-400">
                <span className="text-[10px]">Pauza:</span>
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPauseDuration(s)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      pauseDuration === s ? 'bg-stone-600 text-white' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-center gap-6 py-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Oldingi so‘z"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-900/50 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'To‘xtatish' : 'Boshlash'}
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Keyingi so‘z"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
