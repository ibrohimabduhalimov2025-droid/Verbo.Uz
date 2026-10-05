import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  Flag,
  HelpCircle,
  Volume2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Printer,
  Share2,
  Sparkles,
  BookOpen,
  Award,
  FileText,
  Check,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export interface IeltsQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false_not_given' | 'fill_blank' | 'matching_heading';
  instruction: string;
  passageParagraph?: string; // Reference to paragraph A, B, C, etc.
  questionText: string;
  options?: string[]; // For multiple choice
  headingsList?: { key: string; text: string }[]; // For matching heading
  correctAnswer: string; // "A", "TRUE", "NOT GIVEN", or exact word(s)
  acceptableAnswers?: string[];
  explanation: string;
  lexicalSkill: string;
}

const IELTS_PASSAGE = {
  title: 'The Evolution of Cognitive Communication in Marine Mammals',
  subtitle: 'Academic Reading — Passage 1',
  paragraphs: [
    {
      letter: 'A',
      text: 'For centuries, human observers have marveled at the apparent sophistication of marine mammal vocalizations, particularly those of cetaceans such as bottlenose dolphins (Tursiops truncatus) and humpback whales (Megaptera novaeangliae). Unlike terrestrial mammals whose acoustic repertoires are predominantly innate and reflexive, cetaceans demonstrate an extraordinary capacity for vocal production learning. This rare biological trait allows individuals to modify their acoustic outputs in response to auditory feedback and environmental immersion.',
    },
    {
      letter: 'B',
      text: 'Pioneering marine bioacousticians in the late twentieth century discovered that individual dolphins possess unique frequency-modulated whistles, termed "signature whistles". These acoustic identifiers serve essentially as vocal names, comprising roughly half of an individual’s total acoustic emissions in the wild. Longitudinal tagging studies revealed that calves typically formulate their personalized whistle within the initial twelve months of life, often borrowing spectral contours from individuals with whom they share familial proximity.',
    },
    {
      letter: 'C',
      text: 'Furthermore, the complexity of humpback whale songs introduces a cultural dimension unprecedented among non-human animals. Male humpbacks across an entire oceanic basin conform to an identical, highly structured song consisting of hierarchical themes and repeating phrases. Over months, this communal composition undergoes relentless cultural evolution, with novel vocal motifs sweeping across migratory routes. Crucially, this rapid cultural transmission occurs without genetic modification, proving that social learning drives macro-scale behavioral conformity.',
    },
    {
      letter: 'D',
      text: 'Despite these remarkable breakthroughs, conservative linguists advise caution against conflating vocal mimicry with true semantic language. While signature whistles convey identity, emotional state, and spatial coordinates, empirical evidence has not yet demonstrated syntax—the combinatorial grammar that allows humans to generate infinite conceptual permutations from finite acoustic units. Nevertheless, anthropogenic marine noise from commercial shipping now threatens to shatter these delicate acoustic networks, prompting urgent international conservation protocols.',
    },
  ],
};

