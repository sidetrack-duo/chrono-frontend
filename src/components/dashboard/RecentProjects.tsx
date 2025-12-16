import React from "react";
import { Link } from "react-router-dom";
import { CircleAlert, Flame, FolderOpen } from "lucide-react";
import { ProjectListItem, ProjectStatus } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { getDaysSinceLastCommit } from "@/utils/dashboard";

interface RecentProjectsProps {
  projects: ProjectListItem[];
  getTimeLabel: (daysAgo: number | null) => string;
  getDday: (targetDate?: string) => number | null;
  getDdayLabel: (dday: number | null) => { label: string; isUrgent?: boolean; isOverdue?: boolean } | null;
  getStatusLabel: (status: ProjectStatus) => string;
  getStatusVariant: (status: ProjectStatus) => "primary" | "accent";
}

export function RecentProjects({
  projects,
  getTimeLabel,
  getDday,
  getDdayLabel,
  getStatusLabel,
  getStatusVariant,
}: RecentProjectsProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">최근 프로젝트</h2>
        <Link
          to="/projects/new"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          + 새 프로젝트
        </Link>
      </div>
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="프로젝트가 없습니다"
          description="첫 프로젝트를 만들어보세요!"
          actionLabel="+ 새 프로젝트 만들기"
          actionLink="/projects/new"
          className="bg-transparent shadow-none py-12"
        />
      ) : (
        <div className="grid grid-cols-[24px_1fr] gap-x-4 gap-y-2 items-stretch">
          {projects.map((project, index) => {
            const daysAgo = getDaysSinceLastCommit(project);
            const dday = project.status !== ProjectStatus.COMPLETED ? getDday(project.targetDate) : null;
            const ddayInfo = dday !== null ? getDdayLabel(dday) : null;
            const isFirst = index === 0;
            const isLast = index === projects.length - 1;

            return (
              <React.Fragment key={project.id}>
                <div className="relative flex justify-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-200 ${
                      isFirst && isLast
                        ? "top-4 bottom-4"
                        : isFirst
                        ? "top-1/2 -bottom-1"
                        : isLast
                        ? "-top-1 bottom-1/2"
                        : "-top-1 -bottom-1"
                    }`}
                  ></div>
                  <div className="absolute inset-0 z-10 grid place-items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300 transition-colors duration-200 ease-in-out"></div>
                  </div>
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="group block min-h-[80px] rounded-lg border border-gray-200 bg-white p-4 text-left transition-all duration-200 ease-in-out hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        {project.totalCommits !== undefined && (
                          <span>
                            {project.totalCommits}
                            <span> 커밋</span>
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
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
