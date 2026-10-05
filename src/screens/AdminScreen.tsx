import React, { useState } from 'react';
import {
  ArrowLeft,
  Crown,
  Database,
  Plus,
  Trash2,
  Edit,
  Users,
  Search,
  CheckCircle,
  FolderOpen,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Word } from '../types';
import { speakWord } from '../utils/srs';

export const AdminScreen: React.FC = () => {
  const { user, setCurrentScreen, words, topics, addNewWord } = useApp();

  const [activeTab, setActiveTab] = useState<'words' | 'topics' | 'stats'>('words');
  const [search, setSearch] = useState('');

  // Access control guard
  if (user.role !== 'admin') {
    return (
      <div id="admin-screen-denied" className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <Crown className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 mb-2">Ruxsat cheklangan</h2>
        <p className="text-sm text-stone-600 mb-6 max-w-xs">
          Admin boshqaruv paneliga kirish uchun faqat administrator huquqiga ega foydalanuvchilarga ruxsat berilgan.
        </p>
        <button
          onClick={() => setCurrentScreen('profile')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
        >
          Profilga qaytish
        </button>
      </div>
    );
  }

  // Add word modal within admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [enWord, setEnWord] = useState('');
  const [uzWord, setUzWord] = useState('');
  const [trans, setTrans] = useState('');
  const [example, setExample] = useState('');
  const [topic, setTopic] = useState(topics[0]?.id || 'topic_1');
  const [lvl, setLvl] = useState<'A1' | 'A2' | 'B1' | 'B2'>('B1');

  const handleAdminAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (enWord.trim() && uzWord.trim()) {
      addNewWord({
        english: enWord.trim(),
        uzbek: uzWord.trim(),
        transcription: trans.trim() || `/${enWord.toLowerCase()}/`,
        exampleSentence: example.trim(),
        topicId: topic,
        level: lvl,
      });
      setEnWord('');
      setUzWord('');
      setTrans('');
      setExample('');
      setShowAddModal(false);
    }
  };

  const filteredWords = words.filter(
    (w) =>
      w.english.toLowerCase().includes(search.toLowerCase()) ||
      w.uzbek.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="admin-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-stone-900">Admin Boshqaruv (CMS)</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 p-1 bg-stone-200/70 rounded-xl mb-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('words')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'words' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
          }`}
        >
          So‘zlar ({words.length})
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'topics' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
          }`}
        >
          Mavzular ({topics.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'stats' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
          }`}
        >
          Statistika
        </button>
      </div>

      {/* Tab 1: Words Database */}
      {activeTab === 'words' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 mr-2">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="So‘z qidirish..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi</span>
            </button>
          </div>

          <div className="space-y-2 pb-6">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-xl p-3 border border-stone-200 flex items-center justify-between text-xs shadow-2xs"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-stone-900">{word.english}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {word.transcription}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-sm">
                      {word.level}
                    </span>
                  </div>
                  <div className="text-stone-600 truncate mt-0.5">{word.uzbek}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakWord(word.english)}
                    className="p-1.5 text-stone-400 hover:text-indigo-600"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Topics Management */}
      {activeTab === 'topics' && (
        <div className="space-y-3 pb-6">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Ilovaning rasmiy mavzulari
          </span>

          <div className="space-y-2.5">
            {topics.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl">
                    {t.cover}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">{t.name}</div>
                    <div className="text-[11px] text-stone-400">
                      {t.nameEn} • {t.level}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Faol
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Stats & Metrics */}
      {activeTab === 'stats' && (
        <div className="space-y-3 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500">Jami faol so‘zlar</span>
              <div className="text-2xl font-bold font-display text-indigo-600 mt-1">
                {words.length} ta
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500">O‘rtacha aniqlik</span>
              <div className="text-2xl font-bold font-display text-emerald-600 mt-1">
                84.2%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-stone-900 block">
              Firebase & Server holati (Tayyorgarlik)
            </span>
            <p className="text-xs text-stone-500">
              Ushbu prototip Flutter + Firebase arxitekturasiga 1:1 ko‘chirish uchun barcha data modellar (types/index.ts) bilan sinxronlashtirilgan.
            </p>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Barcha lokal kesh va SM-2 algoritmi faol ishlamoqda.</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Word Modal in CMS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-stone-900 mb-3">Admin orqali so‘z qo‘shish</h3>

            <form onSubmit={handleAdminAddWord} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Inglizcha</label>
                <input
                  type="text"
                  required
                  value={enWord}
                  onChange={(e) => setEnWord(e.target.value)}
                  placeholder="Masalan: Metaphor"
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">O‘zbekcha</label>
                <input
                  type="text"
                  required
                  value={uzWord}
                  onChange={(e) => setUzWord(e.target.value)}
                  placeholder="Masalan: Majoz / Metafora"
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Mavzu</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Daraja</label>
                  <select
                    value={lvl}
                    onChange={(e) => setLvl(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
