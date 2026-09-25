import type { ReactNode } from "react";
import { LuChevronLeft } from "react-icons/lu";
import { Link } from "react-router";

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="mb-6 inline-flex items-center gap-1 text-ui text-muted hover:text-ink">
      <LuChevronLeft className="size-4" />
      {children}
    </Link>
  );
}
