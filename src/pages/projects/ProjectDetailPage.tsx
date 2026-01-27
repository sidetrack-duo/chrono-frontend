import { useState, useEffect, useMemo, useCallback } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ExternalLink,
  GitCommitVertical,
  GitCommitHorizontal,
  Calendar,
  Target,
  CircleAlert,
  Flame,
  Github,
  RefreshCw,
  Sparkle,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import {
  getProject,
  deleteProject,
  updateProjectStatus,
  updateProject,
} from "@/lib/api/project";
import {
  syncCommits,
  getCommitSummary,
  getCommitHistory,
} from "@/lib/api/commit";
import { isApiError } from "@/lib/api/client";
import {
  Project,
  ProjectStatus,
  CommitSummary,
  CommitHistoryCount,
} from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ProjectEditModal } from "@/components/projects/ProjectEditModal";
import { useToastStore } from "@/stores/toastStore";
import {
  SkeletonCard,
  SkeletonCardContent,
  SkeletonText,
  Skeleton,
} from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { getCommitIntensity } from "@/utils/dashboard";

function CommitHistoryChart({ history }: { history: CommitHistoryCount[] }) {
  const validHistory = history.filter((h) => h.date != null);
  const sortedHistory = [...validHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const generateLast14Days = (): CommitHistoryCount[] => {
    const days: CommitHistoryCount[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const existing = sortedHistory.find((h) => {
        const backendDate = h.date?.split("T")[0] || h.date;
        return backendDate === dateStr;
      });
      days.push({
        date: dateStr,
        count: existing?.count ?? 0,
      });
    }
    return days;
  };

  const displayHistory = generateLast14Days();
  const maxCount = Math.max(...displayHistory.map((h) => h.count), 1);

  return (
    <div className="-mx-1.5 overflow-x-auto px-1.5 sm:-mx-2 sm:px-2 md:mx-0 md:px-0">
      <div className="flex min-w-fit items-end justify-between gap-0.5 sm:gap-1 md:gap-0">
        {displayHistory.map((item, index) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          const intensity = getCommitIntensity(item.count);
          return (
            <div
              key={`${item.date}-${index}`}
              className="group flex min-w-[32px] flex-1 flex-col items-center gap-1.5 sm:min-w-[36px] sm:gap-2 md:min-w-0"
            >
              <div
                className="relative flex w-full items-end"
                style={{ height: "60px" }}
              >
                {item.count > 0 && (
                  <span
                    className="absolute left-1/2 z-10 -translate-x-1/2 text-xs whitespace-nowrap text-gray-500 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      bottom: `${60 * (Math.max(height, item.count > 0 ? 12 : 4) / 100) + 6}px`,
                    }}
                  >
                    {item.count}
                  </span>
                )}
                <div
                  className={`w-full rounded-t ${intensity.bg} transition-all hover:opacity-80`}
                  style={{
                    height: `${Math.max(height, item.count > 0 ? 12 : 4)}%`,
                    minHeight: item.count > 0 ? "16px" : "4px",
                  }}
                  title={`${formatDate(item.date)}: ${item.count} commits`}
                />
              </div>
              <span className="text-center text-[10px] whitespace-nowrap text-gray-500 sm:text-[11px]">
                {formatDate(item.date)}
              </span>
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
  const [, setCommitSummary] = useState<CommitSummary | null>(null);
  const [commitHistory, setCommitHistory] = useState<CommitHistoryCount[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const loadProject = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getProject(Number(id));
      setProject(data);
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message || "프로젝트 정보를 불러오는데 실패했습니다.");
      } else {
        setError("프로젝트 정보를 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadCommitSummary = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoadingSummary(true);
      const summary = await getCommitSummary(Number(id));
      setCommitSummary(summary);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("커밋 통계를 불러오는데 실패했습니다:", err);
      }
    } finally {
      setIsLoadingSummary(false);
    }
  }, [id]);

  const loadCommitHistory = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoadingHistory(true);
      const history = await getCommitHistory(Number(id));
      setCommitHistory(history);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("커밋 히스토리를 불러오는데 실패했습니다:", err);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError("프로젝트 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    loadProject();
    loadCommitSummary();
    loadCommitHistory();
  }, [id, loadProject, loadCommitSummary, loadCommitHistory]);

  const handleSyncCommits = async () => {
    if (!id || !project) return;

    try {
      setIsSyncing(true);
      const count = await syncCommits(Number(id));
      showToast(`${count}개의 커밋이 동기화되었습니다.`, "success");
      await loadProject();
      await loadCommitSummary();
      await loadCommitHistory();
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
      await updateProjectStatus(project.projectId, newStatus);
      showToast(
        `프로젝트 상태가 "${getStatusLabel(newStatus)}"로 변경되었습니다.`,
        "success"
      );
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

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: {
    title: string;
    description?: string;
    techStack?: string;
    targetDate?: string;
  }) => {
    if (!project) return;

    try {
      await updateProject(project.projectId, data);
      await loadProject();
    } catch (err) {
      if (isApiError(err)) {
        throw new Error(err.message || "프로젝트 수정에 실패했습니다.");
      } else {
        throw new Error("프로젝트 수정 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!project) return;

    try {
      await deleteProject(project.projectId);
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
    if (daysAgo === null) return "오래전";
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
    const diff = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const getDdayLabel = (
    dday: number | null
  ): { label: string; isUrgent?: boolean; isOverdue?: boolean } | null => {
    if (dday === null) return null;
    if (dday < 0) return { label: `D+${Math.abs(dday)}`, isOverdue: true };
    if (dday === 0) return { label: "D-Day", isUrgent: true };
    if (dday <= 7) return { label: `D-${dday}`, isUrgent: true };
    return { label: `D-${dday}`, isUrgent: false };
  };

  const getDaysSinceLastCommit = (lastCommitAt: string): number | null => {
    if (!lastCommitAt) return null;
    const today = new Date();
    const lastCommit = new Date(lastCommitAt);
    const diffTime = today.getTime() - lastCommit.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const lastCommitAt = project?.lastCommitAt || project?.github?.lastCommitAt;
  const daysAgo = lastCommitAt ? getDaysSinceLastCommit(lastCommitAt) : null;

  const dateRange = useMemo(() => {
    const today = new Date();
    const firstDate = new Date(today);
    firstDate.setDate(today.getDate() - 13);
    const lastDate = new Date(today);
    const formatDate = (date: Date) => {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };
    return `${formatDate(firstDate)} ~ ${formatDate(lastDate)}`;
  }, []);

  const totalCommits = useMemo(() => {
    const validHistory = commitHistory.filter((h) => h.date != null);
    const sortedHistory = [...validHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const last14Days = sortedHistory.slice(-14);
    return last14Days.reduce((sum, h) => sum + h.count, 0);
  }, [commitHistory]);

  const streakDays = useMemo(() => {
    if (!commitHistory.length) return 0;

    const committedDates = commitHistory
      .filter((h) => h.date && h.count > 0)
      .map((h) => {
        const d = new Date(h.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      });

    if (committedDates.length === 0) return 0;

    const uniqueDates = Array.from(new Set(committedDates)).sort(
      (a, b) => b - a
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (uniqueDates[0] !== today.getTime()) {
      return 0;
    }

    let streak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const diffDays =
        (uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [commitHistory]);

  const mostActiveDayName = useMemo(() => {
    const validHistory = commitHistory.filter((h) => h.date != null);
    if (validHistory.length === 0) return null;
    const sortedHistory = [...validHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const last14Days = sortedHistory.slice(-14);
    const maxCount = Math.max(...last14Days.map((h) => h.count), 0);
    if (maxCount === 0) return null;
    const mostActiveDay = last14Days.find((h) => h.count === maxCount);
    if (!mostActiveDay) return null;
    const date = new Date(mostActiveDay.date);
    const dayNames = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return dayNames[date.getDay()];
  }, [commitHistory]);

  const techStackArray = project?.techStack
    ? project.techStack.split(",").map((s) => s.trim())
    : [];
  const dday =
    project && project.status !== ProjectStatus.COMPLETED
      ? getDday(project.targetDate)
      : null;
  const ddayInfo = dday !== null ? getDdayLabel(dday) : null;
  const repoUrl = project
    ? `https://github.com/${project.repoOwner}/${project.repoName}`
    : "";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            프로젝트 상세
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            프로젝트 정보를 불러오는 중...
          </p>
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
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            프로젝트 상세
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            프로젝트 정보를 확인할 수 없습니다.
          </p>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {project.title}
            </h1>
            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                disabled={isUpdatingStatus}
                className={`focus:ring-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                  project.status === ProjectStatus.COMPLETED
                    ? "bg-accent-50 text-accent"
                    : "bg-primary-50 text-primary"
                }`}
              >
                <span>{getStatusLabel(project.status)}</span>
                <ChevronDown
                  className={`h-3 w-3 opacity-70 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isStatusDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsStatusDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 z-20 mt-2 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        if (project.status !== ProjectStatus.IN_PROGRESS) {
                          handleStatusChange(ProjectStatus.IN_PROGRESS);
                        }
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full cursor-pointer px-3 py-2 text-left text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50"
                      style={{
                        backgroundColor:
                          project.status === ProjectStatus.IN_PROGRESS
                            ? "rgba(53, 193, 183, 0.1)"
                            : "transparent",
                        color:
                          project.status === ProjectStatus.IN_PROGRESS
                            ? "#35c1b7"
                            : "#374151",
                      }}
                    >
                      진행 중
                    </button>
                    <button
                      onClick={() => {
                        if (project.status !== ProjectStatus.COMPLETED) {
                          handleStatusChange(ProjectStatus.COMPLETED);
                        }
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full cursor-pointer px-3 py-2 text-left text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50"
                      style={{
                        backgroundColor:
                          project.status === ProjectStatus.COMPLETED
                            ? "rgba(16, 185, 129, 0.1)"
                            : "transparent",
                        color:
                          project.status === ProjectStatus.COMPLETED
                            ? "#10b981"
                            : "#374151",
                      }}
                    >
                      완료
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          {project.description && (
            <p className="mt-1 text-sm text-gray-500">{project.description}</p>
          )}
          {!project.description && (
            <p className="mt-1 text-sm text-gray-500">
              프로젝트를 확인하고 관리하세요.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col">
          <div className="flex-1 rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:bg-primary/5 flex items-center gap-4 rounded-lg bg-white p-4 transition-all"
              >
                <div className="bg-primary-50 group-hover:bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-colors">
                  <Github className="text-primary h-8 w-8 transition-colors group-hover:text-white" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="group-hover:text-primary truncate text-2xl font-semibold text-gray-900 transition-colors">
                    {project.repoOwner}/{project.repoName}
                  </span>
                  <ExternalLink className="group-hover:text-primary h-6 w-6 shrink-0 text-gray-300 transition-colors" />
                </div>
              </a>

              <div className="flex min-h-[85px] items-center justify-between rounded-lg bg-zinc-50 p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="text-primary h-4 w-4" />
                  <span>시작일</span>
                </div>
                <span className="text-base font-semibold text-gray-900">
                  {project.startDate ? (
                    new Date(project.startDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  ) : (
                    <span className="text-base font-semibold text-gray-500">
                      설정 없음
                    </span>
                  )}
                </span>
              </div>

              <div
                className={`flex min-h-[85px] items-center justify-between rounded-lg p-5 ${
                  project.status === ProjectStatus.COMPLETED
                    ? "bg-zinc-50"
                    : ddayInfo?.isOverdue
                      ? "bg-accent-50"
                      : "bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Target className="text-primary h-4 w-4" />
                  <span>목표</span>
                </div>
                {project.targetDate ? (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      {ddayInfo &&
                        project.status !== ProjectStatus.COMPLETED && (
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
                              <CircleAlert className="h-3.5 w-3.5" />
                            )}
                            {ddayInfo.isUrgent && !ddayInfo.isOverdue && (
                              <Flame className="h-3.5 w-3.5" />
                            )}
                          </div>
                        )}
                      <Badge variant={getStatusVariant(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(project.targetDate).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-base font-semibold text-gray-500">
                    설정 없음
                  </span>
                )}
              </div>

              <div className="pt-5">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  다음 기술 스택을 사용했어요
                </h2>
                {techStackArray.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {techStackArray.slice(0, 7).map((tech, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && (
                          <div className="h-3.5 border-l border-gray-300"></div>
                        )}
                        <span className="text-base font-medium text-gray-700">
                          {tech}
                        </span>
                      </React.Fragment>
                    ))}
                    {techStackArray.length > 7 && (
                      <>
                        <div className="h-3.5 border-l border-gray-300"></div>
                        <div className="group relative">
                          <span className="cursor-pointer text-base font-medium text-gray-700">
                            외 {techStackArray.length - 7}가지
                          </span>
                          <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
                            <div className="rounded-lg bg-gray-900 px-3 py-2 text-center text-xs text-white shadow-lg">
                              <div className="flex flex-col gap-1">
                                {techStackArray.slice(7).map((tech, idx) => (
                                  <span key={idx}>{tech}</span>
                                ))}
                              </div>
                              <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-4 border-r-4 border-l-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    기술 스택 정보가 없습니다
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 rounded-xl bg-white p-6 shadow-sm">
            {isLoadingSummary || isLoadingHistory ? (
              <div className="flex items-center justify-center rounded-lg bg-zinc-50 py-12">
                <div className="text-center">
                  <div className="border-primary mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                  <p className="text-sm text-gray-500">
                    커밋 통계를 불러오는 중...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex min-h-[85px] items-center justify-between rounded-lg bg-zinc-50 p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <GitCommitVertical className="text-primary h-4 w-4" />
                    <span>총 커밋</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {project.totalCommits ?? 0}
                  </span>
                </div>

                <div className="flex min-h-[85px] items-center justify-between rounded-lg bg-zinc-50 p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="text-primary h-4 w-4" />
                    <span>최근 활동</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {getTimeLabel(daysAgo)}
                  </span>
                </div>

                <div className="pt-5">
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                          최근 14일간 {totalCommits}번 커밋했어요
                        </h2>
                        <p className="mt-1 text-xs break-words text-gray-500 sm:text-sm">
                          {dateRange}
                        </p>
                      </div>
                      <button
                        onClick={handleSyncCommits}
                        disabled={isSyncing}
                        className="hover:text-primary flex-shrink-0 cursor-pointer text-gray-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        title="커밋 동기화"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isLoadingHistory ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                      </div>
                    ) : (
                      <CommitHistoryChart history={commitHistory} />
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4">
                      <div className="bg-accent-50 flex items-center gap-2 rounded-lg px-3 py-1.5">
                        <GitCommitHorizontal className="text-accent h-4 w-4" />
                        <span className="text-accent text-xs font-medium">
                          {streakDays}일 연속
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkle className="text-accent h-4 w-4" />
                        <span className="text-xs font-medium text-gray-500">
                          {mostActiveDayName
                            ? `${mostActiveDayName}에 가장 활발했어요`
                            : "최근 활동이 없어요"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/projects")}
          className="hover:text-primary flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>목록으로</span>
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={handleEditClick}
            className="hover:text-primary cursor-pointer text-sm text-gray-500 transition-colors"
          >
            수정
          </button>
          <div className="h-3.5 border-l border-gray-300" />
          <button
            onClick={handleDeleteClick}
            className="hover:text-accent cursor-pointer text-sm text-gray-500 transition-colors"
          >
            삭제
          </button>
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

      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}
