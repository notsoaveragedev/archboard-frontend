import type { Board } from "../../types/workspace";

// "Just now" reads as "Edited just now", but dates like "Sep 2" keep their capital.
export function editedPhrase(label: string) {
  return /^(just|last)\b/i.test(label) ? label.toLowerCase() : label;
}

export function boardMeta(board: Board) {
  return board.status === "live"
    ? `Editing now with ${board.collaborators}`
    : `Edited ${editedPhrase(board.editedLabel)} · ${board.owner}`;
}

export function boardPath(board: Board) {
  return `/app/boards/${board.id}`;
}
