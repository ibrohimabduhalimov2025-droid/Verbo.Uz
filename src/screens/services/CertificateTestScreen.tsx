import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Share2,
  Printer,
  Sparkles,
  ShieldCheck,
  QrCode,
  Clock,
  RotateCcw,
  Check,
  X,
  Flag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileCheck,
  BarChart3,
  Layers,
  GraduationCap,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export interface CefrDiagnosticQuestion {
  id: number;
  part: 'grammar' | 'vocabulary' | 'reading';
  partTitle: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  question: string;
  passageText?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillFocus: string;
}

const CEFR_DIAGNOSTIC_QUESTIONS: CefrDiagnosticQuestion[] = [
  // PART 1: Grammar & Use of English (Questions 1–7)
  {
    id: 1,
    part: 'grammar',
    partTitle: 'Part 1: Grammar & Use of English',
    level: 'A1',
    question: 'Choose the correct form: "Where ___ you from?"',
    options: ['are', 'is', 'be', 'do'],
    correctIndex: 0,
    explanation: 'With subject pronoun "you" in the present simple tense of "to be", the correct verb is "are".',
    skillFocus: 'Present simple "to be"',
  },
  {
    id: 2,
    part: 'grammar',
    partTitle: 'Part 1: Grammar & Use of English',
    level: 'A2',
    question: 'Select the missing preposition: "She has been living in Tashkent ___ three years."',
    options: ['for', 'since', 'during', 'from'],
    correctIndex: 0,
    explanation: 'We use "for" with a duration of time ("three years"), whereas "since" is used with a specific starting point.',
    skillFocus: 'Present perfect time markers (for vs since)',
  },
  {
    id: 3,
    part: 'grammar',
    partTitle: 'Part 1: Grammar & Use of English',
    level: 'B1',
    question: 'Complete the sentence: "If I ___ more time yesterday, I would have attended the seminar."',
    options: ['had had', 'have had', 'had', 'would have'],
    correctIndex: 0,
    explanation: 'Third conditional requires "had + past participle" (had had) in the if-clause for past unreal conditions.',
    skillFocus: 'Third conditional (unreal past)',
  },
  {
    id: 4,
    part: 'grammar',
    partTitle: 'Part 1: Grammar & Use of English',
    level: 'B1',
    question: 'Choose the correct modal verb: "You ___ take an umbrella; the forecast says it will remain completely sunny all day."',
    options: ['needn’t', 'mustn’t', 'can’t', 'shouldn’t have'],
    correctIndex: 0,
    explanation: '"Needn\'t" expresses lack of obligation/necessity in the present.',
    skillFocus: 'Modals of necessity & absence of obligation',
  },
  {
    id: 5,
    part: 'grammar',
    partTitle: 'Part 1: Grammar & Use of English',
    level: 'B2',
    question: 'Choose the correct inversion structure: "Seldom ___ such an awe-inspiring natural phenomenon."',
    options: [
      'have I witnessed',
      'I have witnessed',
      'did I witnessed',
      'I witnessed',
    ],
    correctIndex: 0,
    explanation: 'Negative and restrictive adverbs (Seldom, Rarely, Never) at the start of a clause trigger subject-auxiliary inversion.',
    skillFocus: 'Negative inversion for formal emphasis',
  },
  {
    id: 6,
    part: 'grammar',
    partTitle: 'Part 1: Grammar & Use of English',
    level: 'B2',
    question: 'Select the passive causative: "They decided to have their headquarters ___ by a world-renowned architect."',
    options: ['redesigned', 'redesigning', 'redesign', 'to redesign'],
    correctIndex: 0,
    explanation: 'The causative structure "have + object + past participle" indicates that an action is arranged to be done by someone else.',
    skillFocus: 'Causative passive structure',
  },
  {
    id: 7,
    part: 'grammar',
    partTitle: 'Part 1: Grammar & Use of English',
    level: 'C1',
    question: 'Identify the correct subjunctive form: "It is imperative that the research director ___ notified immediately of any laboratory contamination."',
    options: ['be', 'is', 'was', 'being'],
    correctIndex: 0,
    explanation: 'Formal present subjunctive with expressions like "it is imperative that..." uses the base bare form of the verb ("be").',
    skillFocus: 'Mandative subjunctive in formal English',
  },

  // PART 2: Lexical Resource & Collocations (Questions 8–14)
  {
    id: 8,
    part: 'vocabulary',
    partTitle: 'Part 2: Lexical Resource & Collocations',
    level: 'A2',
    question: 'Choose the natural collocation: "Could you please ___ the table for lunch?"',
    options: ['set', 'make', 'put', 'do'],
    correctIndex: 0,
    explanation: 'In standard English, the fixed collocation is to "set the table" (or "lay the table").',
    skillFocus: 'Everyday collocations',
  },
  {
    id: 9,
    part: 'vocabulary',
    partTitle: 'Part 2: Lexical Resource & Collocations',
    level: 'B1',
    question: 'Select the correct phrasal verb: "We had to ___ the meeting until next Tuesday because the chairman fell ill."',
    options: ['put off', 'put on', 'call for', 'bring up'],
    correctIndex: 0,
    explanation: '"Put off" means to postpone or delay an event to a later date.',
    skillFocus: 'Essential phrasal verbs',
  },
  {
    id: 10,
    part: 'vocabulary',
    partTitle: 'Part 2: Lexical Resource & Collocations',
    level: 'B2',
    question: 'What is the precise academic synonym for "essential" or "indispensable"?',
    options: ['Crucial', 'Incidental', 'Sporadic', 'Negligible'],
    correctIndex: 0,
    explanation: '"Crucial" means extremely important or essential. The other options signify minor, occasional, or negligible things.',
    skillFocus: 'Academic synonyms & precision',
  },
  {
    id: 11,
    part: 'vocabulary',
    partTitle: 'Part 2: Lexical Resource & Collocations',
    level: 'B2',
    question: 'Choose the correct dependent preposition: "The young apprentice was capable ___ mastering complex mechanical algorithms."',
    options: ['of', 'to', 'for', 'with'],
    correctIndex: 0,
    explanation: 'The adjective "capable" is strictly followed by the preposition "of" + gerund/noun.',
    skillFocus: 'Dependent prepositions (capable of)',
  },
  {
    id: 12,
    part: 'vocabulary',
    partTitle: 'Part 2: Lexical Resource & Collocations',
    level: 'B2',
    question: 'Which idiom signifies "to confront an unpleasant or difficult reality with determination"?',
    options: [
      'Bite the bullet',
      'Beat around the bush',
      'Burn the midnight oil',
      'Spill the beans',
    ],
    correctIndex: 0,
    explanation: '"To bite the bullet" means to face a difficult situation with fortitude and resolve.',
    skillFocus: 'Idiomatic competence',
  },
  {
    id: 13,
    part: 'vocabulary',
    partTitle: 'Part 2: Lexical Resource & Collocations',
    level: 'C1',
    question: 'Select the word that best fits: "The diplomatic envoy issued an ___ denial of any involvement in the regional trade dispute."',
    options: ['unequivocal', 'unintended', 'unrelated', 'unskilled'],
    correctIndex: 0,
    explanation: '"Unequivocal" means leaving no doubt, unambiguous, or absolute.',
    skillFocus: 'High-level academic collocations (unequivocal denial)',
  },
  {
    id: 14,
    part: 'vocabulary',
    partTitle: 'Part 2: Lexical Resource & Collocations',
    level: 'C1',
    question: 'What is the exact antonym of "scarce" (existing in very small quantities)?',
    options: ['Abundant', 'Meager', 'Deficient', 'Sparse'],
    correctIndex: 0,
    explanation: '"Abundant" means present in great quantities, making it the direct antonym of "scarce".',
    skillFocus: 'Lexical antonyms & nuance',
  },

  // PART 3: Reading Comprehension & Discourse Logic (Questions 15–20)
  {
    id: 15,
    part: 'reading',
    partTitle: 'Part 3: Reading Comprehension & Discourse Logic',
    level: 'B1',
    passageText:
      'Urban green spaces—ranging from rooftop gardens to municipal arboretums—play a multifaceted role in contemporary city life. Beyond providing aesthetic value, they significantly mitigate the "urban heat island" effect by evaporating moisture and shading concrete surfaces.',
    question: 'According to the passage, urban green spaces:',
    options: [
      'Lower city temperatures through moisture evaporation and shading',
      'Are established exclusively for visual and aesthetic pleasure',
      'Contribute to the urban heat island effect',
      'Require more energy than concrete architecture',
    ],
    correctIndex: 0,
    explanation: 'The passage explicitly says they "significantly mitigate the \'urban heat island\' effect by evaporating moisture and shading concrete surfaces."',
    skillFocus: 'Factual text comprehension',
  },
  {
    id: 16,
    part: 'reading',
    partTitle: 'Part 3: Reading Comprehension & Discourse Logic',
    level: 'B2',
    passageText:
      'Advancements in computational linguistics have blurred the boundaries between synthetic and organic prose. While neural networks can produce syntactically flawless essays, scholars contend that deep understanding—the subjective appreciation of emotional resonance and cultural subtext—remains an exclusively human domain.',
    question: 'What is the primary contrast made in the passage?',
    options: [
      'Syntactic accuracy versus genuine emotional and cultural understanding',
      'The speed of computers versus human writing velocity',
      'The cost of organic prose versus machine computation',
      'Ancient literature versus contemporary scientific publications',
    ],
    correctIndex: 0,
    explanation: 'The text balances "syntactically flawless essays" generated by neural networks against "deep understanding... emotional resonance and cultural subtext" belonging to humans.',
    skillFocus: 'Identifying main thematic contrast',
  },
  {
    id: 17,
    part: 'reading',
    partTitle: 'Part 3: Reading Comprehension & Discourse Logic',
    level: 'B2',
    passageText:
      'The economic viability of renewable energy storage systems has accelerated remarkably over the past decade. Lithium-iron-phosphate battery chemistry, once deemed too cumbersome for scalable distribution, has experienced exponential cost deflation alongside continuous energy-density optimization.',
    question: 'The author implies that lithium-iron-phosphate battery chemistry:',
    options: [
      'Overcame earlier skepticism regarding its commercial scalability and cost',
      'Is currently declining in popularity due to hazardous components',
      'Proved entirely ineffective for municipal energy grids',
      'Requires substantial subsidies to compete with fossil fuels',
    ],
    correctIndex: 0,
    explanation: 'The passage states it was "once deemed too cumbersome", but has since experienced "exponential cost deflation" and optimization.',
    skillFocus: 'Implicit meaning & inference',
  },
  {
    id: 18,
    part: 'reading',
    partTitle: 'Part 3: Reading Comprehension & Discourse Logic',
    level: 'C1',
    passageText:
      'Linguistic relativity posits that the grammatical architecture of one’s mother tongue subtly predisposes cognition toward specific perceptual categories. However, contemporary cognitive scientists maintain that while vocabulary may influence memory retrieval speed, it by no means confines the ultimate frontiers of conceptualization.',
    question: 'Which statement aligns most accurately with contemporary cognitive scientists’ perspective?',
    options: [
      'Language influences cognitive processing speed without strictly limiting conceptual thinking',
      'Human thoughts are utterly constrained by maternal grammar',
      'Vocabulary has zero measurable effect on human memory retrieval',
      'Grammatical architecture prevents people from learning foreign concepts',
    ],
    correctIndex: 0,
    explanation: 'Scientists maintain vocabulary "may influence memory retrieval speed", but "by no means confines the ultimate frontiers of conceptualization."',
    skillFocus: 'Complex academic discourse synthesis',
  },
  {
    id: 19,
    part: 'reading',
    partTitle: 'Part 3: Reading Comprehension & Discourse Logic',
    level: 'C1',
    question: 'Choose the most cohesive logical connective: "The experimental protocol was fraught with unexpected technical glitches; ___, the data collected provided invaluable preliminary insights."',
    options: ['nevertheless', 'consequently', 'similarly', 'furthermore'],
    correctIndex: 0,
    explanation: '"Nevertheless" expresses concession/contrast (in spite of the technical glitches, the data was still invaluable).',
    skillFocus: 'Discourse markers & cohesion',
  },
  {
    id: 20,
    part: 'reading',
    partTitle: 'Part 3: Reading Comprehension & Discourse Logic',
    level: 'C2',
    question: 'Select the phrase demonstrating native-like lexical precision: "Her argument was so lucid that it effectively ___ all prior objections raised by the committee."',
    options: ['dismantled', 'dislocated', 'discontinued', 'disgraced'],
    correctIndex: 0,
    explanation: 'Arguments are figuratively "dismantled" (broken down methodically piece by piece).',
    skillFocus: 'C2 figurative & rhetorical precision',
  },
];

