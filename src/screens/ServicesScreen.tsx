import React from 'react';
import {
  Mic,
  Headphones,
  BookOpen,
  FileText,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  Send,
  Printer,
  Compass,
  MessageSquareQuote,
  Star,
  Flame,
  CheckCircle2,
  Volume2,
  Lock,
  Crown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ServicesScreen: React.FC = () => {
  const { setCurrentScreen, user, openLockedFeatureModal, setAddWordDefaultTab } = useApp();

  const services = [
    {
      id: 'ai_flashcard_generator',
      title: 'AI Flashcard Generator',
      desc: 'Matn nusxasi, rasm skan yoki istalgan fayldan AI orqali tekshirib avtomatik flashcardlar yaratish',
      icon: Sparkles,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Gemini 3 AI',
      isPremiumLocked: false,
      action: () => {
        setAddWordDefaultTab('ai_batch');
        setCurrentScreen('add_word');
      },
    },
    {
      id: 'pronunciation',
      title: 'AI Talaffuz Murabbiyi',
      desc: 'Mikrofon orqali talaffuzingizni sinang va darhol aniqlik foizini oling',
      icon: Mic,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'AI Powered',
      isPremiumLocked: false,
      action: () => setCurrentScreen('pronunciation'),
    },
    {
      id: 'audio_player',
      title: 'Hands-Free Audio Pleyer',
      desc: 'Mashinada, yo‘lda yoki yugurishda so‘zlarni avtomatik ketma-ket tinglang',
      icon: Headphones,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Avto-pleyer',
      isPremiumLocked: false,
      action: () => setCurrentScreen('audio_player'),
    },
    {
      id: 'audio_game',
      title: 'Audio Game (Tinglab top)',
      desc: 'Talaffuzni tinglab so‘z ma’nosi yoki yozilishini topish bo‘yicha listening o‘yini',
      icon: Volume2,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Listening Game',
      isPremiumLocked: false,
      action: () => setCurrentScreen('game_audio'),
    },
    {
      id: 'stories',
      title: 'Mavzuli CEFR Hikoyalar',
      desc: 'Lug‘at bazasidagi 11 ta mavzuga mos hikoyalar va matn ichida alohida ajratilgan CEFR so‘zlar',
      icon: BookOpen,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'A1 - C2 | 11 ta mavzu',
      isPremiumLocked: false,
      action: () => setCurrentScreen('stories'),
    },
    {
      id: 'sentence_builder',
      title: 'Gap Tuzish Mashqlari',
      desc: 'Aralashgan so‘zlardan to‘g‘ri sintaksis va kollokatsiyalarni yig‘ing',
      icon: Layers,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Grammatika',
      isPremiumLocked: false,
      action: () => setCurrentScreen('sentence_builder'),
    },
    {
      id: 'certificate_test',
      title: 'CEFR Diagnostika va Sertifikat',
      desc: 'Verbo Premium bilan rasmiy diagnostika testini topshirib, QR-kodli PDF sertifikat oling',
      icon: Award,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Rasmiy Sertifikat',
      isPremiumLocked: true,
      action: () => setCurrentScreen('certificate_test'),
    },
    {
      id: 'ielts_mock_test',
      title: 'IELTS Computer-Delivered Test',
      desc: 'Haqiqiy IDP/BC formati, split-screen o‘qish matni, T/F/NG va 9.0 Band baholash hisoboti',
      icon: FileText,
      color: 'bg-red-600',
      lightColor: 'bg-red-50 text-red-700 border-red-200',
      badge: 'Official Simulation',
      isPremiumLocked: false,
      action: () => setCurrentScreen('ielts_test'),
    },
    {
      id: 'export_tools',
      title: 'PDF Fleshkarta & Eksport',
      desc: 'Chop etiladigan 2 tomonlama qog‘oz kartochkalar, Excel va Anki fayllar',
      icon: Printer,
      color: 'bg-sky-600',
      lightColor: 'bg-sky-50 text-sky-600 border-sky-200',
      badge: 'Print & Export',
      isPremiumLocked: false,
      action: () => setCurrentScreen('export_tools'),
    },
    {
      id: 'ai_tutor',
      title: 'Verbo AI Repetitor (Speaking & Grammar)',
      desc: 'AI bilan 24/7 IELTS Speaking simulyatsiyasi va xatolar tahlili',
      icon: MessageSquareQuote,
      color: 'bg-stone-900',
      lightColor: 'bg-stone-100 text-stone-900 border-stone-300',
      badge: '24/7 AI Murabbiy',
      isPremiumLocked: true,
      action: () => setCurrentScreen('ai_tutor'),
    },
  ];

  return (
    <div id="services-screen" className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/70">
            Ekotizim vositalari
          </span>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight mt-1.5">
            Qo‘shimcha Xizmatlar
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{user.stars} yulduz</span>
        </div>
      </div>

      {/* Hero Banner: Premium Feature Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-950 text-white p-5 sm:p-6 border border-indigo-900 shadow-md">
        <div className="flex items-start justify-between relative z-10 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🚀</span>
            <div>
              <h2 className="font-display font-bold text-base text-white">To‘liq Ta’lim Imkoniyatlari</h2>
              <p className="text-[11px] text-indigo-200/80">Ko‘p qirrali til ko‘nikmalarini rivojlantiring</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-indigo-200">
            {services.length} ta servis
          </span>
        </div>

        <p className="text-xs text-indigo-200/90 leading-relaxed relative z-10 mb-4">
          Faqatgina so‘z yodlash bilan cheklanmang: talaffuzni AI bilan tekshiring, audiopleyerni yo‘lda eshiting, hikoyalar o‘qing va CEFR sertifikatini qo‘lga kiriting.
        </p>

        <div className="flex items-center gap-4 relative z-10 text-[11px] text-indigo-200 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Oflayn va onlayn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% interaktiv</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-3 pb-6">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
          <span>Mavjud Xizmatlar</span>
          <span>{services.length} ta vosita</span>
        </div>

        {services.map((item) => {
          const Icon = item.icon;
          const isUserPremium = Boolean(user.premiumStatus || user.isPremium);
          const isLocked = item.isPremiumLocked && !isUserPremium;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isLocked) {
                  openLockedFeatureModal(item.id);
                } else {
                  item.action();
                }
              }}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 group cursor-pointer ${
                isLocked
                  ? 'bg-linear-to-r from-amber-50/30 via-white to-amber-50/10 border-amber-300/80 hover:border-amber-400 hover:shadow-xs'
                  : 'bg-white border-stone-200/80 hover:border-indigo-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isLocked && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center border-2 border-white shadow-2xs">
                      <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3
                      className={`font-bold text-sm transition-colors ${
                        isLocked
                          ? 'text-stone-900 group-hover:text-amber-800'
                          : 'text-stone-900 group-hover:text-indigo-600'
                      }`}
                    >
                      {item.title}
                    </h3>

                    {isLocked ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border border-amber-300 bg-amber-100 text-amber-900 shadow-2xs">
                        <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                        PRO QULFLANGAN
                      </span>
                    ) : item.isPremiumLocked ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        PRO FAOL
                      </span>
                    ) : null}

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${item.lightColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>

                  {isLocked && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 mt-1.5">
                      <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>Premium obunachilar uchun • Imkoniyatlarni ko‘rish</span>
                    </div>
                  )}
                </div>
              </div>

              {isLocked ? (
                <div className="w-8 h-8 rounded-xl bg-amber-100 group-hover:bg-amber-500 text-amber-800 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <Lock className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-indigo-600 text-stone-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
