import { Button, Tag, Tooltip } from "antd";
import { useState } from "react";
import { DeleteAccountModal } from "../../components/settings/account/DeleteAccountModal";
import { SettingRow, SettingsCard, SettingsSection } from "../../components/settings/SettingsBlocks";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import { storage } from "../../mocks/accountSettings";
import { CURRENT_USER_ID, memberships, platformMembers } from "../../mocks/rbac";
import { findRole } from "../../rbac/permissions";
import { useRbac } from "../../rbac/RbacContext";
import type { RoleId } from "../../types/rbac";
import type { Workspace } from "../../types/workspace";
import { useWorkspace } from "../../workspace/WorkspaceContext";

const me = platformMembers[0];

type MyWorkspace = Workspace & { roleId: RoleId; isSoleOwner: boolean };

function useMyWorkspaces(): MyWorkspace[] {
  const { workspaces, currentWorkspace } = useWorkspace();
  const { actualRoleId } = useRbac();

  return workspaces.map((workspace) => {
    const membership = memberships.find((item) => item.userId === CURRENT_USER_ID && item.workspaceId === workspace.id);
    // The current workspace's role can change this session (e.g. after transferring ownership).
    const roleId = workspace.id === currentWorkspace.id ? actualRoleId : (membership?.roleId ?? "owner");
    const hasOtherOwners = memberships.some(
      (item) => item.workspaceId === workspace.id && item.roleId === "owner" && item.userId !== CURRENT_USER_ID,
    );
    return { ...workspace, roleId, isSoleOwner: roleId === "owner" && !hasOtherOwners };
  });
}

function leaveBlockedReason(workspace: MyWorkspace) {
  if (workspace.plan === "Personal") return "Your Personal workspace can't be left or deleted.";
  if (workspace.isSoleOwner) return "A workspace needs at least one Owner. Transfer ownership first.";
  return null;
}

export function AccountPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const { roles } = useRbac();
  const [leftIds, setLeftIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const myWorkspaces = useMyWorkspaces().filter((workspace) => !leftIds.includes(workspace.id));
  const blockingNames = myWorkspaces
    .filter((workspace) => workspace.isSoleOwner && workspace.plan !== "Personal" && workspace.memberCount > 1)
    .map((workspace) => workspace.name);

  async function leave(workspace: MyWorkspace) {
    const isConfirmed = await confirm({
      title: `Leave ${workspace.name}?`,
      description: "You'll lose access to its boards. An admin will need to invite you again.",
      confirmLabel: "Leave",
      isDanger: true,
    });
    if (!isConfirmed) return;
    setLeftIds((current) => [...current, workspace.id]);
    toast.success(`You left ${workspace.name}`);
  }

  function startExport() {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Export started", `We'll email a download link to ${me.email}.`);
    }, 600);
  }

  return (
    <SettingsPage title="Account & data" description="Storage, your workspaces and your data.">
      <SettingsSection title="Storage">
        <StorageCard />
      </SettingsSection>

      <SettingsSection title="Your workspaces" description="Every workspace you belong to, and your role in each.">
        <SettingsCard>
          {myWorkspaces.map((workspace) => {
            const blockedReason = leaveBlockedReason(workspace);
            return (
              <div key={workspace.id} className="flex min-h-16 items-center gap-3 px-5 py-3.5">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-md text-2xs font-semibold text-white ${workspace.tileClass}`}
                  aria-hidden
                >
                  {workspace.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-ui font-medium">{workspace.name}</div>
                  <div className="mt-0.5 text-2xs text-muted tabular-nums">
                    {workspace.plan} · {workspace.memberCount} {workspace.memberCount === 1 ? "member" : "members"}
                  </div>
                </div>
                <Tag className="m-0 border-0 bg-hover text-2xs text-muted">{findRole(roles, workspace.roleId).name}</Tag>
                <Tooltip title={blockedReason}>
                  <span className="inline-flex">
                    <Button type="text" disabled={!!blockedReason} onClick={() => leave(workspace)} className="text-muted disabled:text-subtle">
                      Leave
                    </Button>
                  </span>
                </Tooltip>
              </div>
            );
          })}
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Your data">
        <SettingsCard>
          <SettingRow label="Export data" description="Export all boards as JSON + PNG.">
            <Button loading={isExporting} onClick={startExport}>
              Export
            </Button>
          </SettingRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <SettingsCard isDanger>
          <SettingRow
            label="Delete account"
            description="Permanently delete your account, your Personal workspace and all your boards."
          >
            <Tooltip title={blockingNames.length ? `Transfer ownership of ${blockingNames.join(" and ")} first.` : undefined}>
              <span className="inline-flex">
                <Button danger disabled={blockingNames.length > 0} onClick={() => setIsDeleteOpen(true)}>
                  Delete account
                </Button>
              </span>
            </Tooltip>
          </SettingRow>
        </SettingsCard>
      </SettingsSection>

      <DeleteAccountModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={(exportFirst) => {
          setIsDeleteOpen(false);
          toast.success(
            "Account scheduled for deletion",
            exportFirst ? `Your export is on its way to ${me.email}.` : "You'll be signed out in a moment.",
          );
        }}
      />
    </SettingsPage>
  );
}

function StorageCard() {
  const percent = (gb: number) => `${(gb / storage.totalGb) * 100}%`;

  return (
    <SettingsCard>
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-ui font-medium tabular-nums">
            {storage.usedGb} GB <span className="font-normal text-muted">of {storage.totalGb} GB used</span>
          </span>
          <span className="text-2xs text-muted tabular-nums">{Math.round((storage.usedGb / storage.totalGb) * 100)}%</span>
        </div>
        <div
          className="flex h-2 gap-px overflow-hidden rounded-full bg-hover"
          role="img"
          aria-label={`${storage.usedGb} GB of ${storage.totalGb} GB used`}
        >
          {storage.parts.map((part) => (
            <div key={part.label} className={part.className} style={{ width: percent(part.gb) }} />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-2xs text-muted">
          {storage.parts.map((part) => (
            <li key={part.label} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${part.className}`} aria-hidden />
              {part.label}
              <span className="text-ink tabular-nums">{part.gb} GB</span>
            </li>
          ))}
        </ul>
      </div>
    </SettingsCard>
  );
}
