import {
  DashboardResponse,
  GitHubRepo,
  User,
  Project,
  ProjectListItem,
  ProjectStatus,
} from "@/types/api";

export const mockUser: User = {
  id: 1,
  email: "developer@example.com",
  nickname: "개발자",
  bio: "사이드 프로젝트를 관리하는 개발자입니다.",
  githubUsername: "testuser",
};

export const mockRepos: GitHubRepo[] = [
  {
    name: "chrono",
    fullName: "testuser/chrono",
    description: "GitHub 커밋 기반 프로젝트 관리 서비스",
    htmlUrl: "https://github.com/testuser/chrono",
    private: false,
  },
  {
    name: "portfolio",
    fullName: "testuser/portfolio",
    description: "개인 포트폴리오 웹사이트",
    htmlUrl: "https://github.com/testuser/portfolio",
    private: false,
  },
  {
    name: "blog",
    fullName: "testuser/blog",
    description: "기술 블로그",
    htmlUrl: "https://github.com/testuser/blog",
    private: false,
  },
];

export const mockProjects: ProjectListItem[] = [
  {
    id: 1,
    title: "Chrono - 프로젝트 관리 서비스",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "React, TypeScript, Tailwind",
    lastCommitAt: "2025-12-04T10:30:00Z",
    totalCommits: 127,
  },
  {
    id: 2,
    title: "포트폴리오 웹사이트",
    status: ProjectStatus.COMPLETED,
    techStack: "Next.js, Vercel",
    lastCommitAt: "2025-11-28T15:20:00Z",
    totalCommits: 45,
  },
  {
    id: 3,
    title: "기술 블로그",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "Gatsby, MDX",
    lastCommitAt: "2025-12-01T09:15:00Z",
    totalCommits: 89,
  },
];

export const mockProject: Project = {
  id: 1,
  title: "Chrono - 프로젝트 관리 서비스",
  description: "GitHub 커밋을 기반으로 사이드 프로젝트를 관리하는 서비스입니다.",
  startDate: "2025-11-01",
  targetDate: "2025-12-31",
  techStack: "React, TypeScript, Tailwind CSS, Zustand",
  status: ProjectStatus.IN_PROGRESS,
  repoName: "chrono",
  repoOwner: "testuser",
  github: {
    totalCommits: 127,
    lastCommitAt: "2025-12-04T10:30:00Z",
  },
};

export const mockDashboard: DashboardResponse = {
  summary: {
    inProgressCount: 2,
    completedCount: 1,
    totalCommitsThisMonth: 156,
  },
  weeklyCommits: [
    { dayOfWeek: "MON", date: "2025-12-02", count: 5 },
    { dayOfWeek: "TUE", date: "2025-12-03", count: 8 },
    { dayOfWeek: "WED", date: "2025-12-04", count: 12 },
    { dayOfWeek: "THU", date: "2025-12-05", count: 7 },
    { dayOfWeek: "FRI", date: "2025-12-06", count: 15 },
    { dayOfWeek: "SAT", date: "2025-12-07", count: 3 },
    { dayOfWeek: "SUN", date: "2025-12-08", count: 6 },
  ],
  weekInfo: {
    startDate: "2025-12-02",
    endDate: "2025-12-08",
  },
  recentProjects: mockProjects.slice(0, 3),
};

