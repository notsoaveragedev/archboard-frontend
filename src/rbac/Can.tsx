import { Tooltip } from "antd";
import type { ReactNode } from "react";
import type { PermissionKey } from "../types/rbac";
import { usePermission, type PermissionTarget } from "./RbacContext";

type CanProps = {
  permission: PermissionKey;
  target?: PermissionTarget;
  // "hide": the role can never do this. "disable": normally allowed, but a rule blocks it here.
  mode?: "hide" | "disable";
  children: ReactNode | ((allowed: boolean) => ReactNode);
};

export function Can({ permission, target, mode = "hide", children }: CanProps) {
  const { allowed, reason } = usePermission(permission, target);
  const content = typeof children === "function" ? children(allowed) : children;

  if (allowed) return content;
  if (mode === "hide") return null;

  return (
    <Tooltip title={reason}>
      <span className="inline-flex">{content}</span>
    </Tooltip>
  );
}
