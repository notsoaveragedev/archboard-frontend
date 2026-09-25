import type { ReactNode } from "react";
import { LuCopy, LuFolderInput, LuShare2, LuStar, LuTrash2, LuX } from "react-icons/lu";

type BulkActionBarProps = {
  count: number;
  onClear: () => void;
  onStar: () => void;
  onMove: () => void;
  onDuplicate: () => void;
  onShare: () => void;
  onDelete: () => void;
};

function BarButton({ icon, label, onClick, danger = false }: { icon: ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-ui font-medium transition-colors [&_svg]:size-3.5 ${
        danger
          ? "text-[#FCA5A5] hover:bg-[#DC2626]/20 hover:text-[#FECACA]"
          : "text-white/85 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

const Divider = () => <span className="mx-1.5 h-5 w-px bg-white/15" />;

export function BulkActionBar({ count, onClear, onStar, onMove, onDuplicate, onShare, onDelete }: BulkActionBarProps) {
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
      <Divider />
      <BarButton icon={<LuStar />} label="Star" onClick={onStar} />
      <BarButton icon={<LuFolderInput />} label="Move to…" onClick={onMove} />
      <BarButton icon={<LuCopy />} label="Duplicate" onClick={onDuplicate} />
      <BarButton icon={<LuShare2 />} label="Share" onClick={onShare} />
      <Divider />
      <BarButton icon={<LuTrash2 />} label="Delete" onClick={onDelete} danger />
    </div>
  );
}
