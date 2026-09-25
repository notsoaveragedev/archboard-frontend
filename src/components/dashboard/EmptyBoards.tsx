import { Button } from "antd";
import type { ReactNode } from "react";
import { LuSearchX, LuSquarePlus, LuTrash2 } from "react-icons/lu";
import { useWorkspaceActions } from "../../hooks/useWorkspaceActions";

type EmptyVariant = "default" | "search" | "trash";

const VARIANTS: Record<EmptyVariant, { icon: ReactNode; description: string }> = {
  default: { icon: <LuSquarePlus />, description: "Create a board here, or drag one in from another folder." },
  search: { icon: <LuSearchX />, description: "Try a different name, or check the spelling." },
  trash: { icon: <LuTrash2 />, description: "Deleted boards stay here for 30 days before they're removed." },
};

export function EmptyBoards({ title, variant = "default" }: { title: string; variant?: EmptyVariant }) {
  const { createBoard, openTemplates } = useWorkspaceActions();
  const { icon, description } = VARIANTS[variant];

  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <span className="flex size-10 items-center justify-center rounded-lg border border-line bg-surface text-muted [&_svg]:size-4.5">
        {icon}
      </span>
      <div className="mt-4 text-md font-medium">{title}</div>
      <p className="mt-1 max-w-88 text-ui text-muted">{description}</p>
      {variant === "default" && (
        <div className="mt-4 flex gap-2">
          <Button type="primary" onClick={createBoard}>
            New board
          </Button>
          <Button onClick={openTemplates}>Browse templates</Button>
        </div>
      )}
    </div>
  );
}
