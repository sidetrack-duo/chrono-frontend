import { apiClient, isApiError } from "./client";
import {
  CommitSummary,
  WeeklyCommitCount,
  CommitHistoryCount,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function syncCommits(projectId: number): Promise<number> {
  const response = await apiClient.post<number>(
    `/projects/${projectId}/commits/sync`
  );
  return response.data;
}

export async function getCommitCount(projectId: number): Promise<number> {
  const response = await apiClient.get<number>(
    `/projects/${projectId}/commits/count`
  );
  return response.data;
}

export async function getLatestCommit(projectId: number): Promise<string> {
  const response = await apiClient.get<string>(
    `/projects/${projectId}/commits/latest`
  );
  return response.data;
}

export async function getCommitSummary(
  projectId: number
): Promise<CommitSummary> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.commit.getCommitSummary(projectId);
  }
  
  try {
    const response = await apiClient.get<CommitSummary>(
      `/projects/${projectId}/commits/summary`
    );
    return response.data;
  } catch (error) {
    // 서버 실패 시 mock 데이터 사용
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`커밋 통계 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.commit.getCommitSummary(projectId);
  }
}

export async function getWeeklyCommits(
  projectId: number
): Promise<WeeklyCommitCount[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.commit.getWeeklyCommits(projectId);
  }
  
  try {
    const response = await apiClient.get<WeeklyCommitCount[]>(
      `/projects/${projectId}/commits/weekly`
    );
    return response.data;
  } catch (error) {
    // 서버 실패 시 mock 데이터 사용
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`주간 커밋 통계 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.commit.getWeeklyCommits(projectId);
  }
}

export async function getCommitHistory(
  projectId: number
): Promise<CommitHistoryCount[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.commit.getCommitHistory(projectId);
  }
  
  try {
    const response = await apiClient.get<CommitHistoryCount[]>(
      `/projects/${projectId}/commits/history`
    );
    return response.data;
  } catch (error) {
    // 서버 실패 시 mock 데이터 사용
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`커밋 히스토리 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.commit.getCommitHistory(projectId);
  }
}

