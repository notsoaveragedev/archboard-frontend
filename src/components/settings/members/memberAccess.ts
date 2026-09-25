import { checkPermission, useRbac, type PermissionResult } from "../../../rbac/RbacContext";
import { hasPermission } from "../../../rbac/permissions";
import type { Invite, PermissionKey, Role, WorkspaceMember } from "../../../types/rbac";

export const PAID_SEATS = 10;

const LAST_OWNER_REASON = "A workspace needs at least one Owner. Transfer ownership first.";
const OWN_SESSIONS_REASON = "Sign yourself out from Security in your account settings.";

export const ROLE_SUMMARY: Record<string, string> = {
  owner: "They have full control, including billing.",
  admin: "They can manage members, roles and security.",
  member: "They can create, edit and share boards.",
  viewer: "They can view boards, but not edit.",
  guest: "They only see what's shared with them.",
};

export function withArticle(roleName: string) {
  return `${/^[AEIOU]/.test(roleName) ? "an" : "a"} ${roleName}`;
}

// Owners can hand out any role; Admins can't grant Owner.
export function assignableRoles(roles: Role[], currentRole: Role) {
  return roles.filter((role) => role.id !== "owner" || currentRole.id === "owner");
}

// Role grants plus the situational rules that only apply to members (last Owner, own sessions).
export function useMemberAccess(members: WorkspaceMember[]) {
  const { currentRole, currentMemberId } = useRbac();
  const ownerCount = members.filter((member) => member.roleId === "owner").length;

  function can(key: PermissionKey) {
    return hasPermission(currentRole, key);
  }

  function check(key: PermissionKey, member: WorkspaceMember): PermissionResult {
    const result = checkPermission(currentRole, currentMemberId, key, {
      memberId: member.id,
      memberRoleId: member.roleId,
    });
    if (!result.allowed) return result;
    if (key === "security.manage" && member.id === currentMemberId)
      return { allowed: false, reason: OWN_SESSIONS_REASON };
    if (key !== "security.manage" && member.roleId === "owner" && ownerCount === 1) {
      return { allowed: false, reason: LAST_OWNER_REASON };
    }
    return result;
  }

  return { can, check, currentMemberId };
}

export type MemberAccess = ReturnType<typeof useMemberAccess>;

// Invites offer Admin (only to Owners and Admins), Member and Viewer.
export function inviteRoles(roles: Role[], currentRole: Role) {
  const canGrantAdmin = currentRole.id === "owner" || currentRole.id === "admin";
  return roles.filter((role) => ["member", "viewer"].includes(role.id) || (role.id === "admin" && canGrantAdmin));
}

export function isInviteExpired(invite: Invite, now = Date.now()) {
  return invite.status === "expired" || new Date(invite.expiresAt).getTime() < now;
}
