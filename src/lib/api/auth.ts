import { apiClient, refreshClient } from "./client";
import { LoginRequest, LoginResponse, SignupRequest, EmailVerificationSendRequest, EmailVerificationVerifyRequest } from "@/types/api";

export async function sendEmailVerification(data: EmailVerificationSendRequest): Promise<void> {
  await apiClient.post("/auth/email/send", data);
}

export async function verifyEmailCode(data: EmailVerificationVerifyRequest): Promise<boolean> {
  const response = await apiClient.post<boolean>("/auth/email/verify", data);
  return response.data;
}

export async function signup(data: SignupRequest): Promise<void> {
  await apiClient.post("/auth/signup", data);
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<{ accessToken: string; refreshTokenCookie: string; nickname: string }>("/auth/login", data);
  
  return {
    accessToken: response.data.accessToken,
    user: {
      id: 0,
      email: data.email,
      nickname: response.data.nickname,
      githubUsername: undefined,
    },
  };
}

export async function refreshToken(): Promise<string> {
  const response = await refreshClient.post<{ success: boolean; message: string; data: string }>("/auth/refresh");
  return response.data.data || response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

