import React, { useState } from 'react';
import { Mail, Lock, Phone, ArrowRight, ShieldCheck, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { setCurrentScreen, setUser } = useApp();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mandatory registration requirements
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleDemoLogin = () => {
    setUser((prev) => ({
      ...prev,
      name: 'Ibrohim (Demo)',
      email: 'ibrohim@verbo.uz',
      phone: '+998 90 123 45 67',
      ageConfirmation: true,
      privacyPolicyAccepted: true,
    }));
    setCurrentScreen('home');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      if (!ageConfirmed) {
        setErrorMsg('Ro‘yxatdan o‘tish uchun 13 yoshdan kattaligingizni tasdiqlang.');
        return;
      }
      if (!privacyAgreed) {
        setErrorMsg('Maxfiylik siyosati va foydalanish shartlariga rozilik bildiring.');
        return;
      }
    }

    // Success authentication
    setUser((prev) => ({
      ...prev,
      name: name.trim() || 'Ibrohim',
      email: authMethod === 'email' ? email : prev.email,
      phone: authMethod === 'phone' ? phone : prev.phone,
      ageConfirmation: ageConfirmed,
      privacyPolicyAccepted: privacyAgreed,
    }));

    setCurrentScreen('home');
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setUser((prev) => ({
      ...prev,
      name: provider === 'google' ? 'Ibrohim (Google)' : 'Ibrohim (Apple)',
      email: 'ibrohim@verbo.uz',
      ageConfirmation: true,
      privacyPolicyAccepted: true,
    }));
    setCurrentScreen('home');
  };

  return (
    <div
      id="auth-container"
      className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-stone-50 min-h-full"
    >
      {/* Top Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-stone-200 shadow-2xs shrink-0">
              <img src="/logo.png" alt="Verbo School" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg text-stone-900 tracking-tight leading-tight">
                VERBO <span className="text-indigo-600">SCHOOL</span>
              </span>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                EST. 2026
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('home')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Mehmon sifatida
          </button>
        </div>

        {/* Tab Switcher: Kirish / Ro'yxatdan o'tish */}
        <div className="grid grid-cols-2 p-1 bg-stone-200/70 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isLogin ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
              !isLogin ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
          {isLogin ? 'Xush kelibsiz!' : 'Yangi hisob yaratish'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mb-6">
          {isLogin
            ? 'Shaxsiy so‘z boyligingiz va yutuqlaringizni davom ettiring.'
            : 'Ingliz tilini Spaced Repetition orqali o‘rganishni boshlang.'}
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-3 mb-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
            {infoMsg}
          </div>
        )}

        {/* Method Toggle: Email vs Phone */}
        <div className="flex items-center gap-3 mb-4 text-xs">
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`pb-1 font-semibold border-b-2 transition-colors ${
              authMethod === 'email'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Email orqali
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`pb-1 font-semibold border-b-2 transition-colors ${
              authMethod === 'phone'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Telefon raqam orqali
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ismingiz
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni kiriting"
                className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          )}

          {authMethod === 'email' ? (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Elektron pochta
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nomi@namuna.uz"
                  className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Telefon raqami
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Parol
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setInfoMsg('Parolni tiklash havolasi emailingizga yuborildi.');
                    setTimeout(() => setInfoMsg(null), 4000);
                  }}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  Unutdingizmi?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 8 ta belgi"
                className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-10 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-stone-400 hover:text-stone-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Registration mandatory checks */}
          {!isLogin && (
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => setAgeConfirmed(!ageConfirmed)}
                className="flex items-start gap-2.5 text-left text-xs text-stone-700"
              >
                {ageConfirmed ? (
                  <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                )}
                <span>Men 13 yoshdan kattaman va mustaqil ravishda o‘rganmoqdaman.</span>
              </button>

              <button
                type="button"
                onClick={() => setPrivacyAgreed(!privacyAgreed)}
                className="flex items-start gap-2.5 text-left text-xs text-stone-700"
              >
                {privacyAgreed ? (
                  <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                )}
                <span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentScreen('privacy_policy');
                    }}
                    className="text-indigo-600 underline"
                  >
                    Maxfiylik siyosati
                  </span>{' '}
                  va foydalanish shartlariga roziman.
                </span>
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>{isLogin ? 'Hisobga kirish' : 'Ro‘yxatdan o‘tish'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Social Authentication Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <span className="relative bg-stone-50 px-3 text-xs text-stone-400 uppercase font-medium">
            yoki
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 font-medium text-xs text-stone-700 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('apple')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 font-medium text-xs text-stone-700 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4 fill-stone-900" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.61 1.34-.56.64-.99 1.7-.87 2.72 1 .08 1.95-.51 2.56-1.21z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Demo Fast Login Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Demo sifatida kirish (Ibrohim hisobi bilan)</span>
          </button>
        </div>
      </div>

      {/* Demo helper */}
      <div className="text-center pt-4">
        <p className="text-[11px] text-stone-400">
          * Ushbu prototipda barcha amallar Firebase/Cloud Firestore ga tayyor holatda lokal saqlanadi.
        </p>
      </div>
    </div>
  );
};
