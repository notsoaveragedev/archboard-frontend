import { Segmented, Select } from "antd";
import { useState } from "react";
import { LuLayoutGrid, LuList } from "react-icons/lu";
import { BoardCard } from "../../components/dashboard/BoardCard";
import { BoardTable } from "../../components/dashboard/BoardTable";
import { CreateRow } from "../../components/dashboard/CreateRow";
import { EmptyBoards } from "../../components/dashboard/EmptyBoards";
import { FolderCards } from "../../components/dashboard/FolderCards";
import { TemplateGrid } from "../../components/dashboard/TemplateGrid";
import { VIEW_LABELS, useDashboardLocation, type DashboardView } from "../../hooks/useDashboardLocation";
import { getChildren, pluralize } from "../../lib/folderTree";
import { boards, currentMember, folders, starredBoardIds, templates } from "../../mocks/workspace";
import type { Board, Folder } from "../../types/workspace";
import { useWorkspace } from "../../workspace/WorkspaceContext";

type ViewMode = "grid" | "list";
type SortKey = "edited" | "name" | "created";

const SORT_OPTIONS = [
  { value: "edited", label: "Last edited" },
  { value: "name", label: "Name" },
  { value: "created", label: "Created" },
];

const VIEW_MODE_OPTIONS = [
  { value: "grid", icon: <LuLayoutGrid className="size-4" />, title: "Grid view" },
  { value: "list", icon: <LuList className="size-4" />, title: "List view" },
];

const squareSegmentItems =
  "[&_.ant-segmented-item-label]:flex [&_.ant-segmented-item-label]:w-8 [&_.ant-segmented-item-label]:justify-center [&_.ant-segmented-item-label]:px-0";

const EMPTY_TITLES: Record<DashboardView, string> = {
  recent: "No boards yet",
  shared: "Nothing shared with you yet",
  starred: "No starred boards yet",
  templates: "No templates found",
  trash: "Trash is empty",
};

const currentOwner = currentMember.name.split(" ")[0];

type Filters = {
  view: DashboardView | null;
  folder: Folder | null;
  query: string;
  starredIds: Set<string>;
};

function getVisibleBoards({ view, folder, query, starredIds }: Filters): Board[] {
  const search = query.trim().toLowerCase();
  if (search) return boards.filter((board) => board.name.toLowerCase().includes(search));
  if (folder) return boards.filter((board) => board.folderId === folder.id);

  switch (view) {
    case "shared":
      return boards.filter((board) => board.owner !== currentOwner);
    case "starred":
      return boards.filter((board) => starredIds.has(board.id));
    case "templates":
    case "trash":
      return [];
    default:
      return boards;
  }
}

function sortBoards(list: Board[], sort: SortKey) {
  return [...list].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "created") return a.createdOrder - b.createdOrder;
    return a.editedOrder - b.editedOrder;
  });
}

export function DashboardPage() {
  const { view, folder, query } = useDashboardLocation();
  const { currentWorkspace } = useWorkspace();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortKey>("edited");
  const [starredIds, setStarredIds] = useState(() => new Set(starredBoardIds));

  const isSearching = query.trim().length > 0;
  const showTemplates = view === "templates" && !isSearching;
  const visibleBoards = sortBoards(getVisibleBoards({ view, folder, query, starredIds }), sort);
  const subfolders = folder && !isSearching ? getChildren(folders, folder.id) : [];

  function toggleStar(boardId: string) {
    setStarredIds((current) => {
      const next = new Set(current);
      if (next.has(boardId)) next.delete(boardId);
      else next.add(boardId);
      return next;
    });
  }

  const boardCount = pluralize(visibleBoards.length, "board");
  let title = folder?.name ?? VIEW_LABELS[view ?? "recent"];
  let subtitle = boardCount;
  let emptyTitle = folder ? "No boards in this folder yet" : EMPTY_TITLES[view ?? "recent"];

  const emptyVariant = isSearching ? "search" : view === "trash" ? "trash" : "default";

  if (isSearching) {
    title = `Results for “${query.trim()}”`;
    emptyTitle = "No boards match your search";
  } else if (folder) {
    subtitle = [boardCount, subfolders.length > 0 ? pluralize(subfolders.length, "folder") : "", `Shared with ${currentWorkspace.name}`]
      .filter(Boolean)
      .join(" · ");
  } else if (view === "trash") {
    subtitle = "Items are deleted after 30 days";
  } else if (showTemplates) {
    subtitle = `${pluralize(templates.length, "template")} for architecture, product, agile and planning work`;
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-title font-semibold tracking-[-0.01em]">{title}</h1>
          <p className="mt-1 text-ui text-muted">{subtitle}</p>
        </div>
        {!showTemplates && (
          <div className="flex items-center gap-2">
            <Select
              value={sort}
              onChange={setSort}
              options={SORT_OPTIONS}
              prefix={<span className="text-muted">Sort:</span>}
              aria-label="Sort boards"
              className="w-44"
            />
            <Segmented
              aria-label="View"
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
              options={VIEW_MODE_OPTIONS}
              className={squareSegmentItems}
            />
          </div>
        )}
      </div>

      {folder && !isSearching && <CreateRow folderName={folder.name} />}
      {subfolders.length > 0 && <FolderCards folders={subfolders} allFolders={folders} boards={boards} />}

      {showTemplates ? (
        <TemplateGrid templates={templates} />
      ) : (
        <section>
          <h2 className="mb-3 text-ui font-medium">
            Boards <span className="ml-1 text-muted tabular-nums">{visibleBoards.length}</span>
          </h2>
          {visibleBoards.length === 0 && <EmptyBoards title={emptyTitle} variant={emptyVariant} />}
          {visibleBoards.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16.25rem,1fr))] gap-4">
              {visibleBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  isStarred={starredIds.has(board.id)}
                  onToggleStar={() => toggleStar(board.id)}
                />
              ))}
            </div>
          )}
          {visibleBoards.length > 0 && viewMode === "list" && (
            <BoardTable
              key={`${view}-${folder?.id}-${query}-${sort}`}
              boards={visibleBoards}
              starredIds={starredIds}
              onToggleStar={toggleStar}
              showFolder={!folder}
            />
          )}
        </section>
      )}
    </>
  );
}
