import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/stores/authStore";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const isLanding = location.pathname === "/" || location.pathname === "/landing";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/dashboard", label: "대시보드" },
    { path: "/projects", label: "프로젝트" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    closeMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-xs">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 md:px-6">
        <Link to={isAuthenticated ? "/dashboard" : "/landing"} className="flex items-center gap-2" onClick={closeMobileMenu}>
          <span className="text-2xl md:text-3xl font-extrabold tracking-[-0.015em] text-gray-900">
            chrono<span className="text-primary text-3xl md:text-4xl leading-none">.</span>
          </span>
        </Link>

        {isLanding ? (
          <div className="col-start-3 flex items-center justify-end gap-3 md:gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
            >
              로그인
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-sm font-medium px-3 md:px-4">
                회원가입
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden items-center justify-center gap-1 md:flex">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "font-semibold text-primary"
                        : "font-medium text-gray-700 hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center justify-end gap-1 md:flex">
              <Link
                to="/settings"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary"
              >
                계정설정
              </Link>
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-accent"
              >
                로그아웃
              </button>
            </div>

            <div className="col-start-3 flex items-center justify-end gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="cursor-pointer rounded-lg p-2 text-gray-700 transition-colors hover:text-gray-900"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {!isLanding && isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "font-semibold text-primary"
                      : "font-medium text-gray-700 hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-gray-100 pt-2">
              <Link
                to="/settings"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-primary"
              >
                계정설정
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:text-accent"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
