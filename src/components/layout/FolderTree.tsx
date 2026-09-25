import { Tree, type TreeDataNode } from "antd";
import { useState } from "react";
import { LuChevronRight, LuFolder } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useDashboardLocation } from "../../hooks/useDashboardLocation";
import { countBoardsInTree, getAncestors, getChildren } from "../../lib/folderTree";
import { boards, folders } from "../../mocks/workspace";

type FolderNode = TreeDataNode & {
  key: string;
  name: string;
  boardCount: number;
  children?: FolderNode[];
};

const DEFAULT_EXPANDED = ["eng", "sd"];

function buildTree(parentId: string | null): FolderNode[] {
  return getChildren(folders, parentId).map((folder) => {
    const children = buildTree(folder.id);
    return {
      key: folder.id,
      name: folder.name,
      boardCount: countBoardsInTree(folders, boards, folder.id),
      children: children.length > 0 ? children : undefined,
    };
  });
}

const treeData = buildTree(null);

function parentIds(folderId: string | undefined) {
  return folderId ? getAncestors(folders, folderId).slice(0, -1).map((folder) => folder.id) : [];
}

export function FolderTree() {
  const navigate = useNavigate();
  const { folder } = useDashboardLocation();
  const [expandedKeys, setExpandedKeys] = useState(() => [...DEFAULT_EXPANDED, ...parentIds(folder?.id)]);
  const [syncedFolderId, setSyncedFolderId] = useState(folder?.id);

  // Opening a folder from elsewhere (cards, breadcrumbs) expands its parents in the tree.
  if (folder?.id !== syncedFolderId) {
    setSyncedFolderId(folder?.id);
    setExpandedKeys((keys) => [...new Set([...keys, ...parentIds(folder?.id)])]);
  }

  return (
    <Tree<FolderNode>
      aria-label="Folders"
      blockNode
      treeData={treeData}
      selectedKeys={folder ? [folder.id] : []}
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys as string[])}
      onSelect={(_, { node }) => navigate(`/app/folders/${node.key}`)}
      switcherIcon={({ expanded }) => (
        <LuChevronRight className={`size-3 text-muted transition-transform ${expanded ? "rotate-90" : ""}`} />
      )}
      titleRender={(node) => (
        <span className="flex min-w-0 items-center gap-2">
          <LuFolder className="size-3.75 shrink-0 text-muted" />
          <span className="flex-1 truncate">{node.name}</span>
          <span className="text-2xs text-muted tabular-nums">{node.boardCount}</span>
        </span>
      )}
      className="bg-transparent [&_.ant-tree-indent-unit]:w-3.5 [&_.ant-tree-node-selected]:font-medium [&_.ant-tree-switcher]:w-4.5"
    />
  );
}
