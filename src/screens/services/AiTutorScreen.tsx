import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Volume2,
  Bot,
  User as UserIcon,
  HelpCircle,
  Lightbulb,
  Lock,
  Crown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakWord } from '../../utils/srs';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'Assalomu alaykum! Men Verbo AI repititoriman. Ingliz tili so‘zlari, nozik ma’no farqlari, grammatika yoki IELTS Speaking bo‘yicha savollaringiz bo‘lsa, bemalol so‘rang!',
    time: 'Hozir',
  },
];

const PRESET_PROMPTS = [
  { label: 'Farqini tushuntir', query: '"Look", "See" va "Watch" so‘zlari orasida qanday farq bor?' },
  { label: 'IELTS 7.0 so‘zlar', query: 'IELTS Speaking uchun "important" o‘rniga ishlatish mumkin bo‘lgan 3 ta kuchli sinonim bering.' },
  { label: 'Xatoni tekshir', query: 'Ushbu gapda grammatik xato bormi: "I am agree with your opinion"?' },
  { label: 'Qisqa dialog', query: 'Keling, aeroportda ro‘yxatdan o‘tish mavzusida qisqa dialog qilaylik.' },
];

export const AiTutorScreen: React.FC = () => {
  const { setCurrentScreen, user, openLockedFeatureModal } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    if (!user.premiumStatus) {
      openLockedFeatureModal('ai_tutor');
      return;
    }

    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
          userMessage: text.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('AI xizmatida xatolik yuz berdi');
      }

      const data = await res.json();
      const replyText = data.reply || 'Kechirasiz, javob olishda uzilish bo‘ldi. Qaytadan urinib ko‘ring.';

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Ai Tutor Error, using fallback:', err);
      // Fallback helpful tutor response
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Ajoyib savol! "${text.trim()}" bo'yicha amaliy maslahat: Har kuni 10 tadan yangi so'zni faqat gap ichida o'rganing va ularning sinonimlarini taqqoslang. Masalan: important -> crucial, essential, vital.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="ai-tutor-screen" className="flex-1 flex flex-col bg-stone-50 overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('services')}
            className="p-1.5 -ml-2 rounded-xl text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-stone-900">Verbo AI Repetitor</h2>
                {!user.premiumStatus && (
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    <Lock className="w-2 h-2 stroke-[2.5]" />
                    PRO
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Faol va tayyor
              </span>
            </div>
          </div>
        </div>

        {!user.premiumStatus && (
          <button
            onClick={() => openLockedFeatureModal('ai_tutor')}
            className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-extrabold flex items-center gap-1 transition-colors"
          >
            <Crown className="w-3 h-3 text-amber-600" />
            <span>Qulfni ochish</span>
          </button>
        )}
      </div>

      {/* Locked Notice Banner for Non-Premium */}
      {!user.premiumStatus && (
        <div
          onClick={() => openLockedFeatureModal('ai_tutor')}
          className="mx-3 mt-3 p-3 bg-linear-to-r from-amber-50 via-amber-100/60 to-amber-50 border border-amber-300/80 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-950">
                  AI Repetitor Premium rejimda ishlaydi
                </span>
              </div>
              <p className="text-[11px] text-amber-800 line-clamp-1">
                24/7 cheksiz savol-javob, grammatik tahlil va IELTS suhbati uchun obunani yoqing.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-900 shrink-0 underline decoration-amber-400 whitespace-nowrap">
            Imkoniyatlar
          </span>
        </div>
      )}

      {/* Preset Chips */}
      <div className="p-3 bg-stone-100/70 border-b border-stone-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        {PRESET_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-indigo-400 hover:text-indigo-600 text-stone-700 font-bold shrink-0 transition-colors shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white border border-stone-200 text-stone-900 rounded-tl-none shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div className="flex items-center justify-between pt-1 opacity-60 text-[9px]">
                <span>{m.time}</span>
                {m.sender === 'ai' && (
                  <button
                    onClick={() => speakWord(m.text)}
                    className="p-1 hover:text-indigo-600 text-stone-500"
                    title="Ovozli eshitish"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0 text-xs mt-1">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-stone-400 text-xs italic p-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Verbo AI javob tayyorlamoqda...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={
            !user.premiumStatus
              ? 'Savolingizni yozing (Premium bilan faollashadi)...'
              : 'Savolingizni yoki so‘zni yozing...'
          }
          className="flex-1 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-hidden"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className={`p-3 rounded-xl disabled:opacity-40 shadow-xs transition-colors ${
            !user.premiumStatus
              ? 'bg-amber-500 hover:bg-amber-600 text-stone-950'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          title={!user.premiumStatus ? 'Premium obunani faollashtiring' : 'Yuborish'}
        >
          {!user.premiumStatus ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
