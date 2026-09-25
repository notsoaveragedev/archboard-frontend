import { Button } from "antd";
import { LuLogOut, LuPlus, LuUserPlus } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { useWorkspaceActions } from "../../hooks/useWorkspaceActions";
import { currentMember } from "../../mocks/workspace";
import { Logo } from "../Logo";
import { MemberAvatar } from "../ui/MemberAvatar";
import { FolderTree } from "./FolderTree";
import { SidebarNav } from "./SidebarNav";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function Sidebar({ onInvite }: { onInvite: () => void }) {
  const { createFolder } = useWorkspaceActions();

  return (
    <aside className="flex min-h-0 w-64 shrink-0 flex-col border-r border-line bg-hover-subtle">
      <div className="flex h-14 shrink-0 items-center border-b border-line px-4">
        <Logo />
      </div>

      <div className="px-3 pt-3 pb-1">
        <WorkspaceSwitcher onInvite={onInvite} />
      </div>

      <SidebarNav />

      <div className="group flex items-center justify-between pt-3 pr-3 pb-1 pl-5">
        <span className="text-2xs font-medium text-muted">Folders</span>
        <Button
          type="text"
          size="small"
          icon={<LuPlus className="size-3.5" />}
          aria-label="New folder"
          title="New folder"
          onClick={createFolder}
          className="text-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-3 pb-3">
        <FolderTree />
      </div>

      <div className="flex flex-col gap-2 border-t border-line p-3">
        <Button type="text" icon={<LuUserPlus />} onClick={onInvite} className="justify-start px-2 text-muted">
          Invite teammates
        </Button>
        <UserRow />
      </div>
    </aside>
  );
}

function UserRow() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const member = user ? { ...currentMember, name: user.name, email: user.email } : currentMember;

  async function handleLogout() {
    try {
      await signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="flex items-center gap-2.5 px-2 py-1">
      <MemberAvatar member={member} showRing />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate font-medium">{member.name}</span>
        <span className="truncate text-2xs text-muted">{member.email}</span>
      </span>
      <Button
        type="text"
        size="small"
        icon={<LuLogOut className="size-4" />}
        aria-label="Log out"
        title="Log out"
        onClick={handleLogout}
        className="text-muted"
      />
    </div>
  );
}
