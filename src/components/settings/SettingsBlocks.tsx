import { useId, type ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SettingsSection({ title, description, action, children }: SettingsSectionProps) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-ui font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-ui text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

type SettingsCardProps = {
  children: ReactNode;
  footer?: ReactNode;
  isDanger?: boolean;
};

export function SettingsCard({ children, footer, isDanger = false }: SettingsCardProps) {
  return (
    <div
      className={`divide-y divide-line-soft rounded-lg border bg-surface ${isDanger ? "border-danger-line" : "border-line"}`}
    >
      {children}
      {footer && <div className="rounded-b-lg bg-hover-subtle px-5 py-3 text-2xs text-muted">{footer}</div>}
    </div>
  );
}

type SettingRowProps = {
  label: string;
  description?: ReactNode;
  children?: ReactNode;
  // "stacked" puts wide controls (name, URL) under the label.
  layout?: "inline" | "stacked";
};

export function SettingRow({ label, description, children, layout = "inline" }: SettingRowProps) {
  const labelId = useId();
  const descriptionId = useId();

  const text = (
    <div className="min-w-0 flex-1">
      <div id={labelId} className="text-ui font-medium">
        {label}
      </div>
      {description && (
        <div id={descriptionId} className="mt-0.5 text-ui text-muted">
          {description}
        </div>
      )}
    </div>
  );

  const control = children && (
    <div role="group" aria-labelledby={labelId} aria-describedby={description ? descriptionId : undefined}>
      {children}
    </div>
  );

  if (layout === "stacked") {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        {text}
        {control}
      </div>
    );
  }

  return (
    <div className="flex min-h-16 items-center justify-between gap-8 px-5 py-4">
      {text}
      {control && <div className="shrink-0">{control}</div>}
    </div>
  );
}
