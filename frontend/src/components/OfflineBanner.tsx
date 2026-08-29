'use client';

import { useEffect, useState } from 'react';
import { replayQueue } from '@/lib/syncQueue';

/**
 * Offline resilience banner + sync queue replay (Req 23.1–23.3)
 * Displays within 1 second of offline event.
 */
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      replayPendingSync();
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function replayPendingSync() {
    setSyncing(true);
    setSyncStatus('Syncing pending uploads…');

    await replayQueue(
      async (entry) => {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/v1/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(entry.payload),
        });
        if (!res.ok) throw new Error('Upload failed');
      },
      (entry) => {
        setSyncStatus(
          entry.status === 'COMPLETED'
            ? `✓ Synced upload ${entry.id.slice(0, 8)}`
            : entry.status === 'FAILED'
            ? `✗ Failed: ${entry.id.slice(0, 8)} (retry ${entry.retryCount}/3)`
            : `Uploading…`,
        );
      },
    );

    setSyncing(false);
    setTimeout(() => setSyncStatus(null), 3000);
  }

  if (isOnline && !syncing && !syncStatus) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full font-sans text-xs shadow-lg flex items-center gap-2 border backdrop-blur-md transition-all duration-300"
      style={{
        background: isOnline ? 'rgba(22, 163, 74, 0.95)' : 'rgba(26, 26, 26, 0.95)',
        borderColor: isOnline ? 'rgba(34, 197, 94, 0.4)' : 'rgba(184, 150, 90, 0.5)',
        color: '#FDFBF7',
      }}
      role="status"
      aria-live="polite"
    >
      {!isOnline && (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Offline mode &mdash; Drafts saved locally</span>
        </span>
      )}
      {isOnline && syncing && <span>🔄 {syncStatus}</span>}
      {isOnline && !syncing && syncStatus && <span>✅ {syncStatus}</span>}
    </div>
  );
}
