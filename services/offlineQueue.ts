/**
 * Offline queue for blood pressure readings.
 *
 * Same logic in maternalert-web (src/services/offlineQueue.ts, localStorage)
 * and maternalert-fe (services/offlineQueue.ts, SecureStore). Only the
 * storage functions at the top differ.
 *
 * When a reading can't reach the server (no internet, server waking up), it
 * is kept on the device with the time it was taken and sent later. The
 * backend ignores an exact repeat (same values + recordedAt), so a retry
 * after a dropped response doesn't create a duplicate.
 */

// ── storage (app) ────────────────────────────────────────────────────────────
import * as SecureStore from "expo-secure-store";

const KEY = "ma_bp_queue_v1";
// SecureStore values should stay under ~2 KB; each item is ~110 bytes.
const MAX_ITEMS = 15;

async function readRaw(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

async function writeRaw(value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, value);
  } catch {
    // storage failed: the reading is lost, but the warning was shown
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export interface QueuedReading {
  id: string;
  systolic: number;
  diastolic: number;
  recordedAt: string;
  attempts: number;
}

type Listener = (items: QueuedReading[]) => void;
const listeners = new Set<Listener>();
let flushing: Promise<{ sent: number; remaining: number }> | null = null;

export async function getQueue(): Promise<QueuedReading[]> {
  const raw = await readRaw();
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function setQueue(items: QueuedReading[]) {
  await writeRaw(JSON.stringify(items.slice(-MAX_ITEMS)));
  listeners.forEach((l) => l(items));
}

export function subscribeQueue(listener: Listener): () => void {
  listeners.add(listener);
  getQueue().then(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when the request never got an answer (offline, DNS, timeout, server asleep). */
export function isNetworkError(err: unknown): boolean {
  const e = err as { response?: { status?: number }; code?: string } | null;
  if (!e) return false;
  if (!e.response) return true;
  const s = e.response.status ?? 0;
  return s === 502 || s === 503 || s === 504;
}

export async function enqueueReading(r: { systolic: number; diastolic: number; recordedAt: string }) {
  const items = await getQueue();
  if (items.some((i) => i.recordedAt === r.recordedAt && i.systolic === r.systolic && i.diastolic === r.diastolic)) return;
  items.push({ ...r, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, attempts: 0 });
  await setQueue(items);
}

/**
 * Try to send everything waiting. Stops at the first network failure (still
 * offline). Drops an item the server rejects as invalid (4xx), so one bad
 * entry can't block the rest forever.
 */
export function flushQueue(send: (r: { systolic: number; diastolic: number; recordedAt: string }) => Promise<unknown>) {
  if (flushing) return flushing;
  flushing = (async () => {
    let items = await getQueue();
    let sent = 0;
    for (const item of [...items].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))) {
      try {
        await send({ systolic: item.systolic, diastolic: item.diastolic, recordedAt: item.recordedAt });
        sent += 1;
        items = items.filter((i) => i.id !== item.id);
        await setQueue(items);
      } catch (err) {
        if (isNetworkError(err)) break;
        const status = (err as any)?.response?.status;
        if (status === 401) break; // signed out; keep for after sign-in
        items = items.filter((i) => i.id !== item.id);
        await setQueue(items);
      }
    }
    return { sent, remaining: items.length };
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}
