interface ActivityRecordProps {
  totalWeekCommits: number;
  totalCommitsThisMonth: number;
  inProgressCount: number;
  completedCount: number;
}

export function ActivityRecord({ totalWeekCommits, totalCommitsThisMonth, inProgressCount, completedCount }: ActivityRecordProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-uniform">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">지금까지</h2>
        <p className="mt-1 text-sm text-gray-500">프로젝트와 활동</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">진행 중인 프로젝트</span>
          <span className="text-lg font-bold text-gray-900">{inProgressCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">완료한 프로젝트</span>
          <span className="text-lg font-bold text-gray-900">{completedCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">전체 프로젝트</span>
          <span className="text-lg font-bold text-gray-900">{inProgressCount + completedCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">이번 주 커밋</span>
          <span className="text-lg font-bold text-gray-900">{totalWeekCommits}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">이번 달 커밋</span>
          <span className="text-lg font-bold text-gray-900">{totalCommitsThisMonth}</span>
        </div>
      </div>
    </div>
  );
}

