import type { Board, Folder } from "../types/workspace";

export function getChildren(folders: Folder[], parentId: string | null) {
  return folders.filter((folder) => folder.parentId === parentId);
}

export function getDescendantIds(folders: Folder[], folderId: string): string[] {
  return [folderId, ...getChildren(folders, folderId).flatMap((child) => getDescendantIds(folders, child.id))];
}

export function countBoardsInTree(folders: Folder[], boards: Board[], folderId: string) {
  const ids = new Set(getDescendantIds(folders, folderId));
  return boards.filter((board) => ids.has(board.folderId)).length;
}

export function getAncestors(folders: Folder[], folderId: string) {
  const path: Folder[] = [];
  let current = folders.find((folder) => folder.id === folderId);
  while (current) {
    path.unshift(current);
    current = folders.find((folder) => folder.id === current?.parentId);
  }
  return path;
}

export function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
