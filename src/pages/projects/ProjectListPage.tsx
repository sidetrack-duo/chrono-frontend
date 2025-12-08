import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { GitCommit, Calendar, Loader2, ArrowRight, Target, ChevronDown, CircleAlert, Flame, Clock } from "lucide-react";
import { getProjects } from "@/lib/api/project";
import { ProjectListItem, ProjectStatus } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { getDaysSinceLastCommit } from "@/utils/dashboard";

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
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Filter by status
    if (filterStatus === "in_progress") {
      filtered = projects.filter((p) => p.status === ProjectStatus.IN_PROGRESS);
    } else if (filterStatus === "completed") {
      filtered = projects.filter((p) => p.status === ProjectStatus.COMPLETED);
    }

    // Sort
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

    // 커밋 많은 순이면 그룹핑 안 함
    if (sortBy === "commits") {
      return {
        todayProjects: filteredAndSortedProjects,
        thisWeekProjects: [],
        thisMonthProjects: [],
        olderProjects: [],
      };
    }

    // 생성순 vs 최근 활동순에 따라 다른 날짜 기준
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

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
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
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-sm">
          <div className="rounded-full bg-gray-100 p-4">
            <GitCommit className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">프로젝트가 없습니다</h3>
          <p className="mt-2 text-sm text-gray-500">첫 프로젝트를 만들어보세요!</p>
          <Link
            to="/projects/new"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            + 새 프로젝트 만들기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Timeline + Preview Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Timeline List */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            {/* Filters & Sort */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`flex cursor-pointer items-center justify-center rounded-full px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    filterStatus === "all"
                      ? "bg-zinc-50 text-gray-900"
                      : "text-gray-900 hover:bg-zinc-50"
                  }`}
                >
                  전체 {projects.length}
                </button>
                <button
                  onClick={() => setFilterStatus("in_progress")}
                  className={`flex cursor-pointer items-center justify-center rounded-full px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    filterStatus === "in_progress"
                      ? "bg-primary-50 text-primary"
                      : "text-gray-900 hover:bg-zinc-50"
                  }`}
                >
                  진행 중 {projects.filter((p) => p.status === ProjectStatus.IN_PROGRESS).length}
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`flex cursor-pointer items-center justify-center rounded-full px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    filterStatus === "completed"
                      ? "bg-accent-50 text-accent"
                      : "text-gray-900 hover:bg-zinc-50"
                  }`}
                >
                  완료 {projects.filter((p) => p.status === ProjectStatus.COMPLETED).length}
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-[38px] w-full appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-8 text-xs text-gray-700 transition-colors hover:border-gray-400 focus:border-primary focus:outline-none"
                >
                  <option value="created">최근생성순</option>
                  <option value="recent">최근커밋순</option>
                  <option value="commits">커밋많은순</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Timeline Content */}
            <div className="relative">
              {/* Timeline Groups */}
              {sortBy === "commits" ? (
                <TimelineGroup
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
                  <TimelineGroup
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
                  <TimelineGroup
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
                  <TimelineGroup
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
                  <TimelineGroup
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

        {/* Preview Panel */}
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

// Timeline Group Component
function TimelineGroup({
  title,
  projects,
  selectedId,
  onSelect,
  getTimeLabel,
  getDday,
  getDdayLabel,
  getStatusLabel,
  getStatusVariant,
  showRank = false,
}: {
  title: string;
  projects: ProjectListItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  getTimeLabel: (daysAgo: number | null) => string;
  getDday: (targetDate?: string) => number | null;
  getDdayLabel: (dday: number | null) => { label: string; isUrgent?: boolean; isOverdue?: boolean } | null;
  getStatusLabel: (status: ProjectStatus) => string;
  getStatusVariant: (status: ProjectStatus) => "primary" | "accent";
  showRank?: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <div className="mb-8 last:mb-0">
      {/* Group Title - 커밋 많은 순일 때는 숨김 */}
      {!showRank && (
        <div className="mb-4 grid grid-cols-[24px_1fr] items-center gap-x-4">
          <div className="flex justify-center">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
          </div>
          <div className="flex items-center">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
      )}

      {/* Project Items - Grid로 타임라인과 카드 정렬 */}
      <div className="grid grid-cols-[24px_1fr] gap-x-4 gap-y-2 items-stretch">
        {projects.map((project, index) => {
          const daysAgo = getDaysSinceLastCommit(project);
          const isSelected = project.id === selectedId;
          const dday = project.status !== ProjectStatus.COMPLETED ? getDday(project.targetDate) : null;
          const ddayInfo = dday !== null ? getDdayLabel(dday) : null;
          const rank = index + 1;
          const isFirst = index === 0;
          const isLast = index === projects.length - 1;

          return (
            <React.Fragment key={project.id}>
              {/* Timeline Cell */}
              <div className="relative flex justify-center">
                {/* 세로 선 - 첫/마지막 카드 고려 */}
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-200 ${
                    isFirst && isLast ? 'top-4 bottom-4' : isFirst ? 'top-1/2 -bottom-1' : isLast ? '-top-1 bottom-1/2' : '-top-1 -bottom-1'
                  }`}
                ></div>
                
                {/* 동그라미 또는 순위 - 카드 중앙에 위치 */}
                <div className="absolute inset-0 z-10 grid place-items-center">
                  {showRank ? (
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        rank === 1
                          ? "bg-amber-400 text-white"
                          : rank === 2
                          ? "bg-gray-300 text-white"
                          : rank === 3
                          ? "bg-amber-600 text-white"
                          : isSelected
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {rank}
                    </div>
                  ) : (
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isSelected ? "bg-primary" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              </div>

              {/* Card Cell */}
              <button
                onClick={() => onSelect(project.id)}
                className={`min-h-[80px] rounded-lg border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 bg-white hover:border-primary/50 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{project.title}</h4>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      {project.totalCommits !== undefined && (
                        <span className="flex items-center gap-1">
                          <GitCommit className="h-3 w-3" />
                          <span className={showRank ? "font-semibold text-gray-900" : ""}>{project.totalCommits}</span>
                          <span>커밋</span>
                        </span>
                      )}
                      <span>·</span>
                      <span>{getTimeLabel(daysAgo)}</span>
                      {ddayInfo && project.status !== ProjectStatus.COMPLETED && (
                        <>
                          <span>·</span>
                          <span
                            className={`flex items-center gap-1 font-medium ${
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
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(project.status)} className="shrink-0 text-xs">
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Project Preview Component
function ProjectPreview({
  project,
  getStatusLabel,
  getStatusVariant,
  getTimeLabel,
  getDday,
  getDdayLabel,
}: {
  project: ProjectListItem;
  getStatusLabel: (status: ProjectStatus) => string;
  getStatusVariant: (status: ProjectStatus) => "primary" | "accent";
  getTimeLabel: (daysAgo: number | null) => string;
  getDday: (targetDate?: string) => number | null;
  getDdayLabel: (dday: number | null) => { label: string; isUrgent?: boolean; isOverdue?: boolean } | null;
}) {
  const daysAgo = getDaysSinceLastCommit(project);
  const techStackArray = project.techStack
    ? project.techStack.split(",").map((s) => s.trim())
    : [];
  const dday = project.status !== ProjectStatus.COMPLETED ? getDday(project.targetDate) : null;
  const ddayInfo = dday !== null ? getDdayLabel(dday) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
      </div>

      {/* Tech Stack */}
      {techStackArray.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-medium text-gray-500">기술 스택</h3>
          <div className="flex flex-wrap items-center">
            {techStackArray.map((tech, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div className="mx-2 h-4 border-l border-gray-100"></div>
                )}
                <span className="rounded-md p-4 text-xs font-medium text-gray-700">
                  {tech}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-3">
        {project.totalCommits !== undefined && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GitCommit className="h-4 w-4 text-primary" />
              <span>총 커밋</span>
            </div>
            <span className="text-base font-medium text-gray-900">{project.totalCommits}</span>
          </div>
        )}

        {daysAgo !== null && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-primary" />
              <span>최근 활동</span>
            </div>
            <span className="text-base font-medium text-gray-900">{getTimeLabel(daysAgo)}</span>
          </div>
        )}

        {project.targetDate && (
          <div
            className={`flex items-center justify-between rounded-lg p-4 ${
              project.status === ProjectStatus.COMPLETED
                ? "bg-zinc-50"
                : ddayInfo?.isOverdue
                ? "bg-accent-50"
                : "bg-zinc-50"
            }`}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
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
      </div>

      {/* Action Button */}
      <Link
        to={`/projects/${project.id}`}
        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        상세보기
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

