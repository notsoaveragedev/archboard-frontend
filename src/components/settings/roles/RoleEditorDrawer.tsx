import { Button, Drawer } from "antd";
import { useState } from "react";
import { z } from "zod";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { pluralize } from "../../../lib/folderTree";
import { PERMISSION_CATEGORIES, PERMISSIONS } from "../../../rbac/permissions";
import type { Role } from "../../../types/rbac";
import { CustomInput } from "../../ui/CustomInput";
import { CustomSelect } from "../../ui/CustomSelect";
import { PermissionGroup } from "./PermissionGroup";
import { BASE_ROLE_OPTIONS, defaultGrants, memberCount, type BaseRoleId, type Grants } from "./roleUtils";

const roleSchema = z.object({
  name: z.string().trim().min(1, "Enter a role name.").max(40, "Use 40 characters or fewer."),
  description: z.string().trim().max(120, "Use 120 characters or fewer."),
});

export type RoleEditorTarget = { mode: "create" | "edit"; role?: Role };

type RoleEditorDrawerProps = {
  open: boolean;
  target: RoleEditorTarget;
  onClose: () => void;
};

function initialDraft({ mode, role }: RoleEditorTarget) {
  const baseRoleId: BaseRoleId = role?.baseRoleId ?? "member";
  return {
    name: mode === "edit" ? (role?.name ?? "") : role ? `${role.name} copy` : "",
    description: role?.description ?? "",
    baseRoleId,
    grants: role ? { ...defaultGrants(baseRoleId), ...role.permissions } : defaultGrants(baseRoleId),
  };
}

// Mount with a new `key` per open so the form starts from the chosen role.
export function RoleEditorDrawer({ open, target, onClose }: RoleEditorDrawerProps) {
  const toast = useToast();
  const confirm = useConfirm();
  const [initial] = useState(() => initialDraft(target));
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [baseRoleId, setBaseRoleId] = useState(initial.baseRoleId);
  const [grants, setGrants] = useState<Grants>(initial.grants);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const isEditing = target.mode === "edit";
  const affectedCount = target.role ? memberCount(target.role.id) : 0;
  const isDirty =
    name !== initial.name ||
    description !== initial.description ||
    baseRoleId !== initial.baseRoleId ||
    PERMISSIONS.some((permission) => grants[permission.key] !== initial.grants[permission.key]);

  async function requestClose() {
    if (isDirty) {
      const isConfirmed = await confirm({
        title: "Discard unsaved changes?",
        description: "Your changes to this role will be lost.",
        confirmLabel: "Discard",
        isDanger: true,
      });
      if (!isConfirmed) return;
    }
    onClose();
  }

  function changeBaseRole(nextBaseRoleId: BaseRoleId) {
    setBaseRoleId(nextBaseRoleId);
    setGrants(defaultGrants(nextBaseRoleId));
  }

  function save() {
    const result = roleSchema.safeParse({ name, description });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({ name: fieldErrors.name?.[0], description: fieldErrors.description?.[0] });
      return;
    }
    if (isEditing) {
      toast.success("Role updated", `Changes apply to ${pluralize(affectedCount, "member")} now.`);
    } else {
      toast.success("Role created", `${result.data.name} is ready to assign.`);
    }
    onClose();
  }

  return (
    <Drawer
      open={open}
      onClose={requestClose}
      size="32rem"
      title={isEditing ? `Edit ${initial.name}` : "New role"}
      classNames={{ body: "px-6 py-5", footer: "px-6 py-3" }}
      footer={
        <div className="flex items-center gap-2">
          {isEditing && (
            <span className="mr-auto text-ui text-muted tabular-nums">
              {pluralize(affectedCount, "member")} will be affected
            </span>
          )}
          <Button onClick={requestClose} className="ml-auto">
            Cancel
          </Button>
          <Button type="primary" onClick={save}>
            Save role
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CustomInput
          label="Name"
          value={name}
          autoFocus
          onChange={(event) => {
            setName(event.target.value);
            setErrors({});
          }}
          error={errors.name}
        />
        <CustomInput
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={errors.description}
          hint="Shown next to the role when you assign it."
        />
        <CustomSelect<BaseRoleId>
          label="Based on"
          value={baseRoleId}
          onChange={changeBaseRole}
          options={BASE_ROLE_OPTIONS}
          hint={
            baseRoleId === "viewer"
              ? "Uses a free seat. People with this role can view, but not edit."
              : "Uses a paid seat. Changing this resets the permissions below."
          }
        />
      </div>

      <h3 className="mt-7 mb-3 text-ui font-semibold">Permissions</h3>
      <div className="flex flex-col gap-3">
        {PERMISSION_CATEGORIES.map((category) => (
          <PermissionGroup
            key={category.key}
            label={category.label}
            permissions={PERMISSIONS.filter((permission) => permission.category === category.key)}
            baseRoleId={baseRoleId}
            grants={grants}
            onChange={setGrants}
          />
        ))}
      </div>
    </Drawer>
  );
}
