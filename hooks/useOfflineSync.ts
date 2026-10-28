import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { mutate } from 'swr';
import apiClient from '../api/client';
import { QueuedReading, flushQueue, subscribeQueue } from '../services/offlineQueue';

// Same file as maternalert-web/src/hooks/useOfflineSync.ts (triggers differ)

/** Sends queued readings when the phone is back online. Mount once. */
export function useOfflineSync() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const run = async () => {
      const { sent } = await flushQueue((r) => apiClient.post("/blood-pressure", r));
      if (sent > 0) {
        queryClient.invalidateQueries({ queryKey: ["blood-pressure"] });
        queryClient.invalidateQueries({ queryKey: ["blood-pressure", "latest"] });
        mutate("/monitoring-engine/state");
        mutate("/monitoring-engine/follow-ups");
      }
    };
    run();
    const sub = AppState.addEventListener("change", (s) => s === "active" && run());
    const timer = setInterval(run, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, [queryClient]);
}

/** Readings waiting to be sent, for banners. */
export function usePendingReadings(): QueuedReading[] {
  const [items, setItems] = useState<QueuedReading[]>([]);
  useEffect(() => subscribeQueue(setItems), []);
  return items;
}
