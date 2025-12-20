import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, ExternalLink, GitCommitVertical, Calendar, Target, CircleAlert, Flame, Github, RefreshCw, ChevronDown } from "lucide-react";
import { getProject, deleteProject, updateProjectStatus } from "@/lib/api/project";
import { syncCommits, getCommitSummary, getCommitHistory, getAllCommits } from "@/lib/api/commit";
import { isApiError } from "@/lib/api/client";
import { Project, ProjectStatus, CommitSummary, CommitHistoryCount, Commit } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useToastStore } from "@/stores/toastStore";
import { SkeletonCard, SkeletonCardContent, SkeletonText, Skeleton } from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { getCommitIntensity } from "@/utils/dashboard";

function CommitHistoryChart({ history }: { history: CommitHistoryCount[] }) {
  const maxCount = Math.max(...history.map((h) => h.count), 1);
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const displayHistory = sortedHistory.slice(-14);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-1">
        {displayHistory.map((item) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          const intensity = getCommitIntensity(item.count);
          return (
            <div
              key={item.date}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <div className="relative flex w-full items-end" style={{ height: "80px" }}>
                {item.count > 0 && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap"
                    style={{
                      bottom: `calc(${Math.max(height, item.count > 0 ? 12 : 4)}% + 4px)`,
                    }}
                  >
                    {item.count}
                  </span>
                )}
                <div
                  className={`w-full rounded-t-lg ${intensity.bg} transition-all hover:opacity-80`}
                  style={{
                    height: `${Math.max(height, item.count > 0 ? 12 : 4)}%`,
                    minHeight: item.count > 0 ? "20px" : "4px",
                  }}
                  title={`${formatDate(item.date)}: ${item.count} commits`}
                />
              </div>
              <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commitSummary, setCommitSummary] = useState<CommitSummary | null>(null);
  const [commitHistory, setCommitHistory] = useState<CommitHistoryCount[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadProject = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProject(Number(id));
      setProject(data);
    } catch (err) {
      setError("프로젝트 정보를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommitSummary = async () => {
    if (!id) return;
    
    try {
      setIsLoadingSummary(true);
      const summary = await getCommitSummary(Number(id));
      setCommitSummary(summary);
    } catch (err) {
      console.error("커밋 통계를 불러오는데 실패했습니다:", err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const loadCommitHistory = async () => {
    if (!id) return;
    
    try {
      setIsLoadingHistory(true);
      const history = await getCommitHistory(Number(id));
      setCommitHistory(history);
    } catch (err) {
      console.error("커밋 히스토리를 불러오는데 실패했습니다:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadCommits = async () => {
    if (!id) return;
    
    try {
      setIsLoadingCommits(true);
      const commitsData = await getAllCommits(Number(id));
      setCommits(commitsData);
    } catch (err) {
      console.error("커밋 목록을 불러오는데 실패했습니다:", err);
    } finally {
      setIsLoadingCommits(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("프로젝트 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    loadProject();
    loadCommitSummary();
    loadCommitHistory();
    loadCommits();
  }, [id]);

  const handleSyncCommits = async () => {
    if (!id || !project) return;
    
    try {
      setIsSyncing(true);
      const count = await syncCommits(Number(id));
      showToast(`${count}개의 커밋이 동기화되었습니다.`, "success");
      await loadProject();
      await loadCommitSummary();
      await loadCommitHistory();
      await loadCommits();
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "커밋 동기화에 실패했습니다.", "error");
      } else {
        showToast("커밋 동기화 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!project || project.status === newStatus) return;
    
    try {
      setIsUpdatingStatus(true);
      await updateProjectStatus(project.id, newStatus);
      showToast(`프로젝트 상태가 "${getStatusLabel(newStatus)}"로 변경되었습니다.`, "success");
      await loadProject();
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "프로젝트 상태 변경에 실패했습니다.", "error");
      } else {
        showToast("프로젝트 상태 변경 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!project) return;
    
    try {
      await deleteProject(project.id);
      showToast("프로젝트가 삭제되었습니다.", "success");
      navigate("/projects");
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "프로젝트 삭제에 실패했습니다.", "error");
      } else {
        showToast("프로젝트 삭제 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    return status === ProjectStatus.IN_PROGRESS ? "진행 중" : "완료";
  };

  const getStatusVariant = (status: ProjectStatus): "primary" | "accent" => {
    return status === ProjectStatus.IN_PROGRESS ? "primary" : "accent";
  };

  const getTimeLabel = (daysAgo: number | null) => {
    if (daysAgo === null) return "활동 없음";
    if (daysAgo === 0) return "오늘";
    if (daysAgo === 1) return "어제";
    return `${daysAgo}일 전`;
  };

  const getDday = (targetDate?: string): number | null => {
    if (!targetDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDdayLabel = (dday: number | null): { label: string; isUrgent?: boolean; isOverdue?: boolean } | null => {
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
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트 상세</h1>
          <p className="mt-1 text-sm text-gray-500">프로젝트 정보를 불러오는 중...</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkeletonCard>
              <div className="space-y-4">
                <Skeleton width="w-64" height="h-8" rounded="md" />
                <SkeletonText lines={2} widths={["w-full", "w-3/4"]} />
                <Skeleton width="w-full" height="h-64" rounded="lg" />
              </div>
            </SkeletonCard>
          </div>

          <div>
            <SkeletonCard>
              <SkeletonCardContent titleWidth="w-24" />
            </SkeletonCard>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트 상세</h1>
          <p className="mt-1 text-sm text-gray-500">프로젝트 정보를 확인할 수 없습니다.</p>
        </div>
        <ErrorState
          title={error || "프로젝트를 찾을 수 없습니다"}
          description="프로젝트가 삭제되었거나 접근 권한이 없을 수 있습니다."
          actionLabel="프로젝트 목록으로 돌아가기"
          actionLink="/projects"
        />
      </div>
    );
  }

  const getDaysSinceLastCommit = (lastCommitAt: string): number | null => {
    if (!lastCommitAt) return null;
    const today = new Date();
    const lastCommit = new Date(lastCommitAt);
    const diffTime = today.getTime() - lastCommit.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const lastCommitAt = project.lastCommitAt || project.github?.lastCommitAt;
  const daysAgo = lastCommitAt ? getDaysSinceLastCommit(lastCommitAt) : null;
  const techStackArray = project.techStack
    ? project.techStack.split(",").map((s) => s.trim())
    : [];
  const dday = project.status !== ProjectStatus.COMPLETED ? getDday(project.targetDate) : null;
  const ddayInfo = dday !== null ? getDdayLabel(dday) : null;
  const repoUrl = `https://github.com/${project.repoOwner}/${project.repoName}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/projects")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{project.title}</h1>
            <p className="mt-1 text-sm text-gray-500">프로젝트 상세 정보를 확인하세요.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast("수정 기능은 곧 구현될 예정입니다.", "info")}
          >
            <Edit className="h-4 w-4 mr-2" />
            수정
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                  {project.description && (
                    <p className="mt-2 text-sm text-gray-500">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                  <div className="relative">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                      disabled={isUpdatingStatus}
                      className="h-[38px] w-auto min-w-[90px] appearance-none rounded-lg border border-gray-200 bg-white pl-2.5 pr-7 text-xs text-gray-700 transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={ProjectStatus.IN_PROGRESS}>진행 중</option>
                      <option value={ProjectStatus.COMPLETED}>완료</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {techStackArray.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-medium text-gray-500">기술 스택</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {techStackArray.map((tech, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-zinc-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.startDate && (
                  <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-4">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">시작일</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(project.startDate).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {project.targetDate && (
                  <div
                    className={`flex items-center gap-3 rounded-lg p-4 ${
                      project.status === ProjectStatus.COMPLETED
                        ? "bg-zinc-50"
                        : ddayInfo?.isOverdue
                        ? "bg-accent-50"
                        : "bg-zinc-50"
                    }`}
                  >
                    <Target className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500">목표일</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(project.targetDate).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {ddayInfo && project.status !== ProjectStatus.COMPLETED && (
                          <div
                            className={`flex items-center gap-1 text-sm font-medium ${
                              ddayInfo.isOverdue
                                ? "text-gray-300"
                                : ddayInfo.isUrgent
                                ? "text-accent"
                                : "text-gray-700"
                            }`}
                          >
                            {ddayInfo.label}
                            {ddayInfo.isOverdue && (
                              <CircleAlert className="h-4 w-4" />
                            )}
                            {ddayInfo.isUrgent && !ddayInfo.isOverdue && (
                              <Flame className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">커밋 활동</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncCommits}
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "동기화 중..." : "동기화"}
              </Button>
            </div>
            
            {isLoadingSummary ? (
              <div className="flex items-center justify-center rounded-lg bg-zinc-50 py-12">
                <div className="text-center">
                  <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-gray-500">커밋 통계를 불러오는 중...</p>
                </div>
              </div>
            ) : commitSummary ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-zinc-50 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">총 커밋</p>
                    <p className="text-2xl font-bold text-gray-900">{commitSummary.totalCommits}</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">이번 주 커밋</p>
                    <p className="text-2xl font-bold text-gray-900">{commitSummary.commitsThisWeek}</p>
                  </div>
                </div>
                {commitSummary.mostActiveDay && (
                  <div className="rounded-lg bg-zinc-50 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">가장 활발한 요일</p>
                    <p className="text-base font-semibold text-gray-900">{commitSummary.mostActiveDay}</p>
                  </div>
                )}
                {commitSummary.latestCommitDate && (
                  <div className="rounded-lg bg-zinc-50 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">최근 커밋</p>
                    <p className="text-sm text-gray-700">
                      {new Date(commitSummary.latestCommitDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}

                {commitHistory.length > 0 && (
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">커밋 히스토리</h3>
                    {isLoadingHistory ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    ) : (
                      <CommitHistoryChart history={commitHistory} />
                    )}
                  </div>
                )}

                {commits.length > 0 && (
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">최근 커밋</h3>
                    {isLoadingCommits ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {commits.slice(0, 10).map((commit) => (
                          <div
                            key={commit.sha}
                            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                          >
                            <div className="mt-0.5 shrink-0">
                              <GitCommitVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {commit.message}
                              </p>
                              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <span>{commit.authorName}</span>
                                <span>•</span>
                                <span>
                                  {new Date(commit.commitDate).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {commits.length > 10 && (
                          <p className="text-xs text-gray-500 text-center pt-2">
                            총 {commits.length}개의 커밋 중 최근 10개만 표시됩니다.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg bg-zinc-50 py-12">
                <div className="text-center">
                  <GitCommitVertical className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500">커밋 통계를 불러올 수 없습니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">GitHub</h2>
              <p className="mt-1 text-xs text-gray-500">저장소 정보 및 통계</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-medium text-gray-500">저장소</h3>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-zinc-50 p-3 transition-colors hover:bg-zinc-100"
                >
                  <Github className="h-5 w-5 text-gray-700 shrink-0" />
                  <span className="flex-1 truncate text-sm font-medium text-gray-900">
                    {project.repoOwner}/{project.repoName}
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                </a>
              </div>

              {(project.totalCommits !== undefined || project.github?.totalCommits !== undefined) && (
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <GitCommitVertical className="h-4 w-4 text-primary" />
                    <span>총 커밋</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {project.totalCommits ?? project.github?.totalCommits ?? 0}
                  </span>
                </div>
              )}

              {daysAgo !== null && (
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>최근 활동</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">{getTimeLabel(daysAgo)}</span>
                </div>
              )}

              {(project.lastCommitAt || project.github?.lastCommitAt) && (
                <div className="rounded-lg bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">마지막 커밋</p>
                  <p className="text-sm text-gray-700">
                    {new Date(project.lastCommitAt || project.github?.lastCommitAt || "").toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="프로젝트 삭제"
        description={`"${project.title}" 프로젝트를 삭제하시겠습니까?\n삭제된 프로젝트는 복구할 수 없습니다.`}
        confirmText="삭제"
        cancelText="취소"
        confirmVariant="accent"
      />
    </div>
  );
}
