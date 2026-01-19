import { apiClient, isApiError } from "./client";
import { DailyCommitCount, DashboardResponse } from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function getDashboard(): Promise<DashboardResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.dashboard.getDashboard();
  }
  
  try {
    const response = await apiClient.get<DashboardResponse>("/dashboard");
    return response.data;
  } catch (error) {
    // 서버 실패 시 mock 데이터 사용
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`대시보드 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.dashboard.getDashboard();
  }
}

export async function getRecent7DaysCommits(): Promise<DailyCommitCount[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.dashboard.getRecent7DaysCommits();
  }

  try {
    const response = await apiClient.get<{ date: string; commitCount: number }[]>(
      "/dashboard/recent-7-days"
    );
    return response.data.map((d) => ({ date: d.date, count: d.commitCount }));
  } catch (error) {
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`recent-7-days API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.dashboard.getRecent7DaysCommits();
  }
}

