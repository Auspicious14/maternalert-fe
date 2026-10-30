import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";

// Same as maternalert-web/src/hooks/useMyHistory.ts
export interface MyHistory {
  linked: boolean;
  facilityName?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  answers?: Record<string, number | boolean | string | null>;
}

/** Her own answers about her history (linked to a clinic only). */
export const useMyHistory = () =>
  useQuery<MyHistory>({
    queryKey: ["my-history"],
    queryFn: async () => (await apiClient.get("/patients/me/history")).data,
    staleTime: 5 * 60_000,
    retry: 1,
  });
