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

  const isDevMode = import.meta.env.DEV;
  const bypassAuth = isDevMode && import.meta.env.VITE_BYPASS_AUTH === "true";

  useEffect(() => {
    if (!accessToken) return;
    
    const storedAuthStorage = localStorage.getItem("auth-storage");
    
    if (!storedAuthStorage && accessToken) {
      useAuthStore.getState().logout();
    }
  }, [accessToken]);

  if (bypassAuth) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

