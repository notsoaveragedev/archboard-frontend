import { Button, Segmented, Tag, Tooltip } from "antd";
import { useState } from "react";
import { LuCheck, LuMinus, LuPlus } from "react-icons/lu";
import { DeleteRoleModal } from "../../components/settings/roles/DeleteRoleModal";
import { PermissionMatrix } from "../../components/settings/roles/PermissionMatrix";
import { ResourceRolesMatrix } from "../../components/settings/roles/ResourceRolesMatrix";
import { RoleEditorDrawer, type RoleEditorTarget } from "../../components/settings/roles/RoleEditorDrawer";
import { DESIGN_REVIEWERS } from "../../components/settings/roles/roleUtils";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { useToast } from "../../hooks/useToast";
import { useRbac } from "../../rbac/RbacContext";
import type { Role } from "../../types/rbac";
import { useWorkspace } from "../../workspace/WorkspaceContext";

type View = "workspace" | "resource";

export function RolesPage() {
  const toast = useToast();
  const { roles } = useRbac();
  const { currentWorkspace } = useWorkspace();
  const [view, setView] = useState<View>("workspace");
  const [editorTarget, setEditorTarget] = useState<RoleEditorTarget>({ mode: "create" });
  const [editorKey, setEditorKey] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const matrixRoles = [...roles, DESIGN_REVIEWERS];
  const isTeamPlan = currentWorkspace.plan === "Team";

  function openEditor(target: RoleEditorTarget) {
    setEditorTarget(target);
    setEditorKey((key) => key + 1);
    setIsEditorOpen(true);
  }

  function deleteRole(role: Role) {
    setRoleToDelete(null);
    toast.success("Role deleted", `Members with ${role.name} were moved to their new role.`);
  }

  const createButton = (
    <Button icon={<LuPlus />} disabled={!isTeamPlan} onClick={() => openEditor({ mode: "create" })}>
      Create role
    </Button>
  );

  return (
    <SettingsPage
      width="wide"
      title="Roles & permissions"
      description={`Control what each role can do in ${currentWorkspace.name}.`}
      actions={
        isTeamPlan ? (
          createButton
        ) : (
          <Tooltip title="Custom roles are available on the Team plan.">
            <span className="inline-flex">{createButton}</span>
          </Tooltip>
        )
      }
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <Segmented<View>
          value={view}
          onChange={setView}
          options={[
            { value: "workspace", label: "Workspace roles" },
            { value: "resource", label: "Board & folder roles" },
          ]}
        />
        {view === "workspace" && <MatrixLegend />}
      </div>

      {view === "workspace" ? (
        <PermissionMatrix
          roles={matrixRoles}
          onDuplicate={(role) => openEditor({ mode: "create", role })}
          onEdit={(role) => openEditor({ mode: "edit", role })}
          onDelete={setRoleToDelete}
        />
      ) : (
        <ResourceRolesMatrix />
      )}

      <RoleEditorDrawer
        key={editorKey}
        open={isEditorOpen}
        target={editorTarget}
        onClose={() => setIsEditorOpen(false)}
      />
      <DeleteRoleModal
        role={roleToDelete}
        roles={matrixRoles}
        onClose={() => setRoleToDelete(null)}
        onDelete={deleteRole}
      />
    </SettingsPage>
  );
}

function MatrixLegend() {
  return (
    <div className="flex items-center gap-4 text-2xs text-muted" aria-hidden>
      <span className="flex items-center gap-1.5">
        <LuCheck className="size-3.5 text-ink" /> Allowed
      </span>
      <span className="flex items-center gap-1.5">
        <Tag className="m-0 border-0 bg-hover px-1.5 text-2xs leading-4 text-muted">Own</Tag> Only items they created
      </span>
      <span className="flex items-center gap-1.5">
        <LuMinus className="size-3.5 text-subtle" /> Not allowed
      </span>
    </div>
  );
}
