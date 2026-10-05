import { UserWordProgress, MasteryLevel } from '../types';

export type RatingChoice = 'bilmadim' | 'qiyin' | 'bildim';

export interface SrsResult {
  nextReviewDate: string;
  intervalDays: number;
  consecutiveKnownCount: number;
  masteryLevel: MasteryLevel;
}

/**
 * Calculates new interval and review date based on simplified SM-2 logic
 * as specified in Verbo.uz requirements.
 */
export function calculateSrsNextReview(
  currentProgress?: Partial<UserWordProgress>,
  rating: RatingChoice = 'bildim'
): SrsResult {
  const currentInterval = currentProgress?.intervalDays || 1;
  const currentConsecutive = currentProgress?.consecutiveKnownCount || 0;

  let newInterval = 1;
  let newConsecutive = currentConsecutive;
  let newMastery: MasteryLevel = currentProgress?.masteryLevel || 'organilmoqda';

  if (rating === 'bilmadim') {
    // Repeat after 1 day, reset consecutive counter
    newInterval = 1;
    newConsecutive = 0;
    newMastery = 'organilmoqda';
  } else if (rating === 'qiyin') {
    // Repeat after 3 days
    newInterval = 3;
    newConsecutive = Math.max(1, currentConsecutive);
    newMastery = 'organilmoqda';
  } else if (rating === 'bildim') {
    // Multiply previous interval by 2.5
    newConsecutive = currentConsecutive + 1;
    if (currentInterval <= 1) {
      newInterval = 3;
    } else {
      newInterval = Math.round(currentInterval * 2.5);
    }

    // Cap at 180 days maximum
    if (newInterval > 180) {
      newInterval = 180;
    }

    // 2 consecutive "Bildim" (or interval >= 6 days) makes word "O'zlashtirilgan"
    if (newConsecutive >= 2) {
      newMastery = 'ozlashtirilgan';
    } else {
      newMastery = 'organilmoqda';
    }
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    nextReviewDate: nextDate.toISOString(),
    intervalDays: newInterval,
    consecutiveKnownCount: newConsecutive,
    masteryLevel: newMastery,
  };
}

/**
 * Global audio and speech synthesis state management
 */
let currentAudioElement: HTMLAudioElement | null = null;
let activeSpeechUtterance: SpeechSynthesisUtterance | null = null;
let speechWatchdogTimer: any = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoices = list;
    }
  } catch {}
  return cachedVoices;
}

// Pre-initialize voice cache immediately
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadAvailableVoices();
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      loadAvailableVoices();
    };
  } catch {}
}

export function stopSpeech() {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch {}
    currentAudioElement = null;
  }
  if (speechWatchdogTimer) {
    clearTimeout(speechWatchdogTimer);
    speechWatchdogTimer = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  activeSpeechUtterance = null;
}

/**
 * Select the highest fidelity voice available on the device
 */
function findOptimalVoice(lang: 'en' | 'uz'): { voice: SpeechSynthesisVoice | null; langCode: string } {
  const voices = loadAvailableVoices();

  if (lang === 'uz') {
    // 1. Check for dedicated Uzbek voices
    const uzVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith('uz') || v.name.toLowerCase().includes('uzbek')
    );
    if (uzVoice) return { voice: uzVoice, langCode: uzVoice.lang };

    // 2. Turkish or Azerbaijani phonetics (95%+ identical phonetic reading of Uzbek Latin orthography)
    const trVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('tr') ||
        v.lang.toLowerCase().startsWith('az') ||
        v.name.toLowerCase().includes('turkish')
    );
    if (trVoice) return { voice: trVoice, langCode: trVoice.lang };

    return { voice: null, langCode: 'tr-TR' };
  }

  // English:
  // 1. Natural / Premium / Neural voices (Edge/Chrome/Windows)
  const naturalEn = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith('en') &&
      (v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('online') ||
        v.name.toLowerCase().includes('neural') ||
        v.name.toLowerCase().includes('premium'))
  );
  if (naturalEn) return { voice: naturalEn, langCode: naturalEn.lang };

  // 2. Google US or Google UK English (Chrome / Android)
  const googleEn = voices.find(
    (v) => v.lang.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('google')
  );
  if (googleEn) return { voice: googleEn, langCode: googleEn.lang };

  // 3. Apple iOS / macOS high quality voices
  const appleEn = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith('en') &&
      (v.name.includes('Samantha') ||
        v.name.includes('Daniel') ||
        v.name.includes('Karen') ||
        v.name.includes('Arthur') ||
        v.name.includes('Alex'))
  );
  if (appleEn) return { voice: appleEn, langCode: appleEn.lang };

  // 4. Standard en-US or en-GB
  const standardEn =
    voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US') ||
    voices.find((v) => v.lang.toLowerCase().startsWith('en'));

  if (standardEn) return { voice: standardEn, langCode: standardEn.lang };

  return { voice: null, langCode: 'en-US' };
}

