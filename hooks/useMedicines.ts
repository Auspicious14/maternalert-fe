import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { MedicinesSummary, MissedDoseReason, Severity, SideEffectKind, MedicationKind } from "../services/medicines";

// Same hook as maternalert-web/src/hooks/useMedicines.ts

const KEY = ["medicines"];

export function useMedicines() {
  const qc = useQueryClient();
  const query = useQuery<MedicinesSummary>({
    queryKey: KEY,
    queryFn: async () => (await apiClient.get("/medications/me")).data,
    staleTime: 60_000,
  });
  const refresh = () => qc.invalidateQueries({ queryKey: KEY });

  const add = useMutation({
    mutationFn: async (body: { kind: MedicationKind; name?: string; timesPerDay: number; reminderTimes: string[]; refillDate?: string }) =>
      (await apiClient.post("/medications/me", body)).data,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...body }: { id: string; timesPerDay?: number; reminderTimes?: string[]; remindersOn?: boolean; refillDate?: string; active?: boolean }) =>
      (await apiClient.patch(`/medications/me/${id}`, body)).data,
    onSuccess: refresh,
  });

  // Ticking a dose updates the screen straight away, then saves.
  const log = useMutation({
    mutationFn: async ({ id, ...body }: { id: string; day: string; slot: number; status: "TAKEN" | "MISSED"; missedReason?: MissedDoseReason }) =>
      (await apiClient.post(`/medications/me/${id}/log`, body)).data,
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<MedicinesSummary>(KEY);
      if (prev) {
        qc.setQueryData<MedicinesSummary>(KEY, {
          ...prev,
          medications: prev.medications.map((m) =>
            m.id !== v.id
              ? m
              : { ...m, today: [...m.today.filter((t) => t.slot !== v.slot), { slot: v.slot, status: v.status, missedReason: v.missedReason ?? null }] },
          ),
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(KEY, ctx.prev),
    onSettled: refresh,
  });

  const undo = useMutation({
    mutationFn: async ({ id, day, slot }: { id: string; day: string; slot: number }) =>
      (await apiClient.delete(`/medications/me/${id}/log`, { params: { day, slot } })).data,
    onSettled: refresh,
  });

  const reportSideEffect = useMutation({
    mutationFn: async (body: { medicationId?: string; effect: SideEffectKind; severity: Severity }) =>
      (await apiClient.post("/medications/me/side-effects", body)).data,
    onSuccess: refresh,
  });

  return { ...query, add, update, log, undo, reportSideEffect };
}
