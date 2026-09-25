import { Dropdown, type MenuProps } from "antd";
import type { ReactNode } from "react";
import { LuChevronUp, LuX } from "react-icons/lu";

export type BarAction = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  // Opens a menu above the bar instead of running onClick.
  menu?: MenuProps;
  danger?: boolean;
};

type ActionBarProps = {
  count: number;
  onClear: () => void;
  actions: BarAction[];
};

const buttonClass =
  "flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-ui font-medium transition-colors [&_svg]:size-3.5";
const toneClass = {
  normal: "text-white/85 hover:bg-white/10 hover:text-white",
  danger: "text-[#FCA5A5] hover:bg-[#DC2626]/20 hover:text-[#FECACA]",
};

function BarButton({ action }: { action: BarAction }) {
  const button = (
    <button
      type="button"
      onClick={action.onClick}
      className={`${buttonClass} ${action.danger ? toneClass.danger : toneClass.normal}`}
    >
      {action.icon}
      {action.label}
      {action.menu && <LuChevronUp className="text-white/50" />}
    </button>
  );

  if (!action.menu) return button;
  return (
    <Dropdown menu={action.menu} trigger={["click"]} placement="top">
      {button}
    </Dropdown>
  );
}

export function ActionBar({ count, onClear, actions }: ActionBarProps) {
  const normalActions = actions.filter((action) => !action.danger);
  const dangerActions = actions.filter((action) => action.danger);

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className="fixed bottom-6 left-[calc(50%+8rem)] z-50 flex h-11 -translate-x-1/2 items-center gap-1 rounded-xl bg-ink pr-1.5 pl-3 text-ui text-white shadow-overlay motion-safe:animate-rise"
    >
      <span className="font-medium tabular-nums">{count} selected</span>
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear selection"
        className="ml-1 flex size-6 cursor-pointer items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
      >
        <LuX className="size-3.5" />
      </button>
      {normalActions.length > 0 && <span className="mx-1.5 h-5 w-px bg-white/15" />}
      {normalActions.map((action) => (
        <BarButton key={action.label} action={action} />
      ))}
      {dangerActions.length > 0 && <span className="mx-1.5 h-5 w-px bg-white/15" />}
      {dangerActions.map((action) => (
        <BarButton key={action.label} action={action} />
      ))}
    </div>
  );
}
