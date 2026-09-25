import { Checkbox, Segmented, Tooltip } from "antd";
import { LuLock } from "react-icons/lu";
import type { Grant, Permission } from "../../../types/rbac";
import { lockReason, type BaseRoleId, type Grants } from "./roleUtils";

type PermissionGroupProps = {
  label: string;
  permissions: Permission[];
  baseRoleId: BaseRoleId;
  grants: Grants;
  onChange: (grants: Grants) => void;
};

export function PermissionGroup({ label, permissions, baseRoleId, grants, onChange }: PermissionGroupProps) {
  const editable = permissions.filter((permission) => !lockReason(permission, baseRoleId));
  const checkedCount = editable.filter((permission) => grants[permission.key]).length;

  function setGrant(permission: Permission, grant: Grant | undefined) {
    onChange({ ...grants, [permission.key]: grant });
  }

  function toggleAll(isChecked: boolean) {
    const next = { ...grants };
    editable.forEach((permission) => {
      next[permission.key] = isChecked ? (grants[permission.key] ?? "all") : undefined;
    });
    onChange(next);
  }

  return (
    <fieldset className="overflow-hidden rounded-lg border border-line">
      <legend className="sr-only">{label}</legend>
      <div className="flex h-9 items-center justify-between border-b border-line-soft bg-hover-subtle px-3.5">
        <span className="text-2xs font-medium text-muted">{label}</span>
        <Checkbox
          checked={editable.length > 0 && checkedCount === editable.length}
          indeterminate={checkedCount > 0 && checkedCount < editable.length}
          disabled={editable.length === 0}
          onChange={(event) => toggleAll(event.target.checked)}
          className="text-2xs text-muted"
        >
          Select all
        </Checkbox>
      </div>

      <div className="divide-y divide-line-soft">
        {permissions.map((permission) => (
          <PermissionRow
            key={permission.key}
            permission={permission}
            grant={grants[permission.key]}
            lockedReason={lockReason(permission, baseRoleId)}
            onChange={(grant) => setGrant(permission, grant)}
          />
        ))}
      </div>
    </fieldset>
  );
}

type PermissionRowProps = {
  permission: Permission;
  grant?: Grant;
  lockedReason: string | null;
  onChange: (grant: Grant | undefined) => void;
};

function PermissionRow({ permission, grant, lockedReason, onChange }: PermissionRowProps) {
  const isLocked = lockedReason !== null;

  return (
    <div className="flex items-center gap-3 px-3.5 py-2">
      <Checkbox
        checked={Boolean(grant) && !isLocked}
        disabled={isLocked}
        onChange={(event) => onChange(event.target.checked ? "all" : undefined)}
        className="min-w-0 flex-1 items-start [&_.ant-checkbox]:mt-0.5"
      >
        <span className={`flex items-center gap-1.5 ${isLocked ? "text-muted" : "text-ink"}`}>
          {permission.label}
          {isLocked && (
            <Tooltip title={lockedReason}>
              <LuLock aria-label={lockedReason} className="size-3 text-subtle" />
            </Tooltip>
          )}
        </span>
        <span className="block text-2xs text-muted">{permission.description}</span>
      </Checkbox>

      {permission.isScopable && grant && !isLocked && (
        <Segmented<Grant>
          size="small"
          value={grant}
          onChange={onChange}
          options={[
            { value: "all", label: "All" },
            { value: "own", label: "Own" },
          ]}
          aria-label={`${permission.label} scope`}
        />
      )}
    </div>
  );
}
