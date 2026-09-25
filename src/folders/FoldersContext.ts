import { createContext, use } from "react";
import type { Folder } from "../types/workspace";

type FoldersContextValue = {
  folders: Folder[];
  openCreateFolder: (parentId: string | null) => void;
  openEditFolder: (folder: Folder) => void;
  deleteFolder: (folder: Folder) => void;
};

export const FoldersContext = createContext<FoldersContextValue | null>(null);

export function useFolders() {
  const context = use(FoldersContext);
  if (!context) throw new Error("useFolders must be used inside <FoldersProvider>");
  return context;
}
