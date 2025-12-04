import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProjectListPage } from "@/pages/projects/ProjectListPage";
import { ProjectCreatePage } from "@/pages/projects/ProjectCreatePage";
import { ProjectDetailPage } from "@/pages/projects/ProjectDetailPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // Root Layout for both Landing and App
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <ProjectListPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "new",
            element: (
              <ProtectedRoute>
                <ProjectCreatePage />
              </ProtectedRoute>
            ),
          },
          {
            path: ":id",
            element: (
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
