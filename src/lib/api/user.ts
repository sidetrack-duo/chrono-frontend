import { apiClient, isApiError } from "./client";
import {
  User,
  UpdateGithubUsernameRequest,
  UpdateGithubUsernameResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";
import { connectGitHubBasic } from "./github";

export async function getMe(): Promise<User> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.getMe();
  }
  
  try {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  } catch (error) {
    // 서버 실패 시 mock 데이터 사용
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`사용자 정보 조회 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.user.getMe();
  }
}

export async function updateGithubUsername(
  data: UpdateGithubUsernameRequest
): Promise<UpdateGithubUsernameResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updateGithubUsername(data);
  }
  
  try {
    const response = await connectGitHubBasic({ username: data.githubUsername });
    return { githubUsername: response.username };
  } catch (error) {
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`GitHub username 설정 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.user.updateGithubUsername(data);
  }
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
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`프로필 수정 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.user.updateProfile(data);
  }
}

export async function updatePassword(data: UpdatePasswordRequest): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updatePassword(data);
  }
  
  try {
    await apiClient.patch("/users/me/password", data);
  } catch (error) {
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
      ? error.message
      : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(`비밀번호 변경 API 호출 실패, mock 데이터 사용: ${errorInfo}`, error);
    }
    return mockApi.user.updatePassword(data);
  }
}

