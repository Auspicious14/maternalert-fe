import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";

export interface EducationArticle {
  id: string;
  title: string;
  category: "HYPERTENSION" | "NUTRITION" | "WARNING_SIGNS" | "POSTPARTUM";
  summary: string;
  content: string;
  readTimeMinutes: number;
  source: string;
  sourceUrl?: string;
  videoUrl?: string;
}

export const useEducation = (category?: EducationArticle["category"]) => {
  return useQuery<EducationArticle[]>({
    queryKey: ["education", category],
    queryFn: async () => {
      const response = await apiClient.get("/education", {
        params: category ? { category } : undefined,
      });
      return response.data;
    },
  });
};