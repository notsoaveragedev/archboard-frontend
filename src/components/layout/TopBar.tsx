import { Avatar, Breadcrumb, Button } from "antd";
import { LuSearch, LuUserPlus } from "react-icons/lu";
import { Link } from "react-router";
import { VIEW_LABELS, useDashboardLocation } from "../../hooks/useDashboardLocation";
import { searchShortcutLabel } from "../../hooks/useSearchShortcut";
import { getAncestors } from "../../lib/folderTree";
import { folders, members } from "../../mocks/workspace";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { MemberAvatar } from "../ui/MemberAvatar";
import { NewMenu } from "./NewMenu";

const VISIBLE_MEMBERS = 3;

type TopBarProps = {
  onInvite: () => void;
  onOpenSearch: () => void;
};

export function TopBar({ onInvite, onOpenSearch }: TopBarProps) {
  const { view, folder } = useDashboardLocation();
  const { currentWorkspace } = useWorkspace();

  const crumbs = folder
    ? getAncestors(folders, folder.id).map((item, index, path) => ({
        title: index === path.length - 1 ? item.name : <Link to={`/app/folders/${item.id}`}>{item.name}</Link>,
      }))
    : [{ title: VIEW_LABELS[view ?? "recent"] }];

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-6">
      <Breadcrumb items={crumbs} className="min-w-0 flex-1 whitespace-nowrap [&_li:last-child]:font-medium" />

      <button
        type="button"
        onClick={onOpenSearch}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        className="flex h-8.5 w-64 cursor-pointer items-center gap-2 rounded-md border border-line bg-hover-subtle px-2.5 text-ui text-muted transition-colors hover:border-line-strong hover:bg-hover hover:text-ink"
      >
        <LuSearch className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="kbd">{searchShortcutLabel}</kbd>
      </button>

      <Avatar.Group
        max={{
          count: VISIBLE_MEMBERS,
          style: {
            width: "1.75rem",
            height: "1.75rem",
            lineHeight: "1.75rem",
            backgroundColor: "#F0F2F5",
            color: "#0B1220",
            fontSize: "0.625rem",
            fontWeight: 600,
          },
        }}
        className="ml-1"
      >
        {members.map((member) => (
          <MemberAvatar key={member.id} member={member} />
        ))}
        {Array.from({ length: Math.max(currentWorkspace.memberCount - members.length, 0) }, (_, index) => (
          <Avatar key={index} />
        ))}
      </Avatar.Group>

      <span className="mx-1 h-5 w-px bg-line" />

      <div className="flex items-center gap-2">
        <Button icon={<LuUserPlus />} onClick={onInvite}>
          Invite
        </Button>
        <NewMenu />
      </div>
    </header>
  );
}
