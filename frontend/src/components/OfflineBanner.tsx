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
      className="fixed top-0 inset-x-0 z-50 px-4 py-3 text-center font-ui text-sm"
      style={{
        background: isOnline ? '#16a34a' : '#dc2626',
        color: 'white',
      }}
      role="status"
      aria-live="polite"
    >
      {!isOnline && (
        <span>
          🔴 You&apos;re offline. Your drafts are saved and will sync when you reconnect.
        </span>
      )}
      {isOnline && syncing && <span>🔄 {syncStatus}</span>}
      {isOnline && !syncing && syncStatus && <span>✅ {syncStatus}</span>}
    </div>
  );
}
