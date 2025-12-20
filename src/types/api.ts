export type ApiError = {
  message: string;
  code: string;
};

export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  GITHUB_USERNAME_NOT_SET = "GITHUB_USERNAME_NOT_SET",
  GITHUB_USER_NOT_FOUND = "GITHUB_USER_NOT_FOUND",
  GITHUB_RATE_LIMIT = "GITHUB_RATE_LIMIT",
  GITHUB_REPO_NOT_FOUND = "GITHUB_REPO_NOT_FOUND",
}

export interface EmailVerificationSendRequest {
  email: string;
}

export interface EmailVerificationVerifyRequest {
  email: string;
  code: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  githubUsername?: string;
}

export interface UpdateGithubUsernameRequest {
  githubUsername: string;
}

export interface UpdateGithubUsernameResponse {
  githubUsername: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface GitHubUsernameValidation {
  valid: boolean;
  username: string;
  avatarUrl: string | null;
  message: string;
}

export interface GitHubConnectBasicRequest {
  username: string;
}

export interface GitHubConnectBasicResponse {
  connected: boolean;
  type: "BASIC" | "FULL";
  username: string;
  avatarUrl?: string;
  message: string;
}

export interface GitHubConnectPatRequest {
  username: string;
  pat: string;
}

export interface GitHubConnectPatResponse {
  connected: boolean;
  type: "FULL";
  message: string;
}

export interface GitHubDisconnectPatResponse {
  connected: boolean;
  type: "BASIC";
  message: string;
}

export interface GitHubRepo {
  repoId: number;
  repoName: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
}

export interface CommitStats {
  totalCommits: number;
  lastCommitAt: string;
}

export enum ProjectStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  targetDate?: string;
  techStack?: string;
  status: ProjectStatus;
  repoName: string;
  repoOwner: string;
  totalCommits?: number;
  lastCommitAt?: string;
  github?: CommitStats;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  targetDate?: string;
  techStack?: string;
  repoName: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  targetDate?: string;
  techStack?: string;
  status?: ProjectStatus;
}

export interface ProjectListItem {
  id: number;
  title: string;
  status: ProjectStatus;
  techStack?: string;
  lastCommitAt?: string;
  totalCommits?: number;
  targetDate?: string;
  startDate?: string;
}

export interface DashboardSummary {
  inProgressCount: number;
  completedCount: number;
  totalCommitsThisMonth: number;
}

export interface WeeklyCommit {
  dayOfWeek: string;
  date: string;
  count: number;
}

export interface WeekInfo {
  startDate: string;
  endDate: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  weeklyCommits: WeeklyCommit[];
  weekInfo: WeekInfo;
  recentProjects: ProjectListItem[];
}

export interface CommitSummary {
  projectId: number;
  totalCommits: number;
  latestCommitDate: string;
  commitsThisWeek: number;
  mostActiveDay: string;
}

export interface WeeklyCommitCount {
  dayOfWeek: number;
  count: number;
}

export interface CommitHistoryCount {
  date: string;
  count: number;
}

export interface Commit {
  sha: string;
  message: string;
  authorName: string;
  authorEmail: string;
  commitDate: string;
}

