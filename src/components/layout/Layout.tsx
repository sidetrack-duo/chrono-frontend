import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

export function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className={cn("min-h-screen", isLanding ? "bg-white" : "bg-zinc-100")}>
      <Navbar />
      {isLanding ? (
        <main>
          <Outlet />
        </main>
      ) : (
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      )}
      <Footer />
    </div>
  );
}
