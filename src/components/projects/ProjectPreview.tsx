import React from "react";
import { Link } from "react-router-dom";
import { GitCommitVertical, Calendar, ChevronRight, Target, CircleAlert, Flame } from "lucide-react";
import { ProjectListItem, ProjectStatus } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { getDaysSinceLastCommit } from "@/utils/dashboard";

interface ProjectPreviewProps {
  project: ProjectListItem;
  getStatusLabel: (status: ProjectStatus) => string;
  getStatusVariant: (status: ProjectStatus) => "primary" | "accent";
  getTimeLabel: (daysAgo: number | null) => string;
  getDday: (targetDate?: string) => number | null;
  getDdayLabel: (dday: number | null) => { label: string; isUrgent?: boolean; isOverdue?: boolean } | null;
}

export function ProjectPreview({
  project,
  getStatusLabel,
  getStatusVariant,
  getTimeLabel,
  getDday,
  getDdayLabel,
}: ProjectPreviewProps) {
  const daysAgo = getDaysSinceLastCommit(project);
  const techStackArray = project.techStack
    ? project.techStack.split(",").map((s) => s.trim())
    : [];
  const dday = project.status !== ProjectStatus.COMPLETED ? getDday(project.targetDate) : null;
  const ddayInfo = dday !== null ? getDdayLabel(dday) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-5 min-h-[85px]">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <GitCommitVertical className="h-4 w-4 text-primary" />
            <span>총 커밋</span>
          </div>
          <span className="text-base font-semibold text-gray-900">{project.totalCommits ?? 0}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-5 min-h-[85px]">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 text-primary" />
            <span>최근 활동</span>
          </div>
          <span className="text-base font-semibold text-gray-900">{getTimeLabel(daysAgo)}</span>
        </div>

        <div
          className={`flex items-center justify-between rounded-lg p-5 min-h-[85px] ${
            project.status === ProjectStatus.COMPLETED
              ? "bg-zinc-50"
              : ddayInfo?.isOverdue
              ? "bg-accent-50"
              : "bg-zinc-50"
          }`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Target className="h-4 w-4 text-primary" />
            <span>목표</span>
          </div>
          {project.targetDate ? (
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
          ) : (
            <span className="text-base font-semibold text-gray-500">설정 없음</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center">
        {techStackArray.length > 0 ? (
          <>
            {techStackArray.slice(0, 5).map((tech, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div className="mx-2 h-4 border-l border-gray-100"></div>
                )}
                <span className="rounded-md px-5 py-2.5 text-sm font-semibold text-gray-900">
                  {tech}
                </span>
              </React.Fragment>
            ))}
            {techStackArray.length > 5 && (
              <>
                <div className="mx-2 h-4 border-l border-gray-100"></div>
                <div className="relative group">
                  <span className="rounded-md px-5 py-2.5 text-sm font-semibold text-gray-900 cursor-pointer">
                    외 {techStackArray.length - 5}가지
                  </span>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg text-center">
                      <div className="flex flex-col gap-1">
                        {techStackArray.slice(5).map((tech, idx) => (
                          <span key={idx}>{tech}</span>
                        ))}
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <span className="rounded-md px-5 py-2.5 text-sm font-medium text-gray-500">기술 스택 정보가 없습니다</span>
        )}
      </div>

      <Link
        to={`/projects/${project.projectId}`}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        상세보기
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

