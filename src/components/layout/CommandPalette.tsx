import { Modal } from "antd";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  LuFolder,
  LuFolderPlus,
  LuHouse,
  LuLayoutTemplate,
  LuPlus,
  LuSearch,
  LuSearchX,
  LuSquareKanban,
  LuStar,
  LuTimer,
  LuTrash2,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { VIEW_PATHS, useDashboardLocation } from "../../hooks/useDashboardLocation";
import { useWorkspaceActions } from "../../hooks/useWorkspaceActions";
import { editedPhrase } from "../dashboard/boardStatus";
import { countBoardsInTree, getAncestors, pluralize } from "../../lib/folderTree";
import { useFolders } from "../../folders/FoldersContext";
import { boards, templates } from "../../mocks/workspace";
import type { Folder } from "../../types/workspace";
import { CustomInput } from "../ui/CustomInput";

type PaletteItem = {
  id: string;
  group: string;
  icon: ReactNode;
  title: string;
  secondary?: string;
  hint?: ReactNode;
  path?: string;
  run: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  onInvite: () => void;
};

const MAX_PER_GROUP = 5;

// Lower is better: prefix match, then word start, then anywhere. -1 means no match.
function matchScore(text: string, query: string) {
  const value = text.toLowerCase();
  if (value.startsWith(query)) return 0;
  if (value.split(/[\s/·-]+/).some((word) => word.startsWith(query))) return 1;
  return value.includes(query) ? 2 : -1;
}

function folderPath(folders: Folder[], folderId: string) {
  return getAncestors(folders, folderId)
    .map((folder) => folder.name)
    .join(" / ");
}

function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.toLowerCase().indexOf(query) : -1;
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent text-ink underline decoration-brand/40 underline-offset-2">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function CommandPalette({ open, onClose, onInvite }: CommandPaletteProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      keyboard={false}
      centered={false}
      width="40rem"
      style={{ top: "12vh", paddingBottom: 0 }}
      destroyOnHidden
      mask={{ blur: true }}
      classNames={{
        mask: "bg-ink/25",
        container: "overflow-hidden rounded-xl border border-line p-0 shadow-overlay",
        body: "p-0",
      }}
      aria-label="Search"
    >
      <PaletteContent onClose={onClose} onInvite={onInvite} />
    </Modal>
  );
}

