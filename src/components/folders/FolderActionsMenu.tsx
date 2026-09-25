import { Button, Dropdown, type MenuProps } from "antd";
import type { MouseEvent } from "react";
import { LuEllipsis, LuFolderOpen, LuFolderPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useFolders } from "../../folders/FoldersContext";
import type { Folder } from "../../types/workspace";

type FolderActionsMenuProps = {
  folder: Folder;
  className?: string;
};

// Menu clicks bubble through React portals, so stop them before they select the tree row or open the card link.
const stop = (event: MouseEvent | { stopPropagation: () => void }) => event.stopPropagation();

export function FolderActionsMenu({ folder, className = "" }: FolderActionsMenuProps) {
  const navigate = useNavigate();
  const { openCreateFolder, openEditFolder, deleteFolder } = useFolders();

  const items: MenuProps["items"] = [
    { key: "open", icon: <LuFolderOpen />, label: "Open", onClick: () => navigate(`/app/folders/${folder.id}`) },
    { key: "edit", icon: <LuPencil />, label: "Edit folder", onClick: () => openEditFolder(folder) },
    { key: "subfolder", icon: <LuFolderPlus />, label: "New subfolder", onClick: () => openCreateFolder(folder.id) },
    { type: "divider" },
    { key: "delete", icon: <LuTrash2 />, label: "Delete folder", danger: true, onClick: () => deleteFolder(folder) },
  ];

  return (
    <Dropdown
      menu={{ items, onClick: ({ domEvent }) => stop(domEvent) }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        size="small"
        icon={<LuEllipsis className="size-4" />}
        aria-label={`Options for ${folder.name}`}
        onClick={(event) => {
          stop(event);
          event.preventDefault();
        }}
        className={`text-muted hover:text-ink ${className}`}
      />
    </Dropdown>
  );
}
