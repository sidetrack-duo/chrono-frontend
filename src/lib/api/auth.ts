import { apiClient, refreshClient, isApiError } from "./client";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  EmailVerificationSendRequest,
  EmailVerificationVerifyRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function sendEmailVerification(
  data: EmailVerificationSendRequest
): Promise<void> {
  await apiClient.post("/auth/email/send", data);
}

export async function verifyEmailCode(
  data: EmailVerificationVerifyRequest
): Promise<boolean> {
  const response = await apiClient.post<boolean>("/auth/email/verify", data);
  return response.data;
}

export async function signup(data: SignupRequest): Promise<void> {
  await apiClient.post("/auth/signup", data);
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.auth.login(data);
  }

  try {
    const response = await apiClient.post<{
      accessToken: string;
      nickname: string;
    }>("/auth/login", data);

    return {
      accessToken: response.data.accessToken,
      user: {
        email: data.email,
        nickname: response.data.nickname,
        githubUsername: undefined,
      },
    };
  } catch (error) {
    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류";

    if (import.meta.env.DEV) {
      console.warn(
        `로그인 API 호출 실패, 데모 계정으로 fallback: ${errorInfo}`,
        error
      );
    }

    return mockApi.auth.login(data);
  }
}

export async function refreshToken(): Promise<string> {
  const response = await refreshClient.post<{
    success: boolean;
    message: string;
    data: string;
  }>("/auth/refresh");
  if (
    response.data &&
    typeof response.data === "object" &&
    "success" in response.data &&
    "data" in response.data
  ) {
    return response.data.data;
  }
  return typeof response.data === "string" ? response.data : "";
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete("/auth");
}

export async function requestPasswordReset(
  data: PasswordResetRequest
): Promise<void> {
  await apiClient.post("/auth/password/reset-request", data);
}

export async function resetPassword(
  data: PasswordResetConfirmRequest
): Promise<void> {
  await apiClient.post("/auth/password/reset", data);
}
