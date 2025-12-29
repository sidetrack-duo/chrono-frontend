import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ActivityRecordProps {
  totalWeekCommits: number;
  totalCommitsThisMonth: number;
  inProgressCount: number;
  completedCount: number;
}

export function ActivityRecord({ totalWeekCommits, totalCommitsThisMonth, inProgressCount, completedCount }: ActivityRecordProps) {
  const totalProjects = inProgressCount + completedCount;

  // 추세 계산
  const weekAvg = totalWeekCommits / 7;
  const currentDay = new Date().getDate();
  const monthAvg = currentDay > 0 ? totalCommitsThisMonth / currentDay : 0;
  const difference = monthAvg > 0 ? ((weekAvg - monthAvg) / monthAvg) * 100 : (weekAvg > 0 ? 100 : 0);

  const getTrendInfo = () => {
    if (totalWeekCommits === 0 && totalCommitsThisMonth === 0) {
      return {
        icon: Minus,
        text: "아직 활동 기록이 없어요",
        color: "text-gray-500",
      };
    }
    if (monthAvg === 0) {
      return {
        icon: TrendingUp,
        text: "이번 주 활동을 시작했어요",
        color: "text-accent",
      };
    }
    if (Math.abs(difference) < 5 || isNaN(difference) || !isFinite(difference)) {
      return {
        icon: Minus,
        text: "이번 주는 평소와 비슷해요",
        color: "text-accent",
      };
    } else if (difference > 0) {
      return {
        icon: TrendingUp,
        text: `이번 주는 평소보다 ${Math.round(Math.abs(difference))}% 더 활발해요`,
        color: "text-accent",
      };
    } else {
      return {
        icon: TrendingDown,
        text: `이번 주는 평소보다 ${Math.round(Math.abs(difference))}% 덜 활발해요`,
        color: "text-accent",
      };
    }
  };

  const trendInfo = getTrendInfo();
  const TrendIcon = trendInfo.icon;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-[28px]">
        <h2 className="text-lg font-semibold text-gray-900">지금까지</h2>
        <p className="mt-1 text-sm text-gray-500">당신의 개발 기록</p>
      </div>

      <div className="space-y-6">
        {/* 전체 프로젝트 - 큰 숫자 강조 */}
        <div className="text-center mb-[18px]">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black leading-none text-primary">{totalProjects}</span>
            <span className="text-sm text-gray-500">개의</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">프로젝트</div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-gray-500">진행 중</span>
              <strong className="text-xl font-bold text-gray-900">{inProgressCount}</strong>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-gray-500">완료</span>
              <strong className="text-xl font-bold text-gray-900">{completedCount}</strong>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-100" />

        {/* 커밋 섹션 */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 p-5">
            <span className="text-sm text-gray-500">이번 달 커밋</span>
            <span className="text-3xl font-bold text-gray-900">{totalCommitsThisMonth}</span>
          </div>
          <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 p-5">
            <span className="text-sm text-gray-500">이번 주 커밋</span>
            <span className="text-3xl font-bold text-gray-900">{totalWeekCommits}</span>
          </div>

          {/* 추세 비교 */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <TrendIcon className={`h-3.5 w-3.5 ${trendInfo.color}`} />
            <span className={`text-xs font-medium ${trendInfo.color}`}>{trendInfo.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