const IELTS_QUESTIONS: IeltsQuestion[] = [
  {
    id: 1,
    type: 'matching_heading',
    instruction: 'Choose the correct heading for Paragraph B from the list of headings below.',
    passageParagraph: 'B',
    questionText: 'Which heading best captures the primary focus of Paragraph B?',
    headingsList: [
      { key: 'i', text: 'Cultural evolution of ocean-wide vocal songs' },
      { key: 'ii', text: 'Individual vocal identification and early acoustic development' },
      { key: 'iii', text: 'The linguistic debate over grammatical syntax' },
      { key: 'iv', text: 'Anthropogenic noise pollution and marine conservation' },
      { key: 'v', text: 'Innate versus learned vocal mechanisms in mammals' },
    ],
    correctAnswer: 'ii',
    explanation: 'Paragraph B focuses specifically on dolphins developing unique "signature whistles" that act as vocal names in the first 12 months.',
    lexicalSkill: 'Identifying main paragraph theme',
  },
  {
    id: 2,
    type: 'matching_heading',
    instruction: 'Choose the correct heading for Paragraph C from the list of headings below.',
    passageParagraph: 'C',
    questionText: 'Which heading best captures the primary focus of Paragraph C?',
    headingsList: [
      { key: 'i', text: 'Cultural evolution of ocean-wide vocal songs' },
      { key: 'ii', text: 'Individual vocal identification and early acoustic development' },
      { key: 'iii', text: 'The linguistic debate over grammatical syntax' },
      { key: 'iv', text: 'Anthropogenic noise pollution and marine conservation' },
      { key: 'v', text: 'Innate versus learned vocal mechanisms in mammals' },
    ],
    correctAnswer: 'i',
    explanation: 'Paragraph C describes humpback whale songs changing across oceanic basins through social learning and cultural evolution.',
    lexicalSkill: 'Discourse and thematic synthesis',
  },
  {
    id: 3,
    type: 'true_false_not_given',
    instruction: 'Do the following statements agree with the information in the text? Choose TRUE, FALSE, or NOT GIVEN.',
    passageParagraph: 'A',
    questionText: 'Most land mammals have vocal sounds that are genetically inherited rather than socially learned.',
    correctAnswer: 'TRUE',
    explanation: 'Paragraph A states: "Unlike terrestrial mammals whose acoustic repertoires are predominantly innate and reflexive..."',
    lexicalSkill: 'Factual verification & paraphrasing',
  },
  {
    id: 4,
    type: 'true_false_not_given',
    instruction: 'Do the following statements agree with the information in the text? Choose TRUE, FALSE, or NOT GIVEN.',
    passageParagraph: 'B',
    questionText: 'Dolphin calves always create signature whistles that are identical to their mother’s whistle.',
    correctAnswer: 'FALSE',
    explanation: 'Paragraph B notes they develop "personalized" whistles and borrow "spectral contours", rather than copying them identically.',
    lexicalSkill: 'Detecting absolute qualifier discrepancies',
  },
  {
    id: 5,
    type: 'true_false_not_given',
    instruction: 'Do the following statements agree with the information in the text? Choose TRUE, FALSE, or NOT GIVEN.',
    passageParagraph: 'C',
    questionText: 'Female humpback whales regularly alter their migration routes to hear songs performed by males.',
    correctAnswer: 'NOT GIVEN',
    explanation: 'The text discusses male humpback whale songs and migration routes, but never mentions whether females alter their routes.',
    lexicalSkill: 'Distinguishing absence of evidence',
  },
  {
    id: 6,
    type: 'true_false_not_given',
    instruction: 'Do the following statements agree with the information in the text? Choose TRUE, FALSE, or NOT GIVEN.',
    passageParagraph: 'D',
    questionText: 'Scientists have confirmed that dolphin whistles contain clear grammatical syntax equivalent to human sentences.',
    correctAnswer: 'FALSE',
    explanation: 'Paragraph D states: "empirical evidence has not yet demonstrated syntax—the combinatorial grammar that allows humans to generate infinite conceptual permutations..."',
    lexicalSkill: 'Contradiction analysis',
  },
  {
    id: 7,
    type: 'multiple_choice',
    instruction: 'Choose the correct letter, A, B, C or D.',
    passageParagraph: 'A',
    questionText: 'According to Paragraph A, what distinct ability sets cetaceans apart from most other mammals?',
    options: [
      'A) Their biological reliance on visual signals under water',
      'B) Their capacity for vocal production learning based on auditory feedback',
      'C) Their ability to navigate exclusively using magnetic ocean fields',
      'D) Their immunity to human-induced marine ambient noise',
    ],
    correctAnswer: 'B',
    explanation: 'Paragraph A explicitly highlights their "extraordinary capacity for vocal production learning" allowing them to modify acoustic outputs.',
    lexicalSkill: 'Direct detail recognition',
  },
  {
    id: 8,
    type: 'multiple_choice',
    instruction: 'Choose the correct letter, A, B, C or D.',
    passageParagraph: 'B',
    questionText: 'What proportion of a wild dolphin’s total vocal emissions is accounted for by signature whistles?',
    options: [
      'A) Exactly twelve percent',
      'B) Approximately one quarter',
      'C) Roughly fifty percent',
      'D) Nearly ninety-five percent',
    ],
    correctAnswer: 'C',
    explanation: 'Paragraph B states signature whistles comprise "roughly half of an individual’s total acoustic emissions".',
    lexicalSkill: 'Quantifier paraphrasing (half = fifty percent)',
  },
  {
    id: 9,
    type: 'multiple_choice',
    instruction: 'Choose the correct letter, A, B, C or D.',
    passageParagraph: 'C',
    questionText: 'The author mentions humpback whale songs primarily to demonstrate that:',
    options: [
      'A) Marine animals can undergo widespread cultural transmission without genetic changes',
      'B) Male whales sing only when competing for feeding territory',
      'C) Oceanic temperature changes influence song frequencies',
      'D) Songs are completely invariant across different oceans',
    ],
    correctAnswer: 'A',
    explanation: 'Paragraph C concludes that rapid cultural transmission occurs "without genetic modification, proving that social learning drives macro-scale behavioral conformity."',
    lexicalSkill: 'Author intention & argument analysis',
  },
  {
    id: 10,
    type: 'multiple_choice',
    instruction: 'Choose the correct letter, A, B, C or D.',
    passageParagraph: 'D',
    questionText: 'In Paragraph D, the word "anthropogenic" refers to noise caused by:',
    options: [
      'A) Underwater volcanic activity',
      'B) Human activity and commercial shipping',
      'C) Extreme atmospheric storms',
      'D) Natural predation between whale species',
    ],
    correctAnswer: 'B',
    explanation: '"Anthropogenic" means originating in human activity; the text couples it with "from commercial shipping".',
    lexicalSkill: 'Academic vocabulary in context',
  },
  {
    id: 11,
    type: 'fill_blank',
    instruction: 'Complete the sentence below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
    passageParagraph: 'B',
    questionText: 'Individual dolphins rely on acoustic identifiers known as _______________ to broadcast their personal identity.',
    correctAnswer: 'signature whistles',
    acceptableAnswers: ['signature whistle', 'signature whistles'],
    explanation: 'Paragraph B explicitly refers to them as "signature whistles".',
    lexicalSkill: 'Key noun collocation extraction',
  },
  {
    id: 12,
    type: 'fill_blank',
    instruction: 'Complete the sentence below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
    passageParagraph: 'D',
    questionText: 'Linguists argue that dolphin communications currently lack _______________, which is essential for infinite human sentence construction.',
    correctAnswer: 'syntax',
    acceptableAnswers: ['syntax', 'combinatorial grammar'],
    explanation: 'Paragraph D states evidence has not yet demonstrated syntax.',
    lexicalSkill: 'Grammatical concept extraction',
  },
  {
    id: 13,
    type: 'multiple_choice',
    instruction: 'Choose the correct letter, A, B, C or D.',
    passageParagraph: 'B',
    questionText: 'Which academic word from Paragraph B means "related to the distribution of frequencies in sound"?',
    options: [
      'A) Longitudinal',
      'B) Spectral',
      'C) Proximity',
      'D) Emitted',
    ],
    correctAnswer: 'B',
    explanation: 'Paragraph B mentions "spectral contours", referring to acoustic spectrum and frequency curves.',
    lexicalSkill: 'IELTS Academic Word List (AWL)',
  },
  {
    id: 14,
    type: 'multiple_choice',
    instruction: 'Choose the correct letter, A, B, C or D.',
    passageParagraph: 'C',
    questionText: 'Which phrase in Paragraph C is an academic synonym for "behavioral uniformity"?',
    options: [
      'A) Oceanic basin',
      'B) Behavioral conformity',
      'C) Migratory routes',
      'D) Repeating phrases',
    ],
    correctAnswer: 'B',
    explanation: '"Behavioral conformity" means adhering to uniform group behavior.',
    lexicalSkill: 'Collocations & lexical precision',
  },
  {
    id: 15,
    type: 'multiple_choice',
    instruction: 'Choose the correct letter, A, B, C or D.',
    passageParagraph: 'D',
    questionText: 'What is the overall tone and perspective of the author in the final paragraph?',
    options: [
      'A) Enthusiastic dismissal of all scientific research',
      'B) Objective, scientifically cautious, and environmentally conscientious',
      'C) Highly skeptical of all mammal intelligence',
      'D) Purely commercial and industrial',
    ],
    correctAnswer: 'B',
    explanation: 'The author balances linguistic caution with urgent concern for environmental conservation.',
    lexicalSkill: 'Global tone and inference',
  },
];

