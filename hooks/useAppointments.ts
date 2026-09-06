import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";

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

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await apiClient.get("/appointments");
      return response.data;
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: {
      type: "ANC" | "LAB" | "SCAN" | "GENERAL";
      title: string;
      dateTime: string;
      location?: string;
      notes?: string;
      providerName?: string;
      facilityName?: string;
    }) => {
      // Patients always create personal appointments
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
    createAppointment: createAppointmentMutation.mutateAsync,
    isCreatingAppointment: createAppointmentMutation.isPending,
    updateAppointment: updateAppointmentMutation.mutateAsync,
    isUpdatingAppointment: updateAppointmentMutation.isPending,
    cancelAppointment: cancelAppointmentMutation.mutateAsync,
    isCancelingAppointment: cancelAppointmentMutation.isPending,
    deleteAppointment: deleteAppointmentMutation.mutateAsync,
    isDeletingAppointment: deleteAppointmentMutation.isPending,
  };
};
