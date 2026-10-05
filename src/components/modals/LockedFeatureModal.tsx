import React from 'react';
import {
  Crown,
  Lock,
  X,
  Award,
  MessageSquareQuote,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface LockedFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: 'certificate_test' | 'ai_tutor' | string;
}

interface FeatureBenefitInfo {
  title: string;
  badge: string;
  icon: React.ElementType;
  iconBg: string;
  accentColor: string;
  shortDesc: string;
  benefits: { title: string; desc: string }[];
}

const FEATURE_DATA: Record<string, FeatureBenefitInfo> = {
  certificate_test: {
    title: 'CEFR Diagnostika va Sertifikat',
    badge: 'PRO QULFLANGAN',
    icon: Award,
    iconBg: 'bg-purple-600',
    accentColor: 'border-purple-200 bg-purple-50 text-purple-700',
    shortDesc:
      'Verbo Premium bilan rasmiy diagnostika testini topshirib, QR-kodli PDF sertifikat oling.',
    benefits: [
      {
        title: 'Tekshiruvchi QR-kodli rasmiy sertifikat',
        desc: 'Sertifikat tekshiruv havolasi va unikal ID raqamga ega bo‘ladi, rezyumega bemalol qo‘sha olasiz.',
      },
      {
        title: 'Chuqur tahliliy hisobot',
        desc: 'Grammatika, leksik boylik va reading bo‘yicha kuchli hamda zaif tomonlaringiz foizlarda ko‘rsatiladi.',
      },
      {
        title: 'Chop etiladigan PDF format',
        desc: 'Sertifikatni xalqaro A4 formatida yuqori sifatda yuklab olish va chop etish imkoniyati.',
      },
      {
        title: 'Cheksiz qayta topshirish',
        desc: 'Yangi so‘zlar o‘rgangach, testni qayta topshirib bilimingiz oshganini rasman qayd eting.',
      },
    ],
  },
  ai_tutor: {
    title: 'Verbo AI Repetitor (Speaking & Grammar)',
    badge: 'PRO QULFLANGAN',
    icon: MessageSquareQuote,
    iconBg: 'bg-stone-900',
    accentColor: 'border-stone-300 bg-stone-100 text-stone-900',
    shortDesc:
      'AI bilan 24/7 IELTS Speaking simulyatsiyasi va xatolar tahlili.',
    benefits: [
      {
        title: '24/7 IELTS Speaking simulyatsiyasi',
        desc: 'Haqiqiy imtihon savollari asosida erkin ovozli va yozma suhbat quring.',
      },
      {
        title: 'Real vaqtda xatolarni tahlil qilish',
        desc: 'Yozgan gapingizni yuboring: AI grammatik xatolarni aniqlab, to‘g‘ri variantini sabablari bilan tushuntiradi.',
      },
      {
        title: 'IELTS Speaking va erkin dialoglar',
        desc: 'Haqiqiy imtihon mavzularida dialog quring va ifoda boyligingizni boyiting.',
      },
      {
        title: 'O‘zbekcha va inglizcha chuqur izoh',
        desc: 'Qiyin qoidalarni o‘zingiz tushunadigan tilda sodda va amaliy misollar bilan o‘rganing.',
      },
    ],
  },
  weak_words: {
    title: 'Mening xatolarim (Smart Weakness Practice)',
    badge: 'PRO QULFLANGAN',
    icon: Zap,
    iconBg: 'bg-rose-600',
    accentColor: 'border-rose-200 bg-rose-50 text-rose-700',
    shortDesc:
      'Verbo Premium bilan xatolaringiz ustida adaptiv ishlab, kuchsiz tomonlaringizni mukammal mustahkamlang.',
    benefits: [
      {
        title: 'Xatolar ustida maxsus adaptiv test',
        desc: 'Test va mashqlarda adashgan barcha so‘zlaringizni alohida to‘plamda qayta takrorlang.',
      },
      {
        title: 'Tezkor xatolikni yo‘qotish va +20 XP',
        desc: 'Har bir to‘g‘ri javob xatolikni tuzatadi va haftalik ligada yuqori o‘rinlarga ko‘taradi.',
      },
      {
        title: 'Spaced Repetition avto-moslashuv',
        desc: 'Kuchsiz so‘zlar xotirangizda to‘liq mustahkamlanmaguncha SM-2 algoritmi orqali qayta takrorlanadi.',
      },
    ],
  },
  multiplayer_limit: {
    title: 'So‘z jangi (Multiplayer) kunlik limiti',
    badge: 'KUNLIK LIMIT: 2/2',
    icon: Crown,
    iconBg: 'bg-indigo-600',
    accentColor: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    shortDesc:
      'Bepul foydalanuvchilar uchun kunlik 2 ta o‘yin limiti tugadi. Cheksiz jonli o‘yinlar va do‘stlar bilan musobaqa uchun Verbo Premiumga o‘ting!',
    benefits: [
      {
        title: 'Cheksiz Multiplayer o‘yinlari',
        desc: 'Kunlik limitlarsiz 24/7 istalgancha do‘stlar va onlayn o‘quvchilar bilan bellashing.',
      },
      {
        title: 'Shaxsiy xonalar ochish huquqi',
        desc: 'Do‘stlaringiz uchun maxsus PIN-kodli xonalar yarating va musobaqa o‘tkazing.',
      },
      {
        title: '2x ko‘proq XP ballari',
        desc: 'G‘alaba qozonganingizda haftalik Top-10 reytingiga 2 baravar ko‘p XP qo‘shiladi.',
      },
    ],
  },
};

