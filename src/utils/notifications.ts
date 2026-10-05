import { NotificationReminder, ReminderFrequency, ReminderPracticeType } from '../types';

/**
 * Checks whether the browser supports the Notification API.
 */
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Returns current Notification permission state.
 */
export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

/**
 * Requests native browser notification permission.
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Failed to request notification permission:', err);
    return Notification.permission;
  }
};

/**
 * Plays a pleasant, subtle two-tone audio chime using the Web Audio API.
 * Does not require external audio assets and works seamlessly across browsers.
 */
export const playReminderChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: F5 (698.46 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: A5 (880 Hz) - Higher harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (e) {
    console.debug('Audio chime playback omitted:', e);
  }
};

/**
 * Sends a native browser push notification if permission is granted.
 */
export const sendBrowserNotification = (
  title: string,
  options?: NotificationOptions & { playSound?: boolean }
): boolean => {
  if (options?.playSound !== false) {
    playReminderChime();
  }

  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      icon: '/icon.png',
      badge: '/icon.png',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (e) {
    console.warn('Native notification dispatch failed:', e);
    return false;
  }
};

/**
 * Validates whether the given schedule is applicable today based on frequency.
 */
export const isReminderActiveForDay = (frequency: ReminderFrequency, dayOfWeek: number): boolean => {
  // dayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (frequency === 'daily') return true;
  if (frequency === 'weekdays') {
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }
  if (frequency === 'weekends') {
    return dayOfWeek === 0 || dayOfWeek === 6;
  }
  return true;
};

/**
 * Calculates minutes until next reminder.
 */
export const getTimeUntilReminder = (reminderTime: string): { hours: number; minutes: number; text: string } => {
  const [targetH, targetM] = reminderTime.split(':').map(Number);
  const now = new Date();
  const currentH = now.getHours();
  const currentM = now.getMinutes();

  let targetDate = new Date();
  targetDate.setHours(targetH, targetM, 0, 0);

  if (targetDate.getTime() <= now.getTime()) {
    // Tomorrow
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const diffMs = targetDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  let text = '';
  if (hours > 0 && minutes > 0) {
    text = `${hours} soat ${minutes} daqiqa`;
  } else if (hours > 0) {
    text = `${hours} soat`;
  } else {
    text = `${minutes} daqiqa`;
  }

  return { hours, minutes, text };
};

/**
 * Returns dynamic text tailored to the reminder's practice type and user status.
 */
export const generatePracticeReminderText = (
  practiceType: ReminderPracticeType,
  context?: {
    dueReviewCount?: number;
    dailyGoalRemaining?: number;
    streak?: number;
    randomWord?: string;
  }
): { title: string; body: string } => {
  switch (practiceType) {
    case 'spaced_repetition':
      return {
        title: 'Verbo • So‘zlarni takrorlash vaqti',
        body: context?.dueReviewCount && context.dueReviewCount > 0
          ? `Sizda xotirada mustahkamlanishi kerak bo‘lgan ${context.dueReviewCount} ta so‘z kutmoqda! 🔄`
          : 'Spaced Repetition: 5 daqiqa takrorlash so‘zlarni uzoq muddatli xotiraga muhrlaydi 🧠',
      };
    case 'new_words':
      return {
        title: 'Verbo • Yangi so‘zlar vaqti',
        body: context?.dailyGoalRemaining && context.dailyGoalRemaining > 0
          ? `Bugungi maqsadingizga erishish uchun yana ${context.dailyGoalRemaining} ta yangi so‘z qoldi 🎯`
          : 'Bugungi 5 ta yangi lug‘at so‘zini o‘rganishga tayyormisiz? 📚',
      };
    case 'quick_quiz':
      return {
        title: 'Verbo • Tezkor mini-test',
        body: '3 daqiqalik mini-viktorina orqali bilimlaringizni sinab ko‘ring! ⚡',
      };
    case 'word_of_day':
      return {
        title: 'Verbo • Kun so‘zi',
        body: context?.randomWord
          ? `Bugungi muhim so‘z: "${context.randomWord}". Ma’nosini ko‘rib chiqing! ✨`
          : 'Bugungi maxsus so‘z va uning amaliy misollarini ko‘rib chiqing! ✨',
      };
    case 'streak_saver':
      return {
        title: 'Verbo • Streak saqlash ogohlantirishi 🔥',
        body: context?.streak
          ? `Diqqat: ${context.streak} kunlik seriyangiz uzilib qolmasin! Bugungi 5 ta so‘zni yakunlang!`
          : 'Bugungi o‘quv seriyangizni saqlab qolish uchun darsni yakunlang! 🔥',
      };
    default:
      return {
        title: 'Verbo • Lug‘at mashg‘uloti',
        body: 'Kundalik ingliz tili amaliyoti vaqti keldi! 🌟',
      };
  }
};
