import { useReducer, useState, type ReactNode } from "react";
import { useMatch, useNavigate } from "react-router";
import { FolderFormModal, type FolderFormValues } from "../components/folders/FolderFormModal";
import { useConfirm } from "../hooks/useConfirm";
import { useToast } from "../hooks/useToast";
import { countBoardsInTree, getDescendantIds, pluralize } from "../lib/folderTree";
import { boards, folders as initialFolders } from "../mocks/workspace";
import type { Folder } from "../types/workspace";
import { FoldersContext } from "./FoldersContext";

type FolderAction =
  | { type: "created"; folder: Folder }
  | { type: "updated"; id: string; changes: Partial<Folder> }
  | { type: "removed"; ids: string[] }
  | { type: "restored"; folders: Folder[] };

function foldersReducer(folders: Folder[], action: FolderAction): Folder[] {
  switch (action.type) {
    case "created":
      return [...folders, action.folder];
    case "updated":
      return folders.map((folder) => (folder.id === action.id ? { ...folder, ...action.changes } : folder));
    case "removed":
      return folders.filter((folder) => !action.ids.includes(folder.id));
    case "restored":
      return [...folders, ...action.folders];
  }
}

type Dialog = { mode: "create"; parentId: string | null } | { mode: "edit"; folder: Folder } | null;

export function FoldersProvider({ children }: { children: ReactNode }) {
  const [folders, dispatch] = useReducer(foldersReducer, initialFolders);
  const [dialog, setDialog] = useState<Dialog>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const currentFolderId = useMatch("/app/folders/:folderId")?.params.folderId;

  function saveFolder(values: FolderFormValues) {
    if (dialog?.mode === "edit") {
      dispatch({ type: "updated", id: dialog.folder.id, changes: values });
      toast.success("Folder updated", `"${values.name}" has been saved.`);
    } else {
      const folder: Folder = { id: crypto.randomUUID(), ...values };
      dispatch({ type: "created", folder });
      navigate(`/app/folders/${folder.id}`);
      toast.success("Folder created", `"${folder.name}" is ready for boards.`);
    }
    setDialog(null);
  }

  async function deleteFolder(folder: Folder) {
    const ids = getDescendantIds(folders, folder.id);
    const boardCount = countBoardsInTree(folders, boards, folder.id);
    const contents = [
      ids.length > 1 ? pluralize(ids.length - 1, "subfolder") : "",
      boardCount > 0 ? pluralize(boardCount, "board") : "",
    ].filter(Boolean);

    const isConfirmed = await confirm({
      title: `Delete "${folder.name}"?`,
      description: contents.length
        ? `The folder and its ${contents.join(" and ")} move to Trash. You can restore them for 30 days.`
        : "The folder moves to Trash. You can restore it for 30 days.",
      confirmLabel: "Delete folder",
      isDanger: true,
    });
    if (!isConfirmed) return;

    const removed = folders.filter((item) => ids.includes(item.id));
    dispatch({ type: "removed", ids });
    if (currentFolderId && ids.includes(currentFolderId)) {
      navigate(folder.parentId ? `/app/folders/${folder.parentId}` : "/app", { replace: true });
    }
    toast.warning("Folder deleted", `"${folder.name}" was moved to Trash.`, {
      label: "Undo",
      onClick: () => {
        dispatch({ type: "restored", folders: removed });
        toast.success("Folder restored", `"${folder.name}" is back.`);
      },
    });
  }

  return (
    <FoldersContext
      value={{
        folders,
        openCreateFolder: (parentId) => setDialog({ mode: "create", parentId }),
        openEditFolder: (folder) => setDialog({ mode: "edit", folder }),
        deleteFolder,
      }}
    >
      {children}
      <FolderFormModal
        open={dialog !== null}
        folder={dialog?.mode === "edit" ? dialog.folder : undefined}
        defaultParentId={dialog?.mode === "create" ? dialog.parentId : null}
        folders={folders}
        onSubmit={saveFolder}
        onClose={() => setDialog(null)}
      />
    </FoldersContext>
  );
}
