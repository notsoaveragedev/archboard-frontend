import { Menu, type MenuProps } from "antd";
import { LuHouse, LuLayoutTemplate, LuStar, LuTrash2, LuUsers } from "react-icons/lu";
import { useNavigate } from "react-router";
import { VIEW_LABELS, VIEW_PATHS, useDashboardLocation } from "../../hooks/useDashboardLocation";

const TEMPLATE_COUNT = 10;

const items: MenuProps["items"] = [
  { key: VIEW_PATHS.recent, icon: <LuHouse />, label: VIEW_LABELS.recent },
  { key: VIEW_PATHS.shared, icon: <LuUsers />, label: VIEW_LABELS.shared },
  { key: VIEW_PATHS.starred, icon: <LuStar />, label: VIEW_LABELS.starred },
  {
    key: VIEW_PATHS.templates,
    icon: <LuLayoutTemplate />,
    label: VIEW_LABELS.templates,
    extra: <span className="text-2xs text-muted tabular-nums">{TEMPLATE_COUNT}</span>,
  },
  { key: VIEW_PATHS.trash, icon: <LuTrash2 />, label: VIEW_LABELS.trash },
];

export function SidebarNav() {
  const navigate = useNavigate();
  const { view } = useDashboardLocation();

  return (
    <nav aria-label="Main" className="px-3 py-2">
      <Menu
        mode="inline"
        inlineIndent={8}
        items={items}
        selectedKeys={view ? [VIEW_PATHS[view]] : []}
        onClick={({ key }) => navigate(key)}
        className="border-e-0 bg-transparent [&_.ant-menu-item-selected]:font-medium"
      />
    </nav>
  );
}
