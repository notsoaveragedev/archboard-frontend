import type { AuditEvent, Invite, Membership, Session, WorkspaceMember } from "../types/rbac";

// Temporary data for UI work. Today is 2026-09-26; the current user is m1 (Priya, Owner of Platform Team).

export const CURRENT_MEMBER_ID = "m1";
export const CURRENT_USER_ID = "u1";

export const platformMembers: WorkspaceMember[] = [
  { id: "m1", userId: "u1", workspaceId: "platform", name: "Priya Sharma", email: "priya@platform.dev", initials: "PS", color: { bg: "#F3ECFA", fg: "#5E2E8C", ring: "#8E4EC6" }, roleId: "owner", mfaEnabled: true, authMethods: ["password", "google"], joinedAt: "2025-11-03T09:12:00Z", lastActiveAt: "2026-09-26T10:41:00Z" },
  { id: "m2", userId: "u2", workspaceId: "platform", name: "Rahul Kumar", email: "rahul@platform.dev", initials: "RK", color: { bg: "#FEEFE5", fg: "#9A3C06", ring: "#F76B15" }, roleId: "admin", mfaEnabled: true, authMethods: ["github"], joinedAt: "2025-11-10T14:30:00Z", lastActiveAt: "2026-09-26T08:05:00Z", invitedById: "m1" },
  { id: "m3", userId: "u3", workspaceId: "platform", name: "Ana López", email: "ana@platform.dev", initials: "AL", color: { bg: "#E4F6F3", fg: "#0B6B60", ring: "#12A594" }, roleId: "member", mfaEnabled: false, authMethods: ["password"], joinedAt: "2026-01-22T11:00:00Z", lastActiveAt: "2026-09-25T17:20:00Z", invitedById: "m1" },
  { id: "m5", userId: "u5", workspaceId: "platform", name: "Wei Chen", email: "wei@platform.dev", initials: "WC", color: { bg: "#E6F4FE", fg: "#0D4F80", ring: "#0090FF" }, roleId: "member", mfaEnabled: true, authMethods: ["google"], joinedAt: "2026-03-04T08:45:00Z", lastActiveAt: "2026-09-24T12:10:00Z", invitedById: "m2" },
  { id: "m6", userId: "u6", workspaceId: "platform", name: "Sofia Rossi", email: "sofia@platform.dev", initials: "SR", color: { bg: "#FDEBEC", fg: "#8C1D22", ring: "#E5484D" }, roleId: "viewer", mfaEnabled: false, authMethods: ["password"], joinedAt: "2026-06-18T15:05:00Z", lastActiveAt: "2026-09-19T09:30:00Z", invitedById: "m2" },
  { id: "m7", userId: "u7", workspaceId: "platform", name: "Daniel Okafor", email: "dan.okafor@gmail.com", initials: "DO", color: { bg: "#FFF6E5", fg: "#7A4A00", ring: "#F5A524" }, roleId: "guest", mfaEnabled: false, authMethods: ["google"], joinedAt: "2026-09-01T10:00:00Z", lastActiveAt: "2026-09-22T16:45:00Z", invitedById: "m3" },
];

export const platformInvites: Invite[] = [
  { id: "i1", workspaceId: "platform", email: "marcus@platform.dev", roleId: "member", invitedById: "m1", sentAt: "2026-09-24T09:00:00Z", expiresAt: "2026-10-01T09:00:00Z", status: "pending" },
  { id: "i2", workspaceId: "platform", email: "jordan@platform.dev", roleId: "viewer", invitedById: "m2", sentAt: "2026-09-12T13:20:00Z", expiresAt: "2026-09-19T13:20:00Z", status: "expired" },
];

export const memberships: Membership[] = [
  { userId: "u1", workspaceId: "platform", roleId: "owner" },
  { userId: "u1", workspaceId: "design", roleId: "admin" },
  { userId: "u1", workspaceId: "personal", roleId: "owner" },
  { userId: "u2", workspaceId: "platform", roleId: "admin" },
  { userId: "u2", workspaceId: "design", roleId: "member" },
  { userId: "u3", workspaceId: "platform", roleId: "member" },
  { userId: "u3", workspaceId: "design", roleId: "viewer" },
];

