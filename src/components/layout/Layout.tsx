import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

export function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === "/" || location.pathname === "/landing";

  return (
    <div className={cn("min-h-screen flex flex-col", isLanding ? "bg-white" : "bg-zinc-100")}>
      <Navbar />
      <div className="flex-1">
        {isLanding ? (
          <main>
            <Outlet />
          </main>
        ) : (
          <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </main>
        )}
      </div>
      <Footer />
    </div>
  );
}
