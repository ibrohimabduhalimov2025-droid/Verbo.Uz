import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Sparkles, HelpCircle, Check, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Word } from '../../types';
import { playChime, speakWord } from '../../utils/srs';

interface LetterTile {
  id: string;
  char: string;
  isUsed: boolean;
}

export const AnagramGame: React.FC = () => {
  const {
    words,
    setCurrentScreen,
    rateWordSRS,
    selectedCefrLevel,
    cefrLevelWords,
    loadCefrWordsForLevel,
    user,
  } = useApp();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [availableLetters, setAvailableLetters] = useState<LetterTile[]>([]);
  const [placedLetters, setPlacedLetters] = useState<LetterTile[]>([]);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (cefrLevelWords.length === 0) {
      loadCefrWordsForLevel(selectedCefrLevel || user.level || 'A1');
    }
  }, [cefrLevelWords.length, selectedCefrLevel, user.level]);

  // List of words for this game session
  const wordPool = cefrLevelWords.length > 0 ? cefrLevelWords : words;
  const gameWords = useMemo(() => {
    return wordPool.filter((w) => w.english && w.english.length >= 3 && w.english.length <= 12);
  }, [wordPool]);

  const targetWord = gameWords[currentWordIndex] || gameWords[0];

  // Scramble letters when targetWord changes
  useEffect(() => {
    if (!targetWord) return;

    const cleanWord = targetWord.english.toUpperCase().replace(/[^A-Z]/g, '');
    const letterArray: LetterTile[] = cleanWord
      .split('')
      .sort(() => 0.5 - Math.random())
      .map((char, index) => ({
        id: `tile_${char}_${index}_${Date.now()}`,
        char,
        isUsed: false,
      }));

    setAvailableLetters(letterArray);
    setPlacedLetters([]);
    setIsSuccess(false);
    setIsError(false);
  }, [currentWordIndex, targetWord]);

  // Click on available letter tile to place it
  const handleSelectLetter = (tile: LetterTile) => {
    if (tile.isUsed) return;
    playChime('flip');
    setAvailableLetters((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );
    setPlacedLetters((prev) => [...prev, tile]);
    setIsError(false);
  };

  // Click on placed letter to return it back
  const handleRemoveLetter = (index: number) => {
    const tileToRemove = placedLetters[index];
    if (!tileToRemove) return;

    playChime('flip');
    setPlacedLetters((prev) => prev.filter((_, i) => i !== index));
    setAvailableLetters((prev) =>
      prev.map((t) => (t.id === tileToRemove.id ? { ...t, isUsed: false } : t))
    );
    setIsError(false);
  };

  // Clear all placed letters
  const handleClear = () => {
    setPlacedLetters([]);
    setAvailableLetters((prev) => prev.map((t) => ({ ...t, isUsed: false })));
    setIsError(false);
  };

  // Check built word
  const handleCheck = () => {
    const builtWord = placedLetters.map((t) => t.char).join('');
    const correctWord = targetWord.english.toUpperCase().replace(/[^A-Z]/g, '');

    if (builtWord === correctWord) {
      playChime('correct');
      setIsSuccess(true);
      setScore((s) => s + 150);
      rateWordSRS(targetWord.id, 'bildim');
      speakWord(targetWord.english);
      try {
        confetti({ particleCount: 50, spread: 50 });
      } catch {}
    } else {
      playChime('wrong');
      setIsError(true);
      rateWordSRS(targetWord.id, 'bilmadim');
    }
  };

  // Next word
  const handleNextWord = () => {
    if (currentWordIndex + 1 < gameWords.length) {
      setCurrentWordIndex((i) => i + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  if (!targetWord) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 space-y-3 min-h-[300px]">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-stone-500">So‘zlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div id="anagram-game" className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-stone-50 min-h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentScreen('games')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700">
            {currentWordIndex + 1} / {gameWords.length}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{score} ball</span>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 -mr-2 rounded-xl text-stone-500 hover:text-stone-900"
          title="Tozalash"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Word Clue Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center my-auto max-w-sm mx-auto w-full">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          O‘zbekcha ma’nosi
        </span>

        <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-3 mb-1">
          {targetWord.uzbek}
        </h3>

        {targetWord.transcription && (
          <p className="text-xs font-mono text-stone-400 mb-4">{targetWord.transcription}</p>
        )}

        {/* Placed Letter Slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[56px] p-2 bg-stone-100/70 rounded-2xl border border-dashed border-stone-300 mb-6">
          {placedLetters.length === 0 ? (
            <span className="text-xs text-stone-400 font-medium">
              Quyidagi harflarni bosing
            </span>
          ) : (
            placedLetters.map((tile, index) => (
              <button
                key={`${tile.id}_placed_${index}`}
                onClick={() => handleRemoveLetter(index)}
                className={`w-10 h-12 rounded-xl font-display font-black text-lg flex items-center justify-center shadow-xs transition-all animate-in zoom-in-75 ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : isError
                    ? 'bg-rose-500 text-white animate-shake'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {tile.char}
              </button>
            ))
          )}
        </div>

        {/* Success / Error Message Banner */}
        {isSuccess && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <span>To‘g‘ri topildi! +150 ball</span>
            <button
              onClick={() => speakWord(targetWord.english)}
              className="p-1 rounded-md bg-emerald-100 text-emerald-900"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            Xato tartib. Qaytadan urinib ko‘ring!
          </div>
        )}

        {/* Available Letters Pool */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {availableLetters.map((tile) => (
            <button
              key={tile.id}
              disabled={tile.isUsed}
              onClick={() => handleSelectLetter(tile)}
              className={`w-11 h-12 rounded-xl font-display font-extrabold text-base border flex items-center justify-center transition-all ${
                tile.isUsed
                  ? 'opacity-20 border-transparent bg-stone-100 text-transparent pointer-events-none'
                  : 'bg-white border-stone-200 text-stone-900 hover:border-indigo-300 hover:scale-105 shadow-2xs active:scale-95'
              }`}
            >
              {tile.char}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="pt-2">
        {isSuccess ? (
          <button
            onClick={handleNextWord}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <span>Keyingi so‘z</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCheck}
            disabled={placedLetters.length === 0}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Tekshirish</span>
          </button>
        )}
      </div>
    </div>
  );
};
