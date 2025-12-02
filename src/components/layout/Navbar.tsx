import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/common/Button";

export function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/dashboard", label: "대시보드", icon: LayoutDashboard },
    { path: "/projects", label: "프로젝트", icon: FolderKanban },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl font-extrabold tracking-[-0.015em] text-gray-900">
            chrono<span className="text-primary text-4xl leading-none">.</span>
          </span>
        </Link>

        {/* Menu Items */}
        {isLanding ? (
          // Landing Page Menu
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary"
            >
              로그인
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-sm px-4">무료로 시작하기</Button>
            </Link>
          </div>
        ) : (
          // App Menu
          <>
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-50 text-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
              <div className="ml-2 hidden h-8 w-8 items-center justify-center rounded-full bg-gray-200 md:flex">
                <span className="text-xs font-medium text-gray-600">U</span>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
