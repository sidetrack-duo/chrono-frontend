import { useMemo } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { ActivityOverview } from "@/components/dashboard/ActivityOverview";
import { ActivityRecord } from "@/components/dashboard/ActivityRecord";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { SkeletonCard, SkeletonCardContent, Skeleton } from "@/components/common/Skeleton";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  const weeklyCommits = data?.weeklyCommits ?? [];

  const {
    maxCommits,
    totalWeekCommits,
    mostActiveDayIndex,
    streakDays,
  } = useMemo(() => {
    const counts = weeklyCommits.map((d) => d.count ?? 0);
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">당신의 프로젝트 활동을 한눈에 확인하세요.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ActivityOverview 스켈레톤 */}
          <div className="lg:col-span-2">
            <SkeletonCard>
              <SkeletonCardContent titleWidth="w-48" />
            </SkeletonCard>
          </div>

          {/* ActivityRecord 스켈레톤 */}
          <div>
            <SkeletonCard>
              <SkeletonCardContent titleWidth="w-20" />
            </SkeletonCard>
          </div>
        </div>

        {/* RecentProjects 스켈레톤 */}
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error || "데이터를 불러올 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">당신의 프로젝트 활동을 한눈에 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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

      <RecentProjects projects={data.recentProjects} />
    </div>
  );
}
