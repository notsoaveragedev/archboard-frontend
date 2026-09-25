import type { BuiltInRoleId, Grant, Permission, PermissionCategory, PermissionKey, Role, RoleId } from "../types/rbac";

export const PERMISSION_CATEGORIES: { key: PermissionCategory; label: string }[] = [
  { key: "workspace", label: "Workspace" },
  { key: "members", label: "Members" },
  { key: "security", label: "Security" },
  { key: "content", label: "Content" },
  { key: "sharing", label: "Sharing" },
];

export const PERMISSIONS: Permission[] = [
  { key: "workspace.update", category: "workspace", label: "Edit workspace", description: "Name, URL and icon" },
  { key: "workspace.transfer", category: "workspace", label: "Transfer ownership", description: "Hand the workspace to another member", isOwnerOnly: true },
  { key: "workspace.delete", category: "workspace", label: "Delete workspace", description: "Permanently delete everything", isOwnerOnly: true },
  { key: "billing.view", category: "workspace", label: "View billing", description: "Plan, seats and invoices" },
  { key: "billing.manage", category: "workspace", label: "Manage billing", description: "Change plan, seats and payment", isOwnerOnly: true },
  { key: "members.view", category: "members", label: "View members", description: "See the member directory" },
  { key: "members.invite", category: "members", label: "Invite people", description: "Send invitations to join" },
  { key: "members.remove", category: "members", label: "Remove members", description: "Remove members and revoke invites" },
  { key: "members.updateRole", category: "members", label: "Change roles", description: "Change other members' roles" },
  { key: "roles.manage", category: "members", label: "Manage roles", description: "Create and edit custom roles" },
  { key: "security.manage", category: "security", label: "Manage security", description: "Policies and signing members out" },
  { key: "auditLog.view", category: "security", label: "View audit log", description: "See and export admin activity" },
  { key: "folders.create", category: "content", label: "Create folders", description: "Add folders anywhere", isScopable: true },
  { key: "folders.delete", category: "content", label: "Delete folders", description: "Move folders to Trash", isScopable: true },
  { key: "boards.create", category: "content", label: "Create boards", description: "Add new boards", isScopable: true },
  { key: "boards.edit", category: "content", label: "Edit boards", description: "Change board content" },
  { key: "boards.delete", category: "content", label: "Delete boards", description: "Move boards to Trash", isScopable: true },
  { key: "boards.export", category: "content", label: "Export boards", description: "PNG, SVG and PDF" },
  { key: "templates.manage", category: "content", label: "Manage templates", description: "Publish workspace templates" },
  { key: "boards.share", category: "sharing", label: "Share", description: "Share folders and boards, approve requests" },
  { key: "publicLinks.create", category: "sharing", label: "Create public links", description: "Links anyone can open" },
  { key: "guests.invite", category: "sharing", label: "Invite guests", description: "Share with people outside the workspace" },
];

const everything = (): Partial<Record<PermissionKey, Grant>> =>
  Object.fromEntries(PERMISSIONS.map((permission) => [permission.key, "all"]));

const without = (grants: Partial<Record<PermissionKey, Grant>>, keys: PermissionKey[]) =>
  Object.fromEntries(Object.entries(grants).filter(([key]) => !keys.includes(key as PermissionKey)));

const ownerOnlyKeys = PERMISSIONS.filter((permission) => permission.isOwnerOnly).map((permission) => permission.key);
const adminOnlyKeys: PermissionKey[] = [
  "workspace.update",
  "billing.view",
  "members.remove",
  "members.updateRole",
  "roles.manage",
  "security.manage",
  "auditLog.view",
  "templates.manage",
];

export const BUILT_IN_ROLES: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full control, including billing, ownership and deletion.",
    isBuiltIn: true,
    baseRoleId: "admin",
    seat: "paid",
    permissions: everything(),
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manages members, roles, security and all content.",
    isBuiltIn: true,
    baseRoleId: "admin",
    seat: "paid",
    permissions: without(everything(), ownerOnlyKeys),
  },
  {
    id: "member",
    name: "Member",
    description: "Creates, edits and shares boards and folders.",
    isBuiltIn: true,
    baseRoleId: "member",
    seat: "paid",
    permissions: {
      ...without(everything(), [...ownerOnlyKeys, ...adminOnlyKeys]),
      "folders.delete": "own",
      "boards.delete": "own",
    },
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Views everything in the workspace. Can't edit.",
    isBuiltIn: true,
    baseRoleId: "viewer",
    seat: "free",
    permissions: { "members.view": "all", "boards.export": "all" },
  },
  {
    id: "guest",
    name: "Guest",
    description: "Sees only what's shared with them directly.",
    isBuiltIn: true,
    baseRoleId: "viewer",
    seat: "free",
    permissions: { "folders.create": "own", "boards.create": "own", "boards.edit": "all" },
  },
];

export const ROLE_ORDER: BuiltInRoleId[] = ["owner", "admin", "member", "viewer", "guest"];

export function findRole(roles: Role[], roleId: RoleId) {
  return roles.find((role) => role.id === roleId) ?? BUILT_IN_ROLES[3];
}

// Pure check against a role's grants. "own" grants pass only for resources the user created.
export function hasPermission(role: Role, key: PermissionKey, isOwnResource = false) {
  const grant = role.permissions[key];
  if (!grant) return false;
  return grant === "all" || isOwnResource;
}
