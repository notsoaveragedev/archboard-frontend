import type { Invite, WorkspaceMember } from "../../../types/rbac";

export type MemberFilters = { query: string; roleId: string; mfa: "any" | "on" | "off" };

export const EMPTY_FILTERS: MemberFilters = { query: "", roleId: "all", mfa: "any" };

export function isFiltered(filters: MemberFilters) {
  return filters.query.trim() !== "" || filters.roleId !== "all" || filters.mfa !== "any";
}

export function filterMembers(members: WorkspaceMember[], { query, roleId, mfa }: MemberFilters) {
  const needle = query.trim().toLowerCase();
  return members.filter(
    (member) =>
      (member.name.toLowerCase().includes(needle) || member.email.includes(needle)) &&
      (roleId === "all" || member.roleId === roleId) &&
      (mfa === "any" || member.mfaEnabled === (mfa === "on")),
  );
}

export function filterInvites(invites: Invite[], { query, roleId }: MemberFilters) {
  const needle = query.trim().toLowerCase();
  return invites.filter((invite) => invite.email.includes(needle) && (roleId === "all" || invite.roleId === roleId));
}
