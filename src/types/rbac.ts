export type BuiltInRoleId = "owner" | "admin" | "member" | "viewer" | "guest";
export type RoleId = BuiltInRoleId | `custom_${string}`;
export type ResourceRole = "viewer" | "editor";

export type PermissionCategory = "workspace" | "members" | "security" | "content" | "sharing";

export type PermissionKey =
  | "workspace.update"
  | "workspace.transfer"
  | "workspace.delete"
  | "billing.view"
  | "billing.manage"
  | "members.view"
  | "members.invite"
  | "members.remove"
  | "members.updateRole"
  | "roles.manage"
  | "security.manage"
  | "auditLog.view"
  | "folders.create"
  | "folders.delete"
  | "boards.create"
  | "boards.edit"
  | "boards.delete"
  | "boards.export"
  | "templates.manage"
  | "boards.share"
  | "publicLinks.create"
  | "guests.invite";

export type Permission = {
  key: PermissionKey;
  category: PermissionCategory;
  label: string;
  description: string;
  isOwnerOnly?: boolean;
  isScopable?: boolean;
};

// "own" = only resources the user created.
export type Grant = "all" | "own";

export type Role = {
  id: RoleId;
  name: string;
  description: string;
  isBuiltIn: boolean;
  baseRoleId: Exclude<BuiltInRoleId, "owner" | "guest">;
  seat: "paid" | "free";
  permissions: Partial<Record<PermissionKey, Grant>>;
};

export type AuthMethod = "password" | "google" | "github";

export type WorkspaceMember = {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  email: string;
  initials: string;
  color: { bg: string; fg: string; ring: string };
  roleId: RoleId;
  mfaEnabled: boolean;
  authMethods: AuthMethod[];
  joinedAt: string;
  lastActiveAt: string;
  invitedById?: string;
};

export type Invite = {
  id: string;
  workspaceId: string;
  email: string;
  roleId: RoleId;
  invitedById: string;
  sentAt: string;
  expiresAt: string;
  status: "pending" | "expired";
};

export type Session = {
  id: string;
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile";
  ip: string;
  location: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
};

export type AuditAction =
  | "member.invited"
  | "member.joined"
  | "member.removed"
  | "member.role_updated"
  | "invite.revoked"
  | "invite.expired"
  | "role.created"
  | "role.updated"
  | "security.policy_updated"
  | "security.sessions_revoked"
  | "share.created"
  | "public_link.created"
  | "board.deleted"
  | "workspace.updated"
  | "ownership.transferred";

export type AuditEvent = {
  id: string;
  workspaceId: string;
  actor: { type: "user"; memberId: string } | { type: "system" };
  action: AuditAction;
  target: {
    type: "member" | "invite" | "role" | "board" | "folder" | "workspace" | "policy";
    id: string;
    name: string;
  };
  changes?: { field: string; from: string; to: string }[];
  ip: string;
  userAgent: string;
  location: string;
  createdAt: string;
};

export type Membership = {
  userId: string;
  workspaceId: string;
  roleId: RoleId;
};
