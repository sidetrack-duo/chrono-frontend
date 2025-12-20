import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ApiError, ErrorCode } from "@/types/api";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

export const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && "success" in response.data && "data" in response.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        useAuthStore.getState().logout();
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.href = "/login";
        }
        return Promise.reject(error.response.data || {
          message: "인증이 만료되었습니다. 다시 로그인해주세요.",
          code: ErrorCode.UNAUTHORIZED,
        });
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshClient.post<{ success: boolean; message: string; data: string } | string>("/auth/refresh");
        const responseData = refreshResponse.data;
        const newAccessToken = typeof responseData === "object" && responseData && "data" in responseData
          ? responseData.data
          : typeof responseData === "string"
          ? responseData
          : "";
        useAuthStore.getState().setToken(newAccessToken);

        refreshSubscribers.forEach((callback) => callback(newAccessToken));
        refreshSubscribers = [];

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshSubscribers = [];
        useAuthStore.getState().logout();
        
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      message: error.message || "네트워크 오류가 발생했습니다.",
      code: ErrorCode.SERVER_ERROR,
    } as ApiError);
  }
);

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error
  );
}