// Helper to determine CEFR Level, sub-scores, and Can-Do descriptors
export function computeCefrDiagnosticResult(correctAnswers: number, answersMap: Record<number, number>) {
  const total = CEFR_DIAGNOSTIC_QUESTIONS.length;
  const percentage = Math.round((correctAnswers / total) * 100);

  // Sub-skill calculation
  let grammarCorrect = 0;
  let vocabCorrect = 0;
  let readingCorrect = 0;

  CEFR_DIAGNOSTIC_QUESTIONS.forEach((q) => {
    const isCorrect = answersMap[q.id] === q.correctIndex;
    if (isCorrect) {
      if (q.part === 'grammar') grammarCorrect++;
      else if (q.part === 'vocabulary') vocabCorrect++;
      else if (q.part === 'reading') readingCorrect++;
    }
  });

  const grammarTotal = 7;
  const vocabTotal = 7;
  const readingTotal = 6;

  let cefrLevel = 'A2';
  let title = 'Elementary / Pre-Intermediate';
  let canDoText =
    'Foydalanuvchi oddiy kundalik so‘zlarni tushunadi va o‘ziga tanish bo‘lgan asosiy mavzularda qisqa gaplar tuza oladi.';
  let ieltsEquiv = '3.5 – 4.0';

  if (percentage >= 90) {
    cefrLevel = 'C1 / C2';
    title = 'Advanced / Mastery (Professional)';
    canDoText =
      'Murakkab va uzun matnlarning yashirin ma’nolarini tushunadi. O‘z fikrini erkin, ravon va tabiiy ifoda eta oladi. Ilmiy, akademik va professional faoliyatda tildan samarali foydalanadi.';
    ieltsEquiv = '7.5 – 8.5';
  } else if (percentage >= 75) {
    cefrLevel = 'B2';
    title = 'Vantage (Upper-Intermediate)';
    canDoText =
      'Murakkab mavzulardagi matnlarning asosiy mazmunini tushuna oladi. Ona tilida so‘zlashuvchilar bilan bemalol fikr almashadi. Turli masalalar bo‘yicha batafsil, aniq va asosli fikr bildiradi.';
    ieltsEquiv = '6.0 – 7.0';
  } else if (percentage >= 55) {
    cefrLevel = 'B1';
    title = 'Threshold (Intermediate)';
    canDoText =
      'Ish, o‘qish va sayohat kabi tanish mavzularda nutqning asosiy mazmunini ilg‘ay oladi. O‘z taassurotlari, rejalari va fikrlarini sodda bog‘langan matn shaklida yetkaza oladi.';
    ieltsEquiv = '4.5 – 5.5';
  } else if (percentage >= 35) {
    cefrLevel = 'A2';
    title = 'Waystage (Pre-Intermediate)';
    canDoText =
      'Kundalik hayot, xaridlar va oilaviy mavzulardagi iboralarni tushunadi. Oddiy muloqot vaziyatlarida asosiy ma’lumotlarni almashadi.';
    ieltsEquiv = '3.5 – 4.0';
  } else {
    cefrLevel = 'A1';
    title = 'Breakthrough (Beginner)';
    canDoText =
      'Eng oddiy kundalik iboralar va asosiy so‘zlarni tushunadi. Sekin va aniq gapirilganda o‘zini tanishtira oladi.';
    ieltsEquiv = '2.5 – 3.0';
  }

  return {
    percentage,
    cefrLevel,
    title,
    canDoText,
    ieltsEquiv,
    grammarPercent: Math.round((grammarCorrect / grammarTotal) * 100),
    vocabPercent: Math.round((vocabCorrect / vocabTotal) * 100),
    readingPercent: Math.round((readingCorrect / readingTotal) * 100),
    grammarCorrect,
    vocabCorrect,
    readingCorrect,
  };
}

