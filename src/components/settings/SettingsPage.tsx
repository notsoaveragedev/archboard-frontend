import { useEffect, useRef, type ReactNode } from "react";

type SettingsPageProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  // "form" pages read best narrow; tables (Members, Roles, Audit log) need room.
  width?: "form" | "wide";
  children: ReactNode;
};

export function SettingsPage({ title, description, actions, width = "form", children }: SettingsPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the page title on navigation so screen readers announce the new page.
  useEffect(() => {
    headingRef.current?.focus();
  }, [title]);

  return (
    <div className={`mx-auto w-full px-10 pt-12 pb-24 ${width === "wide" ? "max-w-240" : "max-w-180"}`}>
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="text-title font-semibold tracking-[-0.01em] outline-none">
            {title}
          </h1>
          <p className="mt-1 text-ui text-muted">{description}</p>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}
