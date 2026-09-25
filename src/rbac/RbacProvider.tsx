import { useState, type ReactNode } from "react";
import { CURRENT_MEMBER_ID, CURRENT_USER_ID, memberships } from "../mocks/rbac";
import type { Role, RoleId } from "../types/rbac";
import { useWorkspace } from "../workspace/WorkspaceContext";
import { BUILT_IN_ROLES, findRole } from "./permissions";
import { RbacContext } from "./RbacContext";

// In production the server returns the current user's role and permissions (GET /workspaces/:id/me);
// the client only uses them to shape the UI. Every endpoint still checks permissions itself.
export function RbacProvider({ children }: { children: ReactNode }) {
  const { currentWorkspace } = useWorkspace();
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  // Your own role changes in this session (e.g. after transferring ownership), keyed by workspace.
  const [ownRoleOverrides, setOwnRoleOverrides] = useState<Record<string, RoleId>>({});

  const roles = [...BUILT_IN_ROLES, ...customRoles];
  const membership = memberships.find(
    (item) => item.userId === CURRENT_USER_ID && item.workspaceId === currentWorkspace.id,
  );
  // Workspaces created in this session belong to the current user.
  const actualRoleId: RoleId = ownRoleOverrides[currentWorkspace.id] ?? membership?.roleId ?? "owner";
  const currentRole = findRole(roles, actualRoleId);

  function saveRole(role: Role) {
    setCustomRoles((current) =>
      current.some((item) => item.id === role.id)
        ? current.map((item) => (item.id === role.id ? role : item))
        : [...current, role],
    );
  }

  function deleteRole(roleId: RoleId) {
    setCustomRoles((current) => current.filter((role) => role.id !== roleId));
  }

  return (
    <RbacContext
      value={{
        roles,
        currentRole,
        actualRoleId,
        currentMemberId: CURRENT_MEMBER_ID,
        setOwnRole: (roleId) => setOwnRoleOverrides((current) => ({ ...current, [currentWorkspace.id]: roleId })),
        saveRole,
        deleteRole,
      }}
    >
      {children}
    </RbacContext>
  );
}
