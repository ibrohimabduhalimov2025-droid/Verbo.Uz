import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Download,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  Share2,
  Copy,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExportToolsScreen: React.FC = () => {
  const {
    setCurrentScreen,
    words,
    topics,
    cefrLevelWords,
    selectedCefrLevel,
    loadCefrWordsForLevel,
    user,
  } = useApp();

  const [activeTool, setActiveTool] = useState<'cards' | 'csv' | 'anki' | 'story'>('cards');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [copiedToast, setCopiedToast] = useState(false);

  React.useEffect(() => {
    if (cefrLevelWords.length === 0) {
      loadCefrWordsForLevel(selectedCefrLevel || user.level || 'A1');
    }
  }, [cefrLevelWords.length, selectedCefrLevel, user.level]);

  const pool = words.length > 0 ? words : cefrLevelWords;

  const filteredWords =
    selectedTopicId === 'all'
      ? pool
      : pool.filter((w) => w.topicId === selectedTopicId || w.category === selectedTopicId);

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = 'English,Uzbek,Transcription,Example Sentence,Level\n';
    const rows = filteredWords
      .map(
        (w) =>
          `"${w.english.replace(/"/g, '""')}","${w.uzbek.replace(/"/g, '""')}","${
            w.transcription || ''
          }","${(w.exampleSentence || '').replace(/"/g, '""')}","${w.level}"`
      )
      .join('\n');

    // Add BOM for Excel UTF-8 support
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `verbo_lugat_${selectedTopicId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Anki Deck (TSV)
  const handleDownloadAnki = () => {
    const rows = filteredWords
      .map((w) => `${w.english} <br><small>${w.transcription || ''}</small>\t${w.uzbek} <br><i>${w.exampleSentence || ''}</i>\t${w.level}`)
      .join('\n');

    const blob = new Blob([rows], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `verbo_anki_${selectedTopicId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintCards = () => {
    window.print();
  };

  return (
    <div id="export-tools-screen" className="flex-1 flex flex-col p-4 sm:p-5 bg-stone-50 overflow-y-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('services')}
          className="p-2 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-stone-700">PDF & Eksport Vositalari</span>
        <div className="w-8" />
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-stone-200/70 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTool('cards')}
          className={`py-2 rounded-xl transition-all ${
            activeTool === 'cards'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Qog‘oz Kartalar
        </button>
        <button
          onClick={() => setActiveTool('csv')}
          className={`py-2 rounded-xl transition-all ${
            activeTool === 'csv'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Excel / CSV
        </button>
        <button
          onClick={() => setActiveTool('anki')}
          className={`py-2 rounded-xl transition-all ${
            activeTool === 'anki'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Anki (.txt)
        </button>
      </div>

      {/* Topic Filter */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-stone-200 text-xs">
        <span className="font-semibold text-stone-600">Mavzu bo‘yicha saralash:</span>
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 font-bold text-stone-900 focus:outline-hidden"
        >
          <option value="all">Barcha so‘zlar ({words.length})</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* View 1: Printable Flashcards Preview */}
      {activeTool === 'cards' && (
        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">
              Chop etish andozasi ({filteredWords.length} ta so‘z)
            </span>
            <button
              onClick={handlePrintCards}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Chop etish / PDF</span>
            </button>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            💡 <b>Maslahat:</b> Ushbu kartochkalarni A4 qog‘oziga chop etib, chiziqlar bo‘ylab qirqib oling. O‘rtasidan bukilsa, bir tomoni inglizcha, orqasi o‘zbekcha bo‘ladi.
          </div>

          {/* Printable Cards Grid */}
          <div className="grid grid-cols-2 gap-3 print:grid-cols-2 print:gap-2">
            {filteredWords.slice(0, 12).map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl p-3 border-2 border-dashed border-stone-300 flex flex-col justify-between min-h-[140px] text-center shadow-2xs"
              >
                <div>
                  <span className="text-[9px] font-mono uppercase text-stone-400 block mb-1">
                    Verbo.uz • {w.level}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    {w.english}
                  </h3>
                  <p className="text-[10px] font-mono text-stone-400">
                    {w.transcription}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <p className="text-xs font-bold text-indigo-700">{w.uzbek}</p>
                  {w.exampleSentence && (
                    <p className="text-[9px] text-stone-500 italic mt-0.5 line-clamp-1">
                      "{w.exampleSentence}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Excel / CSV Export */}
      {activeTool === 'csv' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center space-y-4 my-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold font-display text-stone-900">
              Excel va Google Sheets uchun eksport
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Barcha tanlangan so‘zlar, transkripsiya, tarjima va misol jumlalar UTF-8 formatidagi CSV faylga jamlanadi.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 font-mono">
            {filteredWords.length} ta yozuv tayyorlandi
          </div>

          <button
            onClick={handleDownloadCsv}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV faylini yuklab olish</span>
          </button>
        </div>
      )}

      {/* View 3: Anki Deck Export */}
      {activeTool === 'anki' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center space-y-4 my-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold font-display text-stone-900">
              Anki (.txt) formatiga moslashtirish
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Anki Desktop yoki AnkiDroid ilovasiga to‘g‘ridan-to‘g‘ri import qilish uchun tab-separated fayl.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 font-mono">
            Front: Inglizcha + Transkripsiya | Back: O‘zbekcha + Misol
          </div>

          <button
            onClick={handleDownloadAnki}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Anki faylini yuklab olish (.txt)</span>
          </button>
        </div>
      )}
    </div>
  );
};
