import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";

export interface BloodPressure {
  id: string;
  systolic: number;
  diastolic: number;
  recordedAt: string;
}

export interface Symptom {
  id: string;
  symptomType: string;
  createdAt: string;
  recordedAt: string;
}

export const useHealthData = () => {
  const queryClient = useQueryClient();

  // Queries
  const bpHistory = useQuery<BloodPressure[]>({
    queryKey: ["blood-pressure"],
    queryFn: async () => {
      const response = await apiClient.get("/blood-pressure");
      return response.data;
    },
  });

  const latestBP = useQuery<BloodPressure>({
    queryKey: ["blood-pressure", "latest"],
    queryFn: async () => {
      const response = await apiClient.get("/blood-pressure/latest");
      return response.data;
    },
  });

  const recentSymptoms = useQuery<Symptom[]>({
    queryKey: ["symptoms", "recent"],
    queryFn: async () => {
      const response = await apiClient.get("/symptoms/recent");
      return response.data;
    },
  });

  // Mutations
  const addBPMutation = useMutation({
    mutationFn: async (reading: { systolic: number; diastolic: number }) => {
      const response = await apiClient.post("/blood-pressure", reading);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood-pressure"] });
      queryClient.invalidateQueries({ queryKey: ["blood-pressure", "latest"] });
      queryClient.invalidateQueries({ queryKey: ["care-priority"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const addSymptomMutation = useMutation({
    mutationFn: async (symptomType: string) => {
      const response = await apiClient.post("/symptoms", { symptomType });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["symptoms"] });
      queryClient.invalidateQueries({ queryKey: ["symptoms", "recent"] });
      queryClient.invalidateQueries({ queryKey: ["care-priority"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    bpHistory: bpHistory.data,
    isLoadingBP: bpHistory.isLoading,
    latestBP: latestBP.data,
    isLoadingLatestBP: latestBP.isLoading,
    recentSymptoms: recentSymptoms.data,
    isLoadingRecentSymptoms: recentSymptoms.isLoading,
    addBP: addBPMutation.mutateAsync,
    isAddingBP: addBPMutation.isPending,
    addSymptom: addSymptomMutation.mutateAsync,
    isAddingSymptom: addSymptomMutation.isPending,
  };
};
