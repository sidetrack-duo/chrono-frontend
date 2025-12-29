import { useState, useEffect, useMemo } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink, GitCommitVertical, GitCommitHorizontal, Calendar, Target, CircleAlert, Flame, Github, RefreshCw, Sparkle, ChevronLeft, ChevronDown } from "lucide-react";
import { getProject, deleteProject, updateProjectStatus, updateProject } from "@/lib/api/project";
import { syncCommits, getCommitSummary, getCommitHistory } from "@/lib/api/commit";
import { isApiError } from "@/lib/api/client";
import { Project, ProjectStatus, CommitSummary, CommitHistoryCount } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ProjectEditModal } from "@/components/projects/ProjectEditModal";
import { useToastStore } from "@/stores/toastStore";
import { SkeletonCard, SkeletonCardContent, SkeletonText, Skeleton } from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { getCommitIntensity } from "@/utils/dashboard";

function CommitHistoryChart({ history }: { history: CommitHistoryCount[] }) {
  const validHistory = history.filter((h) => h.date != null);
  const maxCount = Math.max(...validHistory.map((h) => h.count), 1);
  const sortedHistory = [...validHistory].sort((a, b) => 
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
    <div className="flex items-end justify-between gap-0">
      {displayHistory.map((item, index) => {
        const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        const intensity = getCommitIntensity(item.count);
        return (
          <div
            key={`${item.date}-${index}`}
            className="group flex flex-1 flex-col items-center gap-2"
          >
            <div className="relative flex w-full items-end" style={{ height: "60px" }}>
              {item.count > 0 && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap"
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
            <span className="text-[11px] text-gray-500">{formatDate(item.date)}</span>
          </div>
        );
      })}
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const loadProject = async () => {
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

  useEffect(() => {
    if (!id) {
      setError("프로젝트 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    loadProject();
    loadCommitSummary();
    loadCommitHistory();
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

  const displayHistory = useMemo(() => {
    if (commitHistory.length === 0) return [];
    const sortedHistory = [...commitHistory].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedHistory.slice(-14);
  }, [commitHistory]);

  const totalCommits = useMemo(() => 
    displayHistory.reduce((sum, h) => sum + h.count, 0), 
    [displayHistory]
  );

  const dateRange = useMemo(() => {
    if (displayHistory.length === 0) return "";
    const firstDate = new Date(displayHistory[0].date);
    const lastDate = new Date(displayHistory[displayHistory.length - 1].date);
    const formatDate = (date: Date) => {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };
    return `${formatDate(firstDate)} ~ ${formatDate(lastDate)}`;
  }, [displayHistory]);

  const streakDays = useMemo(() => {
    if (commitHistory.length === 0) return 0;
    
    const sortedHistory = [...commitHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let count = 0;
    let previousDate: Date | null = null;
    
    for (const item of sortedHistory) {
      if (item.count === 0) break;
      
      const currentDate = new Date(item.date);
      currentDate.setHours(0, 0, 0, 0);
      
      if (previousDate === null) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          count = 1;
          previousDate = currentDate;
        } else if (diffDays === 1) {
          count = 1;
          previousDate = currentDate;
        } else {
          break;
        }
      } else {
        const diffDays = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          count++;
          previousDate = currentDate;
        } else {
          break;
        }
      }
    }
    
    return count;
  }, [commitHistory]);

  const mostActiveDayName = useMemo(() => {
    if (displayHistory.length === 0) return null;
    const maxCount = Math.max(...displayHistory.map((h) => h.count), 0);
    if (maxCount === 0) return null;
    const mostActiveDay = displayHistory.find((h) => h.count === maxCount);
    if (!mostActiveDay) return null;
    const date = new Date(mostActiveDay.date);
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return dayNames[date.getDay()];
  }, [displayHistory]);

  const techStackArray = project?.techStack
    ? project.techStack.split(",").map((s) => s.trim())
    : [];
  const dday = project && project.status !== ProjectStatus.COMPLETED ? getDday(project.targetDate) : null;
  const ddayInfo = dday !== null ? getDdayLabel(dday) : null;
  const repoUrl = project ? `https://github.com/${project.repoOwner}/${project.repoName}` : "";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{project.title}</h1>
            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                disabled={isUpdatingStatus}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                  project.status === ProjectStatus.COMPLETED 
                    ? 'bg-accent-50 text-accent' 
                    : 'bg-primary-50 text-primary'
                }`}
              >
                <span>{getStatusLabel(project.status)}</span>
                <ChevronDown className={`h-3 w-3 opacity-70 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStatusDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsStatusDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 z-20 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        if (project.status !== ProjectStatus.IN_PROGRESS) {
                          handleStatusChange(ProjectStatus.IN_PROGRESS);
                        }
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer hover:bg-gray-50"
                      style={{
                        backgroundColor: project.status === ProjectStatus.IN_PROGRESS ? 'rgba(53, 193, 183, 0.1)' : 'transparent',
                        color: project.status === ProjectStatus.IN_PROGRESS ? '#35c1b7' : '#374151',
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
                      className="w-full px-3 py-2 text-left text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer hover:bg-gray-50"
                      style={{
                        backgroundColor: project.status === ProjectStatus.COMPLETED ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                        color: project.status === ProjectStatus.COMPLETED ? '#10b981' : '#374151',
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
            <p className="mt-1 text-sm text-gray-500">프로젝트 상세 정보를 확인하세요.</p>
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
                className="group flex items-center gap-4 rounded-lg bg-white p-4 transition-all hover:bg-primary/5"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-50 transition-colors group-hover:bg-primary">
                  <Github className="h-8 w-8 text-primary transition-colors group-hover:text-white" />
                </div>
                <div className="min-w-0 flex-1 flex items-center gap-4">
                  <span className="truncate text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {project.repoOwner}/{project.repoName}
                  </span>
                  <ExternalLink className="h-6 w-6 shrink-0 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </a>

              {project.startDate && (
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 min-h-[80px]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>시작일</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {new Date(project.startDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {project.targetDate && (
                <div className={`flex items-center justify-between rounded-lg p-4 min-h-[80px] ${
                  project.status === ProjectStatus.COMPLETED
                    ? "bg-zinc-50"
                    : ddayInfo?.isOverdue
                    ? "bg-accent-50"
                    : "bg-zinc-50"
                }`}>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Target className="h-4 w-4 text-primary" />
                    <span>목표</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
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
                            <CircleAlert className="h-3.5 w-3.5" />
                          )}
                          {ddayInfo.isUrgent && !ddayInfo.isOverdue && (
                            <Flame className="h-3.5 w-3.5" />
                          )}
                        </div>
                      )}
                      <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(project.targetDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}

              {techStackArray.length > 0 && (
                <div className="pt-5">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">다음 기술 스택을 사용했어요</h2>
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
                        <div className="relative group">
                          <span className="text-base font-medium text-gray-700 cursor-pointer">
                            외 {techStackArray.length - 7}가지
                          </span>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg text-center">
                              <div className="flex flex-col gap-1">
                                {techStackArray.slice(7).map((tech, idx) => (
                                  <span key={idx}>{tech}</span>
                                ))}
                              </div>
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 rounded-xl bg-white p-6 shadow-sm">
            
            {isLoadingSummary || isLoadingHistory ? (
              <div className="flex items-center justify-center rounded-lg bg-zinc-50 py-12">
                <div className="text-center">
                  <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-gray-500">커밋 통계를 불러오는 중...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 min-h-[80px]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <GitCommitVertical className="h-4 w-4 text-primary" />
                    <span>총 커밋</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {commitSummary?.totalCommits ?? project.totalCommits ?? project.github?.totalCommits ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 min-h-[80px]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>최근 활동</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">{getTimeLabel(daysAgo)}</span>
                </div>

                {commitHistory.length > 0 && (
                  <div className="pt-5">
                    <div className="mb-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            최근 14일간 {totalCommits}번 커밋했어요
                          </h2>
                          {dateRange && (
                            <p className="mt-1 text-sm text-gray-500">
                              {dateRange}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleSyncCommits}
                          disabled={isSyncing}
                          className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          title="커밋 동기화"
                        >
                          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {isLoadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                      ) : (
                        <CommitHistoryChart history={commitHistory} />
                      )}

                      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4">
                        {streakDays > 0 && (
                          <div className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-1.5">
                            <GitCommitHorizontal className="h-4 w-4 text-accent" />
                            <span className="text-xs font-medium text-accent">{streakDays}일 연속</span>
                          </div>
                        )}
                        {mostActiveDayName && (
                          <div className="flex items-center gap-2">
                            <Sparkle className="h-4 w-4 text-accent" />
                            <span className="text-xs font-medium text-gray-500">{mostActiveDayName}에 가장 활발했어요</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>목록으로</span>
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={handleEditClick}
            className="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer"
          >
            수정
          </button>
          <div className="h-3.5 border-l border-gray-300" />
          <button
            onClick={handleDeleteClick}
            className="text-sm text-gray-500 hover:text-accent transition-colors cursor-pointer"
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
