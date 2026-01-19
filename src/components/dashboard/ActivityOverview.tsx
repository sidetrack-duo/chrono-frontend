import { GitCommitHorizontal, Sparkle, PlayCircle, CircleCheckBig, FolderTree } from "lucide-react";
import { getCommitIntensity } from "@/utils/dashboard";

interface ActivityOverviewProps {
  dailyCommits: { date: string; count?: number }[];
  weekInfo: { startDate: string; endDate: string };
  streakDays: number;
  totalWeekCommits: number;
  mostActiveDayIndex: number;
  maxCommits: number;
  inProgressCount: number;
  completedCount: number;
}

const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];

const parseLocalDate = (dateString: string) => {
  // "YYYY-MM-DD" 타임존 이슈 방지: 로컬 자정으로 고정
  return new Date(`${dateString}T00:00:00`);
};

const formatDate = (dateString: string) => {
  const date = parseLocalDate(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

const formatShortDate = (dateString: string) => {
  const date = parseLocalDate(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

export function ActivityOverview({
  dailyCommits,
  weekInfo,
  streakDays,
  totalWeekCommits,
  mostActiveDayIndex,
  maxCommits,
  inProgressCount,
  completedCount,
}: ActivityOverviewProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="relative mb-[30px] rounded-lg bg-zinc-50 py-8 px-2">
        <div className="relative flex items-center justify-between">
          <div className="relative z-10 flex flex-1 flex-col items-center gap-3">
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary-light shadow-lg shadow-primary-light/20">
              <PlayCircle className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-xs font-medium text-gray-500">진행 중</p>
              <p className="text-xl font-bold text-gray-900">{inProgressCount}</p>
            </div>
          </div>

          <div className="absolute left-[16.67%] right-[50%] top-[30px] hidden h-2 -translate-y-1/2 bg-gradient-to-r from-primary-light to-primary md:block"></div>

          <div className="relative z-10 flex flex-1 flex-col items-center gap-3">
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/20">
              <CircleCheckBig className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-xs font-medium text-gray-500">완료</p>
              <p className="text-xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>

          <div className="absolute left-[50%] right-[16.67%] top-[30px] hidden h-2 -translate-y-1/2 bg-gradient-to-r from-primary to-primary-dark md:block"></div>

          <div className="relative z-10 flex flex-1 flex-col items-center gap-3">
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary-dark shadow-lg shadow-primary-dark/20">
              <FolderTree className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-xs font-medium text-gray-500">전체</p>
              <p className="text-xl font-bold text-gray-900">{inProgressCount + completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900">최근 일주일간 {totalWeekCommits}번 커밋했어요</h2>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(weekInfo.startDate)} ~ {formatDate(weekInfo.endDate)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-2">
            {dailyCommits.map((commit) => {
              const count = commit?.count ?? 0;
              const date = parseLocalDate(commit.date);
              const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
              const height = maxCommits > 0 ? count / maxCommits * 100 : 0;
              const intensity = getCommitIntensity(count);
              return (
                <div
                  key={commit.date}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <div className="relative flex w-full items-end" style={{ height: "80px" }}>
                    {count > 0 && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{
                          bottom: `calc(${Math.max(height, count > 0 ? 12 : 4)}% + 4px)`,
                        }}
                      >
                        {count}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t-lg ${intensity.bg} transition-all hover:opacity-80`}
                      style={{
                        height: `${Math.max(height, count > 0 ? 12 : 4)}%`,
                        minHeight: count > 0 ? "20px" : "4px",
                      }}
                      title={`${formatShortDate(commit.date)} (${dayLabels[dayIndex]}): ${count} commits`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{formatShortDate(commit.date)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-1.5">
              <GitCommitHorizontal className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-accent">{streakDays}일 연속</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkle className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-gray-500">
                {totalWeekCommits > 0 ? `${dayLabels[mostActiveDayIndex]}요일에 가장 활발했어요` : "최근 활동이 없어요"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

