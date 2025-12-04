import { apiClient } from "./client";
import {
  User,
  UpdateGithubUsernameRequest,
  UpdateGithubUsernameResponse,
  UpdateProfileRequest,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function getMe(): Promise<User> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.getMe();
  }
  const response = await apiClient.get<User>("/users/me");
  return response.data;
}

export async function updateGithubUsername(
  data: UpdateGithubUsernameRequest
): Promise<UpdateGithubUsernameResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updateGithubUsername(data);
  }
  const response = await apiClient.put<UpdateGithubUsernameResponse>(
    "/users/me/github",
    data
  );
  return response.data;
}

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<User> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updateProfile(data);
  }
  const response = await apiClient.put<User>("/users/me", data);
  return response.data;
}

