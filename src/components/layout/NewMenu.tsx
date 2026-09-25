import { Button, Dropdown, type MenuProps } from "antd";
import type { ReactNode } from "react";
import { LuChevronDown, LuFolderPlus, LuLayoutTemplate, LuPlus, LuSquarePlus, LuTimer } from "react-icons/lu";
import { useDashboardLocation } from "../../hooks/useDashboardLocation";
import { useWorkspaceActions } from "../../hooks/useWorkspaceActions";

type NewItemProps = {
  icon: ReactNode;
  label: string;
  description: string;
  shortcut: string;
};

function NewItem({ icon, label, description, shortcut }: NewItemProps) {
  return (
    <span className="flex items-start gap-2.5 py-1">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-ink [&_svg]:size-3.5">
        {icon}
      </span>
      <span className="flex flex-1 flex-col gap-px leading-snug">
        <span className="text-ui font-medium text-ink">{label}</span>
        <span className="text-2xs whitespace-normal text-muted">{description}</span>
      </span>
      <kbd className="kbd">{shortcut}</kbd>
    </span>
  );
}

export function NewMenu() {
  const { folder } = useDashboardLocation();
  const { createBoard, createFolder, startRetro, openTemplates } = useWorkspaceActions();

  const items: MenuProps["items"] = [
    {
      key: "board",
      onClick: createBoard,
      label: (
        <NewItem
          icon={<LuSquarePlus />}
          label="Blank board"
          description="Empty infinite canvas"
          shortcut="B"
        />
      ),
    },
    {
      key: "retro",
      onClick: startRetro,
      label: (
        <NewItem
          icon={<LuTimer />}
          label="Retrospective"
          description="Timer, dot voting, private mode"
          shortcut="R"
        />
      ),
    },
    {
      key: "template",
      onClick: openTemplates,
      label: (
        <NewItem
          icon={<LuLayoutTemplate />}
          label="From a template"
          description="Flowcharts, architecture, kanban and more"
          shortcut="T"
        />
      ),
    },
    { type: "divider" },
    {
      key: "folder",
      onClick: createFolder,
      label: (
        <NewItem
          icon={<LuFolderPlus />}
          label="Folder"
          description={folder ? `Inside ${folder.name}` : "At the workspace root"}
          shortcut="F"
        />
      ),
    },
  ];

  return (
    <Dropdown menu={{ items, style: { width: "16.5rem" } }} trigger={["click"]} placement="bottomRight">
      <Button type="primary" icon={<LuPlus className="size-3.75" />}>
        New
        <LuChevronDown className="size-3.5" />
      </Button>
    </Dropdown>
  );
}