export const sessions: Session[] = [
  { id: "s1", browser: "Chrome 129", os: "macOS", deviceType: "desktop", ip: "103.21.58.12", location: "Bengaluru, India", createdAt: "2026-09-20T08:00:00Z", lastActiveAt: "2026-09-26T10:41:00Z", isCurrent: true },
  { id: "s2", browser: "Safari", os: "iOS 19", deviceType: "mobile", ip: "49.37.112.4", location: "Bengaluru, India", createdAt: "2026-09-02T19:10:00Z", lastActiveAt: "2026-09-25T21:14:00Z", isCurrent: false },
  { id: "s3", browser: "Firefox 131", os: "Windows", deviceType: "desktop", ip: "182.74.20.9", location: "Mumbai, India", createdAt: "2026-08-28T06:30:00Z", lastActiveAt: "2026-09-18T11:02:00Z", isCurrent: false },
  { id: "s4", browser: "Chrome 128", os: "Linux", deviceType: "desktop", ip: "34.93.10.77", location: "Pune, India", createdAt: "2026-08-11T12:00:00Z", lastActiveAt: "2026-09-09T15:40:00Z", isCurrent: false },
];

export const auditEvents: AuditEvent[] = [
  { id: "ae8", workspaceId: "platform", actor: { type: "user", memberId: "m1" }, action: "member.role_updated", target: { type: "member", id: "m6", name: "Sofia Rossi" }, changes: [{ field: "Role", from: "Member", to: "Viewer" }], ip: "103.21.58.12", userAgent: "Chrome 129 on macOS", location: "Bengaluru, India", createdAt: "2026-09-26T10:38:00Z" },
  { id: "ae7", workspaceId: "platform", actor: { type: "user", memberId: "m1" }, action: "member.invited", target: { type: "invite", id: "i1", name: "marcus@platform.dev" }, changes: [{ field: "Role", from: "—", to: "Member" }], ip: "103.21.58.12", userAgent: "Chrome 129 on macOS", location: "Bengaluru, India", createdAt: "2026-09-24T09:00:00Z" },
  { id: "ae6", workspaceId: "platform", actor: { type: "user", memberId: "m2" }, action: "security.policy_updated", target: { type: "policy", id: "security", name: "Workspace security" }, changes: [{ field: "Session length", from: "30 days", to: "14 days" }], ip: "182.74.20.9", userAgent: "Firefox 131 on Windows", location: "Mumbai, India", createdAt: "2026-09-23T14:12:00Z" },
  { id: "ae5", workspaceId: "platform", actor: { type: "user", memberId: "m3" }, action: "public_link.created", target: { type: "board", id: "4", name: "Chat service" }, changes: [{ field: "Link access", from: "Off", to: "Can view" }], ip: "49.36.201.18", userAgent: "Chrome 129 on macOS", location: "Hyderabad, India", createdAt: "2026-09-22T11:47:00Z" },
  { id: "ae3", workspaceId: "platform", actor: { type: "system" }, action: "invite.expired", target: { type: "invite", id: "i2", name: "jordan@platform.dev" }, changes: [{ field: "Status", from: "Pending", to: "Expired" }], ip: "—", userAgent: "—", location: "—", createdAt: "2026-09-19T13:20:00Z" },
  { id: "ae2", workspaceId: "platform", actor: { type: "user", memberId: "m1" }, action: "board.deleted", target: { type: "board", id: "13", name: "Old infra map" }, ip: "103.21.58.12", userAgent: "Chrome 129 on macOS", location: "Bengaluru, India", createdAt: "2026-09-15T16:25:00Z" },
  { id: "ae4", workspaceId: "platform", actor: { type: "user", memberId: "m3" }, action: "share.created", target: { type: "folder", id: "pay", name: "Payments" }, changes: [{ field: "Daniel Okafor", from: "No access", to: "Editor" }], ip: "49.36.201.18", userAgent: "Chrome 129 on macOS", location: "Hyderabad, India", createdAt: "2026-09-01T09:58:00Z" },
  { id: "ae1", workspaceId: "platform", actor: { type: "user", memberId: "m2" }, action: "member.joined", target: { type: "member", id: "m5", name: "Wei Chen" }, ip: "34.93.10.77", userAgent: "Chrome 128 on Linux", location: "Pune, India", createdAt: "2026-03-04T08:45:00Z" },
];
