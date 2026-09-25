import { Button } from "antd";
import { LuDownload } from "react-icons/lu";
import { useRbac } from "../../../rbac/RbacContext";
import { CustomInput } from "../../ui/CustomInput";
import { CustomSelect } from "../../ui/CustomSelect";
import type { MemberFilters } from "./memberFilters";

const MFA_OPTIONS = [
  { value: "any", label: "Any 2FA" },
  { value: "on", label: "2FA on" },
  { value: "off", label: "2FA off" },
];

type MembersToolbarProps = {
  filters: MemberFilters;
  onChange: (filters: MemberFilters) => void;
  searchPlaceholder: string;
  showMfaFilter: boolean;
  onExport?: () => void;
};

export function MembersToolbar({ filters, onChange, searchPlaceholder, showMfaFilter, onExport }: MembersToolbarProps) {
  const { roles } = useRbac();
  const roleOptions = [
    { value: "all", label: "All roles" },
    ...roles.map((role) => ({ value: role.id, label: role.name })),
  ];

  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="w-64">
        <CustomInput
          type="search"
          size="middle"
          aria-label="Search members"
          placeholder={searchPlaceholder}
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </div>
      <div className="w-32">
        <CustomSelect
          size="middle"
          aria-label="Filter by role"
          value={filters.roleId}
          options={roleOptions}
          onChange={(roleId) => onChange({ ...filters, roleId })}
          popupMatchSelectWidth={false}
          className="w-full"
        />
      </div>
      {showMfaFilter && (
        <div className="w-28">
          <CustomSelect<MemberFilters["mfa"]>
            size="middle"
            aria-label="Filter by 2FA"
            value={filters.mfa}
            options={MFA_OPTIONS}
            onChange={(mfa) => onChange({ ...filters, mfa })}
            className="w-full"
          />
        </div>
      )}
      {onExport && (
        <Button type="text" icon={<LuDownload />} onClick={onExport} className="ml-auto text-muted">
          Export CSV
        </Button>
      )}
    </div>
  );
}
