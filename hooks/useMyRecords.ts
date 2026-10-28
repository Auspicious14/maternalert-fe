import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

// Same file as maternalert-web/src/hooks/useMyRecords.ts

export interface AncVisitRecord {
  id: string;
  visitDate: string;
  gestationalAge?: number | null;
  weight?: number | null;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  urineProtein?: "NEGATIVE" | "TRACE" | "PLUS_1" | "PLUS_2" | "PLUS_3" | null;
  fundalHeight?: number | null;
  fetalHeartRate?: number | null;
  fetalMovement?: boolean | null;
  haemoglobin?: number | null;
  temperature?: number | null;
  remarks?: string | null;
  nextAppointmentDate?: string | null;
  facilityName?: string | null;
}

export interface ScanRecord {
  id: string;
  scanType: string;
  scanDate: string;
  notes?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  url: string;
}

export interface MyRecords {
  linked: boolean;
  facilityName: string | null;
  visits: AncVisitRecord[];
  scans: ScanRecord[];
}

export const useMyRecords = () =>
  useQuery<MyRecords>({
    queryKey: ["my-records"],
    queryFn: async () => (await apiClient.get("/my-records")).data,
    // Scan links are signed for an hour; refresh well before that.
    staleTime: 30 * 60 * 1000,
  });

export const URINE_PROTEIN_LABEL: Record<string, string> = {
  NEGATIVE: "None",
  TRACE: "Trace",
  PLUS_1: "+1",
  PLUS_2: "+2",
  PLUS_3: "+3",
};

export const SCAN_LABEL: Record<string, string> = {
  ULTRASOUND: "Ultrasound scan",
  XRAY: "X-ray",
  MRI: "MRI",
  CT: "CT scan",
  ECG: "ECG",
  OTHER: "Scan or document",
};
