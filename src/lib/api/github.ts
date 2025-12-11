import { apiClient } from "./client";
import { GitHubRepo } from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function getRepos(): Promise<GitHubRepo[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.github.getRepos();
  }
  // 백엔드 응답 형식에 맞춤
  const response = await apiClient.get<GitHubRepo[]>("/github/repos");
  return response.data;
}

