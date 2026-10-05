import React, { useState } from 'react';
import {
  ArrowLeft,
  Crown,
  Check,
  Star,
  Sparkles,
  Zap,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const PremiumScreen: React.FC = () => {
  const { setCurrentScreen, user, setUser } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedProvider, setSelectedProvider] = useState<'payme' | 'click' | 'uzum'>('payme');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSimulatePayment = () => {
    setUser((prev) => ({ ...prev, premiumStatus: true }));
    setIsSuccess(true);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  const handleRedeemWithStars = () => {
    if (user.stars >= 200) {
      setUser((prev) => ({ ...prev, stars: prev.stars - 200, premiumStatus: true }));
      setIsSuccess(true);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  };

  return (
    <div id="premium-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-stone-700">Verbo Premium</span>
        <div className="w-8" />
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-3xl p-6 text-center border border-stone-200 shadow-xl my-auto animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900 mb-1">
            Tabriklaymiz! 🎉
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Verbo Premium obunasi muvaffaqiyatli faollashtirildi! Barcha imkoniyatlardan cheklovsiz foydalaning.
          </p>

          <button
            onClick={() => setCurrentScreen('home')}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {/* Hero Banner */}
          <div className="bg-linear-to-br from-stone-900 via-indigo-950 to-stone-900 text-white rounded-3xl p-6 shadow-md text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Crown className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-1">
              Verbo Premium
            </h1>
            <p className="text-xs text-stone-300 max-w-xs mx-auto">
              Ingliz tilini tez va mukammal o‘rganish uchun ilg‘or vositalar
            </p>
          </div>

          {/* Features Checklist */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            {[
              'Cheksiz AI orqali so‘z ajratib olish (PDF, DOCX, matn, rasm)',
              '1200+ so‘z uchun professional audio va misollar',
              'Cheksiz shaxsiy to‘plamlar va kartotekalar',
              'Do‘stlar bilan VIP Multiplayer xonalar ochish',
              '100% reklamasiz, toza ta’lim tajribasi',
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-stone-700">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Special Promotion: Redeem with Stars */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-indigo-950">
                  200 Yulduz bilan bepul olish
                </span>
              </div>
              <span className="text-xs font-extrabold text-indigo-700">
                {user.stars} / 200
              </span>
            </div>

            <p className="text-[11px] text-indigo-800 mb-3">
              Har kuni mashg‘ulot qilib 200 yulduz yig‘ing va Premium obunani pulsiz qo‘lga kiriting.
            </p>

            <button
              onClick={handleRedeemWithStars}
              disabled={user.stars < 200}
              className="w-full py-2.5 rounded-xl bg-indigo-600 disabled:opacity-40 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
            >
              {user.stars >= 200
                ? 'Yulduzlar orqali Premium ochish'
                : `Yana ${200 - user.stars} ta yulduz kerak`}
            </button>
          </div>

          {/* Pricing Plans Selection */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1 Month */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-xs font-bold text-stone-900 block">1 oylik</span>
              <div className="text-lg font-bold font-display text-indigo-600 mt-1">
                29,000 <span className="text-xs font-normal text-stone-500">so‘m</span>
              </div>
              <span className="text-[10px] text-stone-400">Har oy to‘lanadi</span>
            </div>

            {/* 1 Year */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                selectedPlan === 'yearly'
                  ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="absolute top-0 right-0 bg-amber-400 text-stone-950 font-extrabold text-[9px] px-2 py-0.5 rounded-bl-lg">
                -50% Chegirma
              </span>
              <span className="text-xs font-bold text-stone-900 block">1 yillik</span>
              <div className="text-lg font-bold font-display text-indigo-600 mt-1">
                179,000 <span className="text-xs font-normal text-stone-500">so‘m</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Oyiga 14,900 so‘m</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-stone-900 block">
              To‘lov tizimini tanlang:
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'payme', name: 'Payme', color: 'bg-cyan-50 border-cyan-200 text-cyan-800' },
                { id: 'click', name: 'Click', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                { id: 'uzum', name: 'Uzum Bank', color: 'bg-purple-50 border-purple-200 text-purple-800' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id as any)}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    selectedProvider === p.id
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs font-extrabold'
                      : 'border-stone-200 bg-white text-stone-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSimulatePayment}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {selectedPlan === 'monthly' ? '29,000' : '179,000'} so‘m to‘lash
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
