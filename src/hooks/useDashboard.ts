import { useState, useEffect } from "react";
import { getDashboard, getRecent7DaysCommits } from "@/lib/api/dashboard";
import { DailyCommitCount, DashboardResponse } from "@/types/api";
import { isApiError } from "@/lib/api/client";

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [recentDailyCommits, setRecentDailyCommits] = useState<DailyCommitCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardData, recent7Days] = await Promise.all([
          getDashboard(),
          getRecent7DaysCommits(),
        ]);
        setData(dashboardData);
        setRecentDailyCommits(recent7Days);
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

  return { data, recentDailyCommits, isLoading, error };
}

