import { auditEvents, memberships } from "../../../mocks/rbac";
import type { AuditAction, AuditEvent, WorkspaceMember } from "../../../types/rbac";

const VERBS: Record<AuditAction, string> = {
  "member.invited": "invited",
  "member.joined": "added",
  "member.removed": "removed",
  "member.role_updated": "changed the role of",
  "invite.revoked": "revoked the invite for",
  "invite.expired": "expired the invite for",
  "role.created": "created the role",
  "role.updated": "updated the role",
  "security.policy_updated": "updated",
  "security.sessions_revoked": "signed out",
  "share.created": "shared",
  "public_link.created": "created a public link to",
  "board.deleted": "deleted",
  "workspace.updated": "updated",
  "ownership.transferred": "transferred ownership to",
};

export function recentActivity(member: WorkspaceMember, limit = 5) {
  return auditEvents
    .filter(
      (event) => (event.actor.type === "user" && event.actor.memberId === member.id) || event.target.id === member.id,
    )
    .slice(0, limit);
}

function actorName(event: AuditEvent, members: WorkspaceMember[], currentMemberId: string) {
  if (event.actor.type === "system") return "archboard";
  const { memberId } = event.actor;
  if (memberId === currentMemberId) return "You";
  return members.find((member) => member.id === memberId)?.name ?? "Former member";
}

export function describeEvent(event: AuditEvent, members: WorkspaceMember[], currentMemberId: string) {
  return `${actorName(event, members, currentMemberId)} ${VERBS[event.action]} ${event.target.name}`;
}

// Only workspaces where the viewer is also an Owner or Admin; other memberships stay private.
export function sharedWorkspaces(member: WorkspaceMember, viewerUserId: string) {
  const managed = memberships
    .filter((item) => item.userId === viewerUserId && (item.roleId === "owner" || item.roleId === "admin"))
    .map((item) => item.workspaceId);
  return memberships.filter(
    (item) =>
      item.userId === member.userId && item.workspaceId !== member.workspaceId && managed.includes(item.workspaceId),
  );
}
