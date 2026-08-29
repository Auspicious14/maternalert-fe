import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import apiClient from "../api/client";
import {
  buildPregnancyTimeline,
  calculateCurrentWeek,
} from "../services/pregnancyTimeline";
import type { PregnancyTimeline } from "../services/pregnancyTimeline";

export interface UserProfile {
  id: string;
  ageRange: "UNDER_18" | "AGE_18_34" | "AGE_35_PLUS";
  /** Gestational week stored at the time pregnancyReferenceDate was recorded. */
  pregnancyWeeks: number;
  /**
   * The date/time at which pregnancyWeeks was accurate.
   * Used as the calculation anchor for week progression.
   * Set by the backend when the profile is created or pregnancyWeeks is updated.
   *
   * DO NOT use createdAt for week progression calculations.
   * createdAt is the DB row creation timestamp and is not a clinical reference date.
   */
  pregnancyReferenceDate: string;
  firstPregnancy: boolean;
  knownConditions: string[];
  emergencyContactRelationship?:
    | "MIDWIFE"
    | "PARTNER"
    | "FAMILY_MEMBER"
    | "OTHER";
  emergencyContactPhone?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  notifyCarePriority?: boolean;
  notifyBpAlert?: boolean;
  notifySymptomAlert?: boolean;
  notifyReminders?: boolean;
  reminderTime?: string;
  createdAt: string;
}

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const profile = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/user-profile");
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Profile doesn't exist yet, return null instead of throwing
          return null;
        }
        throw error;
      }
    },
    retry: 2,
  });

  /**
   * Current gestational week — derived from pregnancyReferenceDate (not createdAt).
   *
   * FIX: The previous implementation used `createdAt` as the reference and compared
   * UTC timestamps directly. This caused the displayed week to be 1 higher than the
   * API value whenever the user's local timezone pushed the reference into the "next"
   * UTC day — e.g. a user registering at 29 weeks at 23:55 WAT (= 22:55 UTC) would
   * see 30 weeks immediately because UTC already considered it the next day.
   *
   * The fix: use `pregnancyReferenceDate` (the correct clinical anchor) and compare
   * local calendar days rather than UTC milliseconds.
   */
  const calculatedPregnancyWeeks = useMemo(() => {
    if (!profile.data) return null;
    return calculateCurrentWeek(
      profile.data.pregnancyWeeks,
      profile.data.pregnancyReferenceDate,
    );
  }, [profile.data]);

  /** Full pregnancy timeline — use this instead of manual week calculations in screens. */
  const pregnancyTimeline = useMemo((): PregnancyTimeline | null => {
    if (!profile.data) return null;
    return buildPregnancyTimeline(
      profile.data.pregnancyWeeks,
      profile.data.pregnancyReferenceDate,
    );
  }, [profile.data]);

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

  const { refetch } = profile;

  return {
    profile: profile.data,
    calculatedPregnancyWeeks,
    pregnancyTimeline,
    isLoadingProfile: profile.isLoading,
    isErrorProfile: profile.isError,
    errorProfile: profile.error,
    refetchProfile: refetch,
    createProfile: createProfileMutation.mutateAsync,
    isCreatingProfile: createProfileMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};
