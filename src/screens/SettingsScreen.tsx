import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Sliders,
  Target,
  Globe,
  Moon,
  Trash2,
  Shield,
  Check,
  Smartphone,
  Bell,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakWord } from '../utils/srs';

export const SettingsScreen: React.FC = () => {
  const { setCurrentScreen, dailyGoal, setDailyGoal, user, updateUserProfile, reminders, nextScheduledReminder } = useApp();

  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const handleTestAudio = () => {
    speakWord('Pronunciation speed test');
  };

  const handleGoalChange = (newGoal: number) => {
    setDailyGoal(newGoal);
    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div id="settings-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-stone-700">Sozlamalar</span>
        <div className="w-8" />
      </div>

      {savedNotice && (
        <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in fade-in">
          ✓ Sozlamalar muvaffaqiyatli saqlandi
        </div>
      )}

      <div className="space-y-4 pb-6">
        {/* Audio & Speech */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-stone-900">Talaffuz tezligi</span>
            </div>
            <button
              onClick={handleTestAudio}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              Sinab ko‘rish
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  setSpeechRate(rate);
                  showNotice();
                }}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  speechRate === rate
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {rate === 0.8 ? 'Sekin (0.8x)' : rate === 1.0 ? 'Oddiy (1.0x)' : 'Tez (1.2x)'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-xs text-stone-700">O‘yin tovush effektlari (FX)</span>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEffects ? 'bg-indigo-600' : 'bg-stone-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Daily Goal Words */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-stone-900">Kunlik maqsad (so‘zlar soni)</span>
          </div>
          <p className="text-xs text-stone-500">
            Har kuni o‘rganishni rejalashtirgan yangi so‘zlar miqdori
          </p>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {[10, 15, 20, 25].map((g) => (
              <button
                key={g}
                onClick={() => handleGoalChange(g)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  dailyGoal === g
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {g} ta
              </button>
            ))}
          </div>
        </div>

        {/* Push Notifications & Schedule Reminders */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Eslatmalar va Push-xabarlar</span>
                <span className="text-[11px] text-stone-500">
                  {reminders.filter((r) => r.enabled).length} ta faol eslatma vaqti sozlangan
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('notifications')}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>Sozlash</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextScheduledReminder && (
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-stone-50 border border-stone-100 text-[11px] text-stone-600">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Keyingi eslatma: <strong className="text-stone-900 font-mono">{nextScheduledReminder.reminder.time}</strong> ({nextScheduledReminder.text} qoldi)
              </span>
            </div>
          )}
        </div>

        {/* Language & Interface */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-stone-900">Ilova tili</span>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              O‘zbekcha (Lotin)
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2.5">
              <Moon className="w-5 h-5 text-stone-600" />
              <span className="text-xs font-bold text-stone-900">Tungi rejim (Dark Mode)</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                darkMode ? 'bg-indigo-600' : 'bg-stone-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Reset */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-rose-700 block">Qayta tiklash</span>
          <p className="text-xs text-stone-500">
            Lokal keshni tozalash va standart so‘zlar bazasini qaytarish
          </p>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 mt-1 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Keshni tozalash va qayta ishga tushirish</span>
            </button>
          ) : (
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-2.5 animate-in fade-in">
              <p className="text-xs font-bold text-rose-800 text-center">
                Barcha progress va kesh o‘chirilsinmi?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700"
                >
                  Ha, tozalansin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
