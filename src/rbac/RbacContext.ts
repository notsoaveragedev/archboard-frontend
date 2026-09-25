import { createContext, use } from "react";
import type { PermissionKey, Role, RoleId } from "../types/rbac";
import { hasPermission } from "./permissions";

type RbacContextValue = {
  roles: Role[];
  currentRole: Role;
  actualRoleId: RoleId;
  currentMemberId: string;
  setOwnRole: (roleId: RoleId) => void;
  saveRole: (role: Role) => void;
  deleteRole: (roleId: RoleId) => void;
};

export type PermissionTarget = {
  memberId?: string;
  memberRoleId?: RoleId;
  isOwnResource?: boolean;
};

export type PermissionResult = { allowed: boolean; reason: string | null };

export const RbacContext = createContext<RbacContextValue | null>(null);

export function useRbac() {
  const context = use(RbacContext);
  if (!context) throw new Error("useRbac must be used inside <RbacProvider>");
  return context;
}

const MEMBER_MANAGEMENT: PermissionKey[] = ["members.updateRole", "members.remove", "security.manage"];

// Role grants first, then the situational rules (own row, Admin vs Owner). The reason is shown in tooltips.
export function checkPermission(
  role: Role,
  currentMemberId: string,
  key: PermissionKey,
  target: PermissionTarget = {},
): PermissionResult {
  if (!hasPermission(role, key, target.isOwnResource)) {
    return { allowed: false, reason: `Your ${role.name} role doesn't allow this.` };
  }
  if (target.memberId === currentMemberId && key === "members.updateRole") {
    return { allowed: false, reason: "You can't change your own role." };
  }
  if (target.memberId === currentMemberId && key === "members.remove") {
    return { allowed: false, reason: "You can't remove yourself. Leave the workspace from General." };
  }
  if (target.memberRoleId === "owner" && role.id !== "owner" && MEMBER_MANAGEMENT.includes(key)) {
    return { allowed: false, reason: "Only an Owner can change another Owner." };
  }
  return { allowed: true, reason: null };
}

export function usePermission(key: PermissionKey, target?: PermissionTarget) {
  const { currentRole, currentMemberId } = useRbac();
  return checkPermission(currentRole, currentMemberId, key, target);
}
