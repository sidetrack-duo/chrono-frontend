import {
  mockUser,
  mockRepos,
  mockProjects,
  mockProjectsDetail,
  mockProject,
  mockDashboard,
  mockWeeklyCommits,
  mockCommitSummary,
  mockCommitHistory,
} from "./data";
import {
  User,
  GitHubRepo,
  ProjectListItem,
  Project,
  DashboardResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  UpdateGithubUsernameRequest,
  UpdateGithubUsernameResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  ProjectStatus,
  WeeklyCommitCount,
  CommitSummary,
  CommitHistoryCount,
} from "@/types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  user: {
    getMe: async (): Promise<User> => {
      await delay(300);
      return mockUser;
    },
    updateGithubUsername: async (
      data: UpdateGithubUsernameRequest
    ): Promise<UpdateGithubUsernameResponse> => {
      await delay(300);
      return { githubUsername: data.githubUsername };
    },
    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
      await delay(300);
      return { ...mockUser, ...data };
    },
    updatePassword: async (_data: UpdatePasswordRequest): Promise<void> => {
      await delay(500);
    },
  },

  github: {
    getRepos: async (): Promise<GitHubRepo[]> => {
      await delay(500);
      return mockRepos;
    },
  },

  project: {
    createProject: async (data: CreateProjectRequest): Promise<Project> => {
      await delay(500);
      const now = new Date();
      const [repoOwner, repoName] = data.repoName.includes("/")
        ? data.repoName.split("/")
        : [mockUser.githubUsername || "testuser", data.repoName];
      
      // 기존 리포지토리 데이터가 있으면 활용
      const existingRepo = mockRepos.find(
        (r) => r.fullName === `${repoOwner}/${repoName}`
      );
      
      return {
        projectId: Math.floor(Math.random() * 1000) + 1000,
        title: data.title,
        description: data.description,
        startDate: now.toISOString().split("T")[0],
        targetDate: data.targetDate,
        techStack: data.techStack,
        status: ProjectStatus.IN_PROGRESS,
        repoName: repoName,
        repoOwner: repoOwner,
        totalCommits: existingRepo ? Math.floor(Math.random() * 200) + 50 : 0,
        lastCommitAt: existingRepo ? existingRepo.updatedAt : now.toISOString(),
        github: {
          totalCommits: existingRepo ? Math.floor(Math.random() * 200) + 50 : 0,
          lastCommitAt: existingRepo ? existingRepo.updatedAt : now.toISOString(),
        },
      };
    },
    getProjects: async (): Promise<ProjectListItem[]> => {
      await delay(300);
      return mockProjects;
    },
    getProject: async (id: number): Promise<Project> => {
      await delay(300);
      // 상세 정보가 있으면 사용, 없으면 기본 프로젝트 사용
      const projectDetail = mockProjectsDetail[id];
      if (projectDetail) {
        return { ...projectDetail, projectId: id };
      }
      return { ...mockProject, projectId: id };
    },
    updateProject: async (
      id: number,
      data: UpdateProjectRequest
    ): Promise<Project> => {
      await delay(300);
      const projectDetail = mockProjectsDetail[id] || mockProject;
      return { ...projectDetail, projectId: id, ...data };
    },
    deleteProject: async (): Promise<void> => {
      await delay(300);
    },
  },

  dashboard: {
    getDashboard: async (): Promise<DashboardResponse> => {
      await delay(500);
      return mockDashboard;
    },
  },

  commit: {
    getWeeklyCommits: async (_projectId: number): Promise<WeeklyCommitCount[]> => {
      await delay(300);
      return mockWeeklyCommits;
    },
    getCommitSummary: async (_projectId: number): Promise<CommitSummary> => {
      await delay(300);
      return mockCommitSummary;
    },
    getCommitHistory: async (_projectId: number): Promise<CommitHistoryCount[]> => {
      await delay(300);
      return mockCommitHistory;
    },
  },
};

