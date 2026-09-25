import { Tooltip } from "antd";
import { Fragment } from "react";
import { LuLock } from "react-icons/lu";
import { PERMISSION_CATEGORIES, PERMISSIONS } from "../../../rbac/permissions";
import type { Role } from "../../../types/rbac";
import { GrantCell } from "./GrantCell";
import { RoleColumnHeader } from "./RoleColumnHeader";

type PermissionMatrixProps = {
  roles: Role[];
  onDuplicate: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

const firstColumn = "sticky left-0 w-72 min-w-72 px-4 text-left";

export function PermissionMatrix({ roles, ...columnActions }: PermissionMatrixProps) {
  return (
    <div className="max-h-[calc(100vh-14rem)] overflow-auto rounded-lg border border-line bg-surface">
      <table className="w-full border-separate border-spacing-0 text-ui">
        <thead>
          <tr>
            <th
              scope="col"
              className={`${firstColumn} top-0 z-20 border-b border-line bg-surface align-bottom pb-2.5 font-medium text-muted`}
            >
              Permission
            </th>
            {roles.map((role) => (
              <RoleColumnHeader key={role.id} role={role} {...columnActions} />
            ))}
          </tr>
        </thead>

        <tbody>
          {PERMISSION_CATEGORIES.map((category) => (
            <Fragment key={category.key}>
              <tr>
                <th
                  scope="colgroup"
                  className={`${firstColumn} h-8 border-b border-line-soft bg-hover-subtle text-2xs font-medium text-muted`}
                >
                  {category.label}
                </th>
                <td colSpan={roles.length} className="border-b border-line-soft bg-hover-subtle" />
              </tr>

              {PERMISSIONS.filter((permission) => permission.category === category.key).map((permission) => (
                <tr key={permission.key} className="group">
                  <th
                    scope="row"
                    className={`${firstColumn} border-b border-line-soft bg-surface py-2 font-normal group-hover:bg-hover-subtle`}
                  >
                    <span className="flex items-center gap-1.5 text-ink">
                      {permission.label}
                      {permission.isOwnerOnly && (
                        <Tooltip title="Only the Owner can do this.">
                          <LuLock aria-label="Owner only" className="size-3 text-subtle" />
                        </Tooltip>
                      )}
                    </span>
                    <span className="block text-2xs text-muted">{permission.description}</span>
                  </th>
                  {roles.map((role) => (
                    <td
                      key={role.id}
                      className="border-b border-line-soft text-center group-hover:bg-hover-subtle"
                    >
                      <GrantCell grant={role.permissions[permission.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
