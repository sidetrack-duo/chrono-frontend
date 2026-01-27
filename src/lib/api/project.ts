import { apiClient, isApiError, shouldUseMockFallback } from "./client";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectListItem,
  ProjectStatus,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function createProject(
  data: CreateProjectRequest,
  owner?: string
): Promise<{ projectId: number }> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    const mockProject = await mockApi.project.createProject(data);
    return { projectId: mockProject.projectId };
  }

  try {
    if (!owner) {
      throw new Error("GitHub username이 필요합니다.");
    }

    const [repoOwner, repoName] = data.repoName.includes("/")
      ? data.repoName.split("/")
      : [owner, data.repoName];

    const techStackArray = data.techStack
      ? data.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    const response = await apiClient.post<number>("/projects", {
      owner: repoOwner,
      repoName: repoName,
      repoUrl: `https://github.com/${repoOwner}/${repoName}`,
      title: data.title || undefined,
      description: data.description || undefined,
      techStack: techStackArray,
      startDate: undefined,
      targetDate: data.targetDate || undefined,
    });
    return { projectId: response.data };
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(
        `프로젝트 생성 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    const mockProject = await mockApi.project.createProject(data);
    return { projectId: mockProject.projectId };
  }
}

interface BackendProjectResponse {
  projectId: number;
  owner: string;
  repoName: string;
  repoUrl: string;
  active: boolean;
  createdAt: string;
  title: string | null;
  status: ProjectStatus;
  techStack: string[];
  totalCommits: number | null;
  lastCommitAt: string | null;
  startDate: string | null;
  targetDate: string | null;
  progressRate: number | null;
}

export async function getProjects(): Promise<ProjectListItem[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.getProjects();
  }

  try {
    const response = await apiClient.get<BackendProjectResponse[]>("/projects");

    return response.data.map((p) => ({
      projectId: p.projectId,
      title: p.title || p.repoName,
      status: p.status,
      techStack: p.techStack.length > 0 ? p.techStack.join(", ") : undefined,
      lastCommitAt: p.lastCommitAt || undefined,
      totalCommits: p.totalCommits || undefined,
      targetDate: p.targetDate || undefined,
      startDate: p.startDate || p.createdAt,
    }));
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(
        `프로젝트 목록 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.project.getProjects();
  }
}

interface BackendProjectDetailResponse {
  projectId: number;
  owner: string;
  repoName: string;
  repoUrl: string;
  title: string | null;
  description: string | null;
  techStack: string[];
  startDate: string | null;
  targetDate: string | null;
  status: ProjectStatus;
  active: boolean;
  createdAt: string;
  totalCommit: number;
  lastCommitAt: string | null;
}

export async function getProject(id: number): Promise<Project> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.getProject(id);
  }

  try {
    const response = await apiClient.get<BackendProjectDetailResponse>(
      `/projects/${id}`
    );
    const p = response.data;

    return {
      projectId: p.projectId,
      title: p.title || p.repoName,
      description: p.description || undefined,
      startDate: p.startDate || p.createdAt,
      targetDate: p.targetDate || undefined,
      techStack: p.techStack.length > 0 ? p.techStack.join(", ") : undefined,
      status: p.status,
      repoName: p.repoName,
      repoOwner: p.owner,
      totalCommits: p.totalCommit,
      lastCommitAt: p.lastCommitAt || undefined,
    };
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(
        `프로젝트 상세 조회 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.project.getProject(id);
  }
}

export async function updateProject(
  id: number,
  data: UpdateProjectRequest
): Promise<Project> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.updateProject(id, data);
  }

  try {
    const techStackArray = data.techStack
      ? data.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    await apiClient.put(`/projects/${id}/meta`, {
      title: data.title,
      description: data.description,
      techStack: techStackArray,
      startDate: data.startDate || undefined,
      targetDate: data.targetDate || undefined,
    });

    return getProject(id);
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(
        `프로젝트 수정 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.project.updateProject(id, data);
  }
}

export async function updateProjectStatus(
  id: number,
  status: ProjectStatus
): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    await mockApi.project.updateProject(id, { status });
    return;
  }

  try {
    await apiClient.patch(`/projects/${id}/status`, { status });
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(
        `프로젝트 상태 변경 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    await mockApi.project.updateProject(id, { status });
    return;
  }
}

export async function deleteProject(id: number): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.deleteProject();
  }

  try {
    await apiClient.patch(`/projects/${id}/active`, { active: false });
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = isApiError(error)
      ? `[${error.code}] ${error.message}`
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류";
    if (import.meta.env.DEV) {
      console.warn(
        `프로젝트 삭제 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.project.deleteProject();
  }
}
