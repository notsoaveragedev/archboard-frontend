import { Button, Empty, Tabs } from "antd";
import { useState } from "react";
import { LuUserPlus } from "react-icons/lu";
import { InviteMembersModal } from "../../components/settings/members/InviteMembersModal";
import { InvitesTable } from "../../components/settings/members/InvitesTable";
import { isInviteExpired, PAID_SEATS, useMemberAccess } from "../../components/settings/members/memberAccess";
import {
  EMPTY_FILTERS,
  filterInvites,
  filterMembers,
  isFiltered,
} from "../../components/settings/members/memberFilters";
import { MemberDrawer } from "../../components/settings/members/MemberDrawer";
import { MembersTable } from "../../components/settings/members/MembersTable";
import { MembersToolbar } from "../../components/settings/members/MembersToolbar";
import { SeatsStrip } from "../../components/settings/members/SeatsStrip";
import { useMemberActions } from "../../components/settings/members/useMemberActions";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { findRole } from "../../rbac/permissions";
import { useRbac } from "../../rbac/RbacContext";
import type { RoleId } from "../../types/rbac";
import { useWorkspace } from "../../workspace/WorkspaceContext";

type Tab = "members" | "invites";

function TabLabel({ label, count }: { label: string; count: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      <span className="text-2xs text-muted tabular-nums">{count}</span>
    </span>
  );
}

export function MembersPage() {
  const { roles } = useRbac();
  const { currentWorkspace } = useWorkspace();
  const actions = useMemberActions();
  const { members, invites } = actions;
  const access = useMemberAccess(members);
  const [tab, setTab] = useState<Tab>("members");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [openMemberId, setOpenMemberId] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const canInvite = access.can("members.invite");
  const isPaid = (roleId: RoleId) => findRole(roles, roleId).seat === "paid";
  const usedSeats =
    members.filter((member) => isPaid(member.roleId)).length +
    invites.filter((invite) => !isInviteExpired(invite) && isPaid(invite.roleId)).length;

  const visibleMembers = filterMembers(members, filters);
  const visibleInvites = filterInvites(invites, filters);
  const openMember = members.find((member) => member.id === openMemberId) ?? null;
  const activeTab = canInvite ? tab : "members";

  const noResults = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        filters.query.trim() ? `No results match "${filters.query.trim()}"` : "No results match these filters"
      }
    >
      <Button onClick={() => setFilters(EMPTY_FILTERS)}>Clear filters</Button>
    </Empty>
  );

  const noInvites = (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No pending invitations">
      <Button icon={<LuUserPlus />} onClick={() => setIsInviteOpen(true)}>
        Invite members
      </Button>
    </Empty>
  );

  const membersTab = (
    <MembersTable
      members={visibleMembers}
      access={access}
      emptyState={noResults}
      onOpen={setOpenMemberId}
      onChangeRole={actions.changeRole}
      onSignOut={actions.signOut}
      onRemove={actions.removeMembers}
    />
  );

  const invitesTab = (
    <InvitesTable
      invites={visibleInvites}
      members={members}
      access={access}
      emptyState={isFiltered(filters) ? noResults : noInvites}
      onChangeRole={actions.changeInviteRole}
      onResend={actions.resendInvites}
      onCopyLink={actions.copyInviteLink}
      onRevoke={actions.revokeInvites}
    />
  );

  return (
    <SettingsPage
      title="Members"
      description={`Manage who can access ${currentWorkspace.name} and what they can do.`}
      width="wide"
      actions={
        canInvite && (
          <Button type="primary" icon={<LuUserPlus />} onClick={() => setIsInviteOpen(true)}>
            Invite members
          </Button>
        )
      }
    >
      {access.can("billing.view") && <SeatsStrip usedSeats={usedSeats} canManageSeats={access.can("billing.manage")} />}

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setTab(key as Tab)}
        className="[&_.ant-tabs-ink-bar]:bg-ink! [&_.ant-tabs-nav]:mb-4 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-ink!"
        items={[
          { key: "members", label: <TabLabel label="Members" count={members.length} /> },
          ...(canInvite ? [{ key: "invites", label: <TabLabel label="Invitations" count={invites.length} /> }] : []),
        ]}
      />

      <MembersToolbar
        filters={filters}
        onChange={setFilters}
        searchPlaceholder={activeTab === "members" ? "Search by name or email" : "Search by email"}
        showMfaFilter={activeTab === "members" && access.can("security.manage")}
        onExport={activeTab === "members" && access.can("members.updateRole") ? actions.exportCsv : undefined}
      />

      {activeTab === "members" ? membersTab : invitesTab}

      <MemberDrawer
        member={openMember}
        members={members}
        access={access}
        onClose={() => setOpenMemberId(null)}
        onChangeRole={(member, roleId) => actions.changeRole([member], roleId)}
        onSignOut={actions.signOut}
        onRemove={(member) => actions.removeMembers([member])}
      />

      <InviteMembersModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        members={members}
        invites={invites}
        seatsLeft={Math.max(PAID_SEATS - usedSeats, 0)}
        onSend={(emails, roleId) => {
          actions.sendInvites(emails, roleId);
          setTab("invites");
        }}
      />
    </SettingsPage>
  );
}
