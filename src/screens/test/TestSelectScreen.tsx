import React from 'react';
import {
  CheckSquare,
  Calendar,
  Sparkles,
  FolderHeart,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Award,
  FileText,
  ShieldCheck,
  Lock,
  Crown,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CEFRLevel } from '../../types';
import { CEFR_LEVELS_META } from '../../services/cefrService';

export const TestSelectScreen: React.FC = () => {
  const {
    setCurrentScreen,
    setTestMode,
    setSelectedCefrLevel,
    loadCefrWordsForLevel,
    user,
    openLockedFeatureModal,
    openPlacementTestModal,
    pastErrors,
    startWeaknessPractice,
  } = useApp();

  const handleSelectCefrTest = (level: CEFRLevel) => {
    setSelectedCefrLevel(level);
    loadCefrWordsForLevel(level);
    setTestMode(`cefr_${level.toLowerCase()}`);
    setCurrentScreen('test_run');
  };

  const modes = [
    {
      id: 'today',
      title: 'Bugungi yangi so‘zlar',
      desc: 'Bugun o‘rganilgan 8-15 ta so‘z bo‘yicha tezkor sinov',
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      count: '10-15 ta savol',
    },
    {
      id: 'last_6_days',
      title: 'So‘nggi 6 kunlik so‘zlar',
      desc: 'Oxirgi haftada o‘tilgan va takrorlangan barcha so‘zlar',
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      count: '20-25 ta savol',
    },
    {
      id: 'all_learned',
      title: 'Barcha o‘rganilgan so‘zlar',
      desc: 'Umumiy o‘zlashtirilgan 900 ta so‘zdan tasodifiy namunalar',
      icon: CheckSquare,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      count: '30 ta savol',
    },
    {
      id: 'selected_deck',
      title: 'Tanlangan mavzu / to‘plam',
      desc: 'Salomlashuv, Kundalik hayot, Sayohat yoki shaxsiy kartoteka',
      icon: FolderHeart,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      count: '15 ta savol',
    },
  ];

  const handleSelectMode = (modeId: string) => {
    setTestMode(modeId);
    setCurrentScreen('test_run');
  };

  return (
    <div id="test-select-screen" className="flex-1 flex flex-col p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
          Bilimni sinash (Test)
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Kerakli test rejimini tanlang va o‘zlashtirish darajangizni sinovdan o‘tkazing
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-50/80 border border-indigo-200/70 rounded-2xl p-4 text-xs text-indigo-900 flex items-start gap-3 shadow-2xs">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block text-indigo-950 mb-0.5">Spaced Repetition integratsiyasi</span>
          Test davomida xato qilingan barcha so‘zlar avtomatik tarzda ertangi takrorlash kartotekangizga yo‘naltiriladi.
        </div>
      </div>

      {/* Smart Weakness Practice Card */}
      {(() => {
        const isUserPremium = Boolean(user.premiumStatus || user.isPremium);
        return (
          <div
            onClick={() => {
              if (!isUserPremium) openLockedFeatureModal('weak_words');
            }}
            className={`border rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-2xs transition-all ${
              !isUserPremium
                ? 'bg-linear-to-r from-amber-50/50 via-rose-50/30 to-amber-50/40 border-amber-300/80 hover:border-amber-400 cursor-pointer'
                : 'bg-linear-to-r from-rose-500/10 via-amber-500/10 to-orange-500/10 border-rose-200/90'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider">
                    Adaptiv Mashq
                  </span>
                  {!isUserPremium ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border border-amber-300 bg-amber-100 text-amber-900 shadow-2xs">
                      <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                      PRO QULFLANGAN
                    </span>
                  ) : null}
                  <span className="text-xs font-bold text-rose-950">
                    Mening xatolarim ({pastErrors.length} ta so‘z)
                  </span>
                </div>
                <p className="text-xs text-stone-600 max-w-md leading-relaxed">
                  Oldingi test va fleshkarta o‘yinlarida ko‘p xato qilgan so‘zlaringiz ustida ishlang. Har bir to‘g‘ri javob uchun <strong className="text-rose-700 font-bold">+20 XP</strong> beriladi.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isUserPremium ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLockedFeatureModal('weak_words');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 fill-stone-950" />
                    <span>Premium bilan ochish</span>
                  </button>
                ) : pastErrors.length > 0 ? (
                  <>
                    <button
                      onClick={startWeaknessPractice}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tezkor test</span>
                    </button>
                    <button
                      onClick={() => setCurrentScreen('weak_words')}
                      className="px-3 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Ro‘yxat
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setCurrentScreen('weak_words')}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Xatolarni ko‘rish
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Official Standardized Tests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Rasmiy & Xalqaro Imtihonlar</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            Haqiqiy format
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CEFR Diagnostic Test Card */}
          <div
            onClick={() => {
              if (!user.premiumStatus) {
                openLockedFeatureModal('certificate_test');
              } else {
                setCurrentScreen('certificate_test');
              }
            }}
            className={`text-white p-5 rounded-3xl border shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ${
              !user.premiumStatus
                ? 'bg-linear-to-br from-indigo-950 via-slate-900 to-amber-950/40 border-amber-500/40 hover:border-amber-400'
                : 'bg-indigo-950 border-indigo-900 hover:border-indigo-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] uppercase tracking-wider">
                    CEFR Diagnostika
                  </span>
                  {!user.premiumStatus && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border border-amber-400/40 bg-amber-400/20 text-amber-300">
                      <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                      PRO
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-indigo-300">
                  20 Savol • 15 daq
                </span>
              </div>

              <h3 className="font-display font-extrabold text-base text-white group-hover:text-amber-300 transition-colors">
                Rasmiy CEFR Diagnostika & Sertifikat
              </h3>
              <p className="text-xs text-indigo-200/85 mt-1.5 leading-relaxed">
                Cambridge & Milliy Sertifikat standarti. Grammatika, leksik boylik va matn tahlili orqali A1–C2 darajangizni aniqlang.
              </p>

              {!user.premiumStatus && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 mt-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Premium obunachilar uchun • Imkoniyatlarni ko‘rish</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-900 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>
                {!user.premiumStatus
                  ? 'Sertifikatli testni ochish (PRO)'
                  : 'Sertifikatli testni boshlash'}
              </span>
              {!user.premiumStatus ? (
                <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </div>
          </div>

          {/* IELTS Computer-Delivered Mock Test Card */}
          <div
            onClick={() => setCurrentScreen('ielts_test')}
            className="bg-stone-900 text-white p-5 rounded-3xl border border-stone-800 shadow-md hover:border-red-900 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
                  IELTS on Computer
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  9.0 Band Shkalasi
                </span>
              </div>

              <h3 className="font-display font-extrabold text-base text-white group-hover:text-red-400 transition-colors">
                IELTS Computer-Delivered Mock Test
              </h3>
              <p className="text-xs text-stone-300/85 mt-1.5 leading-relaxed">
                Haqiqiy IDP & BC interfeysi: split-screen akademik matn, True/False/Not Given, Heading Matching va rasmiy TRF hisoboti.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-bold text-red-400">
              <span>IELTS simulyatsiyasini boshlash</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Darajani aniqlash testi (Placement Test) Action Banner */}
      <div
        onClick={() => openPlacementTestModal()}
        className="p-4 rounded-3xl bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300 shrink-0 border border-white/20 group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                Placement Test
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-black">
                80%+ o‘tish
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white">
              Darajani aniqlash testi (Placement Quiz)
            </h3>
            <p className="text-xs text-purple-100 line-clamp-1">
              Testdan 80%+ to‘plang va kerakli CEFR darajasi hamda oldingi barcha mavzularni bir zumda oching!
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            openPlacementTestModal();
          }}
          className="px-4 py-2.5 rounded-xl bg-white text-purple-950 font-black text-xs hover:bg-stone-100 shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Darajani aniqlash</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CEFR Level Tests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>CEFR Daraja Testlari (A1–C2)</span>
          </span>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
            10,000 ta so‘z
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
            const meta = CEFR_LEVELS_META[lvl];
            return (
              <button
                key={lvl}
                onClick={() => handleSelectCefrTest(lvl)}
                className="bg-white p-3.5 rounded-2xl border border-stone-200/80 hover:border-indigo-400 hover:shadow-xs transition-all text-left group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-white font-black text-xs bg-linear-to-r ${meta.gradient}`}
                    >
                      {lvl}
                    </span>
                    <span className="text-[10px] text-stone-500 font-bold">
                      {meta.count} ta so‘z
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-stone-900 mt-2.5 group-hover:text-indigo-600 transition-colors">
                    {meta.nameEn} Testi
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5 font-medium">
                    IELTS {meta.ieltsBand}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                  <span>15 ta savol</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modes Grid */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Takrorlash va maxsus rejimlar
        </div>
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => handleSelectMode(m.id)}
              className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 max-w-[240px] leading-relaxed">
                    {m.desc}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-stone-500 mt-1.5 bg-stone-100 px-2 py-0.5 rounded-md">
                    {m.count}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-indigo-600 group-hover:text-white text-stone-400 flex items-center justify-center transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
