import { Table, Tag, type TableColumnsType } from "antd";
import { useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { LuShieldCheck, LuUserCog, LuUserMinus } from "react-icons/lu";
import { formatDate, formatDateTime, formatRelative } from "../../../lib/format";
import { useRbac } from "../../../rbac/RbacContext";
import type { RoleId, WorkspaceMember } from "../../../types/rbac";
import { ActionBar } from "../../ui/ActionBar";
import { MemberAvatar } from "../../ui/MemberAvatar";
import { assignableRoles, type MemberAccess } from "./memberAccess";
import { MemberActionsMenu } from "./MemberActionsMenu";
import { RoleSelect } from "./RoleSelect";
import { TABLE_CLASS, TABLE_CLASS_NAMES, TABLE_WRAPPER_CLASS, selectionSummary, useEscapeToClear } from "./tableShell";

type MembersTableProps = {
  members: WorkspaceMember[];
  access: MemberAccess;
  emptyState: ReactNode;
  onOpen: (memberId: string) => void;
  onChangeRole: (members: WorkspaceMember[], roleId: RoleId) => void;
  onSignOut: (member: WorkspaceMember) => void;
  onRemove: (members: WorkspaceMember[]) => void;
};

const tagClass = "m-0 border-0 px-1.5 text-2xs leading-4.5";

// Clicks on controls, or inside their portals (Select and Dropdown popups), shouldn't open the drawer.
function isRowClick(event: MouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement;
  return event.currentTarget.contains(target) && !target.closest("button, a, input, label, .ant-select");
}

function MemberCell({ member, isYou }: { member: WorkspaceMember; isYou: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <MemberAvatar member={member} showTooltip={false} />
      <div className="flex min-w-0 flex-col">
        <span className="flex min-w-0 items-center gap-1.5 leading-4.5">
          <span className="truncate font-medium">{member.name}</span>
          {isYou && <Tag className={`${tagClass} bg-hover text-muted`}>You</Tag>}
          {member.roleId === "guest" && <Tag className={`${tagClass} bg-warning-soft text-[#7A4A00]`}>Guest</Tag>}
        </span>
        <span className="truncate leading-4.5 text-muted">{member.email}</span>
      </div>
    </div>
  );
}

export function MembersTable({
  members,
  access,
  emptyState,
  onOpen,
  onChangeRole,
  onSignOut,
  onRemove,
}: MembersTableProps) {
  const { roles, currentRole } = useRbac();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const clearSelection = () => setSelectedIds([]);
  useEscapeToClear(selectedIds.length > 0, clearSelection);

  const canChangeRoles = access.can("members.updateRole");
  const canRemove = access.can("members.remove");
  const canSeeSecurity = access.can("security.manage");
  const selectedMembers = members.filter((member) => selectedIds.includes(member.id));

  const isSelectable = (member: WorkspaceMember) =>
    access.check("members.updateRole", member).allowed || access.check("members.remove", member).allowed;

  const columns: TableColumnsType<WorkspaceMember> = [
    {
      title: "Member",
      key: "member",
      render: (_, member) => <MemberCell member={member} isYou={member.id === access.currentMemberId} />,
    },
    {
      title: "Role",
      key: "role",
      width: "9rem",
      render: (_, member) => (
        <RoleSelect
          value={member.roleId}
          isReadOnly={!canChangeRoles}
          disabledReason={access.check("members.updateRole", member).reason}
          onChange={(roleId) => onChangeRole([member], roleId)}
        />
      ),
    },
    ...(canSeeSecurity
      ? [
          {
            title: "2FA",
            key: "mfa",
            width: "6rem",
            render: (_: unknown, member: WorkspaceMember) =>
              member.mfaEnabled ? (
                <span className="flex items-center gap-1.5">
                  <LuShieldCheck className="size-3.5 text-success" />
                  On
                </span>
              ) : (
                <span className="text-muted">Off</span>
              ),
          },
        ]
      : []),
    {
      title: "Last active",
      key: "lastActive",
      width: "8rem",
      render: (_, member) => (
        <span title={formatDateTime(member.lastActiveAt)} className="text-muted tabular-nums">
          {formatRelative(member.lastActiveAt)}
        </span>
      ),
    },
    {
      title: "Joined",
      key: "joined",
      width: "7.5rem",
      render: (_, member) => <span className="text-muted tabular-nums">{formatDate(member.joinedAt)}</span>,
    },
    {
      key: "actions",
      width: "3rem",
      render: (_, member) => (
        <div className="flex justify-end">
          <MemberActionsMenu
            member={member}
            access={access}
            onView={() => onOpen(member.id)}
            onChangeRole={(roleId) => onChangeRole([member], roleId)}
            onSignOut={() => onSignOut(member)}
            onRemove={() => onRemove([member])}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={TABLE_WRAPPER_CLASS}>
        <Table<WorkspaceMember>
          rowKey="id"
          size="middle"
          tableLayout="fixed"
          columns={columns}
          dataSource={members}
          pagination={false}
          locale={{ emptyText: emptyState }}
          rowSelection={
            canChangeRoles || canRemove
              ? {
                  selectedRowKeys: selectedIds,
                  onChange: (keys) => setSelectedIds(keys as string[]),
                  getCheckboxProps: (member) => ({ disabled: !isSelectable(member) }),
                  columnWidth: "2.5rem",
                }
              : undefined
          }
          onRow={(member) => ({
            tabIndex: 0,
            className: "cursor-pointer outline-none focus-visible:bg-hover-subtle",
            onClick: (event) => isRowClick(event) && onOpen(member.id),
            onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
              if (event.key === "Enter" && event.target === event.currentTarget) onOpen(member.id);
            },
          })}
          classNames={TABLE_CLASS_NAMES}
          className={TABLE_CLASS}
        />
      </div>

      <p className="mt-3 text-ui text-muted tabular-nums">
        {selectionSummary(selectedIds.length, members.length, "member")}
      </p>

      {selectedIds.length > 0 && (
        <ActionBar
          count={selectedIds.length}
          onClear={clearSelection}
          actions={[
            ...(canChangeRoles
              ? [
                  {
                    icon: <LuUserCog />,
                    label: "Change role",
                    menu: {
                      items: assignableRoles(roles, currentRole).map((role) => ({ key: role.id, label: role.name })),
                      onClick: ({ key }: { key: string }) => {
                        onChangeRole(selectedMembers, key as RoleId);
                        clearSelection();
                      },
                    },
                  },
                ]
              : []),
            ...(canRemove
              ? [
                  {
                    icon: <LuUserMinus />,
                    label: "Remove",
                    danger: true,
                    onClick: () => {
                      onRemove(selectedMembers);
                      clearSelection();
                    },
                  },
                ]
              : []),
          ]}
        />
      )}
    </>
  );
}
