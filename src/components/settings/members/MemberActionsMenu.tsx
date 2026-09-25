import { Button, Dropdown, Tooltip, type MenuProps } from "antd";
import { LuCheck, LuEllipsis, LuLogOut, LuUserCog, LuUserMinus, LuUserRound } from "react-icons/lu";
import { useRbac } from "../../../rbac/RbacContext";
import type { RoleId, WorkspaceMember } from "../../../types/rbac";
import { assignableRoles, type MemberAccess } from "./memberAccess";
import { FADE_IN_CLASS } from "./tableShell";

type MemberActionsMenuProps = {
  member: WorkspaceMember;
  access: MemberAccess;
  onView: () => void;
  onChangeRole: (roleId: RoleId) => void;
  onSignOut: () => void;
  onRemove: () => void;
};

function withReason(label: string, reason: string | null) {
  return reason ? (
    <Tooltip title={reason} placement="left">
      <span className="block">{label}</span>
    </Tooltip>
  ) : (
    label
  );
}

export function MemberActionsMenu({
  member,
  access,
  onView,
  onChangeRole,
  onSignOut,
  onRemove,
}: MemberActionsMenuProps) {
  const { roles, currentRole } = useRbac();
  const roleRule = access.check("members.updateRole", member);
  const signOutRule = access.check("security.manage", member);
  const removeRule = access.check("members.remove", member);

  const items: MenuProps["items"] = [
    { key: "view", icon: <LuUserRound />, label: "View details", onClick: onView },
    access.can("members.updateRole") && {
      key: "role",
      icon: <LuUserCog />,
      label: withReason("Change role", roleRule.reason),
      disabled: !roleRule.allowed,
      children: assignableRoles(roles, currentRole).map((role) => ({
        key: role.id,
        label: role.name,
        icon: <LuCheck className={role.id === member.roleId ? "" : "invisible"} />,
        onClick: () => role.id !== member.roleId && onChangeRole(role.id),
      })),
    },
    access.can("security.manage") && {
      key: "sign-out",
      icon: <LuLogOut />,
      label: withReason("Sign out of all sessions", signOutRule.reason),
      disabled: !signOutRule.allowed,
      onClick: onSignOut,
    },
    access.can("members.remove") && { type: "divider" as const },
    access.can("members.remove") && {
      key: "remove",
      icon: <LuUserMinus />,
      label: withReason("Remove from workspace", removeRule.reason),
      danger: removeRule.allowed,
      disabled: !removeRule.allowed,
      onClick: onRemove,
    },
  ].filter((item) => item !== false);

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        type="text"
        size="small"
        aria-label={`Actions for ${member.name}`}
        icon={<LuEllipsis />}
        className={`text-muted hover:text-ink ${FADE_IN_CLASS}`}
      />
    </Dropdown>
  );
}
