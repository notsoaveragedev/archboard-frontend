import { Button, Dropdown, type MenuProps } from "antd";
import { useState } from "react";
import { LuEllipsis } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import type { Board } from "../../types/workspace";
import { MoveBoardModal, RenameBoardModal } from "./BoardDialogs";
import { boardPath } from "./boardStatus";

type BoardActionsProps = {
  board: Board;
  isStarred: boolean;
  onToggleStar: () => void;
  className?: string;
};

type Dialog = "rename" | "move" | null;

export function BoardActions({ board, isStarred, onToggleStar, className = "" }: BoardActionsProps) {
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function moveToTrash() {
    const isConfirmed = await confirm({
      title: `Move "${board.name}" to Trash?`,
      description: "You can restore it from Trash for 30 days.",
      confirmLabel: "Move to Trash",
      isDanger: true,
    });
    if (!isConfirmed) return;

    toast.warning("Moved to Trash", `"${board.name}" can be restored for 30 days.`, {
      label: "Undo",
      onClick: () => toast.success("Board restored", `"${board.name}" is back in its folder.`),
    });
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(`${window.location.origin}${boardPath(board)}`);
    toast.success("Link copied", `Anyone with access to "${board.name}" can open it.`);
  }

  const items: MenuProps["items"] = [
    { key: "open", label: "Open", onClick: () => navigate(boardPath(board)) },
    { key: "rename", label: "Rename", onClick: () => setDialog("rename") },
    { key: "move", label: "Move to…", onClick: () => setDialog("move") },
    {
      key: "duplicate",
      label: "Duplicate",
      onClick: () => toast.success("Board duplicated", `"Copy of ${board.name}" was added to this folder.`),
    },
    { key: "share", label: "Copy link", onClick: copyShareLink },
    { key: "star", label: isStarred ? "Unstar" : "Star", onClick: onToggleStar },
    {
      key: "download",
      label: "Download",
      onClick: () => toast.success("Download started", `${board.name}.json is being prepared.`),
    },
    { type: "divider" },
    {
      key: "delete",
      label: "Move to Trash",
      danger: true,
      onClick: moveToTrash,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight" onOpenChange={setIsMenuOpen}>
        <Button
          type="text"
          size="small"
          icon={<LuEllipsis className="size-4" />}
          aria-label={`More options for ${board.name}`}
          title="More"
          className={`text-muted hover:text-ink ${isMenuOpen ? "opacity-100" : className}`}
        />
      </Dropdown>
      <RenameBoardModal board={board} open={dialog === "rename"} onClose={() => setDialog(null)} />
      <MoveBoardModal board={board} open={dialog === "move"} onClose={() => setDialog(null)} />
    </>
  );
}
