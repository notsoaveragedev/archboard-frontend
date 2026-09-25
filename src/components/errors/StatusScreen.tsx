import type { ReactNode } from "react";

type StatusScreenProps = {
  icon: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  details?: string;
  isFullPage?: boolean;
};

export function StatusScreen({ icon, eyebrow, title, description, actions, details, isFullPage = false }: StatusScreenProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center px-6 text-center ${isFullPage ? "min-h-screen bg-surface" : "py-24"}`}
    >
      <span className="flex size-11 items-center justify-center rounded-lg border border-line bg-surface text-muted [&_svg]:size-5">
        {icon}
      </span>
      {eyebrow && <span className="mt-5 text-2xs font-medium tracking-wider text-muted uppercase">{eyebrow}</span>}
      <h1 className={`${eyebrow ? "mt-1" : "mt-5"} text-title font-semibold tracking-[-0.01em]`}>{title}</h1>
      <p className="mt-2 max-w-96 text-ui text-muted">{description}</p>
      {actions && <div className="mt-6 flex gap-2">{actions}</div>}
      {details && (
        <pre className="mt-6 max-w-xl overflow-auto rounded-lg border border-line bg-hover-subtle p-3 text-left font-mono text-2xs text-muted">
          {details}
        </pre>
      )}
    </div>
  );
}
