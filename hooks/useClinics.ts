import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";

export interface ClinicLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  phone?: string;
  isEmergency?: boolean;
}

export const useClinics = (city?: string) => {
  return useQuery<ClinicLocation[]>({
    queryKey: ["clinics", city],
    queryFn: async () => {
      const response = await apiClient.get("/clinic-finder", {
        params: city ? { city } : undefined,
      });
      return response.data;
    },
  });
};