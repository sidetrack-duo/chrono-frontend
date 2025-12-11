import { apiClient } from "./client";
import {
  User,
  UpdateGithubUsernameRequest,
  UpdateGithubUsernameResponse,
  UpdateProfileRequest,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

// TODO: 백엔드에 GET /api/users/me 엔드포인트 추가 필요
export async function getMe(): Promise<User> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.getMe();
  }
  throw new Error("백엔드에 사용자 정보 조회 API가 없습니다.");
}

// TODO: 백엔드에 PUT /api/users/me/github 엔드포인트 추가 필요
// 또는 POST /api/github/connect-basic 사용 가능 (백엔드에 있음)
export async function updateGithubUsername(
  data: UpdateGithubUsernameRequest
): Promise<UpdateGithubUsernameResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updateGithubUsername(data);
  }
  // 백엔드에 POST /api/github/connect-basic이 있지만 요청 형식이 다름
  // TODO: 백엔드에 PUT /api/users/me/github 추가 또는 connect-basic 사용
  throw new Error("백엔드에 GitHub username 설정 API가 없습니다.");
}

// TODO: 백엔드에 PUT /api/users/me 엔드포인트 추가 필요 (SHOULD 기능)
export async function updateProfile(
  data: UpdateProfileRequest
): Promise<User> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.user.updateProfile(data);
  }
  throw new Error("백엔드에 프로필 수정 API가 없습니다.");
}

