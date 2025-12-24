import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { GitCommitVertical, ChevronDown } from "lucide-react";
import { getProjects } from "@/lib/api/project";
import { ProjectListItem, ProjectStatus } from "@/types/api";
import { TimelineSection } from "@/components/projects/TimelineSection";
import { ProjectPreview } from "@/components/projects/ProjectPreview";
import { SkeletonCard, SkeletonCardContent } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { isApiError } from "@/lib/api/client";

type FilterStatus = "all" | "in_progress" | "completed";
type SortOption = "recent" | "commits" | "created";

export function ProjectListPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("created");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message || "프로젝트 목록을 불러오는데 실패했습니다.");
      } else {
        setError("프로젝트 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    if (filterStatus === "in_progress") {
      filtered = projects.filter((p) => p.status === ProjectStatus.IN_PROGRESS);
    } else if (filterStatus === "completed") {
      filtered = projects.filter((p) => p.status === ProjectStatus.COMPLETED);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "created") {
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      } else if (sortBy === "recent") {
        if (!a.lastCommitAt) return 1;
        if (!b.lastCommitAt) return -1;
        return new Date(b.lastCommitAt).getTime() - new Date(a.lastCommitAt).getTime();
      } else if (sortBy === "commits") {
        return (b.totalCommits || 0) - (a.totalCommits || 0);
      }
      return 0;
    });

    return sorted;
  }, [projects, filterStatus, sortBy]);

  const groupedProjects = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const todayProjects: ProjectListItem[] = [];
    const thisWeekProjects: ProjectListItem[] = [];
    const thisMonthProjects: ProjectListItem[] = [];
    const olderProjects: ProjectListItem[] = [];

    if (sortBy === "commits") {
      return {
        todayProjects: filteredAndSortedProjects,
        thisWeekProjects: [],
        thisMonthProjects: [],
        olderProjects: [],
      };
    }

    const dateField = sortBy === "created" ? "startDate" : "lastCommitAt";

    filteredAndSortedProjects.forEach((project) => {
      const dateValue = project[dateField];
      if (!dateValue) {
        olderProjects.push(project);
        return;
      }
      const targetDate = new Date(dateValue);
      if (targetDate >= today) {
        todayProjects.push(project);
      } else if (targetDate >= weekAgo) {
        thisWeekProjects.push(project);
      } else if (targetDate >= monthAgo) {
        thisMonthProjects.push(project);
      } else {
        olderProjects.push(project);
      }
    });

    return { todayProjects, thisWeekProjects, thisMonthProjects, olderProjects };
  }, [filteredAndSortedProjects, sortBy]);

  useEffect(() => {
    if (filteredAndSortedProjects.length > 0) {
      setSelectedProjectId(filteredAndSortedProjects[0].projectId);
    }
  }, [filteredAndSortedProjects]);

  useEffect(() => {
    if (filteredAndSortedProjects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(filteredAndSortedProjects[0].projectId);
    }
  }, [filteredAndSortedProjects, selectedProjectId]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.projectId === selectedProjectId);
  }, [projects, selectedProjectId]);

  const projectCounts = useMemo(() => {
    return {
      all: projects.length,
      inProgress: projects.filter((p) => p.status === ProjectStatus.IN_PROGRESS).length,
      completed: projects.filter((p) => p.status === ProjectStatus.COMPLETED).length,
    };
  }, [projects]);

  const getStatusLabel = (status: ProjectStatus) => {
    return status === ProjectStatus.IN_PROGRESS ? "진행 중" : "완료";
  };

  const getStatusVariant = (status: ProjectStatus): "primary" | "accent" => {
    return status === ProjectStatus.IN_PROGRESS ? "primary" : "accent";
  };

  const getTimeLabel = (daysAgo: number | null) => {
    if (daysAgo === null) return "";
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
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트</h1>
          <p className="mt-1 text-sm text-gray-500">관리 중인 사이드 프로젝트 목록입니다.</p>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트</h1>
          <p className="mt-1 text-sm text-gray-500">관리 중인 사이드 프로젝트 목록입니다.</p>
        </div>
        <ErrorState
          title={error}
          description="잠시 후 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={loadProjects}
        />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트</h1>
          <p className="mt-1 text-sm text-gray-500">관리 중인 사이드 프로젝트 목록입니다.</p>
        </div>
        <EmptyState
          icon={GitCommitVertical}
          title="프로젝트가 없습니다"
          description="첫 프로젝트를 만들어보세요!"
          actionLabel="+ 새 프로젝트"
          actionLink="/projects/new"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트</h1>
          <p className="mt-1 text-sm text-gray-500">관리 중인 사이드 프로젝트 목록입니다.</p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          + 새 프로젝트
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 sm:justify-between">
              <div className="mr-3 flex flex-shrink items-center gap-1.5 sm:mr-0 sm:gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`flex cursor-pointer items-center justify-center rounded-full px-2.5 py-2 text-xs font-medium transition-colors whitespace-nowrap sm:px-3.5 sm:py-2.5 ${
                    filterStatus === "all"
                      ? "bg-zinc-50 text-gray-900"
                      : "text-gray-700 hover:bg-zinc-50"
                  }`}
                >
                  전체 {projectCounts.all}
                </button>
                <button
                  onClick={() => setFilterStatus("in_progress")}
                  className={`flex cursor-pointer items-center justify-center rounded-full px-2.5 py-2 text-xs font-medium transition-colors whitespace-nowrap sm:px-3.5 sm:py-2.5 ${
                    filterStatus === "in_progress"
                      ? "bg-primary-50 text-primary"
                      : "text-gray-700 hover:bg-zinc-50"
                  }`}
                >
                  진행 중 {projectCounts.inProgress}
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`flex cursor-pointer items-center justify-center rounded-full px-2.5 py-2 text-xs font-medium transition-colors whitespace-nowrap sm:px-3.5 sm:py-2.5 ${
                    filterStatus === "completed"
                      ? "bg-accent-50 text-accent"
                      : "text-gray-700 hover:bg-zinc-50"
                  }`}
                >
                  완료 {projectCounts.completed}
                </button>
              </div>

              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-[38px] w-auto min-w-[100px] appearance-none rounded-lg border border-gray-200 bg-white pl-2.5 pr-7 text-xs text-gray-700 transition-colors hover:border-gray-300 focus:border-primary focus:outline-none sm:min-w-[120px] sm:pl-3 sm:pr-8"
                >
                  <option value="created">최근생성순</option>
                  <option value="recent">최근커밋순</option>
                  <option value="commits">커밋많은순</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 sm:right-2" />
              </div>
            </div>

            <div className="relative">
              {sortBy === "commits" ? (
                <TimelineSection
                  title="전체"
                  projects={groupedProjects.todayProjects}
                  selectedId={selectedProjectId}
                  onSelect={setSelectedProjectId}
                  getTimeLabel={getTimeLabel}
                  getDday={getDday}
                  getDdayLabel={getDdayLabel}
                  getStatusLabel={getStatusLabel}
                  getStatusVariant={getStatusVariant}
                  showRank={true}
                />
              ) : (
                <>
                  <TimelineSection
                    title={sortBy === "recent" ? "오늘 활동" : "오늘"}
                    projects={groupedProjects.todayProjects}
                    selectedId={selectedProjectId}
                    onSelect={setSelectedProjectId}
                    getTimeLabel={getTimeLabel}
                    getDday={getDday}
                    getDdayLabel={getDdayLabel}
                    getStatusLabel={getStatusLabel}
                    getStatusVariant={getStatusVariant}
                  />
                  <TimelineSection
                    title={sortBy === "recent" ? "이번 주 활동" : "이번 주"}
                    projects={groupedProjects.thisWeekProjects}
                    selectedId={selectedProjectId}
                    onSelect={setSelectedProjectId}
                    getTimeLabel={getTimeLabel}
                    getDday={getDday}
                    getDdayLabel={getDdayLabel}
                    getStatusLabel={getStatusLabel}
                    getStatusVariant={getStatusVariant}
                  />
                  <TimelineSection
                    title={sortBy === "recent" ? "이번 달 활동" : "이번 달"}
                    projects={groupedProjects.thisMonthProjects}
                    selectedId={selectedProjectId}
                    onSelect={setSelectedProjectId}
                    getTimeLabel={getTimeLabel}
                    getDday={getDday}
                    getDdayLabel={getDdayLabel}
                    getStatusLabel={getStatusLabel}
                    getStatusVariant={getStatusVariant}
                  />
                  <TimelineSection
                    title={sortBy === "recent" ? "이전 활동" : "이전"}
                    projects={groupedProjects.olderProjects}
                    selectedId={selectedProjectId}
                    onSelect={setSelectedProjectId}
                    getTimeLabel={getTimeLabel}
                    getDday={getDday}
                    getDdayLabel={getDdayLabel}
                    getStatusLabel={getStatusLabel}
                    getStatusVariant={getStatusVariant}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
            {selectedProject ? (
              <ProjectPreview
                project={selectedProject}
                getStatusLabel={getStatusLabel}
                getStatusVariant={getStatusVariant}
                getTimeLabel={getTimeLabel}
                getDday={getDday}
                getDdayLabel={getDdayLabel}
              />
            ) : (
              <div className="flex h-full items-center justify-center py-12 text-center text-sm text-gray-500">
                프로젝트를 선택해주세요
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

