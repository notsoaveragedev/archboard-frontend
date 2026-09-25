import dayjs, { type Dayjs } from "dayjs";
import type { IconType } from "react-icons";
import { LuBuilding2, LuFolder, LuKeyRound, LuMail, LuShield, LuSquareKanban, LuUser } from "react-icons/lu";
import type { AuditAction, AuditEvent } from "../../../types/rbac";

export type EventType = "members" | "roles" | "security" | "sharing" | "boards" | "workspace";

export type AuditFilters = {
  range: [Dayjs, Dayjs];
  actor?: string;
  type?: EventType;
  query: string;
};

export const lastDays = (days: number): [Dayjs, Dayjs] => [
  dayjs().subtract(days - 1, "day").startOf("day"),
  dayjs().endOf("day"),
];

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "members", label: "Members" },
  { value: "roles", label: "Roles" },
  { value: "security", label: "Security" },
  { value: "sharing", label: "Sharing" },
  { value: "boards", label: "Boards" },
  { value: "workspace", label: "Workspace" },
];

export const ACTIONS: Record<AuditAction, { label: string; type: EventType }> = {
  "member.invited": { label: "Invited a member", type: "members" },
  "member.joined": { label: "Joined the workspace", type: "members" },
  "member.removed": { label: "Removed a member", type: "members" },
  "member.role_updated": { label: "Changed member role", type: "members" },
  "invite.revoked": { label: "Revoked an invite", type: "members" },
  "invite.expired": { label: "Invite expired", type: "members" },
  "role.created": { label: "Created a custom role", type: "roles" },
  "role.updated": { label: "Updated a custom role", type: "roles" },
  "security.policy_updated": { label: "Updated security policy", type: "security" },
  "security.sessions_revoked": { label: "Signed out sessions", type: "security" },
  "share.created": { label: "Shared with a person", type: "sharing" },
  "public_link.created": { label: "Created a public link", type: "sharing" },
  "board.deleted": { label: "Moved a board to Trash", type: "boards" },
  "workspace.updated": { label: "Updated workspace settings", type: "workspace" },
  "ownership.transferred": { label: "Transferred ownership", type: "workspace" },
};

export const TARGET_ICONS: Record<AuditEvent["target"]["type"], IconType> = {
  member: LuUser,
  invite: LuMail,
  role: LuKeyRound,
  board: LuSquareKanban,
  folder: LuFolder,
  workspace: LuBuilding2,
  policy: LuShield,
};
