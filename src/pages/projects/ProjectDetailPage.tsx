import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, ExternalLink, GitCommitVertical, Calendar, Target, CircleAlert, Flame, Github } from "lucide-react";
import { getProject } from "@/lib/api/project";
import { Project, ProjectStatus } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { useToastStore } from "@/stores/toastStore";
import { SkeletonCard, SkeletonCardContent, SkeletonText, Skeleton } from "@/components/common/Skeleton";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("프로젝트 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    loadProject();
  }, [id]);

  const loadProject = async () => {
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

  const handleDelete = () => {
    if (!project) return;
    
    if (window.confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) {
      // TODO: 삭제 API 연동
      showToast("삭제 기능은 곧 구현될 예정입니다.", "info");
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
          {/* 프로젝트 정보 스켈레톤 */}
          <div className="lg:col-span-2">
            <SkeletonCard>
              <div className="space-y-4">
                <Skeleton width="w-64" height="h-8" rounded="md" />
                <SkeletonText lines={2} widths={["w-full", "w-3/4"]} />
                <Skeleton width="w-full" height="h-64" rounded="lg" />
              </div>
            </SkeletonCard>
          </div>

          {/* GitHub 통계 스켈레톤 */}
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error || "프로젝트를 찾을 수 없습니다."}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/projects")}
          >
            프로젝트 목록으로 돌아가기
          </Button>
        </div>
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
      {/* Header */}
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
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Project Info & Commit Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Info Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-6">
              {/* Title & Status */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                  {project.description && (
                    <p className="mt-2 text-sm text-gray-600">{project.description}</p>
                  )}
                </div>
                <Badge variant={getStatusVariant(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>

              {/* Tech Stack */}
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

              {/* Project Dates */}
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

          {/* Commit Activity Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">커밋 활동</h2>
            <div className="flex items-center justify-center rounded-lg bg-zinc-50 py-12">
              <div className="text-center">
                <GitCommitVertical className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">커밋 그래프는 곧 추가될 예정입니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - GitHub Stats */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">GitHub</h2>
              <p className="mt-1 text-xs text-gray-500">저장소 정보 및 통계</p>
            </div>

            <div className="space-y-4">
              {/* Repo Link */}
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

              {/* Total Commits */}
              {(project.totalCommits !== undefined || project.github?.totalCommits !== undefined) && (
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GitCommitVertical className="h-4 w-4 text-primary" />
                    <span>총 커밋</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {project.totalCommits ?? project.github?.totalCommits ?? 0}
                  </span>
                </div>
              )}

              {/* Last Commit */}
              {daysAgo !== null && (
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>최근 활동</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">{getTimeLabel(daysAgo)}</span>
                </div>
              )}

              {/* Last Commit Date */}
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
    </div>
  );
}
