import { apiClient } from "./client";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectListItem,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function createProject(
  data: CreateProjectRequest
): Promise<Project> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.createProject(data);
  }
  const response = await apiClient.post<Project>("/projects", data);
  return response.data;
}

export async function getProjects(): Promise<ProjectListItem[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.getProjects();
  }
  const response = await apiClient.get<ProjectListItem[]>("/projects");
  return response.data;
}

export async function getProject(id: number): Promise<Project> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.getProject(id);
  }
  const response = await apiClient.get<Project>(`/projects/${id}`);
  return response.data;
}

export async function updateProject(
  id: number,
  data: UpdateProjectRequest
): Promise<Project> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.updateProject(id, data);
  }
  const response = await apiClient.put<Project>(`/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: number): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.deleteProject(id);
  }
  await apiClient.delete(`/projects/${id}`);
}

