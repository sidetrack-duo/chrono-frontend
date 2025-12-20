import { apiClient } from "./client";
import {
  CommitSummary,
  WeeklyCommitCount,
  CommitHistoryCount,
  Commit,
} from "@/types/api";

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
  const response = await apiClient.get<CommitSummary>(
    `/projects/${projectId}/commits/summary`
  );
  return response.data;
}

export async function getWeeklyCommits(
  projectId: number
): Promise<WeeklyCommitCount[]> {
  const response = await apiClient.get<WeeklyCommitCount[]>(
    `/projects/${projectId}/commits/weekly`
  );
  return response.data;
}

export async function getCommitHistory(
  projectId: number
): Promise<CommitHistoryCount[]> {
  const response = await apiClient.get<CommitHistoryCount[]>(
    `/projects/${projectId}/commits/history`
  );
  return response.data;
}

export async function getAllCommits(projectId: number): Promise<Commit[]> {
  const response = await apiClient.get<Commit[]>(
    `/projects/${projectId}/commits`
  );
  return response.data;
}

