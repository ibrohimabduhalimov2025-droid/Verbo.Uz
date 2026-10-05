#!/usr/bin/env python3
import json

with open('tmp/topic_categories.json') as f:
    categories = json.load(f)

# Build TypeScript object string
ts_entries = []
for key, meta in categories.items():
    # Escape quotes
    k_str = json.dumps(key, ensure_ascii=False)
    cat_str = json.dumps(meta['nameUz'], ensure_ascii=False)
    nameUz_str = json.dumps(meta['nameUz'], ensure_ascii=False)
    nameEn_str = json.dumps(meta['nameEn'], ensure_ascii=False)
    emoji_str = json.dumps(meta['emoji'], ensure_ascii=False)
    color_str = json.dumps(meta['color'], ensure_ascii=False)
    grad_str = json.dumps(meta['gradient'], ensure_ascii=False)
    bg_str = json.dumps(meta['bgLight'], ensure_ascii=False)
    bdr_str = json.dumps(meta['borderLight'], ensure_ascii=False)
    txt_str = json.dumps(meta['textAccent'], ensure_ascii=False)
    desc_str = json.dumps(meta['desc'], ensure_ascii=False)

    ts_entries.append(f"""  {k_str}: {{
    category: {cat_str},
    nameUz: {nameUz_str},
    nameEn: {nameEn_str},
    emoji: {emoji_str},
    color: {color_str},
    gradient: {grad_str},
    bgLight: {bg_str},
    borderLight: {bdr_str},
    textAccent: {txt_str},
    description: {desc_str},
  }},""")

categories_ts = "\n".join(ts_entries)

