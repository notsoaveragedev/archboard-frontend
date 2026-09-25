import { Typography } from "antd";
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
        <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-brand-soft text-xl text-brand">
          {icon}
        </span>
      )}
      <Typography.Title level={3} className="mb-1.5 tracking-tight">
        {title}
      </Typography.Title>
      <Typography.Text type="secondary">{description}</Typography.Text>
    </div>
  );
}
