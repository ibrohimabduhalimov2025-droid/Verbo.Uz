import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, Timer, Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Word } from '../../types';
import { playChime, speakWord } from '../../utils/srs';

interface MatchingTile {
  id: string;
  wordId: string;
  text: string;
  type: 'english' | 'uzbek';
  isMatched: boolean;
}

export const MatchingGame: React.FC = () => {
  const {
    words,
    setCurrentScreen,
    rateWordSRS,
    selectedCefrLevel,
    cefrLevelWords,
    loadCefrWordsForLevel,
    user,
  } = useApp();

  const [tiles, setTiles] = useState<MatchingTile[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<MatchingTile | null>(null);
  const [selectedUzbek, setSelectedUzbek] = useState<MatchingTile | null>(null);
  const [mismatchedPair, setMismatchedPair] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (cefrLevelWords.length === 0) {
      loadCefrWordsForLevel(selectedCefrLevel || user.level || 'A1');
    }
  }, [cefrLevelWords.length, selectedCefrLevel, user.level]);

  // Initialize 5 words for matching round
  const startNewGame = () => {
    const wordPool = cefrLevelWords.length > 0 ? cefrLevelWords : words;
    if (wordPool.length === 0) return;

    const shuffledWords = [...wordPool].sort(() => 0.5 - Math.random()).slice(0, 5);
    const newTiles: MatchingTile[] = [];

    shuffledWords.forEach((w) => {
      newTiles.push({
        id: `en_${w.id}`,
        wordId: w.id,
        text: w.english,
        type: 'english',
        isMatched: false,
      });
      newTiles.push({
        id: `uz_${w.id}`,
        wordId: w.id,
        text: w.uzbek,
        type: 'uzbek',
        isMatched: false,
      });
    });

    // Shuffle tiles
    setTiles(newTiles.sort(() => 0.5 - Math.random()));
    setSelectedEnglish(null);
    setSelectedUzbek(null);
    setMismatchedPair([]);
    setScore(0);
    setCombo(1);
    setMoves(0);
    setSeconds(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    startNewGame();
  }, [words, cefrLevelWords]);

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const handleTileClick = (tile: MatchingTile) => {
    if (tile.isMatched || mismatchedPair.length > 0) return;

    if (tile.type === 'english') {
      speakWord(tile.text);
      if (selectedEnglish?.id === tile.id) {
        setSelectedEnglish(null);
        return;
      }
      setSelectedEnglish(tile);

      if (selectedUzbek) {
        checkMatch(tile, selectedUzbek);
      }
    } else {
      if (selectedUzbek?.id === tile.id) {
        setSelectedUzbek(null);
        return;
      }
      setSelectedUzbek(tile);

      if (selectedEnglish) {
        checkMatch(selectedEnglish, tile);
      }
    }
  };

  const checkMatch = (enTile: MatchingTile, uzTile: MatchingTile) => {
    setMoves((m) => m + 1);

    if (enTile.wordId === uzTile.wordId) {
      // MATCH!
      playChime('correct');
      const earned = 100 * combo;
      setScore((s) => s + earned);
      setCombo((c) => c + 1);

      // Mark as matched
      setTiles((prev) =>
        prev.map((t) => (t.wordId === enTile.wordId ? { ...t, isMatched: true } : t))
      );

      // Rate SRS as bildim
      rateWordSRS(enTile.wordId, 'bildim');

      setSelectedEnglish(null);
      setSelectedUzbek(null);

      // Check if all matched
      setTimeout(() => {
        setTiles((currentTiles) => {
          const allMatched = currentTiles.every((t) => t.isMatched);
          if (allMatched) {
            setIsGameOver(true);
            playChime('win');
            try {
              confetti({ particleCount: 70, spread: 60 });
            } catch {}
          }
          return currentTiles;
        });
      }, 300);
    } else {
      // MISMATCH!
      playChime('wrong');
      setCombo(1);
      setMismatchedPair([enTile.id, uzTile.id]);

      // Rate in SRS as bilmadim
      rateWordSRS(enTile.wordId, 'bilmadim');

      setTimeout(() => {
        setMismatchedPair([]);
        setSelectedEnglish(null);
        setSelectedUzbek(null);
      }, 700);
    }
  };

  if (tiles.length === 0 && !isGameOver) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 space-y-3 min-h-[300px]">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-stone-500">So‘zlar tayyorlanmoqda...</p>
      </div>
    );
  }

  return (
    <div id="matching-game" className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-stone-50 min-h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentScreen('games')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono text-stone-600 bg-stone-200/60 px-2.5 py-1 rounded-lg">
            <Timer className="w-3.5 h-3.5 text-stone-500" />
            <span>
              {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <Flame className="w-3.5 h-3.5" />
            <span>{score} ball</span>
          </div>
        </div>

        <button
          onClick={startNewGame}
          className="p-2 -mr-2 rounded-xl text-stone-500 hover:text-stone-900"
          title="Qaytadan boshlash"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Game status & combo */}
      <div className="flex items-center justify-between text-xs px-1 text-stone-500 my-2">
        <span>Inglizcha va o‘zbekcha juftliklarni toping</span>
        {combo > 1 && (
          <span className="font-bold text-indigo-600 animate-pulse">
            🔥 {combo}x Combo!
          </span>
        )}
      </div>

      {/* Tiles Grid */}
      <div className="flex-1 grid grid-cols-2 gap-2.5 my-auto max-h-[500px]">
        {tiles.map((tile) => {
          const isSelected =
            selectedEnglish?.id === tile.id || selectedUzbek?.id === tile.id;
          const isMismatched = mismatchedPair.includes(tile.id);

          if (tile.isMatched) {
            return (
              <div
                key={tile.id}
                className="h-20 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-700 flex items-center justify-center p-3 text-center opacity-40 transition-all"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
            );
          }

          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              className={`h-20 rounded-2xl p-3 text-center flex items-center justify-center font-bold text-xs sm:text-sm border transition-all active:scale-95 shadow-2xs ${
                isMismatched
                  ? 'bg-rose-100 border-rose-400 text-rose-800 animate-shake'
                  : isSelected
                  ? 'bg-indigo-600 border-indigo-700 text-white shadow-md scale-[1.02]'
                  : tile.type === 'english'
                  ? 'bg-white border-stone-200 text-stone-900 hover:border-indigo-300'
                  : 'bg-stone-50 border-stone-200/90 text-stone-700 hover:border-indigo-300'
              }`}
            >
              <span className="line-clamp-2">{tile.text}</span>
            </button>
          );
        })}
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs border border-stone-200 shadow-2xl text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-1">G‘alaba! 🎉</h3>
            <p className="text-xs text-stone-500 mb-4">
              Barcha so‘zlar muvaffaqiyatli juftlandi!
            </p>

            <div className="bg-stone-50 rounded-xl p-3 mb-4 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Yakuniy ball:</span>
                <span className="font-bold text-indigo-600">{score}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Vaqt:</span>
                <span className="font-bold text-stone-900">{seconds} soniya</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Urinishlar:</span>
                <span className="font-bold text-stone-900">{moves} ta</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={startNewGame}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Keyingi bosqich
              </button>
              <button
                onClick={() => setCurrentScreen('games')}
                className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
              >
                O‘yinlar menyusi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
