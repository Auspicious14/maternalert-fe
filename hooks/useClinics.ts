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

interface ClinicQueryParams {
  city?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export const useClinics = (params?: ClinicQueryParams | string) => {
  const queryKeyParams = typeof params === "string" ? { city: params } : params;

  return useQuery<ClinicLocation[]>({
    queryKey: ["clinics", queryKeyParams],
    queryFn: async () => {
      const response = await apiClient.get("/clinic-finder", {
        params: queryKeyParams,
      });
      return response.data;
    },
  });
};