export const CertificateTestScreen: React.FC = () => {
  const { setCurrentScreen, user, openLockedFeatureModal } = useApp();

  const [state, setState] = useState<'intro' | 'testing' | 'certificate'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [candidateName, setCandidateName] = useState(user.name || 'Ibrohim Abduhalimov');

  // Exam timer: 15 minutes (900s)
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (state !== 'testing') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleFlag = (qId: number) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const finishTest = () => {
    setState('certificate');
    try {
      confetti({ particleCount: 120, spread: 85, origin: { y: 0.6 } });
    } catch {}
  };

  const currentQ = CEFR_DIAGNOSTIC_QUESTIONS[currentIdx];

  // Calculate score
  const correctCount = CEFR_DIAGNOSTIC_QUESTIONS.reduce((acc, q) => {
    return answers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const diagResult = computeCefrDiagnosticResult(correctCount, answers);

  const answeredCount = Object.keys(answers).length;

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      setToastMessage('Brauzer chop etish oynasi ochilmadi.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Verbo.uz Rasmiy CEFR Sertifikati',
          text: `Men Verbo.uz xalqaro diagnostika testida CEFR ${diagResult.cefrLevel} darajasini tasdiqladim!`,
        })
        .catch(() => {});
    } else {
      try {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(window.location.href);
        }
      } catch {}
      setToastMessage('Sertifikat havolasi nusxalandi!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div id="certificate-test-screen" className="flex-1 flex flex-col bg-stone-50 overflow-y-auto min-h-screen">
      {/* 1. Header Bar */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button
          onClick={() => {
            if (state === 'testing') {
              setShowExitConfirm(true);
            } else {
              setCurrentScreen('test_select');
            }
          }}
          className="p-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Chiqish</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-stone-900 block">
            CEFR Diagnostika & Rasmiy Sertifikat
          </span>
          <span className="text-[10px] text-stone-500 font-mono">
            Cambridge & Milliy Standart • 20 Savol
          </span>
        </div>

        {/* Timer when in testing */}
        {state === 'testing' ? (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
              secondsLeft <= 180
                ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* 2. Intro Screen */}
      {state === 'intro' && (
        <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto flex flex-col justify-center space-y-5">
          {/* Hero Banner */}
          <div className="bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-3 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Official Diagnostic Assessment
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              Verbo.uz Rasmiy CEFR Diagnostikasi
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
              Yevropa Til Ko‘nikmalari Standarti (CEFR) va O‘zbekiston Milliy Sertifikat formati asosida tuzilgan 20 ta diagnostik savol orqali aniq darajangizni aniqlang va raqamli sertifikatni oling.
            </p>
          </div>

          {/* Test Structure 3 Parts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 text-center space-y-1">
              <span className="text-xs font-bold text-indigo-600 block">Part 1 (7 ta savol)</span>
              <span className="text-xs font-bold text-stone-900 block">Grammar & Syntax</span>
              <span className="text-[10px] text-stone-400 block">Inversiya, passiv va zamonlar</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 text-center space-y-1">
              <span className="text-xs font-bold text-indigo-600 block">Part 2 (7 ta savol)</span>
              <span className="text-xs font-bold text-stone-900 block">Lexical Resource</span>
              <span className="text-[10px] text-stone-400 block">Iboralar va kollokatsiyalar</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 text-center space-y-1">
              <span className="text-xs font-bold text-indigo-600 block">Part 3 (6 ta savol)</span>
              <span className="text-xs font-bold text-stone-900 block">Reading & Logic</span>
              <span className="text-[10px] text-stone-400 block">Matn tahlili va diskurs</span>
            </div>
          </div>

          {/* Candidate Name Input */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Sertifikatda aks etadigan to‘liq F.I.O:
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Ism va Familiyangiz"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          {/* Locked Notice if Not Premium */}
          {!user.premiumStatus && (
            <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                    Verbo Premium Eksklyuziv
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-950">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Rasmiy CEFR diagnostika testi va tekshiriluvchi QR-kodli shaxsiy sertifikat olish Verbo Premium obunachilariga taqdim etiladi.
                </p>
              </div>
            </div>
          )}

          {/* Start CTA */}
          <button
            onClick={() => {
              if (!user.premiumStatus) {
                openLockedFeatureModal('certificate_test');
                return;
              }
              setAnswers({});
              setFlagged({});
              setCurrentIdx(0);
              setSecondsLeft(900);
              setState('testing');
            }}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              !user.premiumStatus
                ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 active:scale-[0.99]'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.99]'
            }`}
          >
            {!user.premiumStatus ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Premium orqali qulfni ochish va testni boshlash</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Diagnostik testni boshlash (15 daqiqa)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 3. Testing Screen */}
      {state === 'testing' && (
        <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-4">
          {/* Question Palette Header */}
          <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">
                Savollar navigatsiyasi ({answeredCount} / {CEFR_DIAGNOSTIC_QUESTIONS.length} yechildi)
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {currentQ.partTitle}
              </span>
            </div>

            {/* 20 Question Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CEFR_DIAGNOSTIC_QUESTIONS.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center relative transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            {/* Question Meta Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                  {currentQ.level} Daraja
                </span>
                <span className="text-[11px] text-stone-400 font-medium">
                  {currentQ.skillFocus}
                </span>
              </div>

              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-colors ${
                  flagged[currentQ.id]
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                }`}
                title="Savolga belgi qo‘yish"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="text-[10px]">
                  {flagged[currentQ.id] ? 'Belgilangan' : 'Belgilash'}
                </span>
              </button>
            </div>

            {/* Reading Passage (if present) */}
            {currentQ.passageText && (
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                <span className="font-sans font-bold text-[10px] text-indigo-600 uppercase tracking-wider block mb-1">
                  Matn parchasini o‘qing:
                </span>
                {currentQ.passageText}
              </div>
            )}

            {/* Question Text */}
            <h2 className="font-bold text-sm sm:text-base text-stone-900 leading-relaxed">
              <span className="text-indigo-600 mr-2 font-mono">#{currentIdx + 1}.</span>
              {currentQ.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(currentQ.id, oIdx)}
                    className={`w-full p-3.5 text-left rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-800 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Oldingi</span>
            </button>

            {currentIdx + 1 < CEFR_DIAGNOSTIC_QUESTIONS.length ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ml-auto"
              >
                <span>Keyingi savol</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={finishTest}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ml-auto"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Testni yakunlash</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Certificate & Diagnostic Results Screen */}
      {state === 'certificate' && (
        <div className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-6 animate-in zoom-in-95">
          {/* Printable Official Certificate */}
          <div
            id="verbo-certificate"
            className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-double border-amber-500/40 shadow-xl text-center relative overflow-hidden print:border-none print:shadow-none"
          >
            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-8 border-amber-500/5 flex items-center justify-center pointer-events-none">
              <span className="text-9xl opacity-10">🏆</span>
            </div>

            {/* Certificate Header */}
            {/* Official Verbo School Crest Emblem */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-600/30 shadow-xs mb-2 bg-white">
                <img src="/logo.png" alt="Verbo School" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-stone-600 uppercase">
                  Verbo School • International CEFR Assessment
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 uppercase tracking-wider">
              Certificate of Language Proficiency
            </h2>
            <div className="text-[11px] text-stone-400 font-sans mt-0.5">
              CEFR English Competency & Diagnostic Achievement
            </div>

            <div className="my-4 pt-3 pb-3 border-t border-b border-stone-100">
              <span className="text-[10px] text-stone-400 block">Ushbu sertifikat topshiriladi:</span>
              <span className="text-xl sm:text-2xl font-display font-extrabold text-stone-900 block mt-0.5">
                {candidateName}
              </span>
            </div>

            {/* CEFR Badge Centerpiece */}
            <div className="my-3 py-3 px-6 bg-amber-50/80 rounded-2xl border border-amber-200/80 inline-block shadow-2xs">
              <span className="text-3xl font-display font-black text-amber-900 block">
                CEFR {diagResult.cefrLevel}
              </span>
              <span className="text-xs font-bold text-amber-800">
                {diagResult.title}
              </span>
              <div className="text-[11px] font-mono text-amber-700/90 mt-1">
                Aniqlik: {diagResult.percentage}% ({correctCount} / {CEFR_DIAGNOSTIC_QUESTIONS.length} to‘g‘ri) • IELTS {diagResult.ieltsEquiv}
              </div>
            </div>

            {/* Can-Do Descriptor */}
            <div className="max-w-md mx-auto my-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-left text-xs text-stone-600 leading-relaxed">
              <span className="font-bold text-stone-800 block text-[11px] uppercase tracking-wider mb-1">
                CEFR Malaka Tavsifi (Can-Do Competency):
              </span>
              {diagResult.canDoText}
            </div>

            {/* Sub-Skill Diagnostic Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 my-4 text-left">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 block">Grammar & Syntax</span>
                <span className="text-sm font-bold text-stone-900 font-mono block">
                  {diagResult.grammarPercent}%
                </span>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${diagResult.grammarPercent}%` }}
                  />
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 block">Lexical Resource</span>
                <span className="text-sm font-bold text-stone-900 font-mono block">
                  {diagResult.vocabPercent}%
                </span>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full"
                    style={{ width: `${diagResult.vocabPercent}%` }}
                  />
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 block">Reading & Logic</span>
                <span className="text-sm font-bold text-stone-900 font-mono block">
                  {diagResult.readingPercent}%
                </span>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${diagResult.readingPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Signatures & Security Stamp */}
            <div className="flex items-end justify-between pt-4 mt-2 border-t border-stone-100 text-left text-[10px] text-stone-400">
              <div>
                <span className="font-mono text-stone-600 block">Sana: 16-Sentyabr, 2026</span>
                <span className="font-mono text-stone-500">ID: VRB-CEFR-2026-UZ-9021</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-stone-700">Verbo Verified</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Sertifikatni chop etish (PDF)</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3.5 px-5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Ulashish</span>
            </button>

            <button
              onClick={() => {
                setAnswers({});
                setFlagged({});
                setCurrentIdx(0);
                setSecondsLeft(900);
                setState('intro');
              }}
              className="py-3.5 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qayta topshirish</span>
            </button>
          </div>

          {toastMessage && (
            <div className="p-3 bg-stone-900 text-white text-center text-xs rounded-xl animate-in fade-in">
              {toastMessage}
            </div>
          )}
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">Testni to‘xtatmoqchimisiz?</h3>
              <p className="text-xs text-stone-500 mt-1">
                Chiqib ketsangiz, joriy javoblaringiz saqlanmaydi va test boshidan boshlanadi.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                Davom etish
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  setState('intro');
                }}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
              >
                Testdan chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
