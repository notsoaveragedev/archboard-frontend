import type { ReactNode } from "react";

type AuthHeaderProps = {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
};

export function AuthHeader({ title, description, icon }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      {icon && (
        <span className="mb-4 flex size-10 items-center justify-center rounded-lg border border-line bg-surface text-ink [&_svg]:size-4.5">
          {icon}
        </span>
      )}
      <h1 className="text-title font-semibold tracking-[-0.01em]">{title}</h1>
      <p className="mt-1.5 text-ui text-muted">{description}</p>
    </div>
  );
}
