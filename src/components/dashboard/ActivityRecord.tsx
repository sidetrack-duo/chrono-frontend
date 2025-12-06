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
  const monthAvg = totalCommitsThisMonth / currentDay;
  const difference = ((weekAvg - monthAvg) / monthAvg) * 100;

  const getTrendInfo = () => {
    if (Math.abs(difference) < 5) {
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
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900">지금까지</h2>
        <p className="mt-1 text-sm text-gray-500">당신의 개발 기록</p>
      </div>

      <div className="space-y-6">
        {/* 전체 프로젝트 - 큰 숫자 강조 */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black leading-none text-primary">{totalProjects}</span>
            <span className="text-sm text-gray-500">개의</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">프로젝트</div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-500">진행 중</span>
              <strong className="text-xl font-bold text-gray-900">{inProgressCount}</strong>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-500">완료</span>
              <strong className="text-xl font-bold text-gray-900">{completedCount}</strong>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-100" />

        {/* 커밋 섹션 */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 px-5 py-[18px]">
            <span className="text-sm text-gray-500">이번 달 커밋</span>
            <span className="text-3xl font-bold text-gray-900">{totalCommitsThisMonth}</span>
          </div>
          <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 px-5 py-[18px]">
            <span className="text-sm text-gray-500">이번 주 커밋</span>
            <span className="text-3xl font-bold text-gray-900">{totalWeekCommits}</span>
          </div>

          {/* 추세 비교 */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <TrendIcon className={`h-3.5 w-3.5 ${trendInfo.color}`} />
            <span className={`text-xs ${trendInfo.color}`}>{trendInfo.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

