import React from "react";
import { Link } from "react-router-dom";
import { GitCommit, Calendar, ArrowRight, Target, CircleAlert, Flame } from "lucide-react";
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

