import type { AuditEvent } from "../types/rbac";
import { auditEvents } from "./rbac";

const priya = { ip: "103.21.58.12", userAgent: "Chrome 129 on macOS", location: "Bengaluru, India" };
const rahul = { ip: "182.74.20.9", userAgent: "Firefox 131 on Windows", location: "Mumbai, India" };
const ana = { ip: "49.36.201.18", userAgent: "Chrome 129 on macOS", location: "Hyderabad, India" };
const wei = { ip: "34.93.10.77", userAgent: "Chrome 128 on Linux", location: "Pune, India" };
const system = { ip: "—", userAgent: "—", location: "—" };

const user = (memberId: string) => ({ type: "user" as const, memberId });

const moreEvents: AuditEvent[] = [
  { id: "ae30", workspaceId: "platform", actor: user("m2"), action: "security.sessions_revoked", target: { type: "member", id: "m6", name: "Sofia Rossi" }, changes: [{ field: "Active sessions", from: "3", to: "0" }], ...rahul, createdAt: "2026-09-26T09:14:00Z" },
  { id: "ae29", workspaceId: "platform", actor: user("m5"), action: "share.created", target: { type: "board", id: "7", name: "Rate limiter design" }, changes: [{ field: "Ana López", from: "No access", to: "Viewer" }], ...wei, createdAt: "2026-09-26T07:52:00Z" },
  { id: "ae28", workspaceId: "platform", actor: user("m1"), action: "role.created", target: { type: "role", id: "custom_reviewer", name: "Reviewer" }, changes: [{ field: "Based on", from: "—", to: "Viewer" }], ...priya, createdAt: "2026-09-25T16:30:00Z" },
  { id: "ae27", workspaceId: "platform", actor: user("m1"), action: "role.updated", target: { type: "role", id: "custom_reviewer", name: "Reviewer" }, changes: [{ field: "Export boards", from: "Not allowed", to: "Allowed" }], ...priya, createdAt: "2026-09-25T16:42:00Z" },
  { id: "ae26", workspaceId: "platform", actor: user("m3"), action: "public_link.created", target: { type: "board", id: "2", name: "Payments flow v3" }, changes: [{ field: "Link access", from: "Off", to: "Can view" }, { field: "Expires", from: "—", to: "Oct 25, 2026" }], ...ana, createdAt: "2026-09-25T11:05:00Z" },
  { id: "ae25", workspaceId: "platform", actor: user("m2"), action: "member.invited", target: { type: "invite", id: "i3", name: "lena@platform.dev" }, changes: [{ field: "Role", from: "—", to: "Viewer" }], ...rahul, createdAt: "2026-09-24T15:20:00Z" },
  { id: "ae24", workspaceId: "platform", actor: user("m2"), action: "invite.revoked", target: { type: "invite", id: "i3", name: "lena@platform.dev" }, changes: [{ field: "Status", from: "Pending", to: "Revoked" }], ...rahul, createdAt: "2026-09-24T15:48:00Z" },
  { id: "ae23", workspaceId: "platform", actor: user("m5"), action: "board.deleted", target: { type: "board", id: "19", name: "Q3 retro" }, ...wei, createdAt: "2026-09-23T18:02:00Z" },
  { id: "ae22", workspaceId: "platform", actor: user("m1"), action: "workspace.updated", target: { type: "workspace", id: "platform", name: "Platform Team" }, changes: [{ field: "URL", from: "platform-eng", to: "platform-team" }], ...priya, createdAt: "2026-09-22T08:31:00Z" },
  { id: "ae21", workspaceId: "platform", actor: user("m3"), action: "share.created", target: { type: "folder", id: "infra", name: "Infrastructure" }, changes: [{ field: "Wei Chen", from: "Viewer", to: "Editor" }], ...ana, createdAt: "2026-09-21T13:40:00Z" },
  { id: "ae20", workspaceId: "platform", actor: user("m2"), action: "security.policy_updated", target: { type: "policy", id: "security", name: "Workspace security" }, changes: [{ field: "Allowed domains", from: "—", to: "@platform.dev" }, { field: "Auto-join", from: "Off", to: "Member" }], ...rahul, createdAt: "2026-09-20T10:15:00Z" },
  { id: "ae19", workspaceId: "platform", actor: user("m1"), action: "member.removed", target: { type: "member", id: "m8", name: "Tom Becker" }, changes: [{ field: "Boards transferred", from: "Tom Becker", to: "Priya Sharma" }], ...priya, createdAt: "2026-09-18T12:26:00Z" },
  { id: "ae18", workspaceId: "platform", actor: { type: "system" }, action: "security.sessions_revoked", target: { type: "member", id: "m8", name: "Tom Becker" }, changes: [{ field: "Active sessions", from: "2", to: "0" }], ...system, createdAt: "2026-09-18T12:26:30Z" },
  { id: "ae17", workspaceId: "platform", actor: user("m2"), action: "member.role_updated", target: { type: "member", id: "m5", name: "Wei Chen" }, changes: [{ field: "Role", from: "Viewer", to: "Member" }], ...rahul, createdAt: "2026-09-12T09:47:00Z" },
  { id: "ae16", workspaceId: "platform", actor: user("m2"), action: "member.invited", target: { type: "invite", id: "i2", name: "jordan@platform.dev" }, changes: [{ field: "Role", from: "—", to: "Viewer" }], ...rahul, createdAt: "2026-09-12T13:20:00Z" },
  { id: "ae15", workspaceId: "platform", actor: user("m3"), action: "member.joined", target: { type: "member", id: "m7", name: "Daniel Okafor" }, changes: [{ field: "Role", from: "—", to: "Guest" }], ...ana, createdAt: "2026-09-01T10:00:00Z" },
  { id: "ae14", workspaceId: "platform", actor: user("m1"), action: "public_link.created", target: { type: "board", id: "1", name: "System overview" }, changes: [{ field: "Link access", from: "Off", to: "Can view" }], ...priya, createdAt: "2026-08-27T17:12:00Z" },
  { id: "ae13", workspaceId: "platform", actor: user("m1"), action: "security.policy_updated", target: { type: "policy", id: "security", name: "Workspace security" }, changes: [{ field: "Sign-in methods", from: "Email, Google", to: "Email, Google, GitHub" }], ...priya, createdAt: "2026-08-19T07:58:00Z" },
  { id: "ae12", workspaceId: "platform", actor: user("m3"), action: "board.deleted", target: { type: "board", id: "11", name: "Kafka sketch" }, ...ana, createdAt: "2026-08-08T14:33:00Z" },
  { id: "ae11", workspaceId: "platform", actor: user("m1"), action: "member.role_updated", target: { type: "member", id: "m2", name: "Rahul Kumar" }, changes: [{ field: "Role", from: "Member", to: "Admin" }], ...priya, createdAt: "2026-07-30T11:10:00Z" },
  { id: "ae10", workspaceId: "platform", actor: user("m2"), action: "member.joined", target: { type: "member", id: "m6", name: "Sofia Rossi" }, changes: [{ field: "Role", from: "—", to: "Viewer" }], ...rahul, createdAt: "2026-07-18T15:05:00Z" },
  { id: "ae9", workspaceId: "platform", actor: user("m1"), action: "workspace.updated", target: { type: "workspace", id: "platform", name: "Platform Team" }, changes: [{ field: "Icon", from: "PE", to: "PT" }], ...priya, createdAt: "2026-07-04T06:20:00Z" },
];

export const workspaceAuditLog: AuditEvent[] = [...auditEvents, ...moreEvents].sort((a, b) =>
  b.createdAt.localeCompare(a.createdAt),
);
