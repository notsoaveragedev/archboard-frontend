import { Select, Tooltip } from "antd";
import { findRole } from "../../../rbac/permissions";
import { useRbac } from "../../../rbac/RbacContext";
import type { Role, RoleId } from "../../../types/rbac";
import { assignableRoles } from "./memberAccess";

type RoleSelectProps = {
  value: RoleId;
  onChange: (roleId: RoleId) => void;
  // null when the viewer can't change this role at all; a string explains a situational block.
  disabledReason?: string | null;
  isReadOnly?: boolean;
  roles?: Role[];
  variant?: "borderless" | "outlined";
  className?: string;
};

function RoleOption({ role }: { role: Role }) {
  return (
    <div className="flex max-w-64 flex-col py-0.5">
      <span className="text-ui font-medium">{role.name}</span>
      <span className="text-2xs whitespace-normal text-muted">{role.description}</span>
    </div>
  );
}

export function RoleSelect({
  value,
  onChange,
  disabledReason,
  isReadOnly = false,
  roles,
  variant = "borderless",
  className = "",
}: RoleSelectProps) {
  const { roles: allRoles, currentRole } = useRbac();
  const roleName = findRole(allRoles, value).name;

  if (isReadOnly) return <span>{roleName}</span>;
  if (disabledReason) {
    return (
      <Tooltip title={disabledReason}>
        <span className="cursor-default">{roleName}</span>
      </Tooltip>
    );
  }

  const options = (roles ?? assignableRoles(allRoles, currentRole)).map((role) => ({
    value: role.id,
    label: role.name,
    role,
  }));

  return (
    <Select<RoleId>
      value={value}
      onChange={onChange}
      variant={variant}
      size={variant === "borderless" ? "small" : "middle"}
      popupMatchSelectWidth={false}
      aria-label="Role"
      options={options}
      optionRender={(option) => <RoleOption role={option.data.role} />}
      className={variant === "borderless" ? `-ml-2 ${className}` : className}
    />
  );
}
