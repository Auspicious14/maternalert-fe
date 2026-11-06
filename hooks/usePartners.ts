import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";

// Same hooks as maternalert-web/src/hooks/usePartners.ts
// The mother's side ("Partner or family") and the supporter's side.

export type Relation = "PARTNER" | "MOTHER" | "SISTER" | "MOTHER_IN_LAW" | "OTHER";

export interface PartnersSummary {
  max: number;
  supporters: { id: string; name: string; relation: Relation; joinedAt: string; isEmergencyContact: boolean }[];
  settings: { shareBpNumbers: boolean; shareMedicines: boolean; shareSymptoms: boolean };
  activeCode: { code: string; expiresAt: string; link: string } | null;
}

export interface MotherView {
  linkId: string;
  relation: Relation;
  firstName: string;
  fullName: string | null;
  phone: string | null;
  pregnancy: { weeks: number | null; referenceDate: string | null; status: "ONGOING" | "DELIVERED" | "ENDED" } | null;
  status: { state: "NORMAL" | "MONITOR" | "URGENT" | "EMERGENCY"; since: string | null; urgent: boolean };
  latestBp: { at: string; systolic?: number; diastolic?: number } | null;
  nextAppointment: { title: string; dateTime: string; facilityName: string | null; location: string | null; type: string } | null;
  facility: { name: string; phone: string | null } | null;
  medicines: { name: string; kind: string; percent: number | null; takenToday: number; dosesToday: number }[] | null;
  symptoms: { symptomType: string; createdAt: string }[] | null;
}

export function usePartners() {
  const qc = useQueryClient();
  const key = ["partners"];
  const query = useQuery<PartnersSummary>({ queryKey: key, queryFn: async () => (await apiClient.get("/partners")).data });
  const refresh = () => qc.invalidateQueries({ queryKey: key });
  const invite = useMutation({
    mutationFn: async () => (await apiClient.post("/partners/invite")).data as { code: string; expiresAt: string; link: string; placesLeft: number },
    onSuccess: refresh,
  });
  const settings = useMutation({
    mutationFn: async (body: Partial<PartnersSummary["settings"]>) => (await apiClient.patch("/partners/settings", body)).data,
    onMutate: async (body) => {
      const prev = qc.getQueryData<PartnersSummary>(key);
      if (prev) qc.setQueryData<PartnersSummary>(key, { ...prev, settings: { ...prev.settings, ...body } });
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(key, ctx.prev),
    onSettled: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/partners/links/${id}`)).data,
    onSuccess: refresh,
  });
  const removeAll = useMutation({
    mutationFn: async () => (await apiClient.delete("/partners/links")).data,
    onSuccess: refresh,
  });
  return { ...query, invite, settings, remove, removeAll };
}

export function useSupporting() {
  return useQuery<{ mothers: MotherView[] }>({
    queryKey: ["supporting"],
    queryFn: async () => (await apiClient.get("/partners/supporting")).data,
    refetchInterval: 60_000, // an emergency should show up without a reload
  });
}

export const relationLabel = (r: Relation, tr: (x: { en: string; pcm: string; yo: string }) => string) =>
  ({
    PARTNER: tr({ en: "Husband or partner", pcm: "Husband or partner", yo: "Ọkọ tàbí olólùfẹ́" }),
    MOTHER: tr({ en: "Mother", pcm: "Mama", yo: "Ìyá" }),
    SISTER: tr({ en: "Sister", pcm: "Sister", yo: "Arábìnrin" }),
    MOTHER_IN_LAW: tr({ en: "Mother-in-law", pcm: "Mother-in-law", yo: "Ìyá ọkọ" }),
    OTHER: tr({ en: "Other family", pcm: "Other family", yo: "Ẹbí mìíràn" }),
  })[r];

export const RELATIONS: Relation[] = ["PARTNER", "MOTHER", "SISTER", "MOTHER_IN_LAW", "OTHER"];
