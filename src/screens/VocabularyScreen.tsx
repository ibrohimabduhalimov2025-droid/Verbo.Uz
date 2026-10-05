import React, { useState, useEffect } from 'react';
import {
  Plus,
  BookOpen,
  FolderHeart,
  Search,
  ChevronRight,
  Volume2,
  Sparkles,
  Play,
  Layers,
  ArrowLeft,
  Flame,
  Target,
  Stethoscope,
  Trash2,
  GraduationCap,
  Award,
  Lock,
  HeartPulse,
  Activity,
  CheckCircle2,
  FolderPlus,
  HelpCircle,
  Trophy,
  TrendingUp,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Topic, Deck, Word, CEFRLevel } from '../types';
import { speakWord, speakUzbek } from '../utils/srs';
import { CEFR_LEVELS_META, TOTAL_CEFR_WORDS } from '../services/cefrService';
import { CefrVocabularyBrowser } from '../components/CefrVocabularyBrowser';
import { MEDICAL_ENGLISH_META, MEDICAL_ENGLISH_WORDS } from '../data/medicalEnglishData';

export const VocabularyScreen: React.FC = () => {
  const {
    topics,
    decks,
    words,
    wordProgress,
    setCurrentScreen,
    setSelectedTopicId,
    selectedDeckId,
    setSelectedDeckId,
    selectedCefrLevel,
    setSelectedCefrLevel,
    getCefrLevelStats,
    getTotalCefrStats,
    addNewDeck,
    deleteDeck,
    removeWordFromDeck,
    isLevelUnlocked,
    openLockedProgressionModal,
    setAddWordDefaultTab,
  } = useApp();

  // Two main tabs: 'tayyor' = Mualliflik lug'atlari, 'shaxsiy' = Shaxsiy to'plamlar
  const [activeTab, setActiveTab] = useState<'tayyor' | 'shaxsiy'>('tayyor');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicDetail, setActiveTopicDetail] = useState<Topic | null>(null);
  const [activeDeckDetail, setActiveDeckDetail] = useState<Deck | null>(null);
  const [activeMedicalDetail, setActiveMedicalDetail] = useState(false);
  const [medicalCategoryFilter, setMedicalCategoryFilter] = useState<string>('all');

  // If a deck is specifically selected (e.g. just saved words into it via AI), open it
  useEffect(() => {
    if (selectedDeckId && !activeDeckDetail && !activeTopicDetail && !activeMedicalDetail) {
      const target = decks.find((d) => d.id === selectedDeckId);
      if (target) {
        setActiveTab('shaxsiy');
        setActiveDeckDetail(target);
      }
    }
  }, [selectedDeckId, decks]);

  // Keep activeDeckDetail synced with decks state
  useEffect(() => {
    if (activeDeckDetail) {
      const updated = decks.find((d) => d.id === activeDeckDetail.id);
      if (updated) {
        setActiveDeckDetail(updated);
      } else {
        setActiveDeckDetail(null);
      }
    }
  }, [decks]);

  // Deck deletion modal state
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);

  // New deck creation modal state
  const [showCreateDeckModal, setShowCreateDeckModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeckName.trim()) {
      const created = addNewDeck(newDeckName.trim(), newDeckDesc.trim());
      setNewDeckName('');
      setNewDeckDesc('');
      setShowCreateDeckModal(false);
      setActiveDeckDetail(created);
    }
  };

  // Filter words if in detail view
  const currentDetailWords: Word[] = activeTopicDetail
    ? words.filter((w) => w.topicId === activeTopicDetail.id)
    : activeDeckDetail
    ? words.filter((w) => activeDeckDetail.words.includes(w.id))
    : [];

  const filteredWords = currentDetailWords.filter(
    (w) =>
      w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.uzbek.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Medical English filtered words
  const filteredMedicalWords = MEDICAL_ENGLISH_WORDS.filter((w) => {
    const matchesSearch =
      w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.uzbek.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (medicalCategoryFilter === 'all') return true;
    if (medicalCategoryFilter === 'anatomy') {
      const keywords = ['body', 'eye', 'hand', 'head', 'heart', 'arm', 'leg', 'bone', 'brain', 'blood', 'chest', 'skin', 'ear', 'mouth', 'throat', 'muscle', 'organ'];
      return keywords.some((k) => w.english.toLowerCase().includes(k) || w.uzbek.toLowerCase().includes(k));
    }
    if (medicalCategoryFilter === 'symptoms') {
      const keywords = ['symptom', 'pain', 'ache', 'fever', 'cough', 'sick', 'ill', 'hurt', 'dizzy', 'infection', 'fatigue', 'pressure', 'inflammation'];
      return keywords.some((k) => w.english.toLowerCase().includes(k) || w.uzbek.toLowerCase().includes(k));
    }
    if (medicalCategoryFilter === 'hospital') {
      const keywords = ['hospital', 'doctor', 'nurse', 'clinic', 'patient', 'ward', 'emergency', 'surgery', 'surgeon', 'care', 'test', 'exam', 'biopsy'];
      return keywords.some((k) => w.english.toLowerCase().includes(k) || w.uzbek.toLowerCase().includes(k));
    }
    if (medicalCategoryFilter === 'pharma') {
      const keywords = ['pill', 'drug', 'medicine', 'prescription', 'dose', 'antibiotic', 'therapy', 'vaccine', 'injection', 'drops', 'syrup'];
      return keywords.some((k) => w.english.toLowerCase().includes(k) || w.uzbek.toLowerCase().includes(k));
    }
    return true;
  });

  // Start flashcard session on selected topic, deck, or medical
  const handleStartFlashcards = () => {
    if (activeMedicalDetail) {
      setSelectedTopicId('medical_english');
      setSelectedDeckId(null);
      setSelectedCefrLevel(null);
    } else if (activeTopicDetail) {
      setSelectedTopicId(activeTopicDetail.id);
      setSelectedDeckId(null);
    } else if (activeDeckDetail) {
      setSelectedDeckId(activeDeckDetail.id);
      setSelectedTopicId(null);
    }
    setCurrentScreen('flashcards');
  };

  // If viewing a CEFR level (A1 - C2)
  if (selectedCefrLevel) {
    return (
      <CefrVocabularyBrowser
        level={selectedCefrLevel}
        onBack={() => setSelectedCefrLevel(null)}
      />
    );
  }

  // ================= VIEW: MEDICAL ENGLISH DETAIL (Mualliflik lug'ati) =================
  if (activeMedicalDetail) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
        {/* Header - Back button only (NO AI Flashcard or +So'z buttons in Mualliflik lug'atlari!) */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveMedicalDetail(false)}
            className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mualliflik lug‘atlariga qaytish</span>
          </button>
        </div>

        {/* Medical Banner */}
        <div className="rounded-3xl p-5 bg-linear-to-r from-teal-900 via-cyan-900 to-blue-950 text-white shadow-md relative overflow-hidden mb-4 border border-teal-800">
          <div className="flex items-start justify-between relative z-10 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/30 text-[10px] font-black uppercase tracking-wider text-teal-200">
                    Mualliflik Kursi
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-cyan-950 text-[10px] font-black">
                    IELTS 6.0 – 8.5
                  </span>
                </div>
                <h2 className="text-xl font-display font-extrabold text-white mt-1">
                  Medical English (Tibbiyot ingliz tili)
                </h2>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-white/10 text-teal-200 font-mono text-xs font-bold border border-white/10">
              {MEDICAL_ENGLISH_WORDS.length} ta so‘z
            </span>
          </div>

          <p className="text-xs text-teal-100/90 leading-relaxed mb-4 max-w-2xl relative z-10">
            Shifokorlar, hamshiralar, farmatsevtlar va tibbiyot talabalari uchun klinik tashxis,
            anatomiya, simptomlar va xalqaro tibbiy muloqot terminlari to‘plami.
          </p>

          <button
            onClick={handleStartFlashcards}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer relative z-10"
          >
            <Play className="w-4 h-4 fill-teal-950" />
            <span>Fleshkarta orqali o‘rganishni boshlash</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'anatomy', label: 'Anatomiya & A’zolar' },
            { id: 'symptoms', label: 'Simptomlar & Kasalliklar' },
            { id: 'hospital', label: 'Shifoxona & Muolaja' },
            { id: 'pharma', label: 'Dori & Farmakologiya' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setMedicalCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                medicalCategoryFilter === cat.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-teal-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tibbiy atamalardan qidirish (masalan: doctor, blood, diagnosis)..."
            className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-teal-500 shadow-2xs"
          />
        </div>

        {/* Medical Words List */}
        <div className="flex-1 space-y-2 overflow-y-auto pb-6">
          {filteredMedicalWords.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs bg-white rounded-2xl border border-stone-200">
              Ushbu qidiruv bo‘yicha atama topilmadi
            </div>
          ) : (
            filteredMedicalWords.map((word) => {
              const prog = wordProgress[word.id];
              const isMastered = prog?.masteryLevel === 'ozlashtirilgan';

              return (
                <div
                  key={word.id}
                  className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-2xs flex items-center justify-between group hover:border-teal-300 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-bold text-sm text-stone-900 font-display">
                        {word.english}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {word.transcription}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {word.level}
                      </span>
                    </div>
                    <div className="text-xs text-teal-800 font-semibold truncate">
                      {word.uzbek}
                    </div>
                    {word.exampleSentence && (
                      <div className="text-[11px] text-stone-500 italic truncate mt-0.5">
                        "{word.exampleSentence}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => speakWord(word.english, undefined, 'en')}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                      title="Inglizcha talaffuz"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => speakUzbek(word.uzbek)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="O‘zbekcha talaffuz"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                    {isMastered && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        ✓ Yodlandi
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ================= VIEW: TOPIC DETAIL OR PERSONAL DECK DETAIL =================
  if (activeTopicDetail || activeDeckDetail) {
    const isTopic = !!activeTopicDetail;
    const isPersonalDeck = !!activeDeckDetail;
    const title = activeTopicDetail ? activeTopicDetail.name : activeDeckDetail?.name;
    const subtitle = activeTopicDetail
      ? `${activeTopicDetail.nameEn} • ${activeTopicDetail.level}`
      : `${activeDeckDetail?.words.length || 0} ta so‘z`;

    return (
      <div className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setActiveTopicDetail(null);
              setActiveDeckDetail(null);
            }}
            className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Orqaga</span>
          </button>

          {/* AI Flashcard and +So'z buttons ONLY shown when viewing a Personal Deck */}
          {isPersonalDeck && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAddWordDefaultTab('ai_batch');
                  if (activeDeckDetail) setSelectedDeckId(activeDeckDetail.id);
                  setCurrentScreen('add_word');
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>AI Flashcard</span>
              </button>
              <button
                onClick={() => {
                  setAddWordDefaultTab('single');
                  if (activeDeckDetail) setSelectedDeckId(activeDeckDetail.id);
                  setCurrentScreen('add_word');
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 shadow-xs border border-stone-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>So‘z qo‘shish</span>
              </button>
              <button
                type="button"
                onClick={() => setDeckToDelete(activeDeckDetail)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 transition-colors cursor-pointer"
                title="Ushbu to‘plamni o‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Title banner */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-stone-900">{title}</h2>
            {activeTopicDetail && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                {activeTopicDetail.level}
              </span>
            )}
            {activeDeckDetail && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                Shaxsiy To‘plam
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mb-4">{subtitle}</p>

          <button
            onClick={handleStartFlashcards}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Fleshkarta orqali o‘rganish</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="So‘zlardan qidirish..."
            className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
          />
        </div>

        {/* Words list */}
        <div className="flex-1 space-y-2 overflow-y-auto pb-6">
          {filteredWords.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs bg-white rounded-2xl border border-stone-200">
              Hozircha so‘zlar mavjud emas
            </div>
          ) : (
            filteredWords.map((word) => {
              const prog = wordProgress[word.id];
              const isMastered = prog?.masteryLevel === 'ozlashtirilgan';

              return (
                <div
                  key={word.id}
                  className="bg-white rounded-xl p-3.5 border border-stone-200/90 shadow-2xs flex items-center justify-between group hover:border-indigo-200 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-bold text-sm text-stone-900 font-display">
                        {word.english}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {word.transcription}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-700 font-medium truncate">
                      {word.uzbek}
                    </div>
                    {word.exampleSentence && (
                      <div className="text-[11px] text-stone-400 italic truncate mt-0.5">
                        "{word.exampleSentence}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => speakWord(word.english, undefined, 'en')}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="Inglizcha talaffuz"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => speakUzbek(word.uzbek)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="O‘zbekcha talaffuz"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                    {isMastered && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        ✓ Yodlandi
                      </span>
                    )}
                    {isPersonalDeck && activeDeckDetail && (
                      <button
                        onClick={() => removeWordFromDeck(activeDeckDetail.id, word.id)}
                        className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="To‘plamdan o‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ================= MAIN SCREEN =================
  return (
    <div id="vocabulary-screen" className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900">
            Lug‘atlarim
          </h1>
          <p className="text-xs text-stone-500">
            {activeTab === 'tayyor'
              ? 'Xalqaro standartdagi mualliflik to‘plamlari'
              : 'Shaxsiy yaratilgan kartotekalar va to‘plamlar'}
          </p>
        </div>

        {/* AI Flashcard and +So'z buttons: ONLY visible when activeTab === 'shaxsiy'!
            (User explicitly: "Mualiflik lug'atlariga Al flashcard va + so'zni ham olib tashla. Al Flashcard va + so'z Shaxsiy to'plamda bo'lsin.") */}
        {activeTab === 'shaxsiy' && (
          <div className="flex items-center gap-2 animate-in fade-in">
            <button
              onClick={() => {
                setAddWordDefaultTab('ai_batch');
                setCurrentScreen('add_word');
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>AI Flashcard</span>
            </button>
            <button
              id="btn-add-word-top"
              onClick={() => {
                setAddWordDefaultTab('single');
                setCurrentScreen('add_word');
              }}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 active:scale-[0.98] text-stone-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ So‘z</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs: Mualliflik lug'atlari vs Shaxsiy to'plamlar */}
      <div className="grid grid-cols-2 p-1 bg-stone-200/60 rounded-2xl border border-stone-200/50">
        <button
          type="button"
          onClick={() => setActiveTab('tayyor')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'tayyor'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>Mualliflik lug‘atlari</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shaxsiy')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'shaxsiy'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <FolderHeart className="w-4 h-4 text-indigo-600" />
          <span>Shaxsiy to‘plamlar</span>
        </button>
      </div>

      {/* ================= TAB 1: MUALLIFLIK LUG'ATLARI ================= */}
      {activeTab === 'tayyor' && (
        <div className="space-y-6 pb-6 animate-in fade-in">
          {/* SECTION A: CEFR A1 - C2 Database */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>CEFR Lug‘at Bazasi (A1–C2: 10,000 ta so‘z)</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Xalqaro standart asosida saralangan so‘zlar bazasi. Bosqichma-bosqich o‘rganing.
                </p>
              </div>

              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                10,000 ta so‘z
              </span>
            </div>

            {/* GRAND 10,000 CEFR MASTER VOCABULARY PROGRESS DASHBOARD */}
            {(() => {
              const cefrList: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
              const totalStats = getTotalCefrStats();
              const totalLearned = totalStats.totalLearned;
              const totalLearning = totalStats.totalLearning;
              const totalPercent = totalStats.totalPercent;
              const remainingWords = Math.max(0, TOTAL_CEFR_WORDS - totalLearned);

              return (
                <div className="bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-md border border-indigo-900/60 relative overflow-hidden">
                  {/* Subtle background glow */}
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner shrink-0">
                        <Trophy className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                            CEFR Leksik Xarita
                          </span>
                          <span className="text-[10px] font-bold text-stone-400">
                            10,000 ta so‘zlik maqsad
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-display font-black text-white mt-0.5">
                          Umumiy CEFR O‘zlashtirish Ko‘rsatkichi
                        </h2>
                      </div>
                    </div>

                    {/* Master Percentage Callout Badge */}
                    <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-[10px] text-stone-300 font-bold uppercase">Umumiy Natija</div>
                        <div className="text-sm sm:text-base font-black text-white font-mono leading-none">
                          {totalPercent}% <span className="text-xs font-normal text-stone-300">({totalLearned} / 10,000)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>O‘zlashtirildi</span>
                      </div>
                      <div className="text-base sm:text-xl font-black text-white mt-0.5 font-display">
                        {totalLearned}
                      </div>
                      <div className="text-[10px] text-stone-400">10,000 ta so‘zdan</div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
                      <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>O‘rganilmoqda</span>
                      </div>
                      <div className="text-base sm:text-xl font-black text-amber-300 mt-0.5 font-display">
                        {totalLearning}
                      </div>
                      <div className="text-[10px] text-stone-400">faol so‘zlar</div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 text-center">
                      <div className="text-[10px] text-indigo-300 font-bold uppercase flex items-center justify-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>Qolgan so‘zlar</span>
                      </div>
                      <div className="text-base sm:text-xl font-black text-stone-200 mt-0.5 font-display">
                        {remainingWords}
                      </div>
                      <div className="text-[10px] text-stone-400">marra sari</div>
                    </div>
                  </div>

                  {/* GRAND 10,000-WORD PROPORTIONAL MULTI-SEGMENT PROGRESS BAR */}
                  <div className="relative z-10 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-300 font-semibold px-0.5">
                      <span>Darajalar taqsimoti (A1 dan C2 gacha)</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {totalLearned} / 10,000 ta so‘z
                      </span>
                    </div>

                    {/* Proportional Segmented Progress Bar */}
                    <div className="w-full h-5 sm:h-6 bg-black/40 rounded-xl p-0.5 border border-white/15 flex gap-1 overflow-hidden shadow-inner">
                      {cefrList.map((lvl) => {
                        const meta = CEFR_LEVELS_META[lvl];
                        const stats = getCefrLevelStats(lvl);
                        // Proportional share of the 10,000 total
                        const segmentShare = (meta.count / TOTAL_CEFR_WORDS) * 100;
                        const levelFill = Math.min(100, Math.round((stats.learned / meta.count) * 100));

                        return (
                          <div
                            key={lvl}
                            className="h-full rounded-lg relative overflow-hidden bg-white/10 flex items-center justify-center group cursor-pointer"
                            style={{ width: `${segmentShare}%` }}
                            onClick={() => {
                              if (isLevelUnlocked(lvl)) {
                                setSelectedCefrLevel(lvl);
                              } else {
                                openLockedProgressionModal({
                                  type: 'level',
                                  id: lvl,
                                  title: `${lvl} Darajasi (${meta.nameUz})`,
                                  subtitle: `${meta.count} ta so‘z • IELTS ${meta.ieltsBand}`,
                                  requirement: 'Oldingi darajani 85%+ natija bilan yakunlang',
                                });
                              }
                            }}
                            title={`${lvl}: ${stats.learned}/${meta.count} ta so‘z (${levelFill}%) • Umumiy 10,000 ning ${segmentShare.toFixed(1)}% qismi`}
                          >
                            {/* Inner fill for this level */}
                            <div
                              className={`absolute left-0 top-0 bottom-0 bg-linear-to-r ${meta.gradient} transition-all duration-700`}
                              style={{ width: `${levelFill}%` }}
                            />
                            {/* Level Name */}
                            <span className="relative z-10 text-[9px] sm:text-[10px] font-black text-white/95 drop-shadow-xs">
                              {lvl}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Level Interactive Badges */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1.5">
                      {cefrList.map((lvl) => {
                        const meta = CEFR_LEVELS_META[lvl];
                        const stats = getCefrLevelStats(lvl);
                        const levelFill = Math.min(100, Math.round((stats.learned / meta.count) * 100));
                        const isUnlocked = isLevelUnlocked(lvl);

                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              if (isUnlocked) {
                                setSelectedCefrLevel(lvl);
                              } else {
                                openLockedProgressionModal({
                                  type: 'level',
                                  id: lvl,
                                  title: `${lvl} Darajasi (${meta.nameUz})`,
                                  subtitle: `${meta.count} ta so‘z • IELTS ${meta.ieltsBand}`,
                                  requirement: 'Oldingi darajani 85%+ natija bilan yakunlang',
                                });
                              }
                            }}
                            className={`p-1.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                              isUnlocked
                                ? 'bg-white/10 hover:bg-white/20 border-white/15'
                                : 'bg-white/5 border-white/5 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-white flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full bg-linear-to-r ${meta.gradient}`} />
                                {lvl}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-stone-300">
                                {levelFill}%
                              </span>
                            </div>
                            <div className="text-[9px] text-stone-400 truncate mt-0.5">
                              {stats.learned}/{meta.count}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 6 CEFR Level Cards Grid (A1 - C2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
                const meta = CEFR_LEVELS_META[lvl];
                const stats = getCefrLevelStats(lvl);
                const isUnlocked = isLevelUnlocked(lvl);
                const masteredPercent = Math.min(100, Math.round((stats.learned / meta.count) * 100));
                const learningPercent = Math.min(
                  100 - masteredPercent,
                  Math.round((stats.learning / meta.count) * 100)
                );
                const shareOfTotal = ((meta.count / TOTAL_CEFR_WORDS) * 100).toFixed(1);

                const handleClick = () => {
                  if (isUnlocked) {
                    setSelectedCefrLevel(lvl);
                  } else {
                    openLockedProgressionModal({
                      type: 'level',
                      id: lvl,
                      title: `${lvl} Darajasi (${meta.nameUz})`,
                      subtitle: `${meta.count} ta so‘z • IELTS ${meta.ieltsBand}`,
                      requirement: 'Oldingi darajani 85%+ natija bilan yakunlang',
                    });
                  }
                };

                return (
                  <div
                    key={lvl}
                    onClick={handleClick}
                    className={`rounded-2xl p-4 border transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ${
                      isUnlocked
                        ? 'bg-white border-stone-200 hover:border-indigo-400 hover:shadow-xs'
                        : 'bg-stone-50/80 border-stone-200/70 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      {/* Top badge & count / lock indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-white font-black text-xs bg-linear-to-r ${meta.gradient} shadow-2xs ${
                              !isUnlocked ? 'grayscale-40 opacity-90' : ''
                            }`}
                          >
                            {lvl}
                          </span>
                          {!isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-900 text-[10px] font-extrabold flex items-center gap-1 border border-amber-200">
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Qulflangan</span>
                            </span>
                          ) : (
                            masteredPercent >= 85 && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>85%+ Tayyor</span>
                              </span>
                            )
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold">
                            {meta.topicCount} ta mavzu
                          </span>
                          <span className="text-xs font-bold text-stone-700">
                            {meta.count} ta so‘z
                          </span>
                        </div>
                      </div>

                      {/* Title & Uzbek title */}
                      <div className="mt-2.5">
                        <h3
                          className={`font-bold text-sm transition-colors flex items-center justify-between ${
                            isUnlocked ? 'text-stone-900 group-hover:text-indigo-600' : 'text-stone-700'
                          }`}
                        >
                          <span>{meta.nameUz.split('(')[0].trim()}</span>
                          <span className="text-[11px] font-normal text-stone-400">
                            IELTS {meta.ieltsBand}
                          </span>
                        </h3>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                          {meta.description}
                        </p>
                      </div>
                    </div>

                    {/* DEDICATED VISUAL PROGRESS BAR SECTION */}
                    <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                      {/* Progress Header row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-stone-500 font-medium text-[11px]">O‘zlashtirildi:</span>
                          <span className="font-extrabold text-stone-900 font-display">
                            {stats.learned}
                          </span>
                          <span className="text-stone-400 text-[11px]">/ {meta.count} ta</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {stats.learning > 0 && (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              +{stats.learning} o‘rganilmoqda
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                              masteredPercent >= 85
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : masteredPercent > 0
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-stone-100 text-stone-500 border border-stone-200'
                            }`}
                          >
                            {masteredPercent}%
                          </span>
                        </div>
                      </div>

                      {/* The Visual Progress Bar Track with 85% Unlock Milestone Marker */}
                      <div className="w-full h-3.5 sm:h-4 bg-stone-100 rounded-full p-0.5 border border-stone-200/80 relative overflow-hidden shadow-inner">
                        {/* 85% Target Line */}
                        <div
                          className="absolute top-0 bottom-0 w-[1.5px] bg-stone-300 z-10"
                          style={{ left: '85%' }}
                          title="85% - Qulf ochish marrasi"
                        />

                        {/* Mastered Progress Bar */}
                        <div
                          className={`h-full rounded-full bg-linear-to-r ${meta.gradient} transition-all duration-700 ease-out shadow-xs`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(stats.learned > 0 ? 3 : 0, (stats.learned / meta.count) * 100)
                            )}%`,
                          }}
                        />

                        {/* Learning Secondary Indicator */}
                        {stats.learning > 0 && (
                          <div
                            className="h-full rounded-full bg-amber-400/80 transition-all duration-700 absolute top-0.5 bottom-0.5"
                            style={{
                              left: `${Math.min(95, (stats.learned / meta.count) * 100)}%`,
                              width: `${Math.min(
                                100 - (stats.learned / meta.count) * 100,
                                (stats.learning / meta.count) * 100
                              )}%`,
                            }}
                          />
                        )}
                      </div>

                      {/* Progress Subtext details */}
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <span>
                          {stats.newCount > 0 ? (
                            <>{stats.newCount} ta so‘z qoldi</>
                          ) : (
                            <span className="text-emerald-600 font-bold">100% yakunlandi! 🏆</span>
                          )}
                        </span>
                        <span className="text-stone-400">
                          10,000 so‘zdan {stats.learned} ta ({shareOfTotal}%)
                        </span>
                      </div>

                      {/* Status & CTA Link */}
                      {isUnlocked ? (
                        <div className="pt-1 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                          <div className="flex items-center gap-1 text-[11px]">
                            {masteredPercent >= 85 ? (
                              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Muvaffaqiyatli yakunlandi</span>
                              </span>
                            ) : stats.learned > 0 ? (
                              <span className="text-indigo-600 flex items-center gap-1 font-bold">
                                <Flame className="w-3.5 h-3.5 text-amber-500" />
                                <span>O‘rganish davom etmoqda</span>
                              </span>
                            ) : (
                              <span className="text-stone-500 font-medium">Boshlashga tayyor</span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            <span className="text-[11px]">Mavzularni ochish</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ) : (
                        <div className="pt-1 space-y-1.5">
                          <div className="text-[10px] font-bold text-amber-900 bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-200 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span className="truncate">Oldingi darajani 85%+ natija bilan yakunlang</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold text-stone-500 group-hover:text-amber-700">
                            <span className="text-[11px]">Qulfni ochish talabi</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION B: MEDICAL ENGLISH (Maxsus Mualliflik Lug'ati) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span>Maxsus Mualliflik Lug‘ati: Medical English</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Tibbiyot sohasi xodimlari va talabalar uchun professional klinik terminlar
                </p>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                {MEDICAL_ENGLISH_WORDS.length} ta termin
              </span>
            </div>

            {/* Medical English Hero Card */}
            <div className="rounded-3xl p-5 bg-linear-to-r from-teal-900 via-cyan-900 to-blue-950 text-white shadow-md relative overflow-hidden border border-teal-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0 shadow-inner">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[10px] font-black uppercase tracking-wider border border-teal-400/30">
                        Professional Lug‘at
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-cyan-950 text-[10px] font-black">
                        IELTS 6.0 – 8.5
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white mt-1">
                      Medical English (Tibbiyot ingliz tili)
                    </h3>
                    <p className="text-xs text-teal-100/90 mt-1 max-w-lg leading-relaxed">
                      Klinik tashxis, anatomiya, simptomlar, kasalliklar, muolaja va dori-darmonlar
                      atamalari. Audio talaffuz va amaliy misollar bilan.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col shrink-0">
                  <button
                    onClick={() => setActiveMedicalDetail(true)}
                    className="flex-1 sm:w-full px-4 py-2.5 rounded-xl bg-white text-teal-950 font-bold text-xs hover:bg-stone-100 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-teal-700" />
                    <span>Lug‘atni ochish</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTopicId('medical_english');
                      setSelectedDeckId(null);
                      setSelectedCefrLevel(null);
                      setCurrentScreen('flashcards');
                    }}
                    className="flex-1 sm:w-full px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 font-black text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-teal-950" />
                    <span>Fleshkarta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SHAXSIY TO'PLAMLAR ================= */}
      {activeTab === 'shaxsiy' && (
        <div className="space-y-4 pb-6 animate-in fade-in">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <FolderHeart className="w-4 h-4 text-indigo-600" />
                <span>Mening kartotekalarim ({decks.length})</span>
              </span>
              <p className="text-[11px] text-stone-400 mt-0.5">
                AI yordamida yaratilgan va shaxsiy saqlangan fleshkarta to‘plamlari
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAddWordDefaultTab('ai_batch');
                  setCurrentScreen('add_word');
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>AI Flashcard</span>
              </button>
              <button
                onClick={() => {
                  setAddWordDefaultTab('single');
                  setCurrentScreen('add_word');
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ So‘z</span>
              </button>
              <button
                onClick={() => setShowCreateDeckModal(true)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Yangi to‘plam</span>
              </button>
            </div>
          </div>

          {/* Decks Grid */}
          {decks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                <FolderHeart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-stone-900">Hozircha shaxsiy to‘plamlar yo‘q</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                AI Flashcard Generator orqali matn, rasm yoki fayl tashlab bir zumda "Grammar 1" yoki boshqa to‘plam yarating!
              </p>
              <button
                onClick={() => {
                  setAddWordDefaultTab('ai_batch');
                  setCurrentScreen('add_word');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>AI orqali birinchi to‘plamni yaratish</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {decks.map((deck) => {
                return (
                  <div
                    key={deck.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center justify-between group"
                  >
                    <div
                      onClick={() => setActiveDeckDetail(deck)}
                      className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl bg-linear-to-br ${deck.color} text-white flex items-center justify-center font-bold shadow-2xs shrink-0`}
                      >
                        <FolderHeart className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-stone-900 truncate">{deck.name}</h3>
                          {deck.name === 'Grammar 1' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              Yangi
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5 truncate">{deck.description}</div>
                        <div className="text-[11px] text-indigo-600 font-bold mt-1">
                          {deck.words.length} ta fleshkarta
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedDeckId(deck.id);
                          setSelectedTopicId(null);
                          setCurrentScreen('flashcards');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Fleshkarta orqali takrorlash"
                      >
                        <Play className="w-3.5 h-3.5 fill-indigo-700" />
                        <span className="hidden sm:inline">O‘rganish</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeckToDelete(deck);
                        }}
                        className="p-2 rounded-xl text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="To‘plamni o‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <ChevronRight
                        onClick={() => setActiveDeckDetail(deck)}
                        className="w-5 h-5 text-stone-400 group-hover:text-indigo-600 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create new personal deck */}
      {showCreateDeckModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Yangi to‘plam yaratish</h3>
            <p className="text-xs text-stone-500 mb-4">
              Masalan: "Grammar 1", "IELTS Reading", "Sayohat so‘zlari"
            </p>

            <form onSubmit={handleCreateDeck} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  To‘plam nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Masalan: Grammar 1"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Qisqacha tavsif (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={newDeckDesc}
                  onChange={(e) => setNewDeckDesc(e.target.value)}
                  placeholder="Maqsadi yoki izoh"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDeckModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Deck Deletion */}
      {deckToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              To‘plamni o‘chirish
            </h3>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              Haqiqatan ham <strong className="text-stone-900">«{deckToDelete.name}»</strong> to‘plamini o‘chirmoqchimisiz? Ushbu to‘plamdagi so‘zlar to‘plamdan olib tashlanadi. Bu amalni qaytarib bo‘lmaydi.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeckToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = deckToDelete.id;
                  deleteDeck(targetId);
                  setDeckToDelete(null);
                  if (activeDeckDetail?.id === targetId) {
                    setActiveDeckDetail(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Ha, o‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
