import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

// Same file as maternalert-web/src/hooks/useClinics.ts

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
  kind?: "hospital" | "clinic" | "other";
  distanceKm?: number;
  /** Name suggests maternity/women's services (a hint, not verified). */
  maternity?: boolean;
  source?: "google" | "osm" | "geoapify" | "curated";
  placeId?: string;
  mapsUrl?: string;
}

export interface ClinicDetails {
  id: string;
  phone?: string;
  internationalPhone?: string;
  openNow?: boolean;
  hours?: string[];
  website?: string;
}

export interface ClinicQueryParams {
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export const useClinics = (params?: ClinicQueryParams | string | null, enabled = true) => {
  const queryKeyParams = typeof params === "string" ? { q: params } : params ?? undefined;

  return useQuery<ClinicLocation[]>({
    queryKey: ["clinics", queryKeyParams],
    queryFn: async () => {
      const response = await apiClient.get("/clinic-finder", { params: queryKeyParams });
      return response.data;
    },
    enabled: enabled && Boolean(queryKeyParams),
    staleTime: 30 * 60 * 1000,
  });
};

/** Phone and opening hours, fetched only when the user asks (costs a lookup). */
export const useClinicDetails = (placeId?: string | null) =>
  useQuery<ClinicDetails | null>({
    queryKey: ["clinic-details", placeId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/clinic-finder/details/${encodeURIComponent(placeId!)}`);
        return response.data;
      } catch {
        return null;
      }
    },
    enabled: Boolean(placeId),
    staleTime: 24 * 60 * 60 * 1000,
  });

export function formatDistance(km?: number): string | null {
  if (km === undefined || km === null || !Number.isFinite(km)) return null;
  return km < 1 ? `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function directionsUrl(c: ClinicLocation): string {
  return c.mapsUrl ?? `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`;
}