function PaletteContent({ onClose, onInvite }: Omit<CommandPaletteProps, "open">) {
  const navigate = useNavigate();
  const { folders } = useFolders();
  const { setQuery } = useDashboardLocation();
  const actions = useWorkspaceActions();
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const query = search.trim().toLowerCase();

  function go(path: string) {
    navigate(path);
    onClose();
  }

  function runAndClose(action: () => void) {
    action();
    onClose();
  }

  const quickActions: PaletteItem[] = [
    {
      id: "a-board",
      group: "Quick actions",
      icon: <LuPlus />,
      title: "New board",
      hint: <kbd className="kbd">B</kbd>,
      run: () => runAndClose(actions.createBoard),
    },
    {
      id: "a-retro",
      group: "Quick actions",
      icon: <LuTimer />,
      title: "New retrospective",
      hint: <kbd className="kbd">R</kbd>,
      run: () => runAndClose(actions.startRetro),
    },
    {
      id: "a-folder",
      group: "Quick actions",
      icon: <LuFolderPlus />,
      title: "New folder",
      hint: <kbd className="kbd">F</kbd>,
      run: () => runAndClose(actions.createFolder),
    },
    {
      id: "a-invite",
      group: "Quick actions",
      icon: <LuUserPlus />,
      title: "Invite teammates",
      run: () => runAndClose(onInvite),
    },
    {
      id: "a-templates",
      group: "Quick actions",
      icon: <LuLayoutTemplate />,
      title: "Browse templates",
      run: () => go(VIEW_PATHS.templates),
    },
  ];

  const goToItems: PaletteItem[] = [
    { id: "g-recent", group: "Go to", icon: <LuHouse />, title: "Recent", run: () => go(VIEW_PATHS.recent) },
    { id: "g-starred", group: "Go to", icon: <LuStar />, title: "Starred", run: () => go(VIEW_PATHS.starred) },
    { id: "g-shared", group: "Go to", icon: <LuUsers />, title: "Shared with me", run: () => go(VIEW_PATHS.shared) },
    { id: "g-trash", group: "Go to", icon: <LuTrash2 />, title: "Trash", run: () => go(VIEW_PATHS.trash) },
  ];

  const boardItem = (board: (typeof boards)[number], group: string): PaletteItem => ({
    id: `b-${board.id}`,
    group,
    icon: <LuSquareKanban />,
    title: board.name,
    secondary: folderPath(folders, board.folderId),
    hint: `Edited ${editedPhrase(board.editedLabel)}`,
    path: `/app/boards/${board.id}`,
    run: () => go(`/app/boards/${board.id}`),
  });

  function ranked<T>(list: T[], getText: (item: T) => string) {
    return list
      .map((item) => ({ item, score: matchScore(getText(item), query) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, MAX_PER_GROUP)
      .map(({ item }) => item);
  }

  let items: PaletteItem[];
  if (!query) {
    const recentBoards = [...boards].sort((a, b) => a.editedOrder - b.editedOrder).slice(0, MAX_PER_GROUP);
    items = [...recentBoards.map((board) => boardItem(board, "Recent boards")), ...quickActions, ...goToItems];
  } else {
    const searchAll: PaletteItem = {
      id: "search-all",
      group: "",
      icon: <LuSearch />,
      title: `Search all boards for "${search.trim()}"`,
      run: () => {
        navigate(VIEW_PATHS.recent);
        setQuery(search.trim());
        onClose();
      },
    };
    const matchedBoards = ranked(boards, (board) => `${board.name} ${folderPath(folders, board.folderId)}`);
    const matchedFolders = ranked(folders, (folder) => folder.name).map((folder) => ({
      id: `f-${folder.id}`,
      group: "Folders",
      icon: <LuFolder />,
      title: folder.name,
      secondary: folderPath(folders, folder.id),
      hint: pluralize(countBoardsInTree(folders, boards, folder.id), "board"),
      path: `/app/folders/${folder.id}`,
      run: () => go(`/app/folders/${folder.id}`),
    }));
    const matchedTemplates = ranked(templates, (template) => template.name).map((template) => ({
      id: `t-${template.id}`,
      group: "Templates",
      icon: <LuLayoutTemplate />,
      title: template.name,
      secondary: `${template.category} template`,
      run: () => runAndClose(() => actions.createFromTemplate(template.name)),
    }));
    const matchedActions = ranked([...quickActions, ...goToItems], (item) => item.title).map((item) => ({
      ...item,
      group: "Actions",
    }));
    const results = [
      ...matchedBoards.map((board) => boardItem(board, "Boards")),
      ...matchedFolders,
      ...matchedTemplates,
      ...matchedActions,
    ];
    items = results.length > 0 ? [searchAll, ...results] : [];
  }

  const activeItem = items[activeIndex];
  const activeId = activeItem ? `${listId}-${activeItem.id}` : undefined;

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  function moveActive(step: number) {
    if (items.length === 0) return;
    setActiveIndex((current) => (current + step + items.length) % items.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") moveActive(1);
    else if (event.key === "ArrowUp") moveActive(-1);
    else if (event.key === "Home") setActiveIndex(0);
    else if (event.key === "End") setActiveIndex(Math.max(items.length - 1, 0));
    else if (event.key === "Escape") {
      if (search) setSearch("");
      else onClose();
    } else if (event.key === "Enter" && activeItem) {
      if ((event.metaKey || event.ctrlKey) && activeItem.path) window.open(activeItem.path, "_blank");
      else activeItem.run();
    } else return;
    event.preventDefault();
  }

  const groups = items.reduce<{ name: string; items: { item: PaletteItem; index: number }[] }[]>(
    (result, item, index) => {
      const last = result[result.length - 1];
      if (last && last.name === item.group) last.items.push({ item, index });
      else result.push({ name: item.group, items: [{ item, index }] });
      return result;
    },
    [],
  );

  return (
    <div>
      <div className="flex h-13 items-center gap-3 border-b border-line px-4">
        <LuSearch className="size-4.5 shrink-0 text-muted" />
        <div className="flex-1">
          <CustomInput
            variant="borderless"
            size="large"
            autoFocus
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search boards, folders, templates…"
            role="combobox"
            aria-label="Search"
            aria-expanded
            aria-controls={listId}
            aria-activedescendant={activeId}
            className="px-0 text-md shadow-none! outline-none!"
          />
        </div>
        <kbd className="kbd">esc</kbd>
      </div>

      <div ref={listRef} id={listId} role="listbox" className="max-h-[min(60vh,26rem)] scroll-py-2 overflow-y-auto p-2">
        {items.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-lg border border-line text-muted">
              <LuSearchX className="size-4.5" />
            </span>
            <p className="mt-3 text-ui font-medium">No results for "{search.trim()}"</p>
            <p className="text-ui text-muted">Try a different name or folder.</p>
          </div>
        )}

        {groups.map((group, groupIndex) => (
          <div key={`${group.name}-${groupIndex}`} role="group" aria-label={group.name || "Search"}>
            {group.name && (
              <div className={`px-2 pb-1 text-2xs font-medium text-muted ${groupIndex === 0 ? "pt-1" : "pt-2.5"}`}>
                {group.name}
              </div>
            )}
            {group.items.map(({ item, index }) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.id}
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={item.run}
                  className={`flex h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-ui text-ink ${isActive ? "bg-hover" : ""}`}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-muted [&_svg]:size-3.5">
                    {item.icon}
                  </span>
                  <span className="truncate font-medium">
                    <Highlight text={item.title} query={query} />
                  </span>
                  {item.secondary && <span className="truncate text-muted">{item.secondary}</span>}
                  <span className="ml-auto shrink-0 text-2xs text-muted">
                    {isActive ? <kbd className="kbd">↵</kbd> : item.hint}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex h-10 items-center gap-4 border-t border-line bg-hover-subtle px-3 text-2xs text-muted">
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">↵</kbd>
          Open
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">esc</kbd>
          Close
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <kbd className="kbd">⌘↵</kbd>
          Open in new tab
        </span>
        <span className="sr-only" aria-live="polite">
          {pluralize(items.length, "result")}
        </span>
      </div>
    </div>
  );
}
