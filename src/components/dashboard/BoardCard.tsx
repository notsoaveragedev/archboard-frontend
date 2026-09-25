import { Button } from "antd";
import { LuStar } from "react-icons/lu";
import { Link } from "react-router";
import type { Board } from "../../types/workspace";
import { BoardActions } from "./BoardActions";
import { BoardThumbnail } from "./BoardThumbnail";
import { StatusBadge } from "./StatusBadge";
import { boardMeta, boardPath } from "./boardStatus";

type BoardCardProps = {
  board: Board;
  isStarred: boolean;
  onToggleStar: () => void;
};

const revealOnHover = "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100";

export function BoardCard({ board, isStarred, onToggleStar }: BoardCardProps) {
  const starLabel = isStarred ? "Unstar" : "Star";

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors focus-within:ring-2 focus-within:ring-brand/30 hover:border-line-strong">
      <Link to={boardPath(board)} aria-label={`Open ${board.name}`} className="block">
        <BoardThumbnail shapes={board.thumbnail} highlightIndex={board.status === "live" ? 4 : undefined}>
          <StatusBadge board={board} className="absolute top-2 left-2" />
        </BoardThumbnail>
      </Link>

      <div className="flex items-center gap-1 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <Link to={boardPath(board)} className="block truncate text-ui font-medium text-ink hover:text-ink">
            {board.name}
          </Link>
          <div className="mt-0.5 truncate text-2xs text-muted">{boardMeta(board)}</div>
        </div>
        <Button
          type="text"
          size="small"
          aria-pressed={isStarred}
          aria-label={starLabel}
          title={starLabel}
          onClick={onToggleStar}
          icon={<LuStar className={isStarred ? "fill-warning text-warning" : ""} />}
          className={`text-muted hover:text-ink ${isStarred ? "" : revealOnHover}`}
        />
        <BoardActions board={board} isStarred={isStarred} onToggleStar={onToggleStar} className={revealOnHover} />
      </div>
    </article>
  );
}
