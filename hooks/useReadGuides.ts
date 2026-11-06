import * as SecureStore from "expo-secure-store";
import { useCallback, useSyncExternalStore } from "react";

// Same idea as maternalert-web/src/hooks/useReadGuides.ts (localStorage there).
// Which Learn guides she has opened, kept on this phone only.

const KEY = "maternalert.readGuides";
const listeners = new Set<() => void>();
let cache: string[] = [];
let loaded = false;

function notify() {
  listeners.forEach((l) => l());
}

async function load() {
  if (loaded) return;
  loaded = true;
  try {
    const v = JSON.parse((await SecureStore.getItemAsync(KEY)) || "[]");
    if (Array.isArray(v)) {
      cache = Array.from(new Set([...v.filter((x) => typeof x === "string"), ...cache]));
      notify();
    }
  } catch {
    /* start empty */
  }
}

export function markGuideRead(id: string) {
  void load();
  if (cache.includes(id)) return;
  cache = [...cache, id];
  notify();
  SecureStore.setItemAsync(KEY, JSON.stringify(cache.slice(-200))).catch(() => undefined);
}

export function useReadGuides() {
  void load();
  const read = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => cache,
  );
  const isRead = useCallback((id: string) => read.includes(id), [read]);
  return { read, isRead, markRead: markGuideRead };
}
