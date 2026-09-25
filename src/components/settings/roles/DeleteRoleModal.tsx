import { Modal } from "antd";
import { useState } from "react";
import { pluralize } from "../../../lib/folderTree";
import type { Role, RoleId } from "../../../types/rbac";
import { CustomSelect } from "../../ui/CustomSelect";
import { memberCount } from "./roleUtils";

type DeleteRoleModalProps = {
  role: Role | null;
  roles: Role[];
  onClose: () => void;
  onDelete: (role: Role) => void;
};

export function DeleteRoleModal({ role, roles, onClose, onDelete }: DeleteRoleModalProps) {
  const [reassignTo, setReassignTo] = useState<RoleId>("member");
  const count = role ? memberCount(role.id) : 0;
  const options = roles
    .filter((item) => item.id !== role?.id && item.id !== "owner" && item.id !== "guest")
    .map((item) => ({ value: item.id, label: item.name }));

  return (
    <Modal
      open={role !== null}
      onCancel={onClose}
      onOk={() => role && onDelete(role)}
      title={`Delete ${role?.name ?? "role"}?`}
      okText="Delete role"
      okButtonProps={{ danger: true }}
      width="26rem"
      centered
      destroyOnHidden
    >
      <div className="flex flex-col gap-4 pt-1">
        <p className="text-ui text-muted">
          {count > 0
            ? `${pluralize(count, "member")} will move to the role you pick. This can't be undone.`
            : "No one has this role yet, so no one is affected. This can't be undone."}
        </p>
        <CustomSelect<RoleId>
          label={`Reassign ${pluralize(count, "member")} to`}
          value={reassignTo}
          onChange={setReassignTo}
          options={options}
          disabled={count === 0}
          size="middle"
        />
      </div>
    </Modal>
  );
}
