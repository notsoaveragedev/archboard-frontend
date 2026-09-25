import { useState } from "react";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { pluralize } from "../../../lib/folderTree";
import { platformInvites, platformMembers } from "../../../mocks/rbac";
import { findRole } from "../../../rbac/permissions";
import { useRbac } from "../../../rbac/RbacContext";
import type { Invite, RoleId, WorkspaceMember } from "../../../types/rbac";
import { useWorkspace } from "../../../workspace/WorkspaceContext";
import { ROLE_SUMMARY, withArticle } from "./memberAccess";

const DAY = 24 * 3600 * 1000;

// Mock-backed member and invite state. Every change is optimistic; the API call slots in later.
export function useMemberActions() {
  const toast = useToast();
  const confirm = useConfirm();
  const { roles, currentMemberId } = useRbac();
  const { currentWorkspace } = useWorkspace();
  const [members, setMembers] = useState(platformMembers);
  const [invites, setInvites] = useState(platformInvites);

  async function changeRole(targets: WorkspaceMember[], roleId: RoleId) {
    const role = findRole(roles, roleId);
    const label = targets.length === 1 ? targets[0].name : pluralize(targets.length, "member");
    if (roleId === "admin" || roleId === "owner") {
      const isConfirmed = await confirm({
        title: targets.length === 1 ? `Make ${label} ${withArticle(role.name)}?` : `Make ${label} ${role.name}s?`,
        description:
          roleId === "owner"
            ? "Owners have full control, including billing and deleting the workspace."
            : "Admins can manage members, roles and security settings.",
        confirmLabel: `Make ${role.name}`,
      });
      if (!isConfirmed) return;
    }

    const previous = members;
    const ids = targets.map((member) => member.id);
    setMembers((current) => current.map((member) => (ids.includes(member.id) ? { ...member, roleId } : member)));
    toast.success(
      targets.length === 1 ? `${label} is now ${withArticle(role.name)}` : `${label} are now ${role.name}s`,
      ROLE_SUMMARY[roleId] ?? role.description,
      { label: "Undo", onClick: () => setMembers(previous) },
    );
  }

  async function removeMembers(targets: WorkspaceMember[]) {
    const label = targets.length === 1 ? targets[0].name : pluralize(targets.length, "member");
    const isConfirmed = await confirm({
      title: `Remove ${label}?`,
      description: `They'll lose access to ${currentWorkspace.name} right away. Boards they own will be transferred to you.`,
      confirmLabel: targets.length === 1 ? "Remove member" : "Remove members",
      isDanger: true,
    });
    if (!isConfirmed) return;

    const previous = members;
    const ids = targets.map((member) => member.id);
    setMembers((current) => current.filter((member) => !ids.includes(member.id)));
    toast.warning(`${label} removed`, "Their shares in this workspace were revoked.", {
      label: "Undo",
      onClick: () => setMembers(previous),
    });
  }

  async function signOut(member: WorkspaceMember) {
    const isConfirmed = await confirm({
      title: `Sign ${member.name} out everywhere?`,
      description: "They'll need to sign in again on every device. Their role and boards don't change.",
      confirmLabel: "Sign out",
      isDanger: true,
    });
    if (isConfirmed) toast.success(`${member.name} signed out`, "All of their sessions were ended.");
  }

  function sendInvites(emails: string[], roleId: RoleId) {
    const now = Date.now();
    const sent: Invite[] = emails.map((email) => ({
      id: crypto.randomUUID(),
      workspaceId: currentWorkspace.id,
      email,
      roleId,
      invitedById: currentMemberId,
      sentAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 7 * DAY).toISOString(),
      status: "pending",
    }));
    setInvites((current) => [...sent, ...current]);
    toast.success(
      emails.length === 1 ? `Invite sent to ${emails[0]}` : `${emails.length} invites sent`,
      `They'll join ${currentWorkspace.name} as ${findRole(roles, roleId).name}s.`,
    );
  }

  function changeInviteRole(invite: Invite, roleId: RoleId) {
    setInvites((current) => current.map((item) => (item.id === invite.id ? { ...item, roleId } : item)));
    toast.success("Invite updated", `${invite.email} will join as ${withArticle(findRole(roles, roleId).name)}.`);
  }

  function resendInvites(targets: Invite[]) {
    const now = Date.now();
    const ids = targets.map((invite) => invite.id);
    setInvites((current) =>
      current.map((invite) =>
        ids.includes(invite.id)
          ? {
              ...invite,
              status: "pending",
              sentAt: new Date(now).toISOString(),
              expiresAt: new Date(now + 7 * DAY).toISOString(),
            }
          : invite,
      ),
    );
    toast.success(
      targets.length === 1 ? `Invite resent to ${targets[0].email}` : `${targets.length} invites resent`,
      "The link is valid for another 7 days.",
    );
  }

  async function copyInviteLink(invite: Invite) {
    await navigator.clipboard.writeText(`https://archboard.app/invite/${invite.id}`);
    toast.success("Invite link copied", `Only ${invite.email} can use it.`);
  }

  async function revokeInvites(targets: Invite[]) {
    const label = targets.length === 1 ? targets[0].email : pluralize(targets.length, "invite");
    const isConfirmed = await confirm({
      title: targets.length === 1 ? "Revoke this invite?" : `Revoke ${label}?`,
      description: `The link stops working right away for ${label}.`,
      confirmLabel: "Revoke",
      isDanger: true,
    });
    if (!isConfirmed) return;

    const previous = invites;
    const ids = targets.map((invite) => invite.id);
    setInvites((current) => current.filter((invite) => !ids.includes(invite.id)));
    toast.warning(targets.length === 1 ? "Invite revoked" : `${label} revoked`, undefined, {
      label: "Undo",
      onClick: () => setInvites(previous),
    });
  }

  function exportCsv() {
    const rows = members.map((member) => [
      member.name,
      member.email,
      findRole(roles, member.roleId).name,
      member.joinedAt,
    ]);
    const csv = [["Name", "Email", "Role", "Joined"], ...rows].map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `${currentWorkspace.name.toLowerCase().replace(/\s+/g, "-")}-members.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Exported ${pluralize(members.length, "member")}`);
  }

  return {
    members,
    invites,
    changeRole,
    removeMembers,
    signOut,
    sendInvites,
    changeInviteRole,
    resendInvites,
    copyInviteLink,
    revokeInvites,
    exportCsv,
  };
}
