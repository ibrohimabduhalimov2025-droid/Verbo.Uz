import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Target,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  Bell,
  ArrowRight,
  Compass,
  Zap,
  BookOpen,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen, setUser } = useApp();
  const [step, setStep] = useState<number>(1);

  // User onboarding responses
  const [goal, setGoal] = useState<string>('IELTS 7+ yoki CEFR B2/C1 olish');
  const [level, setLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1'>('A1');
  const [focusSkill, setFocusSkill] = useState<string>('vocabulary');
  const [dailyWords, setDailyWords] = useState<number>(15);
  const [deadlineDays, setDeadlineDays] = useState<number>(60);
  const [deadlineText, setDeadlineText] = useState<string>('60 kun');
  const [reminderTime, setReminderTime] = useState<string>('20:00');

  const TOTAL_STEPS = 8;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Save user profile and move to auth
      setUser((prev) => ({
        ...prev,
        level,
        targetLevel: level === 'B2' || level === 'C1' ? 'C1' : 'B2',
        targetGoal: goal,
        dailyGoal: dailyWords,
        targetDeadline: deadlineText,
        reminderTime,
      }));
      setCurrentScreen('auth');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Projected vocabulary calculation
  const totalProjectedWords = dailyWords * deadlineDays;

  return (
    <div
      id="onboarding-container"
      className="flex-1 flex flex-col justify-between p-5 sm:p-7 bg-stone-50 min-h-full"
    >
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between pt-1">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-7 bg-indigo-600'
                  : i + 1 < step
                  ? 'w-2 bg-indigo-300'
                  : 'w-1.5 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep(TOTAL_STEPS)}
            className="text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors"
          >
            O‘tkazish
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* Screen Content Body */}
      <div className="flex-1 flex flex-col justify-center items-center text-center my-4">
        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome Screen */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center max-w-sm"
            >
              <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-200 mb-6 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
                  <span className="font-display text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
                    V
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aqlli ingliz tili platformasi</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-900 mb-2">
                VERBO.UZ ga xush kelibsiz!
              </h1>
              <p className="text-stone-600 text-sm sm:text-base font-medium leading-snug">
                "So‘zlarni shunchaki yodlamang — doimiy xotirangizga muhrlang."
              </p>
              <p className="text-stone-500 text-xs mt-3 leading-relaxed">
                Bir necha savol orqali sizning darajangiz, maqsadingiz va qulay sur’atingizga moslashtirilgan shaxsiy o‘quv rejasini tuzib chiqamiz.
              </p>
            </motion.div>
          )}

          {/* STEP 2: Goal Specification */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Ingliz tilini o‘rganishdan asosiy maqsadingiz nima?
              </h2>
              <p className="text-stone-500 text-xs mb-4">
                Mavzular va AI mashg‘ulotlari aynan shu maqsadingizga yo‘naltiriladi
              </p>

              <div className="w-full space-y-2 text-left">
                {[
                  {
                    id: 'IELTS 7+ yoki CEFR B2/C1 olish',
                    title: '🎯 IELTS 7+ yoki CEFR B2/C1 olish',
                    sub: 'Akademik so‘zlar, grammatika va yozma insho leksikasi',
                  },
                  {
                    id: 'Chet elga sayohat va viza suhbati',
                    title: '✈️ Chet elga sayohat va viza suhbati',
                    sub: 'Aeroport, bojxona, mehmonxona va transport iboralari',
                  },
                  {
                    id: 'IT va Xalqaro kompaniyada ishlash',
                    title: '💻 IT va Xalqaro kompaniyada ishlash',
                    sub: 'Texnik atamalar, ish suhbati va biznes muloqot',
                  },
                  {
                    id: 'Maktab va Universitet imtihonlari',
                    title: '🎓 Maktab yoki Universitet imtihonlari',
                    sub: 'DTM, litsey va oliygoh kirish imtihonlariga tayyorgarlik',
                  },
                  {
                    id: 'Kundalik erkin suhbat va muloqot',
                    title: '💬 Kundalik erkin suhbat va do‘stlar orttirish',
                    sub: 'Komplekssiz, to‘g‘ri talaffuz bilan ravon gapirish',
                  },
                  {
                    id: 'Film va kitoblarni tarjimasiz tushunish',
                    title: '🎬 Film, kitob va podkastlarni tushunish',
                    sub: 'Zamonaviy sleng, iboralar va audio idrok etish',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      goal === item.id
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-900">{item.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{item.sub}</div>
                    </div>
                    {goal === item.id && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Current Level Assessment */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Hozirgi darajangiz qanday?
              </h2>
              <p className="text-stone-500 text-xs mb-4">
                Boshlang‘ich so‘zlar qiyinligi shunga mos ravishda belgilanadi
              </p>

              <div className="w-full space-y-2 text-left">
                {[
                  {
                    key: 'A1',
                    badge: 'A1 — Beginner',
                    title: 'Boshlang‘ich (Noldan boshlayapman)',
                    sub: 'Alifbo, asosiy so‘zlar va eng oddiy birikmalar',
                  },
                  {
                    key: 'A2',
                    badge: 'A2 — Elementary',
                    title: 'Boshlang‘ich-o‘rta daraja',
                    sub: 'Oddiy gaplarni tushunaman, lekin so‘z boyligim cheklangan',
                  },
                  {
                    key: 'B1',
                    badge: 'B1 — Intermediate',
                    title: 'O‘rta daraja (IELTS 5.0 - 6.0)',
                    sub: 'Kundalik mavzularda gaplasha olaman, yangi so‘zlar kerak',
                  },
                  {
                    key: 'B2',
                    badge: 'B2 — Upper-Intermediate',
                    title: 'Yetarli daraja (IELTS 6.5 - 7.0)',
                    sub: 'Murakkab matnlarni tushunaman, akademik leksikaga intilmoqdaman',
                  },
                  {
                    key: 'C1',
                    badge: 'C1 — Advanced',
                    title: 'Professional daraja (IELTS 7.5+)',
                    sub: 'Kam uchraydigan idiomatik iboralar va nufuzli lug‘at kerak',
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setLevel(item.key as 'A1' | 'A2' | 'B1' | 'B2' | 'C1')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      level === item.key
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-700">
                          {item.badge}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-stone-900 mt-1">{item.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{item.sub}</div>
                    </div>
                    {level === item.key && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Focus Skill Selection */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Qaysi ko‘nikmaga ko‘proq urg‘u beramiz?
              </h2>
              <p className="text-stone-500 text-xs mb-4">
                Ilovadagi bosh sahifa va mashqlar shunga moslashtiriladi
              </p>

              <div className="w-full space-y-2 text-left">
                {[
                  {
                    id: 'vocabulary',
                    title: '🧠 So‘z boyligi va Spaced Repetition',
                    sub: 'SM-2 ilmiy intervali orqali minglab so‘zlarni uzoq muddatli xotirada saqlash',
                  },
                  {
                    id: 'pronunciation',
                    title: '🎙️ To‘g‘ri talaffuz va Speaking',
                    sub: 'AI fonetik tahlili, bo‘g‘in urg‘ulari va tabiiy inson ovozida takrorlash',
                  },
                  {
                    id: 'listening',
                    title: '🎧 Eshitib tushunish (Hands-Free)',
                    sub: 'Avtomobilda, sportda yoki yo‘lda naushnikda so‘zlarni avtomatik tinglash',
                  },
                  {
                    id: 'stories',
                    title: '📖 Kontekstda o‘rganish (Hikoyalar)',
                    sub: 'Qiziqarli maqola va hikoyalar o‘qish, yangi so‘zlarni bosib lug‘atga olish',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFocusSkill(item.id)}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      focusSkill === item.id
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-900">{item.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{item.sub}</div>
                    </div>
                    {focusSkill === item.id && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Daily Pace */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Kuningizda qancha vaqt ajrata olasiz?
              </h2>
              <p className="text-stone-500 text-xs mb-4">
                Doimiylik va kunlik ozgina vaqt — eng katta natijani beradi
              </p>

              <div className="w-full space-y-2 text-left">
                {[
                  { num: 5, label: '5 ta so‘z / kun', time: '~5 daqiqa', desc: 'Yengil va qulay sur’at' },
                  { num: 10, label: '10 ta so‘z / kun', time: '~10 daqiqa', desc: 'Muntazam va barqaror o‘rganish' },
                  { num: 15, label: '15 ta so‘z / kun', time: '~15 daqiqa', desc: 'Tavsiya etiladi (Ideal sur’at)' },
                  { num: 25, label: '25 ta so‘z / kun', time: '~25 daqiqa', desc: 'Intensiv va tezkor natija' },
                ].map((item) => (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => setDailyWords(item.num)}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      dailyWords === item.num
                        ? 'border-indigo-600 bg-indigo-50 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-900 flex items-center gap-2">
                        <span>{item.label}</span>
                        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-md">
                          {item.time}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                    </div>
                    {dailyWords === item.num && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 6: Target Deadline */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Qachongacha maqsadingizga erishmoqchisiz?
              </h2>
              <p className="text-stone-500 text-xs mb-4">
                Aniq muddat sizni intizomda saqlaydi va maqsadga yetaklaydi
              </p>

              <div className="w-full grid grid-cols-2 gap-2.5">
                {[
                  { days: 30, val: '30 kun', label: '30 kun', sub: '1 oy — tezkor start' },
                  { days: 60, val: '60 kun', label: '60 kun', sub: '2 oy — tavsiya etiladi' },
                  { days: 90, val: '90 kun', label: '90 kun', sub: '3 oy — mustahkam baza' },
                  { days: 180, val: '180 kun', label: '180 kun', sub: 'Yarim yil — to‘liq erkinlik' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setDeadlineDays(item.days);
                      setDeadlineText(item.val);
                    }}
                    className={`p-3.5 rounded-xl text-center border transition-all ${
                      deadlineText === item.val
                        ? 'border-indigo-600 bg-indigo-50 shadow-xs text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 7: Reminder Notification Time */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Eslatma vaqti (Notification)
              </h2>
              <p className="text-stone-500 text-xs mb-4">
                Streakingiz uzilib qolmasligi uchun har kuni eslatib turamiz
              </p>

              <div className="w-full grid grid-cols-2 gap-2.5">
                {[
                  { time: '08:00', label: '08:00', sub: 'Ertalab qahva bilan' },
                  { time: '13:00', label: '13:00', sub: 'Tushlik tanaffusida' },
                  { time: '20:00', label: '20:00', sub: 'Kechki payt (Tavsiya)' },
                  { time: '22:00', label: '22:00', sub: 'Uyqudan oldin takrorlash' },
                ].map((item) => (
                  <button
                    key={item.time}
                    type="button"
                    onClick={() => setReminderTime(item.time)}
                    className={`p-3.5 rounded-xl text-center border transition-all ${
                      reminderTime === item.time
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 8: Tailored Goal & Personalized Strategy Summary */}
          {step === 8 && (
            <motion.div
              key="step8"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-200">
                <Target className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 mb-0.5">
                Shaxsiy rejangiz tayyorlandi
              </span>
              <h2 className="text-2xl font-bold font-display text-stone-900 mb-3">
                Sizning muvaffaqiyat xaritangiz
              </h2>

              {/* Strategy Card */}
              <div className="w-full bg-linear-to-br from-indigo-950 via-indigo-900 to-stone-950 text-white rounded-3xl p-5 shadow-xl text-left relative overflow-hidden mb-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-800/80 mb-3">
                  <div>
                    <span className="text-[10px] text-indigo-300 font-medium">Boshlang‘ich daraja</span>
                    <div className="text-lg font-bold font-display text-white flex items-center gap-2 mt-0.5">
                      <span>{level}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-emerald-400 font-extrabold">B2 / C1</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-indigo-300 font-medium">Asosiy maqsad</span>
                    <div className="text-xs font-bold text-white mt-0.5 max-w-[140px] truncate">{goal}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                    <div className="text-[10px] text-indigo-200">Kutilayotgan so‘z boyligi</div>
                    <div className="text-base font-extrabold font-display text-amber-300">
                      +{totalProjectedWords} ta so‘z
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                    <div className="text-[10px] text-indigo-200">Muddati</div>
                    <div className="text-base font-extrabold font-display text-emerald-300">
                      {deadlineText}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-indigo-800/60 text-[11px] text-indigo-200 flex items-center justify-between">
                  <span>Kunlik norma: {dailyWords} ta so‘z</span>
                  <span>Eslatma: {reminderTime}</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-left flex items-start gap-2.5 w-full">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-950 leading-relaxed font-medium">
                  Har kuni atigi {dailyWords === 5 ? '5' : dailyWords === 10 ? '10' : '15'} daqiqa sarflab, {deadlineText} ichida {totalProjectedWords} ta so‘zni SM-2 algoritmi orqali umrbod xotirangizga muhrlaysiz.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-3 border-t border-stone-200/80">
        <button
          id="onboarding-next-btn"
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{step === TOTAL_STEPS ? 'Mashg‘ulotlarni boshlash' : 'Davom etish'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
