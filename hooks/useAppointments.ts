import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import axios from 'axios';

export interface Appointment {
  id: string;
  type: "ANC" | "LAB" | "SCAN" | "GENERAL";
  title: string;
  dateTime: string;
  location?: string;
  notes?: string;
  status: "SCHEDULED" | "COMPLETED" | "MISSED" | "CANCELLED";
  appointmentSource: "FACILITY" | "PATIENT";
  providerName?: string;
  facilityName?: string;
  createdAt: string;
  updatedAt: string;
}

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    isError: isAppointmentsError,
    error: appointmentsError,
    refetch: refetchAppointments,
    isFetching: isFetchingAppointments,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await apiClient.get("/appointments");
      return response.data;
    },
  });

  const isFacilityLinkRequired =
    axios.isAxiosError(appointmentsError) &&
    appointmentsError.response?.status === 400 &&
    typeof appointmentsError.response?.data?.message === "string" &&
    appointmentsError.response.data.message
      .toLowerCase()
      .includes("link to a facility");

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: {
      type?: "ANC" | "LAB" | "SCAN" | "GENERAL";
      title: string;
      dateTime: string;
      location?: string;
      notes?: string;
      providerName?: string;
      facilityName?: string;
    }) => {
      // Always use the personal endpoint for patients
      const response = await apiClient.post("/appointments/personal", appointmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Appointment>;
    }) => {
      const response = await apiClient.put(`/appointments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/appointments/${id}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    appointments,
    isLoadingAppointments,
    isAppointmentsError,
    appointmentsError,
    isFacilityLinkRequired,
    createAppointment: createAppointmentMutation.mutateAsync,
    isCreatingAppointment: createAppointmentMutation.isPending,
    updateAppointment: updateAppointmentMutation.mutateAsync,
    isUpdatingAppointment: updateAppointmentMutation.isPending,
    cancelAppointment: cancelAppointmentMutation.mutateAsync,
    isCancelingAppointment: cancelAppointmentMutation.isPending,
    deleteAppointment: deleteAppointmentMutation.mutateAsync,
    isDeletingAppointment: deleteAppointmentMutation.isPending,
    refetchAppointments,
    isFetchingAppointments,
  };
};
