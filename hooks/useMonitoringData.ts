import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../api/client";

export interface MonitoringStateResponse {
  currentState: "NORMAL" | "MONITOR" | "URGENT" | "EMERGENCY";
  reason: string | null;
  lastUpdatedAt: string;
  nextAction: string | null;
}

export interface FollowUpTaskResponse {
  id: string;
  userId: string;
  type: "RECHECK" | "SEEK_CARE";
  dueAt: string;
  status: "PENDING" | "COMPLETED" | "MISSED";
  relatedReadingId: string | null;
}

export function useMonitoringData() {
  const {
    data: monitoringState,
    error: monitoringStateError,
    isLoading: isLoadingMonitoringState,
    mutate: mutateMonitoringState,
  } = useSWR<MonitoringStateResponse>("/monitoring-engine/state", fetcher, {
    // Revalidate every 30 seconds so that symptom-triggered monitoring state
    // updates are reflected promptly without needing a full page refresh.
    refreshInterval: 30000,
  });

  const {
    data: followUpTasks,
    error: followUpTasksError,
    isLoading: isLoadingFollowUpTasks,
    mutate: mutateFollowUpTasks,
  } = useSWR<FollowUpTaskResponse[]>("/monitoring-engine/follow-ups", fetcher, {
    refreshInterval: 30000,
  });

  /**
   * Imperatively revalidate both monitoring endpoints.
   * Call this after a clinical event (BP submission, symptom submission)
   * so the UI reflects the updated state immediately.
   */
  function revalidateMonitoring() {
    mutateMonitoringState();
    mutateFollowUpTasks();
  }

  return {
    monitoringState,
    followUpTasks,
    isLoadingMonitoringState,
    isLoadingFollowUpTasks,
    monitoringStateError,
    followUpTasksError,
    mutateMonitoringState,
    mutateFollowUpTasks,
    revalidateMonitoring,
  };
}
