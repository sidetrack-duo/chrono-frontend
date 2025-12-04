import {
  mockUser,
  mockRepos,
  mockProjects,
  mockProject,
  mockDashboard,
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
  ProjectStatus,
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
      return {
        id: Math.floor(Math.random() * 1000),
        title: data.title,
        description: data.description,
        startDate: new Date().toISOString().split("T")[0],
        targetDate: data.targetDate,
        techStack: data.techStack,
        status: ProjectStatus.IN_PROGRESS,
        repoName: data.repoName,
        repoOwner: mockUser.githubUsername || "testuser",
        github: {
          totalCommits: 0,
          lastCommitAt: new Date().toISOString(),
        },
      };
    },
    getProjects: async (): Promise<ProjectListItem[]> => {
      await delay(300);
      return mockProjects;
    },
    getProject: async (id: number): Promise<Project> => {
      await delay(300);
      return { ...mockProject, id };
    },
    updateProject: async (
      id: number,
      data: UpdateProjectRequest
    ): Promise<Project> => {
      await delay(300);
      return { ...mockProject, id, ...data };
    },
    deleteProject: async (id: number): Promise<void> => {
      await delay(300);
    },
  },

  dashboard: {
    getDashboard: async (): Promise<DashboardResponse> => {
      await delay(500);
      return mockDashboard;
    },
  },
};

