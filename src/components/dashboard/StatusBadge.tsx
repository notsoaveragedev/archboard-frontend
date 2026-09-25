import type { Board, BoardStatus } from "../../types/workspace";

const STATUS_CLASSES: Record<BoardStatus, { badge: string; dot: string }> = {
  live: { badge: "border-live-line bg-live-bg text-live-fg", dot: "bg-live-dot motion-safe:animate-pulse" },
  shared: { badge: "border-shared-line bg-shared-bg text-shared-fg", dot: "bg-shared-dot" },
  draft: { badge: "border-line bg-app text-muted", dot: "bg-subtle" },
};

export function StatusBadge({ board, className = "" }: { board: Board; className?: string }) {
  const { badge, dot } = STATUS_CLASSES[board.status];

  return (
    <span
      className={`inline-flex h-5 items-center gap-1.5 rounded-md border px-1.5 text-2xs font-medium whitespace-nowrap ${badge} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {board.status === "live" ? "Live" : board.statusLabel}
    </span>
  );
}
