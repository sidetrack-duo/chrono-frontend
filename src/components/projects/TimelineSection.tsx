import React from "react";
import { CircleAlert, Flame } from "lucide-react";
import { ProjectListItem, ProjectStatus } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { getDaysSinceLastCommit } from "@/utils/dashboard";

interface TimelineSectionProps {
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
}

export function TimelineSection({
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
}: TimelineSectionProps) {
  if (projects.length === 0) return null;

  return (
    <div className="mb-8 last:mb-0">
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
              <div className="relative flex justify-center">
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-200 ${
                    isFirst && isLast ? 'top-4 bottom-4' : isFirst ? 'top-1/2 -bottom-1' : isLast ? '-top-1 bottom-1/2' : '-top-1 -bottom-1'
                  }`}
                ></div>
                <div className="absolute inset-0 z-10 grid place-items-center">
                  {showRank ? (
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        rank === 1
                          ? "bg-amber-400 text-white"
                          : rank === 2
                          ? "bg-gray-400 text-white"
                          : rank === 3
                          ? "bg-amber-600 text-white"
                          : isSelected
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {rank}
                    </div>
                  ) : (
                    <div
                      className={`h-2 w-2 rounded-full transition-colors duration-200 ease-in-out ${
                        isSelected ? "bg-primary" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onSelect(project.id)}
                className={`min-h-[80px] rounded-lg border p-4 text-left transition-all duration-200 ease-in-out cursor-pointer ${
                  isSelected
                    ? "border-primary shadow-sm shadow-primary/20 hover:bg-primary/5"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate ${isSelected ? "text-primary" : "text-gray-900"}`}>{project.title}</h4>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      {project.totalCommits !== undefined && (
                        <span>
                          <span className={showRank ? "font-semibold text-gray-900" : ""}>{project.totalCommits}</span>
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
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

