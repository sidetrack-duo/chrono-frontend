import { useMemo, useState, useEffect } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { ActivityOverview } from "@/components/dashboard/ActivityOverview";
import { ActivityRecord } from "@/components/dashboard/ActivityRecord";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { SkeletonCard, SkeletonCardContent, Skeleton } from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { ProjectStatus, ProjectListItem } from "@/types/api";
import { getProjects } from "@/lib/api/project";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const weeklyCommits = data?.weeklyCommits ?? [];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const allProjects = await getProjects();
        const sortedProjects = [...allProjects].sort((a, b) => {
          if (!a.lastCommitAt) return 1;
          if (!b.lastCommitAt) return -1;
          return new Date(b.lastCommitAt).getTime() - new Date(a.lastCommitAt).getTime();
        });
        setProjects(sortedProjects.slice(0, 5));
      } catch (err) {
        console.error("프로젝트 목록을 불러오는데 실패했습니다:", err);
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const {
    maxCommits,
    totalWeekCommits,
    mostActiveDayIndex,
    streakDays,
  } = useMemo(() => {
    // 월요일부터 일요일 순서 (MySQL DAYOFWEEK: 2=월, 3=화, ..., 1=일)
    const dayOrder = [2, 3, 4, 5, 6, 7, 1];
    const countsByDay = new Map<number, number>();
    weeklyCommits.forEach((commit) => {
      countsByDay.set(commit.dayOfWeek, commit.count ?? 0);
    });

    const counts = dayOrder.map((dayOfWeek) => countsByDay.get(dayOfWeek) ?? 0);
    const max = counts.length > 0 ? Math.max(...counts) : 1;
    const total = counts.reduce((s, v) => s + v, 0);

    let mostIdx = 0;
    counts.forEach((c, i) => {
      if (c > counts[mostIdx]) mostIdx = i;
    });

    let streak = 0;
    for (let i = counts.length - 1; i >= 0; i--) {
      if (counts[i] > 0) streak++;
      else break;
    }

    return {
      maxCommits: max,
      totalWeekCommits: total,
      mostActiveDayIndex: mostIdx,
      streakDays: streak,
    };
  }, [weeklyCommits]);

  const getStatusLabel = (status: ProjectStatus) => {
    return status === ProjectStatus.IN_PROGRESS ? "진행 중" : "완료";
  };

  const getStatusVariant = (status: ProjectStatus): "primary" | "accent" => {
    return status === ProjectStatus.IN_PROGRESS ? "primary" : "accent";
  };

  const getTimeLabel = (daysAgo: number | null) => {
    if (daysAgo === null) return "오래전";
    if (daysAgo === 0) return "오늘";
    if (daysAgo === 1) return "어제";
    return `${daysAgo}일 전`;
  };

  const getDday = (targetDate?: string) => {
    if (!targetDate) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDdayLabel = (dday: number | null) => {
    if (dday === null) return null;
    if (dday < 0) return { label: `D+${Math.abs(dday)}`, isOverdue: true };
    if (dday === 0) return { label: "D-Day", isUrgent: true };
    if (dday <= 7) return { label: `D-${dday}`, isUrgent: true };
    return { label: `D-${dday}`, isUrgent: false };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">당신의 프로젝트 활동을 한눈에 확인하세요.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkeletonCard>
              <SkeletonCardContent titleWidth="w-48" />
            </SkeletonCard>
          </div>

          <div>
            <SkeletonCard>
              <SkeletonCardContent titleWidth="w-20" />
            </SkeletonCard>
          </div>
        </div>

        <SkeletonCard height="h-64">
          <div className="space-y-3">
            <Skeleton width="w-24" height="h-6" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width="w-full" height="h-20" rounded="lg" />
              ))}
            </div>
          </div>
        </SkeletonCard>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">당신의 프로젝트 활동을 한눈에 확인하세요.</p>
        </div>
        <ErrorState
          title={error || "데이터를 불러올 수 없습니다"}
          description="잠시 후 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">당신의 프로젝트 활동을 한눈에 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-2">
          <ActivityOverview
            weeklyCommits={weeklyCommits}
            weekInfo={data.weekInfo}
            streakDays={streakDays}
            totalWeekCommits={totalWeekCommits}
            mostActiveDayIndex={mostActiveDayIndex}
            maxCommits={maxCommits}
            inProgressCount={data.summary.inProgressCount}
            completedCount={data.summary.completedCount}
          />
        </div>

        <ActivityRecord
          totalWeekCommits={totalWeekCommits}
          totalCommitsThisMonth={data.summary.totalCommitsThisMonth}
          inProgressCount={data.summary.inProgressCount}
          completedCount={data.summary.completedCount}
        />
      </div>

      <RecentProjects
        projects={projects}
        getTimeLabel={getTimeLabel}
        getDday={getDday}
        getDdayLabel={getDdayLabel}
        getStatusLabel={getStatusLabel}
        getStatusVariant={getStatusVariant}
      />
    </div>
  );
}
