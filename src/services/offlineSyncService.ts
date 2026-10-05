import { Word, CEFRLevel, UserWordProgress } from '../types';

const DB_NAME = 'verbo_offline_db';
const DB_VERSION = 2;
const STORE_CEFR = 'cefr_words';
const STORE_PROGRESS = 'progress';
const STORE_META = 'metadata';

export const CEFR_DATABASE_VERSION = '2.3.0';

/**
 * Checks if stored CEFR vocabulary cache is outdated and clears it if so.
 */
export function invalidateCefrCacheIfOutdated(): void {
  if (typeof window === 'undefined') return;
  try {
    const storedVer = localStorage.getItem('verbo_cefr_db_version');
    if (storedVer !== CEFR_DATABASE_VERSION) {
      console.log(`[Verbo Offline] Upgrading CEFR database cache to v${CEFR_DATABASE_VERSION}...`);
      localStorage.removeItem('verbo_cefr_cache');
      ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].forEach((lvl) => {
        localStorage.removeItem(`verbo_offline_cefr_${lvl}_preview`);
      });
      openDatabase().then((db) => {
        if (db) {
          try {
            const tx = db.transaction(STORE_CEFR, 'readwrite');
            tx.objectStore(STORE_CEFR).clear();
          } catch {
            // ignore
          }
        }
      });
      localStorage.setItem('verbo_cefr_db_version', CEFR_DATABASE_VERSION);
    }
  } catch (e) {
    console.warn('[Verbo Offline] Cache invalidation notice:', e);
  }
}

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase | null> | null = null;

/**
 * Open IndexedDB safely with fallback
 */
function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  if (dbInstance) return Promise.resolve(dbInstance);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_CEFR)) {
          db.createObjectStore(STORE_CEFR, { keyPath: 'level' });
        }
        if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
          db.createObjectStore(STORE_PROGRESS, { keyPath: 'wordId' });
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        resolve(dbInstance);
      };

      request.onerror = (e) => {
        console.warn('[Verbo Offline] IndexedDB open error, falling back to LocalStorage:', e);
        resolve(null);
      };
    } catch (err) {
      console.warn('[Verbo Offline] IndexedDB initialization failed:', err);
      resolve(null);
    }
  });

  return dbPromise;
}

/**
 * Save CEFR level word list to IndexedDB & localStorage cache
 */
export async function saveCefrLevelOffline(level: CEFRLevel, words: Word[]): Promise<void> {
  if (!words || words.length === 0) return;

  try {
    const db = await openDatabase();
    if (db) {
      const tx = db.transaction(STORE_CEFR, 'readwrite');
      const store = tx.objectStore(STORE_CEFR);
      store.put({ level, words, savedAt: Date.now() });
    }
  } catch (err) {
    console.warn(`[Verbo Offline] Error saving CEFR ${level} to IndexedDB:`, err);
  }

  // Backup starter subset in localStorage for instant boot
  try {
    const key = `verbo_offline_cefr_${level.toLowerCase()}_preview`;
    const preview = words.slice(0, 100);
    localStorage.setItem(key, JSON.stringify(preview));
  } catch {
    // LocalStorage quota safety
  }
}

/**
 * Retrieve CEFR words from IndexedDB or LocalStorage fallback
 */
export async function getCefrLevelOffline(level: CEFRLevel): Promise<Word[] | null> {
  try {
    const db = await openDatabase();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_CEFR, 'readonly');
          const store = tx.objectStore(STORE_CEFR);
          const req = store.get(level);

          req.onsuccess = () => {
            if (req.result && Array.isArray(req.result.words) && req.result.words.length > 0) {
              resolve(req.result.words);
            } else {
              resolve(getFromLocalStorage(level));
            }
          };
          req.onerror = () => resolve(getFromLocalStorage(level));
        } catch {
          resolve(getFromLocalStorage(level));
        }
      });
    }
  } catch {
    // fallback
  }

  return getFromLocalStorage(level);
}

function getFromLocalStorage(level: CEFRLevel): Word[] | null {
  try {
    const key = `verbo_offline_cefr_${level.toLowerCase()}_preview`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

/**
 * Save user progress snapshot to IndexedDB for offline persistence
 */
export async function syncProgressOffline(progressMap: Record<string, UserWordProgress>): Promise<void> {
  try {
    const db = await openDatabase();
    if (db) {
      const tx = db.transaction(STORE_PROGRESS, 'readwrite');
      const store = tx.objectStore(STORE_PROGRESS);
      Object.values(progressMap).forEach((p) => {
        store.put(p);
      });
    }
  } catch (err) {
    console.warn('[Verbo Offline] Error storing progress in IndexedDB:', err);
  }
}

/**
 * Pre-cache all essential preview words into IndexedDB in background
 */
export async function preloadAllEssentialVocabulary(): Promise<void> {
  try {
    const res = await fetch('/data/cefr/starter_preview.json');
    if (res.ok) {
      const allStarters: Word[] = await res.json();
      const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

      for (const lvl of levels) {
        const levelWords = allStarters.filter((w) => w.level === lvl);
        if (levelWords.length > 0) {
          await saveCefrLevelOffline(lvl, levelWords);
        }
      }
    }
  } catch (err) {
    console.warn('[Verbo Offline] Background pre-cache notice:', err);
  }
}

/**
 * Subscribe to online/offline network changes
 */
export function subscribeNetworkStatus(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
