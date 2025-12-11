import { apiClient } from "./client";
import { LoginRequest, LoginResponse, SignupRequest } from "@/types/api";

// ========== Auth API ==========

/**
 * 회원가입
 * 백엔드 응답: "회원가입 성공" (문자열)
 */
export async function signup(data: SignupRequest): Promise<void> {
  await apiClient.post("/auth/signup", data);
}

/**
 * 로그인
 * 백엔드 응답: { "accessToken": "...", "nickname": "..." }
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<{ accessToken: string; nickname: string }>("/auth/login", data);
  
  // 백엔드 응답을 프론트엔드가 기대하는 형식으로 변환
  // TODO: 백엔드에서 user 객체를 포함하도록 수정 필요
  // 임시로 nickname만 사용 (백엔드에서 user 정보 추가 필요)
  return {
    accessToken: response.data.accessToken,
    user: {
      id: 0, // TODO: 백엔드에서 제공 필요
      email: data.email, // 임시로 요청에서 사용
      nickname: response.data.nickname,
      githubUsername: undefined, // TODO: 백엔드에서 제공 필요
    },
  };
}

/**
 * 로그아웃
 * 백엔드 엔드포인트: POST /api/auth/logout
 */
export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

