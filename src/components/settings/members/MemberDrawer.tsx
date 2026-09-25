import { Avatar, Button, Descriptions, Drawer, Tag, Tooltip } from "antd";
import type { ReactNode } from "react";
import { LuArrowRight, LuLogOut, LuShieldCheck, LuUserMinus } from "react-icons/lu";
import { Link } from "react-router";
import { formatDate, formatDateTime, formatRelative } from "../../../lib/format";
import { CURRENT_USER_ID } from "../../../mocks/rbac";
import { findRole } from "../../../rbac/permissions";
import { useRbac, type PermissionResult } from "../../../rbac/RbacContext";
import type { AuthMethod, RoleId, WorkspaceMember } from "../../../types/rbac";
import { useWorkspace } from "../../../workspace/WorkspaceContext";
import type { MemberAccess } from "./memberAccess";
import { describeEvent, recentActivity, sharedWorkspaces } from "./memberActivity";
import { RoleSelect } from "./RoleSelect";

const AUTH_LABELS: Record<AuthMethod, string> = { password: "Password", google: "Google", github: "GitHub" };
const roleTagClass = "m-0 border-0 bg-hover text-2xs font-medium text-ink";

type MemberDrawerProps = {
  member: WorkspaceMember | null;
  members: WorkspaceMember[];
  access: MemberAccess;
  onClose: () => void;
  onChangeRole: (member: WorkspaceMember, roleId: RoleId) => void;
  onSignOut: (member: WorkspaceMember) => void;
  onRemove: (member: WorkspaceMember) => void;
};

function DrawerSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-line-soft px-6 py-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-2xs font-medium text-muted">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

// Visible to the role but blocked here: show it disabled, with the reason on hover.
function Guarded({ rule, children }: { rule: PermissionResult; children: (disabled: boolean) => ReactNode }) {
  if (rule.allowed) return children(false);
  return (
    <Tooltip title={rule.reason}>
      <span className="inline-flex">{children(true)}</span>
    </Tooltip>
  );
}

export function MemberDrawer({
  member,
  members,
  access,
  onClose,
  onChangeRole,
  onSignOut,
  onRemove,
}: MemberDrawerProps) {
  return (
    <Drawer
      open={member !== null}
      onClose={onClose}
      size="26rem"
      title="Member details"
      styles={{ body: { padding: 0 } }}
      footer={
        member && (
          <DrawerFooter
            member={member}
            access={access}
            onChangeRole={onChangeRole}
            onSignOut={onSignOut}
            onRemove={onRemove}
          />
        )
      }
    >
      {member && <MemberDetails member={member} members={members} access={access} />}
    </Drawer>
  );
}

function MemberDetails({
  member,
  members,
  access,
}: {
  member: WorkspaceMember;
  members: WorkspaceMember[];
  access: MemberAccess;
}) {
  const { roles } = useRbac();
  const { workspaces } = useWorkspace();
  const inviter = members.find((item) => item.id === member.invitedById);
  const otherWorkspaces = access.can("members.updateRole") ? sharedWorkspaces(member, CURRENT_USER_ID) : [];
  const activity = recentActivity(member);

  return (
    <>
      <div className="flex items-center gap-4 px-6 py-6">
        <Avatar
          style={{
            width: "3rem",
            height: "3rem",
            backgroundColor: member.color.bg,
            color: member.color.fg,
            fontWeight: 600,
          }}
        >
          {member.initials}
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-md font-semibold">{member.name}</span>
            <Tag className={roleTagClass}>{findRole(roles, member.roleId).name}</Tag>
          </div>
          <div className="truncate text-ui text-muted">{member.email}</div>
        </div>
      </div>

      <div className="px-6 pb-5">
        <Descriptions
          column={1}
          size="small"
          colon={false}
          classNames={{ label: "w-28 text-ui! text-muted!", content: "text-ui! text-ink! tabular-nums" }}
          items={[
            { key: "joined", label: "Joined", children: formatDate(member.joinedAt) },
            { key: "invitedBy", label: "Invited by", children: inviter?.name ?? "Created the workspace" },
            {
              key: "lastActive",
              label: "Last active",
              children: <span title={formatDateTime(member.lastActiveAt)}>{formatRelative(member.lastActiveAt)}</span>,
            },
            {
              key: "mfa",
              label: "2FA",
              children: member.mfaEnabled ? (
                <span className="flex items-center gap-1.5">
                  <LuShieldCheck className="size-3.5 text-success" />
                  On
                </span>
              ) : (
                <span className="text-muted">Off</span>
              ),
            },
            {
              key: "signIn",
              label: "Sign-in",
              children: member.authMethods.map((method) => AUTH_LABELS[method]).join(", "),
            },
          ]}
        />
      </div>

      {otherWorkspaces.length > 0 && (
        <DrawerSection title="Also a member of">
          <ul className="flex flex-col gap-2.5">
            {otherWorkspaces.map((membership) => {
              const workspace = workspaces.find((item) => item.id === membership.workspaceId);
              if (!workspace) return null;
              return (
                <li key={workspace.id} className="flex items-center gap-2.5 text-ui">
                  <span
                    className={`flex size-6 items-center justify-center rounded-md text-3xs font-semibold text-white ${workspace.tileClass}`}
                  >
                    {workspace.initials}
                  </span>
                  <span className="flex-1 truncate">{workspace.name}</span>
                  <Tag className={roleTagClass}>{findRole(roles, membership.roleId).name}</Tag>
                </li>
              );
            })}
          </ul>
        </DrawerSection>
      )}

      <DrawerSection
        title="Recent activity"
        action={
          access.can("auditLog.view") && (
            <Link
              to={`/app/settings/workspace/audit-log?actor=${member.id}`}
              className="flex items-center gap-1 text-2xs font-medium text-muted hover:text-ink"
            >
              View in audit log
              <LuArrowRight className="size-3" />
            </Link>
          )
        }
      >
        {activity.length === 0 ? (
          <p className="text-ui text-muted">No activity in the last 90 days.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {activity.map((event) => (
              <li key={event.id} className="flex gap-3 text-ui">
                <span className="mt-1.75 size-1.5 shrink-0 rounded-full bg-line-strong" />
                <div className="min-w-0">
                  <div>{describeEvent(event, members, access.currentMemberId)}</div>
                  <div className="text-2xs text-muted tabular-nums">{formatDateTime(event.createdAt)}</div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </DrawerSection>
    </>
  );
}

type DrawerFooterProps = Pick<MemberDrawerProps, "access" | "onChangeRole" | "onSignOut" | "onRemove"> & {
  member: WorkspaceMember;
};

function DrawerFooter({ member, access, onChangeRole, onSignOut, onRemove }: DrawerFooterProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      {access.can("members.updateRole") && (
        <RoleSelect
          variant="outlined"
          value={member.roleId}
          disabledReason={access.check("members.updateRole", member).reason}
          onChange={(roleId) => onChangeRole(member, roleId)}
          className="w-32"
        />
      )}
      <span className="flex-1" />
      {access.can("security.manage") && (
        <Guarded rule={access.check("security.manage", member)}>
          {(disabled) => (
            <Button icon={<LuLogOut />} disabled={disabled} onClick={() => onSignOut(member)}>
              Sign out
            </Button>
          )}
        </Guarded>
      )}
      {access.can("members.remove") && (
        <Guarded rule={access.check("members.remove", member)}>
          {(disabled) => (
            <Button danger icon={<LuUserMinus />} disabled={disabled} onClick={() => onRemove(member)}>
              Remove
            </Button>
          )}
        </Guarded>
      )}
    </div>
  );
}