// Calculation of IELTS Band Score from Raw Score (15 questions)
export function calculateIeltsBandScore(rawScore: number): {
  band: number;
  descriptor: string;
  cefrEquiv: string;
  statusText: string;
} {
  if (rawScore >= 14) {
    return { band: 9.0, descriptor: 'Expert User', cefrEquiv: 'C2', statusText: 'Exceptional command of academic English' };
  } else if (rawScore >= 13) {
    return { band: 8.5, descriptor: 'Very Good User', cefrEquiv: 'C1+', statusText: 'Near-native fluency with complex arguments' };
  } else if (rawScore >= 12) {
    return { band: 8.0, descriptor: 'Very Good User', cefrEquiv: 'C1', statusText: 'Handles complex detailed argumentation well' };
  } else if (rawScore >= 11) {
    return { band: 7.5, descriptor: 'Good User', cefrEquiv: 'C1', statusText: 'Strong operational command with rare inaccuracies' };
  } else if (rawScore >= 10) {
    return { band: 7.0, descriptor: 'Good User', cefrEquiv: 'C1 / B2+', statusText: 'Meets requirements for leading international universities' };
  } else if (rawScore >= 8) {
    return { band: 6.5, descriptor: 'Competent User', cefrEquiv: 'B2', statusText: 'Effective command of English with occasional errors' };
  } else if (rawScore >= 7) {
    return { band: 6.0, descriptor: 'Competent User', cefrEquiv: 'B2', statusText: 'Satisfactory command in most familiar situations' };
  } else if (rawScore >= 5) {
    return { band: 5.5, descriptor: 'Modest User', cefrEquiv: 'B1+', statusText: 'Partial command with frequent grammatical errors' };
  } else if (rawScore >= 4) {
    return { band: 5.0, descriptor: 'Modest User', cefrEquiv: 'B1', statusText: 'Understands general meaning but struggles with nuance' };
  } else {
    return { band: 4.5, descriptor: 'Limited User', cefrEquiv: 'A2 / B1', statusText: 'Basic ability; further vocabulary building needed' };
  }
}

