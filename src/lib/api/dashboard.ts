import { apiClient } from "./client";
import { DashboardResponse } from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function getDashboard(): Promise<DashboardResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.dashboard.getDashboard();
  }
  const response = await apiClient.get<DashboardResponse>("/dashboard");
  return response.data;
}

