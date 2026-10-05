import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Clock,
  Flame,
  Send,
  Sparkles,
  Check,
  Smartphone,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Volume2,
  VolumeX,
  AlertTriangle,
  Calendar,
  BookOpen,
  X,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationReminder, ReminderFrequency, ReminderPracticeType } from '../types';

export const NotificationsScreen: React.FC = () => {
  const {
    setCurrentScreen,
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    triggerTestNotification,
    notificationPermission,
    requestPermission,
    soundAlertsEnabled,
    setSoundAlertsEnabled,
    nextScheduledReminder,
  } = useApp();

  const [telegramConnected, setTelegramConnected] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  // Form Fields
  const [formTime, setFormTime] = useState('08:30');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPracticeType, setFormPracticeType] = useState<ReminderPracticeType>('spaced_repetition');
  const [formFrequency, setFormFrequency] = useState<ReminderFrequency>('daily');
  const [formSoundEnabled, setFormSoundEnabled] = useState(true);

  const openAddModal = () => {
    setEditingReminderId(null);
    setFormTime('09:00');
    setFormTitle('Kundalik mashg‘ulot');
    setFormDesc('Spaced Repetition: 5 daqiqa takrorlash so‘zlarni uzoq muddatli xotiraga o‘tkazadi ☀️');
    setFormPracticeType('spaced_repetition');
    setFormFrequency('daily');
    setFormSoundEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (reminder: NotificationReminder) => {
    setEditingReminderId(reminder.id);
    setFormTime(reminder.time);
    setFormTitle(reminder.title);
    setFormDesc(reminder.desc);
    setFormPracticeType(reminder.practiceType);
    setFormFrequency(reminder.frequency);
    setFormSoundEnabled(reminder.soundEnabled !== false);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTime) return;

    let finalTitle = formTitle.trim();
    if (!finalTitle) {
      if (formPracticeType === 'spaced_repetition') finalTitle = 'SRS Takrorlash';
      else if (formPracticeType === 'new_words') finalTitle = 'Yangi so‘zlar';
      else if (formPracticeType === 'quick_quiz') finalTitle = 'Tezkor viktorina';
      else if (formPracticeType === 'word_of_day') finalTitle = 'Kun so‘zi';
      else finalTitle = 'Streak saqlash';
    }

    let finalDesc = formDesc.trim();
    if (!finalDesc) {
      if (formPracticeType === 'spaced_repetition') {
        finalDesc = 'Xotirada susayayotgan so‘zlarni Spaced Repetition orqali mustahkamlang 🔄';
      } else if (formPracticeType === 'new_words') {
        finalDesc = 'Bugungi yangi so‘zlarni o‘rganish va so‘z boyligingizni oshirish vaqti 📚';
      } else if (formPracticeType === 'quick_quiz') {
        finalDesc = '3 daqiqalik mini-test bilan bilimlarni tekshirib oling ⚡';
      } else if (formPracticeType === 'word_of_day') {
        finalDesc = 'Bugungi maxsus so‘z va foydali kontekst iboralarini ko‘rib chiqing ✨';
      } else {
        finalDesc = 'Diqqat: Bugungi seriyangiz uzilib qolishiga oz vaqt qoldi! 🔥';
      }
    }

    if (editingReminderId) {
      updateReminder(editingReminderId, {
        time: formTime,
        title: finalTitle,
        desc: finalDesc,
        practiceType: formPracticeType,
        frequency: formFrequency,
        soundEnabled: formSoundEnabled,
      });
    } else {
      addReminder({
        time: formTime,
        title: finalTitle,
        desc: finalDesc,
        enabled: true,
        practiceType: formPracticeType,
        frequency: formFrequency,
        soundEnabled: formSoundEnabled,
      });
    }

    setIsModalOpen(false);
  };

  const handleTriggerTest = (reminderId?: string) => {
    triggerTestNotification(reminderId);
    setTestNotice('Sinov xabarnomasi yuborildi! (Brauzer push & In-app signal)');
    setTimeout(() => setTestNotice(null), 3500);
  };

  const handleRequestPermission = async () => {
    const perm = await requestPermission();
    if (perm === 'granted') {
      handleTriggerTest();
    }
  };

  const getPracticeTypeBadge = (type: ReminderPracticeType) => {
    switch (type) {
      case 'spaced_repetition':
        return { label: 'SRS Takrorlash', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'new_words':
        return { label: 'Yangi so‘zlar', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'quick_quiz':
        return { label: 'Tezkor Test', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'word_of_day':
        return { label: 'Kun so‘zi', bg: 'bg-violet-50 text-violet-700 border-violet-200' };
      case 'streak_saver':
        return { label: 'Streak saqlash', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Mashg‘ulot', bg: 'bg-stone-50 text-stone-700 border-stone-200' };
    }
  };

  const getFrequencyLabel = (freq: ReminderFrequency) => {
    switch (freq) {
      case 'daily':
        return 'Har kuni';
      case 'weekdays':
        return 'Ish kunlari (Du–Ju)';
      case 'weekends':
        return 'Dam olish (Sha–Yak)';
      default:
        return 'Har kuni';
    }
  };

  return (
    <div id="notifications-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors"
          title="Orqaga"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-xs font-bold text-stone-800">Bildirishnomalar va Eslatmalar</h1>
          <p className="text-[10px] text-stone-500">Kunlik lug‘at mashg‘ulotlari jadvali</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Qo‘shish</span>
        </button>
      </div>

      {/* Simulated Live In-App Notification Toast */}
      {testNotice && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl border border-stone-700 animate-in slide-in-from-top-4 flex items-start gap-3">
          <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1 text-xs">
            <span className="font-bold block text-white">Verbo Bildirishnomasi</span>
            <span className="text-stone-300">{testNotice}</span>
          </div>
          <button
            onClick={() => setTestNotice(null)}
            className="text-stone-400 hover:text-white text-xs p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Push Notification Permission Status Banner */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-50 text-emerald-600'
                  : notificationPermission === 'denied'
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              {notificationPermission === 'granted' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : notificationPermission === 'denied' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-stone-900">Push-xabarnomalar</h2>
                {notificationPermission === 'granted' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Faol ✓
                  </span>
                )}
                {notificationPermission === 'denied' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                    Bloklangan
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {notificationPermission === 'granted'
                  ? 'Brauzer va tizim bildirishnomalari yoqilgan. Belgilangan vaqtlarda bevosita qurilmangizga eslatma yuboriladi.'
                  : notificationPermission === 'denied'
                  ? 'Brauzer sozlamalarida bildirishnomalar taqiqlangan. Eslatmalarni olish uchun URL qatoridagi qulf belgisidan ruxsat bering.'
                  : 'Belgilangan vaqtlarda mobil qurilmangiz yoki brauzeringizga to‘g‘ridan-to‘g‘ri eslatmalar kelishi uchun ruxsat bering.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions for Permission */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
          {notificationPermission !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Qurilmaga ruxsat berish (Push)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <Check className="w-3.5 h-3.5" />
              <span>Tizim xabarnomalari o‘rnatilgan</span>
            </div>
          )}

          <button
            onClick={() => handleTriggerTest()}
            className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sinov eslatmasini yuborish</span>
          </button>
        </div>
      </div>

      {/* Next Scheduled Reminder Status & Chime Audio Setting */}
      <div className="bg-linear-to-br from-indigo-900 to-stone-900 text-white rounded-3xl p-5 shadow-sm mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 block mb-1">
              Rejalashtirilgan eslatma
            </span>
            {nextScheduledReminder ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    {nextScheduledReminder.reminder.time}
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
                    {nextScheduledReminder.text} qoldi
                  </span>
                </div>
                <h3 className="text-xs font-bold text-stone-200 mt-1">
                  {nextScheduledReminder.reminder.title}
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                  {nextScheduledReminder.reminder.desc}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-stone-300">
                  Barcha eslatmalar vaqtincha o‘chirilgan.
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Jadvaldagi istalgan eslatmani faollashtiring yoki yangi vaqt belgilang.
                </p>
              </div>
            )}
          </div>

          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-indigo-300" />
          </div>
        </div>

        {/* Global Sound Alert Toggle */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundAlertsEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
            <span className="text-xs text-stone-300 font-medium">Ovozli audio-signal (Chime)</span>
          </div>

          <button
            onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              soundAlertsEnabled ? 'bg-indigo-500' : 'bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Kunlik reja jadvali ({reminders.filter((r) => r.enabled).length} faol)
          </span>
          <button
            onClick={openAddModal}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Vaqt qo‘shish</span>
          </button>
        </div>

        {reminders.map((item) => {
          const badge = getPracticeTypeBadge(item.practiceType);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 border transition-all ${
                item.isWarning
                  ? 'border-amber-200 bg-amber-50/30'
                  : item.enabled
                  ? 'border-stone-200 shadow-2xs'
                  : 'border-stone-200/60 opacity-65 bg-stone-50/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Time Badge */}
                  <div
                    className={`px-2.5 py-1.5 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                      item.enabled
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : 'bg-stone-100 border-stone-200 text-stone-500'
                    }`}
                  >
                    <span className="text-sm font-black font-mono tracking-tight">{item.time}</span>
                    <span className="text-[9px] font-bold text-stone-500 uppercase">
                      {getFrequencyLabel(item.frequency).split(' ')[0]}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-xs text-stone-900">{item.title}</h3>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[9px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        {getFrequencyLabel(item.frequency)}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleReminder(item.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    item.enabled ? 'bg-indigo-600' : 'bg-stone-200'
                  }`}
                  title={item.enabled ? 'Eslatmani o‘chirish' : 'Eslatmani yoqish'}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      item.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Action Toolbar for Item */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-stone-500" />
                    <span>Tahrirlash</span>
                  </button>

                  <button
                    onClick={() => deleteReminder(item.id)}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Eslatmani o‘chirish"
                  >
                    <Trash2 className="w-3 h-3 text-rose-500" />
                    <span>O‘chirish</span>
                  </button>
                </div>

                <button
                  onClick={() => handleTriggerTest(item.id)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <span>Sinab ko‘rish</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telegram Bot Integration Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">✈️</span>
            <h3 className="font-bold text-xs text-stone-900">Telegram Bot orqali qo‘shimcha eslatmalar</h3>
          </div>
          {telegramConnected && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              ✓ Ulangan
            </span>
          )}
        </div>

        <p className="text-xs text-stone-500 mb-3">
          Push bildirishnomalar bilan birga @VerboUzBot orqali ham kunlik so‘zlar va streak ogohlantirishlarini oling.
        </p>

        <button
          onClick={() => setTelegramConnected(!telegramConnected)}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            telegramConnected
              ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
          }`}
        >
          {telegramConnected ? 'Telegram ulanishini o‘chirish' : '@VerboUzBot ga ulanish'}
        </button>
      </div>

      {/* Add / Edit Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">
                    {editingReminderId ? 'Eslatma vaqtini o‘zgartirish' : 'Yangi eslatma vaqti'}
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Lug‘at takrorlash uchun push-xabarnoma vaqtini belgilang
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Time Picker */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Eslatma vaqti (24-soatlik format)
                </label>
                <input
                  type="time"
                  required
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl text-lg font-mono font-extrabold text-stone-900 focus:outline-hidden focus:border-indigo-500"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-stone-500 font-semibold mr-1">Tezkor tanlov:</span>
                  {['07:30', '08:00', '13:00', '17:30', '20:00', '22:00'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormTime(preset)}
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border transition-colors ${
                        formTime === preset
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Eslatma sarlavhasi
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Masalan: Tonggi takrorlash, Ishdan qaytganda..."
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Practice Focus Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Mashg‘ulot yo‘nalishi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'spaced_repetition', label: 'SRS Takrorlash', desc: 'Unutilayotgan so‘zlar' },
                    { id: 'new_words', label: 'Yangi so‘zlar', desc: '5 ta yangi lug‘at' },
                    { id: 'quick_quiz', label: 'Tezkor viktorina', desc: '3 daqiqalik test' },
                    { id: 'word_of_day', label: 'Kun so‘zi', desc: 'Maxsus so‘z va ibora' },
                    { id: 'streak_saver', label: 'Streak saqlash', desc: 'Seriyani himoya qilish' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormPracticeType(t.id as ReminderPracticeType)}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        formPracticeType === t.id
                          ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-900">{t.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Qaytarilish tartibi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: 'Har kuni' },
                    { id: 'weekdays', label: 'Ish kunlari' },
                    { id: 'weekends', label: 'Dam olish' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormFrequency(f.id as ReminderFrequency)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                        formFrequency === f.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description / Custom Message */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Eslatma matni (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Bo‘sh qoldirilsa, avtomatik mos matn tanlanadi"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {editingReminderId ? 'O‘zgarishlarni saqlash' : 'Eslatmani saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
