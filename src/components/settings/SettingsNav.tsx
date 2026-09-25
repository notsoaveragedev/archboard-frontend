import { Menu, type MenuProps } from "antd";
import type { IconType } from "react-icons";
import {
  LuBell,
  LuCreditCard,
  LuDatabase,
  LuKeyRound,
  LuLock,
  LuScrollText,
  LuSettings,
  LuShield,
  LuSlidersHorizontal,
  LuUser,
  LuUsers,
} from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";
import { platformMembers } from "../../mocks/rbac";
import { checkPermission, useRbac } from "../../rbac/RbacContext";
import type { PermissionKey } from "../../types/rbac";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { WorkspaceSwitcher } from "../layout/WorkspaceSwitcher";

type NavItem = {
  path: string;
  label: string;
  icon: IconType;
  permission?: PermissionKey;
  // Pages that only make sense with other people in the workspace.
  isTeamOnly?: boolean;
};

const ACCOUNT_ITEMS: NavItem[] = [
  { path: "/app/settings/profile", label: "Profile", icon: LuUser },
  { path: "/app/settings/preferences", label: "Preferences", icon: LuSlidersHorizontal },
  { path: "/app/settings/notifications", label: "Notifications", icon: LuBell },
  { path: "/app/settings/security", label: "Security", icon: LuLock },
  { path: "/app/settings/account", label: "Account & data", icon: LuDatabase },
];

const WORKSPACE_ITEMS: NavItem[] = [
  { path: "/app/settings/workspace/general", label: "General", icon: LuSettings },
  { path: "/app/settings/workspace/members", label: "Members", icon: LuUsers, permission: "members.view", isTeamOnly: true },
  { path: "/app/settings/workspace/roles", label: "Roles & permissions", icon: LuKeyRound, permission: "roles.manage", isTeamOnly: true },
  { path: "/app/settings/workspace/security", label: "Security & access", icon: LuShield, permission: "security.manage", isTeamOnly: true },
  { path: "/app/settings/workspace/audit-log", label: "Audit log", icon: LuScrollText, permission: "auditLog.view", isTeamOnly: true },
  { path: "/app/settings/workspace/billing", label: "Plan & billing", icon: LuCreditCard, permission: "billing.view" },
];

const menuClass = "border-e-0 bg-transparent [&_.ant-menu-item-selected]:font-medium";

export function SettingsNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentRole, currentMemberId } = useRbac();
  const { currentWorkspace } = useWorkspace();

  const isPersonal = currentWorkspace.plan === "Personal";
  const isGuest = currentRole.id === "guest";
  const memberCount = currentWorkspace.id === "platform" ? platformMembers.length : currentWorkspace.memberCount;

  const toMenuItems = (items: NavItem[]): MenuProps["items"] =>
    items.map(({ path, label, icon: Icon }) => ({
      key: path,
      icon: <Icon />,
      label,
      extra: path.endsWith("/members") ? <span className="text-2xs text-muted tabular-nums">{memberCount}</span> : undefined,
    }));

  const workspaceItems = WORKSPACE_ITEMS.filter(
    (item) =>
      !(item.isTeamOnly && isPersonal) &&
      (!item.permission || checkPermission(currentRole, currentMemberId, item.permission).allowed),
  );

  return (
    <>
      <div className="px-2 pb-1 text-2xs font-medium text-muted">Account</div>
      <Menu
        mode="inline"
        inlineIndent={8}
        items={toMenuItems(ACCOUNT_ITEMS)}
        selectedKeys={[pathname]}
        onClick={({ key }) => navigate(key)}
        className={menuClass}
      />

      {!isGuest && (
        <>
          <div className="mt-5 mb-1">
            <WorkspaceSwitcher stayOnPage />
          </div>
          <Menu
            mode="inline"
            inlineIndent={8}
            items={toMenuItems(workspaceItems)}
            selectedKeys={[pathname]}
            onClick={({ key }) => navigate(key)}
            className={menuClass}
          />
        </>
      )}
    </>
  );
}
