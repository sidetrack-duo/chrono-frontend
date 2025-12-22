import { apiClient } from "./client";
import {
  User,
  UpdateGithubUsernameRequest,
  UpdateGithubUsernameResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function getMe(): Promise<User> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.getMe();
  }
  
  try {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("사용자 정보 조회 API 호출 실패, mock 데이터 사용:", error);
      return mockApi.user.getMe();
    }
    throw error;
  }
}

export async function updateGithubUsername(
  data: UpdateGithubUsernameRequest
): Promise<UpdateGithubUsernameResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updateGithubUsername(data);
  }
  throw new Error("백엔드에 GitHub username 설정 API가 없습니다.");
}

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<User> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updateProfile(data);
  }
  
  try {
    const response = await apiClient.put<User>("/users/me", data);
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("프로필 수정 API 호출 실패, mock 데이터 사용:", error);
      return mockApi.user.updateProfile(data);
    }
    throw error;
  }
}

export async function updatePassword(data: UpdatePasswordRequest): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }
  await apiClient.patch("/users/me/password", data);
}

