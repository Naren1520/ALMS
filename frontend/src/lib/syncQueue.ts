/**
 * Client-side Sync Queue for offline resilience (Req 23.1–23.6)
 * Stores pending operations in localStorage when offline.
 * Replays on reconnection with at most 3 retry attempts.
 */
'use client';

const QUEUE_KEY = 'alms_sync_queue';
const MAX_ENTRIES = 50;
const MAX_RETRIES = 3;

export type SyncOperation = 'PRODUCT_DRAFT' | 'IMAGE_UPLOAD' | 'VOICE_NOTE';

export type SyncStatus = 'PENDING' | 'UPLOADING' | 'COMPLETED' | 'FAILED';

export interface SyncQueueEntry {
  id: string;
  timestamp: number;
  operation: SyncOperation;
  payload: Record<string, unknown>;
  retryCount: number;
  status: SyncStatus;
}

export function getQueue(): SyncQueueEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as SyncQueueEntry[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(entries: SyncQueueEntry[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(entries));
}

/** Add an entry, evicting oldest PENDING if at cap (Req 23.5) */
export function enqueue(
  operation: SyncOperation,
  payload: Record<string, unknown>,
  onEviction?: (evicted: SyncQueueEntry) => void,
): SyncQueueEntry {
  const queue = getQueue();

  // Enforce cap
  if (queue.length >= MAX_ENTRIES) {
    const oldestPendingIdx = queue.findIndex((e) => e.status === 'PENDING');
    if (oldestPendingIdx !== -1) {
      const evicted = queue.splice(oldestPendingIdx, 1)[0];
      onEviction?.(evicted);
    }
  }

  const entry: SyncQueueEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    operation,
    payload,
    retryCount: 0,
    status: 'PENDING',
  };

  queue.push(entry);
  saveQueue(queue);
  return entry;
}

export function updateEntry(id: string, updates: Partial<SyncQueueEntry>): void {
  const queue = getQueue();
  const idx = queue.findIndex((e) => e.id === id);
  if (idx !== -1) {
    queue[idx] = { ...queue[idx], ...updates };
    saveQueue(queue);
  }
}

export function removeEntry(id: string): void {
  const queue = getQueue().filter((e) => e.id !== id);
  saveQueue(queue);
}

/** Replay all PENDING entries in chronological order (Req 23.3, 23.4) */
export async function replayQueue(
  executor: (entry: SyncQueueEntry) => Promise<void>,
  onProgress?: (entry: SyncQueueEntry) => void,
): Promise<void> {
  const pending = getQueue()
    .filter((e) => e.status === 'PENDING')
    .sort((a, b) => a.timestamp - b.timestamp);

  for (const entry of pending) {
    updateEntry(entry.id, { status: 'UPLOADING' });
    onProgress?.({ ...entry, status: 'UPLOADING' });

    try {
      await executor(entry);
      updateEntry(entry.id, { status: 'COMPLETED' });
      onProgress?.({ ...entry, status: 'COMPLETED' });
    } catch {
      const newRetryCount = entry.retryCount + 1;
      if (newRetryCount >= MAX_RETRIES) {
        updateEntry(entry.id, { status: 'FAILED', retryCount: newRetryCount });
        onProgress?.({ ...entry, status: 'FAILED', retryCount: newRetryCount });
      } else {
        updateEntry(entry.id, { status: 'PENDING', retryCount: newRetryCount });
      }
    }
  }
}
