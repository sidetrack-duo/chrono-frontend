import { ProjectListItem } from "@/types/api";

export const getCommitIntensity = (count: number) => {
  if (count === 0) return { bg: "bg-gray-100" };
  if (count <= 3) return { bg: "bg-primary/30" };
  if (count <= 7) return { bg: "bg-primary/60" };
  if (count <= 12) return { bg: "bg-primary" };
  return { bg: "bg-primary-dark" };
};

export const getHeatmapIntensity = (count: number) => {
  if (count === 0) return "bg-gray-100";
  if (count <= 2) return "bg-primary/20";
  if (count <= 5) return "bg-primary/40";
  if (count <= 8) return "bg-primary/70";
  return "bg-primary";
};

export const getDaysSinceLastCommit = (project: ProjectListItem) => {
  if (!project?.lastCommitAt) return null;
  const today = new Date();
  const lastCommit = new Date(project.lastCommitAt);
  const diffTime = today.getTime() - lastCommit.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const generateHeatmapData = (weeklyCommits: { date: string; count?: number }[]) => {
  const heatmap: { date: string; count: number }[] = [];
  const today = new Date();
  
  for (let i = 34; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    const commit = weeklyCommits.find((c) => c.date === dateStr);
    heatmap.push({
      date: dateStr,
      count: commit?.count ?? 0,
    });
  }
  
  return heatmap;
};

