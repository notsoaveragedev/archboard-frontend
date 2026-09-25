import { Dropdown, Tooltip, type MenuProps } from "antd";
import { LuCopy, LuLock, LuPencil, LuTrash2 } from "react-icons/lu";
import { pluralize } from "../../../lib/folderTree";
import type { Role } from "../../../types/rbac";
import { memberCount } from "./roleUtils";

type RoleColumnHeaderProps = {
  role: Role;
  onDuplicate: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

// Owner and Guest are special seats, so they can't be duplicated into custom roles.
const NOT_DUPLICABLE = ["owner", "guest"];

export function RoleColumnHeader({ role, onDuplicate, onEdit, onDelete }: RoleColumnHeaderProps) {
  const items: MenuProps["items"] = [
    { key: "duplicate", label: "Duplicate", icon: <LuCopy />, onClick: () => onDuplicate(role) },
    ...(role.isBuiltIn
      ? []
      : [
          { key: "edit", label: "Edit", icon: <LuPencil />, onClick: () => onEdit(role) },
          { type: "divider" as const },
          { key: "delete", label: "Delete", icon: <LuTrash2 />, danger: true, onClick: () => onDelete(role) },
        ]),
  ];
  const hasMenu = !NOT_DUPLICABLE.includes(role.id);

  const label = (
    <>
      <span className="flex max-w-full items-center gap-1 font-medium text-ink">
        <span className="truncate">{role.name}</span>
        {role.isBuiltIn && (
          <Tooltip title="Built-in roles can't be edited. Duplicate to customize.">
            <LuLock aria-label="Built-in role" className="size-3 shrink-0 text-subtle" />
          </Tooltip>
        )}
      </span>
      <span className="text-2xs text-muted tabular-nums">{pluralize(memberCount(role.id), "member")}</span>
    </>
  );

  return (
    <th scope="col" className="sticky top-0 z-10 w-24 min-w-24 border-b border-line bg-surface px-1.5 py-2 align-top font-normal">
      {hasMenu ? (
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottom">
          <button
            type="button"
            aria-label={`${role.name} role options`}
            className="flex w-full cursor-pointer flex-col items-center gap-0.5 rounded-md px-1 py-1 hover:bg-hover aria-expanded:bg-hover"
          >
            {label}
          </button>
        </Dropdown>
      ) : (
        <div className="flex flex-col items-center gap-0.5 px-1 py-1">{label}</div>
      )}
    </th>
  );
}
