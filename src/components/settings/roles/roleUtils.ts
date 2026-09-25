import { platformMembers } from "../../../mocks/rbac";
import { BUILT_IN_ROLES, PERMISSIONS } from "../../../rbac/permissions";
import type { Grant, Permission, PermissionKey, Role, RoleId } from "../../../types/rbac";

export type BaseRoleId = Role["baseRoleId"];
export type Grants = Partial<Record<PermissionKey, Grant>>;

export const BASE_ROLE_OPTIONS: { value: BaseRoleId; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

const VIEWER_LOCKED_KEYS: PermissionKey[] = ["boards.edit", "boards.create", "folders.create"];

// Dummy custom role so the matrix shows the custom-role actions until roles come from the API.
export const DESIGN_REVIEWERS: Role = {
  id: "custom_reviewer",
  name: "Reviewer",
  description: "Reviews designs and leaves feedback. Can export for decks.",
  isBuiltIn: false,
  baseRoleId: "viewer",
  seat: "free",
  permissions: { "members.view": "all", "boards.export": "all", "boards.share": "all" },
};

const CUSTOM_MEMBER_COUNTS: Partial<Record<RoleId, number>> = { [DESIGN_REVIEWERS.id]: 2 };

export function memberCount(roleId: RoleId) {
  return CUSTOM_MEMBER_COUNTS[roleId] ?? platformMembers.filter((member) => member.roleId === roleId).length;
}

export function lockReason(permission: Permission, baseRoleId: BaseRoleId) {
  if (permission.isOwnerOnly) return "Only the Owner can do this.";
  if (baseRoleId === "viewer" && VIEWER_LOCKED_KEYS.includes(permission.key)) {
    return "Viewer-based roles use a free seat and can't edit.";
  }
  return null;
}

export function defaultGrants(baseRoleId: BaseRoleId): Grants {
  const base = BUILT_IN_ROLES.find((role) => role.id === baseRoleId)?.permissions ?? {};
  return Object.fromEntries(
    PERMISSIONS.filter((permission) => base[permission.key] && !lockReason(permission, baseRoleId)).map(
      (permission) => [permission.key, base[permission.key]],
    ),
  );
}
