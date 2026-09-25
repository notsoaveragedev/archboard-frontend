import { Button, Dropdown, Table, Tag, type MenuProps, type TableColumnsType } from "antd";
import { useState, type ReactNode } from "react";
import { LuEllipsis, LuLink, LuMail, LuRotateCw, LuX } from "react-icons/lu";
import { formatDateTime, formatRelative } from "../../../lib/format";
import { useRbac } from "../../../rbac/RbacContext";
import type { Invite, RoleId, WorkspaceMember } from "../../../types/rbac";
import { ActionBar } from "../../ui/ActionBar";
import { MemberAvatar } from "../../ui/MemberAvatar";
import { inviteRoles, isInviteExpired, type MemberAccess } from "./memberAccess";
import { RoleSelect } from "./RoleSelect";
import {
  FADE_IN_CLASS,
  TABLE_CLASS,
  TABLE_CLASS_NAMES,
  TABLE_WRAPPER_CLASS,
  selectionSummary,
  useEscapeToClear,
} from "./tableShell";

type InvitesTableProps = {
  invites: Invite[];
  members: WorkspaceMember[];
  access: MemberAccess;
  emptyState: ReactNode;
  onChangeRole: (invite: Invite, roleId: RoleId) => void;
  onResend: (invites: Invite[]) => void;
  onCopyLink: (invite: Invite) => void;
  onRevoke: (invites: Invite[]) => void;
};

function InviteStatus({ invite }: { invite: Invite }) {
  if (isInviteExpired(invite)) {
    return <Tag className="m-0 border-danger-line bg-danger-soft text-2xs text-danger-text">Expired</Tag>;
  }
  return <span className="text-muted tabular-nums">Expires {formatRelative(invite.expiresAt).toLowerCase()}</span>;
}

export function InvitesTable({
  invites,
  members,
  access,
  emptyState,
  onChangeRole,
  onResend,
  onCopyLink,
  onRevoke,
}: InvitesTableProps) {
  const { roles, currentRole } = useRbac();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const clearSelection = () => setSelectedIds([]);
  useEscapeToClear(selectedIds.length > 0, clearSelection);

  const canInvite = access.can("members.invite");
  const canRevoke = access.can("members.remove");
  const selectedInvites = invites.filter((invite) => selectedIds.includes(invite.id));

  function actionItems(invite: Invite): MenuProps["items"] {
    return [
      canInvite && { key: "resend", icon: <LuRotateCw />, label: "Resend invite", onClick: () => onResend([invite]) },
      { key: "copy", icon: <LuLink />, label: "Copy invite link", onClick: () => onCopyLink(invite) },
      canRevoke && { type: "divider" as const },
      canRevoke && {
        key: "revoke",
        icon: <LuX />,
        label: "Revoke invite",
        danger: true,
        onClick: () => onRevoke([invite]),
      },
    ].filter((item) => item !== false);
  }

  const columns: TableColumnsType<Invite> = [
    {
      title: "Email",
      key: "email",
      render: (_, invite) => (
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-muted">
            <LuMail className="size-3.5" />
          </span>
          <span className="truncate font-medium">{invite.email}</span>
        </span>
      ),
    },
    {
      title: "Role",
      key: "role",
      width: "9rem",
      render: (_, invite) => (
        <RoleSelect
          value={invite.roleId}
          isReadOnly={!canInvite}
          roles={inviteRoles(roles, currentRole)}
          onChange={(roleId) => onChangeRole(invite, roleId)}
        />
      ),
    },
    {
      title: "Invited by",
      key: "invitedBy",
      width: "10rem",
      render: (_, invite) => {
        const inviter = members.find((member) => member.id === invite.invitedById);
        if (!inviter) return <span className="text-muted">Former member</span>;
        return (
          <span className="flex min-w-0 items-center gap-2">
            <MemberAvatar member={inviter} size="xs" showTooltip={false} />
            <span className="truncate">{inviter.id === access.currentMemberId ? "You" : inviter.name}</span>
          </span>
        );
      },
    },
    {
      title: "Sent",
      key: "sent",
      width: "7.5rem",
      render: (_, invite) => (
        <span title={formatDateTime(invite.sentAt)} className="text-muted tabular-nums">
          {formatRelative(invite.sentAt)}
        </span>
      ),
    },
    { title: "Status", key: "status", width: "9rem", render: (_, invite) => <InviteStatus invite={invite} /> },
    {
      key: "actions",
      width: "3rem",
      render: (_, invite) => (
        <div className="flex justify-end">
          <Dropdown menu={{ items: actionItems(invite) }} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              size="small"
              aria-label={`Actions for ${invite.email}`}
              icon={<LuEllipsis />}
              className={`text-muted hover:text-ink ${FADE_IN_CLASS}`}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={TABLE_WRAPPER_CLASS}>
        <Table<Invite>
          rowKey="id"
          size="middle"
          tableLayout="fixed"
          columns={columns}
          dataSource={invites}
          pagination={false}
          locale={{ emptyText: emptyState }}
          rowSelection={
            canRevoke
              ? {
                  selectedRowKeys: selectedIds,
                  onChange: (keys) => setSelectedIds(keys as string[]),
                  columnWidth: "2.5rem",
                }
              : undefined
          }
          classNames={TABLE_CLASS_NAMES}
          className={TABLE_CLASS}
        />
      </div>

      <p className="mt-3 text-ui text-muted tabular-nums">
        {selectionSummary(selectedIds.length, invites.length, "invitation")}
      </p>

      {selectedIds.length > 0 && (
        <ActionBar
          count={selectedIds.length}
          onClear={clearSelection}
          actions={[
            {
              icon: <LuRotateCw />,
              label: "Resend invites",
              onClick: () => {
                onResend(selectedInvites);
                clearSelection();
              },
            },
            {
              icon: <LuX />,
              label: "Revoke",
              danger: true,
              onClick: () => {
                onRevoke(selectedInvites);
                clearSelection();
              },
            },
          ]}
        />
      )}
    </>
  );
}
