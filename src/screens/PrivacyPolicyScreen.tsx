import React from 'react';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicyScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div id="privacy-policy-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-stone-700">Maxfiylik siyosati</span>
        <div className="w-8" />
      </div>

      <div className="space-y-4 pb-6">
        {/* Banner */}
        <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-xs text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2 text-indigo-300">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-display">Verbo.uz Maxfiylik Siyosati</h1>
          <p className="text-xs text-indigo-200 mt-1">
            Bolalar xavfsizligi va shaxsiy ma’lumotlarni himoya qilish kafolati
          </p>
        </div>

        {/* Section 1: 13-Age Restriction & COPPA */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>13 yoshdan kichik foydalanuvchilar bo‘yicha talablar (COPPA)</span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Verbo.uz ta’lim platformasi bolalar xavfsizligini birlamchi o‘ringa qo‘yadi.
            13 yoshga to‘lmagan o‘quvchilar ro‘yxatdan o‘tayotganda ota-onalari yoki qonuniy vasiylarining elektron pochtasi va roziligi so‘raladi.
          </p>

          <div className="space-y-2 pt-1">
            {[
              '13 yoshdan kichik o‘quvchilarning joylashuvi yoki nozik ma’lumotlari yig‘ilmaydi.',
              'Ilovada uchinchi tomonning xavfli reklamalari mavjud emas.',
              'Multiplayer rejimlarida ochiq chat yo‘q, faqat PIN-kodli ta’limiy viktorinalar mavjud.',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-600">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Data Usage */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-stone-900">Qanday ma’lumotlar saqlanadi?</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Platforma faqat ta’lim jarayonini tashkil etish uchun zarur bo‘lgan minimal ma’lumotlarni (ism, daraja, o‘rganilgan so‘zlar tarixi va Spaced Repetition oraliq intervallari) saqlaydi.
          </p>
        </div>

        {/* Section 3: Parental Rights */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Ota-onalarning huquqlari</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Ota-onalar istalgan vaqtda o‘z farzandining ta’lim hisobini ko‘rib chiqish, o‘chirish yoki ma’lumotlarni yangilash huquqiga ega. Buning uchun support@verbo.uz manziliga murojaat qilish kifoya.
          </p>
        </div>
      </div>
    </div>
  );
};
