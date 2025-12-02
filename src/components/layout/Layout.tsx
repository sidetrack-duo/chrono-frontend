import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

export function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className={cn("min-h-screen", isLanding ? "bg-white" : "bg-gray-50")}>
      <Navbar />
      {isLanding ? (
        // Landing page takes full width
        <main>
          <Outlet />
        </main>
      ) : (
        // App pages have constrained width and padding
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      )}
    </div>
  );
}
