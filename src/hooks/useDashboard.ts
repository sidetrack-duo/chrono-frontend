import { useState, useEffect } from "react";
import { getDashboard } from "@/lib/api/dashboard";
import { DashboardResponse } from "@/types/api";
import { isApiError } from "@/lib/api/client";

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await getDashboard();
        setData(dashboardData);
      } catch (err) {
        if (isApiError(err)) {
          setError(err.message);
        } else {
          setError("대시보드 데이터를 불러오는데 실패했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return { data, isLoading, error };
}