/**
 * Audio fallback for single words when SpeechSynthesis is unavailable or errors
 */
function playAudioFallback(text: string, lang: 'en' | 'uz', onEnd?: () => void) {
  try {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const cleanWord = text.trim().toLowerCase();

    // Dispatch notification event for UI awareness
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('verbo:audio_fallback', {
          detail: { text, lang, isOnline },
        })
      );
    }

    // For single English words while online, attempt online dictionary audio
    if (isOnline && lang === 'en' && !cleanWord.includes(' ') && cleanWord.length < 30) {
      const audioUrl = `https://api.dictionaryapi.dev/media/pronunciations/en/${encodeURIComponent(cleanWord)}-us.mp3`;
      const audio = new Audio(audioUrl);
      currentAudioElement = audio;

      let isFinished = false;
      const finish = () => {
        if (!isFinished) {
          isFinished = true;
          currentAudioElement = null;
          if (onEnd) onEnd();
        }
      };

      audio.onended = finish;
      audio.onerror = () => {
        // Fallback to pleasant subtle chime if audio file not found
        playChime('flip');
        finish();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          playChime('flip');
          finish();
        });
      }

      // 4s timeout fallback
      setTimeout(finish, 4000);
      return;
    }
  } catch {}

  // Last-resort graceful feedback: gentle flip chime so the UI remains interactive
  playChime('flip');
  if (onEnd) onEnd();
}

/**
 * Execute robust speech synthesis with Chrome GC protection, unpause logic, and watchdog timer
 */
function playSynthesizedSpeech(
  text: string,
  lang: 'en' | 'uz',
  onEnd?: () => void,
  rate?: number
) {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }

  // If browser does not support SpeechSynthesis, use graceful fallback
  if (!('speechSynthesis' in window)) {
    playAudioFallback(text, lang, onEnd);
    return;
  }

  stopSpeech();

  try {
    // Unfreeze speech synthesis engine if in paused state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const { voice, langCode } = findOptimalVoice(lang);
    const cleanText = text.trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = langCode;
    utterance.rate = rate && rate > 0 ? rate : lang === 'en' ? 0.92 : 0.95;
    utterance.pitch = 1.0;
    if (voice) {
      utterance.voice = voice;
    }

    let isCompleted = false;
    const handleCompletion = () => {
      if (!isCompleted) {
        isCompleted = true;
        if (speechWatchdogTimer) {
          clearTimeout(speechWatchdogTimer);
          speechWatchdogTimer = null;
        }
        activeSpeechUtterance = null;
        if (onEnd) onEnd();
      }
    };

    utterance.onend = handleCompletion;
    utterance.onerror = (e) => {
      // If speech synthesis encountered a fatal error (not interrupted/canceled)
      if (e && e.error && e.error !== 'interrupted' && e.error !== 'canceled') {
        playAudioFallback(cleanText, lang, handleCompletion);
      } else {
        handleCompletion();
      }
    };

    // Watchdog timer: estimate realistic duration and guarantee callback fires
    // Prevents player from freezing if device audio is muted or browser drops event
    const wordCount = cleanText.split(/\s+/).length;
    const expectedDurationMs = Math.max(
      1500,
      Math.min(14000, wordCount * 650 + 1200)
    );
    speechWatchdogTimer = setTimeout(handleCompletion, expectedDurationMs);

    // Keep global references to prevent Chromium garbage-collecting the utterance mid-playback
    activeSpeechUtterance = utterance;
    (window as any).__verboSpeechUtterance = utterance;

    window.speechSynthesis.speak(utterance);

    // Chrome bugfix: resume immediately to ensure queue doesn't stay suspended
    setTimeout(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 15);
  } catch (err) {
    console.warn('Speech engine fallback triggered:', err);
    activeSpeechUtterance = null;
    playAudioFallback(text, lang, onEnd);
  }
}

/**
 * Native Uzbek Pronunciation
 */
export function speakUzbek(text: string, onEnd?: () => void, rate?: number) {
  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }
  playSynthesizedSpeech(text, 'uz', onEnd, rate);
}

/**
 * Universal speech player: Instant, zero-lag, clear human-like pronunciation
 */
export function speakWord(
  text: string,
  onEnd?: () => void,
  lang?: 'en' | 'uz',
  rate?: number
) {
  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  if (lang === 'uz') {
    speakUzbek(text, onEnd, rate);
    return;
  }

  playSynthesizedSpeech(text, 'en', onEnd, rate);
}

/**
 * Audio chime sound generator using Web Audio API for rewarding interaction feedback
 */
export function playChime(type: 'correct' | 'wrong' | 'flip' | 'win') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(170, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'flip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'win') {
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    }
  } catch {
    // ignore audio context failures
  }
}
