import { Button, Dropdown, Modal, type MenuProps } from "antd";
import { useState } from "react";
import { LuCheck, LuChevronsUpDown, LuPlus, LuUserPlus } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { pluralize } from "../../lib/folderTree";
import { createWorkspaceSchema } from "../../lib/schemas";
import type { Workspace } from "../../types/workspace";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { CustomInput } from "../ui/CustomInput";

function WorkspaceTile({ workspace }: { workspace: Workspace }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-md text-3xs font-semibold text-white ${workspace.tileClass}`}
    >
      {workspace.initials}
    </span>
  );
}

function workspaceMeta(workspace: Workspace) {
  return `${workspace.plan} · ${pluralize(workspace.memberCount, "member")}`;
}

export function WorkspaceSwitcher({ onInvite }: { onInvite: () => void }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function handleSwitch(workspace: Workspace) {
    if (workspace.id === currentWorkspace.id) return;
    switchWorkspace(workspace.id);
    navigate("/app");
    toast.success(`Switched to ${workspace.name}`);
  }

  const items: MenuProps["items"] = [
    {
      type: "group",
      label: <span className="text-2xs font-medium text-muted">Workspaces</span>,
      children: workspaces.map((workspace) => ({
        key: workspace.id,
        onClick: () => handleSwitch(workspace),
        label: (
          <span className="flex items-center gap-2.5 py-0.5">
            <WorkspaceTile workspace={workspace} />
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-ui font-medium text-ink">{workspace.name}</span>
              <span className="text-2xs text-muted">{workspaceMeta(workspace)}</span>
            </span>
            {workspace.id === currentWorkspace.id && <LuCheck className="size-4 shrink-0 text-ink" />}
          </span>
        ),
      })),
    },
    { type: "divider" },
    {
      key: "create",
      icon: <LuPlus />,
      label: "Create workspace",
      onClick: () => setIsCreateOpen(true),
    },
    {
      key: "invite",
      icon: <LuUserPlus />,
      label: "Invite members",
      onClick: onInvite,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items, style: { width: "14.5rem" } }}
        trigger={["click"]}
        placement="bottomLeft"
      >
        <button
          type="button"
          aria-label={`Switch workspace, current: ${currentWorkspace.name}`}
          className="flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-md px-2 text-left transition-colors hover:bg-hover aria-expanded:bg-hover"
        >
          <WorkspaceTile workspace={currentWorkspace} />
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-ui font-medium text-ink">{currentWorkspace.name}</span>
            <span className="text-2xs text-muted">{workspaceMeta(currentWorkspace)}</span>
          </span>
          <LuChevronsUpDown className="size-3.5 text-muted" />
        </button>
      </Dropdown>

      <CreateWorkspaceModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}

function CreateWorkspaceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { createWorkspace } = useWorkspace();

  const { formProps, fieldErrors, isPending } = useForm({
    schema: createWorkspaceSchema,
    onSubmit: async ({ name }) => {
      createWorkspace(name);
      onClose();
      navigate("/app");
      toast.success("Workspace created", `You're now in ${name}. Invite your team to get started.`);
    },
  });

  return (
    <Modal open={open} onCancel={onClose} title="Create workspace" footer={null} destroyOnHidden width="26rem">
      <form {...formProps} className="flex flex-col gap-5 pt-2">
        <CustomInput
          label="Workspace name"
          name="name"
          placeholder="e.g. Payments Team"
          autoFocus
          error={fieldErrors.name}
          hint="Usually your team or company name. You can change it later."
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create workspace
          </Button>
        </div>
      </form>
    </Modal>
  );
}
