import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/common/Button";

export function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
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

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <span className="text-2xl md:text-3xl font-extrabold tracking-[-0.015em] text-gray-900">
            chrono<span className="text-primary text-3xl md:text-4xl leading-none">.</span>
          </span>
        </Link>

        {/* Desktop Menu Items */}
        {isLanding ? (
          // Landing Page Menu
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
            >
              로그인
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-sm font-medium px-3 md:px-4">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        ) : (
          // App Menu
          <>
            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-50 text-primary"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Menu */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/settings"
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <div className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-gray-200 flex">
                <span className="text-sm font-medium text-gray-700">U</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/settings"
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <div className="h-8 w-8 items-center justify-center rounded-full bg-gray-200 flex">
                <span className="text-sm font-medium text-gray-700">U</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
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

      {/* Mobile Menu Dropdown */}
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
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-50 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
