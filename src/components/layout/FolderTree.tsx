import { Tree, type TreeDataNode } from "antd";
import { useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useFolders } from "../../folders/FoldersContext";
import { useDashboardLocation } from "../../hooks/useDashboardLocation";
import { FolderGlyph } from "../folders/FolderGlyph";
import { countBoardsInTree, getAncestors, getChildren } from "../../lib/folderTree";
import { boards } from "../../mocks/workspace";
import type { Folder } from "../../types/workspace";
import { FolderActionsMenu } from "../folders/FolderActionsMenu";

type FolderNode = TreeDataNode & {
  key: string;
  folder: Folder;
  boardCount: number;
  children?: FolderNode[];
};

const DEFAULT_EXPANDED = ["eng", "sd"];

function buildTree(folders: Folder[], parentId: string | null): FolderNode[] {
  return getChildren(folders, parentId).map((folder) => {
    const children = buildTree(folders, folder.id);
    return {
      key: folder.id,
      folder,
      boardCount: countBoardsInTree(folders, boards, folder.id),
      children: children.length > 0 ? children : undefined,
    };
  });
}

export function FolderTree() {
  const navigate = useNavigate();
  const { folders } = useFolders();
  const { folder } = useDashboardLocation();

  const parentIds = (folderId: string | undefined) =>
    folderId ? getAncestors(folders, folderId).slice(0, -1).map((item) => item.id) : [];

  const [expandedKeys, setExpandedKeys] = useState(() => [...DEFAULT_EXPANDED, ...parentIds(folder?.id)]);
  const [syncedFolderId, setSyncedFolderId] = useState(folder?.id);

  // Opening a folder from elsewhere (cards, breadcrumbs, a new folder) expands its parents in the tree.
  if (folder?.id !== syncedFolderId) {
    setSyncedFolderId(folder?.id);
    setExpandedKeys((keys) => [...new Set([...keys, ...parentIds(folder?.id)])]);
  }

  return (
    <Tree<FolderNode>
      aria-label="Folders"
      blockNode
      treeData={buildTree(folders, null)}
      selectedKeys={folder ? [folder.id] : []}
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys as string[])}
      onSelect={(_, { node }) => navigate(`/app/folders/${node.key}`)}
      switcherIcon={({ expanded }) => (
        <LuChevronRight className={`size-3 text-muted transition-transform ${expanded ? "rotate-90" : ""}`} />
      )}
      titleRender={(node) => (
        <span className="group/row flex min-w-0 items-center gap-2">
          <FolderGlyph color={node.folder.color} icon={node.folder.icon} className="size-3.75" />
          <span className="flex-1 truncate">{node.folder.name}</span>
          <span className="text-2xs text-muted tabular-nums group-hover/row:hidden">{node.boardCount}</span>
          <FolderActionsMenu
            folder={node.folder}
            className="-my-1 hidden size-6 min-w-6 group-hover/row:inline-flex [&.ant-dropdown-open]:inline-flex"
          />
        </span>
      )}
      className="bg-transparent [&_.ant-tree-indent-unit]:w-3.5 [&_.ant-tree-node-selected]:font-medium [&_.ant-tree-switcher]:w-4.5"
    />
  );
}