export const LockedFeatureModal: React.FC<LockedFeatureModalProps> = ({
  isOpen,
  onClose,
  featureId,
}) => {
  const { setCurrentScreen, user } = useApp();

  if (!isOpen) return null;

  const currentFeature =
    FEATURE_DATA[featureId] || FEATURE_DATA.certificate_test;
  const Icon = currentFeature.icon;

  const handleUpgrade = () => {
    onClose();
    setCurrentScreen('premium');
  };

  return (
    <div
      id="locked-feature-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Premium banner */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Crown className="w-3 h-3 fill-stone-950" />
              <span>Verbo Premium</span>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-start gap-3.5 relative z-10">
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-2xl ${currentFeature.iconBg} text-white flex items-center justify-center shadow-md`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center border-2 border-stone-900 shadow-xs">
                <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-amber-300">
                Qulflangan VIP Xizmat
              </span>
              <h2 className="text-lg font-bold font-display text-white leading-snug">
                {currentFeature.title}
              </h2>
            </div>
          </div>

          <p className="text-xs text-stone-300 mt-3 leading-relaxed relative z-10">
            {currentFeature.shortDesc}
          </p>
        </div>

        {/* Modal Body: Feature Benefits list */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Ushbu xizmatni ochganda nimalarga ega bo‘lasiz:
              </span>
            </div>

            <div className="space-y-2.5">
              {currentFeature.benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{b.title}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plus all Premium perks highlight */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Barcha Premium imkoniyatlar birgalikda ochiladi:</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              10,000 ta CEFR so‘zlar bazasi, hands-free audiopleyer, cheksiz kartotekalar, oflayn rejim va 100% reklamasiz ta’lim.
            </p>
          </div>

          {/* Star redemption alternative tip */}
          {user.stars > 0 && (
            <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
              <span>Sizda {user.stars} ta yulduz bor</span>
              <span className="font-medium text-indigo-600">
                200 yulduz bilan bepul ochish mumkin
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col gap-2">
          <button
            onClick={handleUpgrade}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Premiumga o‘tish va to‘liq ochish</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-center text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            Hozircha bepul davom etish
          </button>
        </div>
      </div>
    </div>
  );
};
