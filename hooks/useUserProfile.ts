import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";

export interface UserProfile {
  id: string;
  ageRange: "UNDER_18" | "AGE_18_34" | "AGE_35_PLUS";
  pregnancyWeeks: number;
  firstPregnancy: boolean;
  knownConditions: string[];
  emergencyContactRelationship?: "MIDWIFE" | "PARTNER" | "FAMILY_MEMBER" | "OTHER";
  emergencyContactPhone?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  notifyCarePriority?: boolean;
  notifyBpAlert?: boolean;
  notifySymptomAlert?: boolean;
  notifyReminders?: boolean;
}

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const profile = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await apiClient.get("/user-profile");
      return response.data;
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiClient.post("/user-profile", profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiClient.put("/user-profile", profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  return {
    profile: profile.data,
    isLoadingProfile: profile.isLoading,
    createProfile: createProfileMutation.mutateAsync,
    isCreatingProfile: createProfileMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};
