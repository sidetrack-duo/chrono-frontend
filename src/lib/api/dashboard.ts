import { apiClient } from "./client";
import { DashboardResponse } from "@/types/api";
import { mockApi } from "@/lib/mock/api";

// TODO: 백엔드에 GET /api/dashboard 엔드포인트 추가 필요
export async function getDashboard(): Promise<DashboardResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.dashboard.getDashboard();
  }
  throw new Error("백엔드에 대시보드 API가 없습니다.");
}