# Build full cefrService.ts
cefr_service_content = f'''import {{ Word, CEFRLevel }} from '../types';
import {{ saveCefrLevelOffline, getCefrLevelOffline, CEFR_DATABASE_VERSION }} from './offlineSyncService';

export interface CefrLevelMeta {{
  level: CEFRLevel;
  nameUz: string;
  nameEn: string;
  count: number;
  ieltsBand: string;
  cefrColor: string;
  gradient: string;
  description: string;
  focus: string;
}}

export const CEFR_LEVELS_META: Record<CEFRLevel, CefrLevelMeta> = {{
  A1: {{
    level: 'A1',
    nameUz: 'Boshlang‘ich (Beginner)',
    nameEn: 'Beginner',
    count: 1500,
    ieltsBand: '2.0 – 3.0',
    cefrColor: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Kundalik eng zarur so‘zlar, salomlashuv, raqamlar, oila va sodda iboralar.',
    focus: 'Kundalik muloqot va asosiy tushunchalar',
  }},
  A2: {{
    level: 'A2',
    nameUz: 'Elementar (Elementary)',
    nameEn: 'Elementary',
    count: 1500,
    ieltsBand: '3.5 – 4.0',
    cefrColor: 'teal',
    gradient: 'from-teal-500 to-cyan-600',
    description: 'Do‘kon, sayohat, ish, uy-joy va o‘tgan zamon voqealari haqida suhbatlashish.',
    focus: 'Kundalik vaziyatlar va shaxsiy ma’lumotlar',
  }},
  B1: {{
    level: 'B1',
    nameUz: 'O‘rta (Intermediate)',
    nameEn: 'Intermediate',
    count: 2000,
    ieltsBand: '4.5 – 5.0',
    cefrColor: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    description: 'O‘z fikrini ifodalash, orzular, tajribalar va kundalik mavzularda mustaqil suhbat.',
    focus: 'Erkin ifoda va ijtimoiy muloqot',
  }},
  B2: {{
    level: 'B2',
    nameUz: 'Yuqori o‘rta (Upper-Intermediate)',
    nameEn: 'Upper-Intermediate',
    count: 2500,
    ieltsBand: '5.5 – 6.5',
    cefrColor: 'indigo',
    gradient: 'from-indigo-600 to-purple-600',
    description: 'Murakkab matnlar, abstrakt tushunchalar, munozara va professional soha so‘zlari.',
    focus: 'Professional va akademik tayyorgarlik',
  }},
  C1: {{
    level: 'C1',
    nameUz: 'Ilg‘or (Advanced)',
    nameEn: 'Advanced',
    count: 1500,
    ieltsBand: '7.0 – 8.0',
    cefrColor: 'purple',
    gradient: 'from-purple-600 to-pink-600',
    description: 'Akademik ilmiy matnlar, yashirin ma’nolar, boy sinonimlar va ravon nutq.',
    focus: 'IELTS 7.5+ va professional mutaxassislik',
  }},
  C2: {{
    level: 'C2',
    nameUz: 'Mukammal (Proficiency)',
    nameEn: 'Proficiency',
    count: 1000,
    ieltsBand: '8.5 – 9.0',
    cefrColor: 'amber',
    gradient: 'from-amber-500 to-rose-600',
    description: 'Ona tili darajasidagi boy lug‘at, nozik ma’nodosh so‘zlar, adabiy va ilmiy terminlar.',
    focus: 'To‘liq ona tili darajasi va akademik mukammallik',
  }},
}};

export interface CefrTopicMeta {{
  category: string;
  nameUz: string;
  nameEn: string;
  emoji: string;
  color: string;
  gradient: string;
  bgLight: string;
  borderLight: string;
  textAccent: string;
  description: string;
}}

export const CEFR_TOPIC_CATEGORIES: Record<string, CefrTopicMeta> = {{
{categories_ts}
}};

export const CEFR_LEVELS_SEQUENCE: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export interface CefrTopicGroup {{
  id: string; // topicId (e.g. cefr_a1_greetings)
  category: string; // category string
  nameUz: string;
  nameEn: string;
  emoji: string;
  color: string;
  gradient: string;
  bgLight: string;
  borderLight: string;
  textAccent: string;
  description: string;
  totalWords: number;
  words: Word[];
  learnedCount: number;
  learningCount: number;
  newCount: number;
  percent: number;
}}

export function getNextTopicInLevel(
  currentTopicId: string,
  levelTopics: CefrTopicGroup[]
): {{ nextTopic: CefrTopicGroup | null; isLastTopic: boolean }} {{
  const index = levelTopics.findIndex(
    (t) => t.id === currentTopicId || t.category === currentTopicId
  );
  if (index === -1) {{
    return {{ nextTopic: null, isLastTopic: false }};
  }}
  if (index + 1 < levelTopics.length) {{
    return {{ nextTopic: levelTopics[index + 1], isLastTopic: false }};
  }}
  return {{ nextTopic: null, isLastTopic: true }};
}}

export function getNextCefrLevel(currentLevel: CEFRLevel): CEFRLevel | null {{
  const idx = CEFR_LEVELS_SEQUENCE.indexOf(currentLevel);
  if (idx !== -1 && idx + 1 < CEFR_LEVELS_SEQUENCE.length) {{
    return CEFR_LEVELS_SEQUENCE[idx + 1];
  }}
  return null;
}}

export function groupCefrWordsByTopic(
  words: Word[],
  wordProgress: Record<string, any> = {{}}
): CefrTopicGroup[] {{
  const map = new Map<string, Word[]>();

  for (const w of words) {{
    const cat = w.category || 'Salomlashuv va Kundalik muloqot';
    if (!map.has(cat)) {{
      map.set(cat, []);
    }}
    map.get(cat)!.push(w);
  }}

  const groups: CefrTopicGroup[] = [];

  for (const [cat, catWords] of map.entries()) {{
    const meta = CEFR_TOPIC_CATEGORIES[cat] || {{
      category: cat,
      nameUz: cat,
      nameEn: catWords[0]?.topicId?.replace(/^cefr_[a-z0-9]+_/, '') || 'Topic Words',
      emoji: '📚',
      color: 'indigo',
      gradient: 'from-indigo-600 to-blue-700',
      bgLight: 'bg-indigo-50/80',
      borderLight: 'border-indigo-200',
      textAccent: 'text-indigo-800',
      description: `${{cat}} mavzusiga oid saralangan leksika va iboralar to‘plami.`,
    }};

    let learnedCount = 0;
    let learningCount = 0;

    for (const w of catWords) {{
      const p = wordProgress[w.id];
      if (p) {{
        if (p.masteryLevel === 'ozlashtirilgan') learnedCount++;
        else if (p.masteryLevel === 'organilmoqda') learningCount++;
      }}
    }}

    const totalWords = catWords.length;
    const newCount = Math.max(0, totalWords - learnedCount - learningCount);
    const weightedLearned = learnedCount + learningCount * 0.5;
    let percent = 0;
    if (totalWords > 0 && weightedLearned > 0) {{
      const calc = (weightedLearned / totalWords) * 100;
      percent = calc < 1 ? Math.max(0.1, Number(calc.toFixed(1))) : Math.round(calc);
    }}
    const topicId = catWords[0]?.topicId || `cefr_topic_${{encodeURIComponent(cat)}}`;

    groups.push({{
      id: topicId,
      category: cat,
      nameUz: meta.nameUz,
      nameEn: meta.nameEn,
      emoji: meta.emoji,
      color: meta.color,
      gradient: meta.gradient,
      bgLight: meta.bgLight,
      borderLight: meta.borderLight,
      textAccent: meta.textAccent,
      description: meta.description,
      totalWords,
      words: catWords,
      learnedCount,
      learningCount,
      newCount,
      percent,
    }});
  }}

  // Sort groups strictly by their natural appearance order in the dataset (first word's orderNumber)
  return groups.sort((a, b) => {{
    const firstA = a.words[0]?.orderNumber || 0;
    const firstB = b.words[0]?.orderNumber || 0;
    return firstA - firstB;
  }});
}}

export const TOTAL_CEFR_WORDS = 10000;

// In-memory cache for level words
const wordsCache = new Map<CEFRLevel, Word[]>();
let starterWordsCache: Word[] | null = null;

/**
 * Load all words for a specific CEFR level (A1=1500, A2=1500, B1=2000, B2=2500, C1=1500, C2=1000)
 */
export async function getCefrLevelWords(level: CEFRLevel): Promise<Word[]> {{
  if (wordsCache.has(level)) {{
    return wordsCache.get(level)!;
  }}

  try {{
    const res = await fetch(`/data/cefr/${{level.toLowerCase()}}.json?v=${{CEFR_DATABASE_VERSION}}`);
    if (!res.ok) {{
      throw new Error(`Failed to load CEFR ${{level}} vocabulary: ${{res.statusText}}`);
    }}
    const data: Word[] = await res.json();
    wordsCache.set(level, data);
    saveCefrLevelOffline(level, data).catch(() => {{}});
    return data;
  }} catch (err) {{
    console.warn(`[Verbo Offline] Network fetch failed for CEFR ${{level}}, checking offline cache:`, err);
    const offlineCached = await getCefrLevelOffline(level);
    if (offlineCached && offlineCached.length > 0) {{
      wordsCache.set(level, offlineCached);
      return offlineCached;
    }}
    const starters = await getCefrStarterWords();
    const fallback = starters.filter((w) => w.level === level);
    return fallback;
  }}
}}

/**
 * Load quick preview starter words
 */
export async function getCefrStarterWords(): Promise<Word[]> {{
  if (starterWordsCache) {{
    return starterWordsCache;
  }}

  try {{
    const res = await fetch(`/data/cefr/starter_preview.json?v=${{CEFR_DATABASE_VERSION}}`);
    if (res.ok) {{
      const data: Word[] = await res.json();
      starterWordsCache = data;
      return data;
    }}
  }} catch (err) {{
    console.warn('Could not load starter preview words:', err);
  }}

  return [];
}}

export function clearCefrCache(): void {{
  wordsCache.clear();
  starterWordsCache = null;
}}
'''

with open('src/services/cefrService.ts', 'w', encoding='utf-8') as f:
    f.write(cefr_service_content)

print("Updated src/services/cefrService.ts successfully!")
