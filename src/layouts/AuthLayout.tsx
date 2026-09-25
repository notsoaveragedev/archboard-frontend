import { Link, Outlet } from "react-router";
import { AuthShowcase } from "../components/auth/AuthShowcase";
import { Logo } from "../components/Logo";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-surface text-ui lg:grid-cols-2">
      <div className="flex min-h-screen flex-col px-6 py-6 sm:px-10">
        <Link to="/login" className="self-start rounded-md">
          <Logo />
        </Link>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-90">
            <Outlet />
          </div>
        </main>

        <footer className="text-2xs text-muted">© {new Date().getFullYear()} archboard</footer>
      </div>

      <AuthShowcase />
    </div>
  );
}
