import { apiClient } from "./client";
import { GitHubRepo, GitHubUsernameValidation, GitHubConnectBasicRequest, GitHubConnectBasicResponse, GitHubConnectPatRequest, GitHubConnectPatResponse, GitHubDisconnectPatResponse } from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function validateGitHubUsername(username: string): Promise<GitHubUsernameValidation> {
  const response = await apiClient.get<GitHubUsernameValidation>("/github/validate", {
    params: { username },
  });
  return response.data;
}

export async function connectGitHubBasic(data: GitHubConnectBasicRequest): Promise<GitHubConnectBasicResponse> {
  const response = await apiClient.post<GitHubConnectBasicResponse>("/github/connect-basic", data);
  return response.data;
}

export async function connectGitHubPat(data: GitHubConnectPatRequest): Promise<GitHubConnectPatResponse> {
  const response = await apiClient.post<GitHubConnectPatResponse>("/github/connect-pat", data);
  return response.data;
}

export async function disconnectGitHubPat(): Promise<GitHubDisconnectPatResponse> {
  const response = await apiClient.delete<GitHubDisconnectPatResponse>("/github/pat");
  return response.data;
}

export async function getRepos(): Promise<GitHubRepo[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.github.getRepos();
  }
  const response = await apiClient.get<GitHubRepo[]>("/github/repos");
  return response.data;
}

