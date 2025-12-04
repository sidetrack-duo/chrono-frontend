import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, accessToken } = useAuthStore();
  const location = useLocation();

  // localStorage와 스토어 상태 동기화 (401 에러로 스토어가 초기화된 경우)
  useEffect(() => {
    if (!accessToken) return; // accessToken이 없으면 체크 불필요
    
    const storedAuthStorage = localStorage.getItem("auth-storage");
    
    // persist 스토어가 없는데 스토어에는 토큰이 있으면 스토어 초기화
    // (401 에러로 인터셉터가 스토어를 초기화한 경우)
    if (!storedAuthStorage && accessToken) {
      useAuthStore.getState().logout();
    }
  }, [accessToken]);

  if (!isAuthenticated) {
    // 로그인 후 원래 페이지로 돌아가기 위해 현재 위치 저장
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

