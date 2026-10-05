/**
 * Offline Sync and Network Status Management for Verbo.uz
 * Ensures all vocabulary, flashcards, test progress, and SRS intervals
 * are reliably stored in local storage and synced when back online.
 */

import { Word, UserWordProgress } from '../types';

export interface OfflineSyncStatus {
  isOnline: boolean;
  lastSyncedAt: string;
  pendingSyncCount: number;
}

const STORAGE_KEY_OFFLINE_QUEUE = 'verbo_offline_sync_queue';
const STORAGE_KEY_LAST_SYNC = 'verbo_last_sync_timestamp';

/**
 * Check if the browser currently has network connectivity
 */
export function checkIsOnline(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

/**
 * Save pending sync action into offline queue
 */
export function enqueueOfflineAction(action: {
  type: 'word_progress' | 'test_result' | 'xp_gain' | 'error_record';
  data: any;
  timestamp: string;
}) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(action);
    localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to enqueue offline action:', e);
  }
}

/**
 * Retrieve pending offline queue items
 */
export function getOfflineQueue(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear offline queue after successful sync
 */
export function clearOfflineQueue() {
  try {
    localStorage.removeItem(STORAGE_KEY_OFFLINE_QUEUE);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toISOString());
  } catch {}
}

/**
 * Pre-cache core vocabulary and user state so flashcards and tests work 100% offline
 */
export function cacheEssentialVocabularyForOffline(words: Word[]) {
  try {
    if (words && words.length > 0) {
      localStorage.setItem('verbo_cached_words_offline', JSON.stringify(words.slice(0, 500)));
    }
  } catch {}
}