export const IeltsTestScreen: React.FC = () => {
  const { setCurrentScreen, user } = useApp();

  const [testState, setTestState] = useState<'instructions' | 'testing' | 'results'>('instructions');
  const [candidateName, setCandidateName] = useState(user.name || 'Ibrohim Abduhalimov');
  const [candidateNumber] = useState('004821');
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // User answers map: questionId -> answerString
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // Flagged questions for review
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  // Countdown timer: 20 minutes (1200 seconds)
  const [secondsLeft, setSecondsLeft] = useState(1200);
  const [isTimeHidden, setIsTimeHidden] = useState(false);

  // Text sizing for accessibility
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  // Submit confirmation modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Audio test modal
  const [showAudioModal, setShowAudioModal] = useState(false);

  // In-app exit confirmation modal
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Timer countdown in testing state
  useEffect(() => {
    if (testState !== 'testing') return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testState]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const toggleFlag = (qIndex: number) => {
    setFlagged((prev) => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };

  const handleFinishTest = () => {
    setShowSubmitModal(false);
    setTestState('results');
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    } catch {}
  };

  // Score calculation
  const calculateResults = () => {
    let rawScore = 0;
    const details = IELTS_QUESTIONS.map((q) => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const isCorrect =
        userAns === q.correctAnswer.toLowerCase() ||
        (q.acceptableAnswers && q.acceptableAnswers.some((a) => a.toLowerCase() === userAns));

      if (isCorrect) rawScore++;
      return {
        question: q,
        userAnswer: answers[q.id] || 'Javob berilmadi',
        isCorrect,
      };
    });

    const bandInfo = calculateIeltsBandScore(rawScore);
    return { rawScore, details, bandInfo };
  };

  const results = calculateResults();

  const currentQ = IELTS_QUESTIONS[currentQIndex];
  const answeredCount = Object.keys(answers).filter((k) => (answers[Number(k)] || '').trim() !== '').length;

  return (
    <div id="ielts-test-screen" className="flex-1 flex flex-col bg-stone-900 text-stone-100 min-h-screen">
      {/* 1. Official CD-IELTS Header */}
      <header className="bg-stone-950 border-b border-stone-800 px-4 py-2.5 flex items-center justify-between shrink-0 select-none shadow-md">
        {/* Left: Brand & Candidate Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (testState === 'testing') {
                setShowExitConfirm(true);
              } else {
                setCurrentScreen('test_select');
              }
            }}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title="Chiqish"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded-xs text-xs tracking-wider">
              IELTS
            </span>
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-stone-200 block leading-tight">
                Computer-Delivered Practice Test
              </span>
              <span className="text-[9px] text-stone-400 font-mono">
                Academic Reading & Lexical Resource
              </span>
            </div>
          </div>
        </div>

        {/* Center: Real IELTS Timer */}
        {testState === 'testing' && (
          <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg shadow-inner">
            <Clock
              className={`w-4 h-4 ${
                secondsLeft <= 120 ? 'text-red-500 animate-pulse' : 'text-amber-400'
              }`}
            />
            <div className="text-center">
              {!isTimeHidden ? (
                <span
                  className={`font-mono text-sm font-bold tracking-wider ${
                    secondsLeft <= 120 ? 'text-red-400' : 'text-stone-100'
                  }`}
                >
                  {formatTimer(secondsLeft)}
                </span>
              ) : (
                <span className="text-xs text-stone-400 font-mono">Vaqt yashiringan</span>
              )}
            </div>
            <button
              onClick={() => setIsTimeHidden(!isTimeHidden)}
              className="text-[10px] text-stone-400 hover:text-stone-200 ml-1 p-1 hover:bg-stone-800 rounded-sm flex items-center gap-1"
              title={isTimeHidden ? "Vaqtni ko'rsatish" : "Vaqtni yashirish"}
            >
              {isTimeHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Right: Candidate Details & Controls */}
        <div className="flex items-center gap-2.5 text-right">
          <div className="hidden md:block">
            <div className="text-[11px] font-semibold text-stone-200">{candidateName}</div>
            <div className="text-[9px] font-mono text-stone-400">Cand. No: {candidateNumber}</div>
          </div>

          <button
            onClick={() => setTextSize(textSize === 'normal' ? 'large' : 'normal')}
            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 rounded text-[10px] font-bold text-stone-300 transition-colors"
            title="Matn hajmini o‘zgartirish"
          >
            {textSize === 'normal' ? 'A+' : 'A-'}
          </button>

          <button
            onClick={() => setShowAudioModal(true)}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 transition-colors"
            title="Ovoz va yordam"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Content Views */}
      {testState === 'instructions' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-3xl mx-auto flex flex-col justify-center space-y-6">
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-red-600 text-white font-extrabold text-xs tracking-wider rounded-xs">
                  IDP / BC FORMAT
                </span>
                <span className="text-xs font-bold text-stone-400">
                  IELTS on Computer Simulation
                </span>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800 px-2.5 py-0.5 rounded-full">
                20 Daqiqa • 15 Savol
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                IELTS Academic Reading & Lexical Test
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-1.5 leading-relaxed">
                Ushbu sinov haqiqiy Computer-Delivered IELTS formati bo‘yicha tuzilgan. Matnni tahlil qilib, sarlavhalarni moslashtirish, True/False/Not Given va bo‘sh o‘rinlarni to‘ldirish savollariga javob bering.
              </p>
            </div>

            {/* Test Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  <span>Akademik Matn: 4 ta Paragraf</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Ekran chap tomonida to‘liq ilmiy matn (A–D paragraflar) joylashgan bo‘lib, o‘ng tomonda savollar ketma-ket chiqadi.
                </p>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>9.0 Band Shkalasi</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Test yakunida haqiqiy IELTS konvertatsiyasi asosida umumiy Band Score (masalan: Band 6.5, 7.5, 8.0) hisoblab beriladi.
                </p>
              </div>
            </div>

            {/* Candidate Name Input */}
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block">
                Nomzodning F.I.O (Test Report Form uchun):
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="F.I.O"
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Rules list */}
            <div className="space-y-2 text-xs text-stone-400 border-t border-stone-800 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Har qanday savolga istalgan payt pastdagi panel orqali o‘tishingiz mumkin.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ikkilangan savollaringizni "Review" (Belgilash) tugmasi bilan belgilab keting.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>20 daqiqa tugaganda test avtomatik ravishda yakunlanadi.</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                setTestState('testing');
                setSecondsLeft(1200);
              }}
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Testni boshlash (Start Test)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {testState === 'testing' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT PANE: Split-Screen Academic Reading Passage */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col bg-stone-950 overflow-hidden">
            {/* Passage Header Tab */}
            <div className="bg-stone-900/80 px-4 py-2 border-b border-stone-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-bold text-stone-200">
                  {IELTS_PASSAGE.subtitle}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                Matndan ko‘chirib oling
              </span>
            </div>

            {/* Passage Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 select-text">
              <div className="border-b border-stone-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-stone-100 font-serif">
                  {IELTS_PASSAGE.title}
                </h2>
                <span className="text-[11px] text-stone-400 italic">
                  Read the text and answer Questions 1–15.
                </span>
              </div>

              <div className="space-y-4">
                {IELTS_PASSAGE.paragraphs.map((p) => {
                  const isCurrentTarget = currentQ.passageParagraph === p.letter;
                  return (
                    <div
                      key={p.letter}
                      className={`p-3 rounded-lg transition-colors leading-relaxed ${
                        isCurrentTarget
                          ? 'bg-amber-950/20 border-l-4 border-amber-500 text-stone-100'
                          : 'text-stone-300'
                      } ${textSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}
                    >
                      <span className="font-bold text-red-400 font-mono mr-2 bg-stone-900 px-2 py-0.5 rounded-sm">
                        [{p.letter}]
                      </span>
                      <span>{p.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANE: IELTS Interactive Questions */}
          <div className="w-full md:w-1/2 flex flex-col bg-stone-900 overflow-hidden">
            {/* Question Top Subheader */}
            <div className="bg-stone-900/90 px-4 py-2 border-b border-stone-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-stone-300">
                Question {currentQIndex + 1} of {IELTS_QUESTIONS.length}
              </span>

              {/* Review Flag button */}
              <button
                onClick={() => toggleFlag(currentQIndex)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                  flagged[currentQIndex]
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQIndex] ? 'Review Flagged' : 'Review'}</span>
              </button>
            </div>

            {/* Question Interactive Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Instructions Callout */}
              <div className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl text-xs text-stone-300 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-1">
                  INSTRUCTIONS:
                </span>
                {currentQ.instruction}
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-stone-100 leading-snug">
                  <span className="text-red-400 mr-2 font-mono">Q{currentQIndex + 1}.</span>
                  {currentQ.questionText}
                </h3>

                {/* 1. MATCHING HEADINGS */}
                {currentQ.type === 'matching_heading' && currentQ.headingsList && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block">
                      List of Headings:
                    </span>
                    {currentQ.headingsList.map((h) => {
                      const isSelected = answers[currentQ.id] === h.key;
                      return (
                        <button
                          key={h.key}
                          onClick={() => handleSelectAnswer(currentQ.id, h.key)}
                          className={`w-full p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-red-950/40 border-red-500 text-white font-bold ring-1 ring-red-500'
                              : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-mono text-red-400 font-bold w-5">{h.key}.</span>
                            <span>{h.text}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-red-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. TRUE / FALSE / NOT GIVEN */}
                {currentQ.type === 'true_false_not_given' && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {['TRUE', 'FALSE', 'NOT GIVEN'].map((choice) => {
                      const isSelected = answers[currentQ.id] === choice;
                      return (
                        <button
                          key={choice}
                          onClick={() => handleSelectAnswer(currentQ.id, choice)}
                          className={`py-3.5 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-red-600 border-red-500 text-white shadow-md'
                              : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. MULTIPLE CHOICE */}
                {currentQ.type === 'multiple_choice' && currentQ.options && (
                  <div className="space-y-2 pt-2">
                    {currentQ.options.map((opt) => {
                      const letter = opt.charAt(0);
                      const isSelected = answers[currentQ.id] === letter;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectAnswer(currentQ.id, letter)}
                          className={`w-full p-3.5 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-red-950/40 border-red-500 text-white font-bold ring-1 ring-red-500'
                              : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 text-red-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 4. FILL IN THE BLANK */}
                {currentQ.type === 'fill_blank' && (
                  <div className="pt-2 space-y-2">
                    <label className="text-xs text-stone-400 block font-mono">
                      Write your answer in the box below:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                      placeholder="Type word(s) from passage..."
                      className="w-full bg-stone-950 border border-stone-700 focus:border-red-500 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:outline-hidden"
                    />
                    <span className="text-[10px] text-stone-500 block">
                      * Matndagi so‘zlardan aniq nusxalang (NO MORE THAN TWO WORDS).
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Real CD-IELTS Bottom Navigation Bar */}
      {testState === 'testing' && (
        <footer className="bg-stone-950 border-t border-stone-800 p-2.5 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 select-none shadow-2xl">
          {/* Question Palette with Numbers 1..15 */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {IELTS_QUESTIONS.map((q, idx) => {
              const isCurrent = idx === currentQIndex;
              const hasAnswer = (answers[q.id] || '').trim() !== '';
              const isFlagged = flagged[idx];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-8 h-8 rounded-sm text-xs font-mono font-bold flex items-center justify-center relative transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-red-600 text-white ring-2 ring-white shadow-md'
                      : hasAnswer
                      ? 'bg-stone-800 text-stone-200 border border-stone-600'
                      : 'bg-stone-900 text-stone-500 border border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {/* Flag indicator dot */}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-stone-950" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="p-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded text-stone-300 transition-colors"
              title="Avvalgi savol"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentQIndex((prev) => Math.min(IELTS_QUESTIONS.length - 1, prev + 1))}
              disabled={currentQIndex === IELTS_QUESTIONS.length - 1}
              className="p-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded text-stone-300 transition-colors"
              title="Keyingi savol"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-all shadow-md ml-1"
            >
              Finish Exam
            </button>
          </div>
        </footer>
      )}

      {/* 4. Results Screen (Official Test Report Form - TRF) */}
      {testState === 'results' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in">
          {/* Official IELTS Test Report Form Card */}
          <div
            id="ielts-trf-card"
            className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
          >
            {/* TRF Top Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-5 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded-xs text-sm tracking-wider">
                    IELTS
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    TEST REPORT FORM (TRF)
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                  Candidate Performance & Band Report
                </h1>
              </div>

              <div className="text-left sm:text-right text-[11px] font-mono text-stone-400">
                <div>Centre No: <span className="text-stone-200">UZ001 (Verbo Tashkent)</span></div>
                <div>Test Date: <span className="text-stone-200">16-Sep-2026</span></div>
              </div>
            </div>

            {/* Candidate Details & Overall Band Score Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-stone-900 border border-stone-800 p-5 rounded-2xl">
              <div className="space-y-1 md:col-span-2">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  Nomzod (Candidate):
                </span>
                <div className="text-lg sm:text-xl font-bold text-white">
                  {candidateName}
                </div>
                <div className="text-xs text-stone-400">
                  Candidate No: <span className="font-mono text-stone-300">{candidateNumber}</span> • Scheme: Academic
                </div>
                <div className="text-xs text-stone-400 pt-1">
                  Status: <span className="text-emerald-400 font-bold">{results.bandInfo.statusText}</span>
                </div>
              </div>

              {/* Huge Band Score Display */}
              <div className="bg-stone-950 border-2 border-red-600/60 p-4 rounded-xl text-center shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                  Overall Band Score
                </span>
                <span className="text-4xl sm:text-5xl font-black text-red-500 block my-0.5 font-mono">
                  {results.bandInfo.band.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-stone-200 block">
                  {results.bandInfo.descriptor}
                </span>
                <span className="inline-block mt-1 text-[10px] font-bold bg-stone-800 text-amber-400 px-2 py-0.5 rounded-full">
                  CEFR: {results.bandInfo.cefrEquiv}
                </span>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-stone-900/60 border border-stone-800 p-3.5 rounded-xl space-y-1">
                <span className="text-[11px] text-stone-400 font-bold block">
                  Xom ball (Raw Score)
                </span>
                <div className="text-xl font-bold text-stone-100 font-mono">
                  {results.rawScore} / {IELTS_QUESTIONS.length}
                </div>
                <span className="text-[10px] text-stone-500">
                  {Math.round((results.rawScore / IELTS_QUESTIONS.length) * 100)}% to‘g‘ri javob
                </span>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-3.5 rounded-xl space-y-1">
                <span className="text-[11px] text-stone-400 font-bold block">
                  Lexical Resource Band
                </span>
                <div className="text-xl font-bold text-stone-100 font-mono">
                  {(Math.min(9.0, results.bandInfo.band + 0.5)).toFixed(1)}
                </div>
                <span className="text-[10px] text-stone-500">
                  Akademik so‘z boyligi & kontekst
                </span>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-3.5 rounded-xl space-y-1">
                <span className="text-[11px] text-stone-400 font-bold block">
                  Reading Comprehension
                </span>
                <div className="text-xl font-bold text-stone-100 font-mono">
                  {results.bandInfo.band.toFixed(1)}
                </div>
                <span className="text-[10px] text-stone-500">
                  Tushunish va diskurs tahlili
                </span>
              </div>
            </div>

            {/* Detailed Question Review List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider flex items-center justify-between">
                <span>Savollar tahlili va to‘g‘ri javoblar:</span>
                <span className="text-xs font-mono text-stone-400 lowercase">
                  ({results.rawScore} to‘g‘ri, {IELTS_QUESTIONS.length - results.rawScore} xato)
                </span>
              </h3>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {results.details.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      item.isCorrect
                        ? 'bg-emerald-950/20 border-emerald-900/60 text-stone-200'
                        : 'bg-red-950/20 border-red-900/60 text-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold flex items-center gap-2">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>Q{idx + 1}. {item.question.questionText}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 shrink-0">
                        {item.question.lexicalSkill}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-stone-800/60">
                      <div>
                        Sizning javobingiz:{' '}
                        <span className={`font-bold ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                          {item.userAnswer}
                        </span>
                      </div>
                      <div>
                        To‘g‘ri javob:{' '}
                        <span className="font-bold text-stone-100">
                          {item.question.correctAnswer}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400 bg-stone-900/80 p-2 rounded-lg">
                      <span className="font-bold text-amber-400">Izoh: </span>
                      {item.question.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  try {
                    window.print();
                  } catch {
                    setToastMsg('Chop etish oynasi ochilmadi.');
                    setTimeout(() => setToastMsg(null), 3000);
                  }
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Hisobotni chop etish (Print TRF)</span>
              </button>

              <button
                onClick={() => {
                  setAnswers({});
                  setFlagged({});
                  setCurrentQIndex(0);
                  setTestState('instructions');
                }}
                className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta topshirish</span>
              </button>

              <button
                onClick={() => setCurrentScreen('test_select')}
                className="px-4 py-3 bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-300 font-bold text-xs rounded-xl transition-all"
              >
                Testlar bo‘limiga qaytish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Testni yakunlaysizmi?</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Jami 15 ta savoldan <span className="font-bold text-white">{answeredCount} tasiga</span> javob berdingiz.
              {Object.values(flagged).filter(Boolean).length > 0 && (
                <span className="block text-amber-400 mt-1">
                  ⚠️ Sizda {Object.values(flagged).filter(Boolean).length} ta "Review" (ko‘rib chiqish) belgisi qo‘yilgan savol bor.
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-xs font-bold text-stone-300"
              >
                Testga qaytish
              </button>
              <button
                onClick={handleFinishTest}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold text-white shadow-md"
              >
                Ha, yakunlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio & Help Modal */}
      {showAudioModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-red-500" />
                <span>Audio & Exam System Check</span>
              </h3>
              <button
                onClick={() => setShowAudioModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Computer-Delivered IELTS imtihonida ekran o‘lchamlari va audio sifati oldindan tekshiriladi. Savollar orasida erkin harakatlanish uchun pastki 1–15 raqamli navigatsiyadan foydalanishingiz mumkin.
            </p>

            <button
              onClick={() => setShowAudioModal(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold text-white"
            >
              Tushundim
            </button>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Testni to‘xtatmoqchimisiz?</h3>
              <p className="text-xs text-stone-400 mt-1">
                Chiqib ketsangiz, joriy javoblaringiz va test natijangiz saqlanmaydi.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
              >
                Davom etish
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  setCurrentScreen('test_select');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white text-xs px-4 py-2 rounded-xl shadow-lg border border-stone-700 animate-in fade-in">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
