import { Button, Tooltip } from "antd";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  DeleteWorkspaceModal,
  TransferOwnershipModal,
} from "../../components/settings/workspace/WorkspaceDangerModals";
import { SaveBar } from "../../components/settings/SaveBar";
import { SettingRow, SettingsCard, SettingsSection } from "../../components/settings/SettingsBlocks";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { CustomInput } from "../../components/ui/CustomInput";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import { usePermission } from "../../rbac/RbacContext";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { TILE_COLORS, initialsOf } from "../../workspace/workspaceUtils";

const TAKEN_SLUGS = ["design-guild", "admin", "archboard", "settings"];

const generalSchema = z.object({
  name: z.string().trim().min(2, "Use at least 2 characters.").max(40, "Keep the name under 40 characters."),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]{3,32}$/, "Use 3–32 lowercase letters, numbers or dashes.")
    .refine((slug) => !TAKEN_SLUGS.includes(slug), "That URL is taken."),
});

export function WorkspaceGeneralPage() {
  const { currentWorkspace: workspace } = useWorkspace();
  // Remount the form when switching workspace so it never shows the previous workspace's draft.
  return <GeneralSettings key={workspace.id} />;
}

function GeneralSettings() {
  const toast = useToast();
  const { currentWorkspace: workspace, updateWorkspace } = useWorkspace();
  const canEdit = usePermission("workspace.update").allowed;

  const [name, setName] = useState(workspace.name);
  const [slug, setSlug] = useState(workspace.slug);
  const [tileClass, setTileClass] = useState(workspace.tileClass);
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});

  const isDirty = name.trim() !== workspace.name || slug.trim() !== workspace.slug || tileClass !== workspace.tileClass;
  useUnsavedChanges(isDirty, "General");

  function reset() {
    setName(workspace.name);
    setSlug(workspace.slug);
    setTileClass(workspace.tileClass);
    setErrors({});
  }

  function save() {
    const result = generalSchema.safeParse({ name, slug });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as "name" | "slug"] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    updateWorkspace(workspace.id, { ...result.data, tileClass, initials: initialsOf(result.data.name) });
    toast.success("Workspace updated");
  }

  const slugHint =
    slug !== workspace.slug && !errors.slug ? (
      <span className="flex items-center gap-1 text-success">
        <LuCheck className="size-3" /> Available · old links redirect for 30 days
      </span>
    ) : undefined;

  return (
    <SettingsPage title="General" description={`Basic details for ${workspace.name}.`}>
      <SettingsSection title="Workspace">
        <SettingsCard>
          <SettingRow label="Icon" description="Shown in the sidebar and workspace switcher.">
            <div className="flex items-center gap-3">
              <span
                className={`flex size-10 items-center justify-center rounded-lg text-ui font-semibold text-white ${tileClass}`}
              >
                {initialsOf(name) || workspace.initials}
              </span>
              {canEdit && (
                <div role="radiogroup" aria-label="Icon color" className="flex gap-1.5">
                  {TILE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      role="radio"
                      aria-checked={color === tileClass}
                      aria-label={`Color ${color}`}
                      onClick={() => setTileClass(color)}
                      className={`size-6 cursor-pointer rounded-md ${color} ${
                        color === tileClass
                          ? "ring-2 ring-ink ring-offset-2"
                          : "hover:ring-2 hover:ring-line-strong hover:ring-offset-1"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </SettingRow>

          <SettingRow label="Name" layout="stacked">
            {canEdit ? (
              <CustomInput
                aria-label="Workspace name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((current) => ({ ...current, name: undefined }));
                }}
                error={errors.name}
                size="middle"
                className="max-w-96"
              />
            ) : (
              <span className="text-ui">{workspace.name}</span>
            )}
          </SettingRow>

          <SettingRow label="URL" description="Used in invite and board links." layout="stacked">
            {canEdit ? (
              <CustomInput
                aria-label="Workspace URL"
                prefix={<span className="text-muted">archboard.app/</span>}
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value.toLowerCase());
                  setErrors((current) => ({ ...current, slug: undefined }));
                }}
                error={errors.slug}
                hint={slugHint}
                size="middle"
                className="max-w-96"
              />
            ) : (
              <span className="text-ui text-muted">archboard.app/{workspace.slug}</span>
            )}
          </SettingRow>
        </SettingsCard>
      </SettingsSection>

      <DangerZone />

      {canEdit && <SaveBar isDirty={isDirty} onSave={save} onReset={reset} />}
    </SettingsPage>
  );
}

function DangerZone() {
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { currentWorkspace: workspace, removeWorkspace } = useWorkspace();
  const canTransfer = usePermission("workspace.transfer").allowed;
  const canDelete = usePermission("workspace.delete").allowed;
  const [modal, setModal] = useState<"transfer" | "delete" | null>(null);

  const isPersonal = workspace.plan === "Personal";
  const isSoleOwner = canTransfer && workspace.memberCount > 1;
  const leaveBlockedReason = isPersonal
    ? "Your Personal workspace can't be left or deleted."
    : isSoleOwner
      ? "You're the only Owner. Transfer ownership before leaving."
      : null;

  async function leave() {
    const isConfirmed = await confirm({
      title: `Leave ${workspace.name}?`,
      description: "You'll lose access to its boards unless someone invites you again.",
      confirmLabel: "Leave workspace",
      isDanger: true,
    });
    if (!isConfirmed) return;
    removeWorkspace(workspace.id);
    navigate("/app");
    toast.success(`You left ${workspace.name}`);
  }

  return (
    <SettingsSection title="Danger zone" description="These actions are hard or impossible to undo.">
      <SettingsCard isDanger>
        <SettingRow label="Leave workspace" description="Remove yourself from this workspace.">
          <Tooltip title={leaveBlockedReason}>
            <Button danger disabled={!!leaveBlockedReason} onClick={leave}>
              Leave
            </Button>
          </Tooltip>
        </SettingRow>

        {canTransfer && !isPersonal && (
          <SettingRow label="Transfer ownership" description="Make another member the Owner. You'll become an Admin.">
            <Button danger onClick={() => setModal("transfer")}>
              Transfer
            </Button>
          </SettingRow>
        )}

        {canDelete && (
          <SettingRow label="Delete workspace" description="Permanently delete all boards, folders and history.">
            <Tooltip title={isPersonal ? "Your Personal workspace can't be left or deleted." : null}>
              <Button danger disabled={isPersonal} onClick={() => setModal("delete")}>
                Delete workspace
              </Button>
            </Tooltip>
          </SettingRow>
        )}
      </SettingsCard>

      <TransferOwnershipModal open={modal === "transfer"} onClose={() => setModal(null)} />
      <DeleteWorkspaceModal open={modal === "delete"} onClose={() => setModal(null)} />
    </SettingsSection>
  );
}
