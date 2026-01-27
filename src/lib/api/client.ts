import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ErrorCode } from "@/types/api";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        useAuthStore.getState().logout();
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(
          error.response.data || {
            message: "인증이 만료되었습니다. 다시 로그인해주세요.",
            code: ErrorCode.UNAUTHORIZED,
          }
        );
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
        const refreshResponse = await refreshClient.post<
          { success: boolean; message: string; data: string } | string
        >("/auth/refresh");
        const responseData = refreshResponse.data;
        const newAccessToken =
          typeof responseData === "object" &&
          responseData &&
          "data" in responseData
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

        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
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

    // 백엔드에서 에러 메시지가 없을 경우 status code별 기본 메시지 제공
    const statusCode = error.response?.status;
    let message = "요청 처리 중 오류가 발생했습니다.";
    let code = ErrorCode.SERVER_ERROR;

    if (statusCode) {
      switch (statusCode) {
        case 400:
          message = "잘못된 요청입니다.";
          code = ErrorCode.VALIDATION_ERROR;
          break;
        case 401:
          message = "인증이 필요합니다.";
          code = ErrorCode.UNAUTHORIZED;
          break;
        case 403:
          message = "요청을 처리할 수 없습니다.";
          code = ErrorCode.FORBIDDEN;
          break;
        case 404:
          message = "요청한 리소스를 찾을 수 없습니다.";
          code = ErrorCode.NOT_FOUND;
          break;
        case 500:
        case 502:
        case 503:
          message = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          code = ErrorCode.SERVER_ERROR;
          break;
        default:
          message = `요청 처리 중 오류가 발생했습니다. (${statusCode})`;
      }
    } else if (
      error.code === "ECONNABORTED" ||
      error.message?.includes("timeout")
    ) {
      message = "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    } else if (error.message?.includes("Network Error") || !error.response) {
      message = "네트워크 연결을 확인해주세요.";
    }

    return Promise.reject({
      message,
      code,
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

export function shouldUseMockFallback(error: unknown): boolean {
  if (!isApiError(error)) {
    return true;
  }

  if (
    error.code === ErrorCode.UNAUTHORIZED ||
    error.code === ErrorCode.FORBIDDEN
  ) {
    return false;
  }

  return true;
}
