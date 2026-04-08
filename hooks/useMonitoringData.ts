import useSWR from "swr";
import { fetcher } from "../api/client";

export interface MonitoringStateResponse {
  state: "NORMAL" | "MONITOR" | "URGENT" | "EMERGENCY";
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
  } = useSWR<MonitoringStateResponse>("/monitoring-engine/state", fetcher);

  const {
    data: followUpTasks,
    error: followUpTasksError,
    isLoading: isLoadingFollowUpTasks,
    mutate: mutateFollowUpTasks,
  } = useSWR<FollowUpTaskResponse[]>("/monitoring-engine/follow-ups", fetcher);

  return {
    monitoringState,
    followUpTasks,
    isLoadingMonitoringState,
    isLoadingFollowUpTasks,
    monitoringStateError,
    followUpTasksError,
    mutateMonitoringState,
    mutateFollowUpTasks,
  };
}
