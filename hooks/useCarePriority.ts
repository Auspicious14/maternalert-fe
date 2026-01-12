import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";

export interface CarePriority {
  priority: "ROUTINE" | "INCREASED_MONITORING" | "URGENT_REVIEW" | "EMERGENCY";
  message: string;
  reasons: string[];
  timestamp: string;
}

export const useCarePriority = () => {
  return useQuery<CarePriority>({
    queryKey: ["care-priority"],
    queryFn: async () => {
      const response = await apiClient.get("/care-priority");
      return response.data;
    },
    // Poll for priority updates every 2 minutes if the user is active
    refetchInterval: 120000,
    staleTime: 60000,
  });
};
