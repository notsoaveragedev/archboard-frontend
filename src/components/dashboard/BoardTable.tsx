import { Button, Pagination, Select, Table, type TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { LuSquareKanban, LuStar } from "react-icons/lu";
import { Link } from "react-router";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import { pluralize } from "../../lib/folderTree";
import { useFolders } from "../../folders/FoldersContext";
import { currentMember, findMemberByFirstName } from "../../mocks/workspace";
import type { Board } from "../../types/workspace";
import { MemberAvatar } from "../ui/MemberAvatar";
import { BoardActions } from "./BoardActions";
import { BulkActionBar } from "./BulkActionBar";
import { StatusBadge } from "./StatusBadge";
import { boardPath } from "./boardStatus";

const PAGE_SIZE_OPTIONS = [10, 20, 50].map((size) => ({ value: size, label: String(size) }));
const currentOwner = currentMember.name.split(" ")[0];

type BoardTableProps = {
  boards: Board[];
  starredIds: Set<string>;
  onToggleStar: (boardId: string) => void;
  showFolder: boolean;
};

export function BoardTable({ boards, starredIds, onToggleStar, showFolder }: BoardTableProps) {
  const toast = useToast();
  const confirm = useConfirm();
  const { folders } = useFolders();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pagedBoards = boards.slice((page - 1) * pageSize, page * pageSize);
  const from = boards.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, boards.length);
  const selectedCount = selectedIds.length;

  useEffect(() => {
    if (selectedCount === 0) return;
    const clearOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIds([]);
    };
    window.addEventListener("keydown", clearOnEscape);
    return () => window.removeEventListener("keydown", clearOnEscape);
  }, [selectedCount]);

  function changePage(nextPage: number) {
    setPage(nextPage);
    setSelectedIds([]);
  }

  function starSelected() {
    selectedIds.filter((id) => !starredIds.has(id)).forEach(onToggleStar);
    toast.success(`Starred ${pluralize(selectedCount, "board")}`);
    setSelectedIds([]);
  }

  async function deleteSelected() {
    const count = selectedCount;
    const isConfirmed = await confirm({
      title: `Move ${pluralize(count, "board")} to Trash?`,
      description: "You can restore them from Trash for 30 days.",
      confirmLabel: "Move to Trash",
      isDanger: true,
    });
    if (!isConfirmed) return;

    setSelectedIds([]);
    toast.warning(`${pluralize(count, "board")} moved to Trash`, "They'll be deleted after 30 days.", {
      label: "Undo",
      onClick: () => toast.success(`${pluralize(count, "board")} restored`),
    });
  }

  function bulkToast(title: string, description: string) {
    toast.success(title, description);
    setSelectedIds([]);
  }

  const columns: TableColumnsType<Board> = [
    {
      title: "Name",
      key: "name",
      render: (_, board) => (
        <Link to={boardPath(board)} className="flex min-w-0 items-center gap-3 rounded-sm text-ink hover:text-ink">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-line bg-app text-muted">
            <LuSquareKanban className="size-3.5" />
          </span>
          <span className="truncate font-medium decoration-line-strong underline-offset-4 group-hover:underline">
            {board.name}
          </span>
          {starredIds.has(board.id) && <LuStar className="size-3 shrink-0 fill-warning text-warning" />}
        </Link>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "8.5rem",
      render: (_, board) => <StatusBadge board={board} />,
    },
    {
      title: "Owner",
      key: "owner",
      width: "10rem",
      render: (_, board) => {
        const member = findMemberByFirstName(board.owner);
        return (
          <span className="flex min-w-0 items-center gap-2">
            {member && <MemberAvatar member={member} size="xs" showTooltip={false} />}
            <span className="truncate">{board.owner === currentOwner ? "You" : board.owner}</span>
          </span>
        );
      },
    },
    ...(showFolder
      ? [
          {
            title: "Folder",
            key: "folder",
            width: "10rem",
            render: (_: unknown, board: Board) => (
              <span className="block truncate text-muted">{folders.find((folder) => folder.id === board.folderId)?.name}</span>
            ),
          },
        ]
      : []),
    {
      title: "Last edited",
      key: "edited",
      width: "8.5rem",
      render: (_, board) => <span className="text-muted tabular-nums">{board.editedLabel}</span>,
    },
    {
      key: "actions",
      width: "4.5rem",
      render: (_, board) => {
        const isStarred = starredIds.has(board.id);
        return (
          <div className="flex justify-end gap-0.5">
            <Button
              type="text"
              size="small"
              aria-pressed={isStarred}
              aria-label={isStarred ? "Unstar" : "Star"}
              onClick={() => onToggleStar(board.id)}
              icon={<LuStar className={isStarred ? "fill-warning text-warning" : ""} />}
              className={`text-muted hover:text-ink ${isStarred ? "" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}
            />
            <BoardActions
              board={board}
              isStarred={isStarred}
              onToggleStar={() => onToggleStar(board.id)}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <Table<Board>
          rowKey="id"
          size="middle"
          tableLayout="fixed"
          columns={columns}
          dataSource={pagedBoards}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (keys) => setSelectedIds(keys as string[]),
            columnWidth: "2.5rem",
          }}
          classNames={{
            header: { cell: "h-10! border-b border-line text-ui font-medium whitespace-nowrap text-muted" },
            body: { row: "group", cell: "text-ui text-ink" },
          }}
          className="[&_.ant-table-tbody>tr:last-child>td]:border-b-0"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-ui text-muted">
        <span className="tabular-nums">
          {selectedCount > 0 ? `${selectedCount} of ${boards.length} selected` : `Showing ${from}–${to} of ${boards.length}`}
        </span>
        {boards.length > PAGE_SIZE_OPTIONS[0].value && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              Rows per page
              <Select
                size="small"
                value={pageSize}
                options={PAGE_SIZE_OPTIONS}
                onChange={(size) => {
                  setPageSize(size);
                  changePage(1);
                }}
                className="w-17"
              />
            </label>
            <Pagination
              size="small"
              current={page}
              pageSize={pageSize}
              total={boards.length}
              onChange={changePage}
              showSizeChanger={false}
              showLessItems
              className="[&_.ant-pagination-item-active]:border-line-strong [&_.ant-pagination-item-active]:shadow-xs"
            />
          </div>
        )}
      </div>

      {selectedCount > 0 && (
        <BulkActionBar
          count={selectedCount}
          onClear={() => setSelectedIds([])}
          onStar={starSelected}
          onMove={() => bulkToast(`Moved ${pluralize(selectedCount, "board")}`, "They're now in System design.")}
          onDuplicate={() => bulkToast(`Duplicated ${pluralize(selectedCount, "board")}`, "Copies were added to this folder.")}
          onShare={() => bulkToast("Share links copied", `${pluralize(selectedCount, "link")} copied to your clipboard.`)}
          onDelete={deleteSelected}
        />
      )}
    </>
  );
}
