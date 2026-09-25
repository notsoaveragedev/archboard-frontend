import type { ReactNode } from "react";
import { LuFolderPlus, LuLayoutTemplate, LuPlus, LuTimer } from "react-icons/lu";
import { useWorkspaceActions } from "../../hooks/useWorkspaceActions";

type CreateCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isPrimary?: boolean;
  isDashed?: boolean;
};

function CreateCard({ icon, title, description, onClick, isPrimary = false, isDashed = false }: CreateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-lg border bg-surface p-3 text-left transition-colors hover:border-line-strong hover:bg-hover-subtle ${
        isDashed ? "border-dashed border-line-strong" : "border-line"
      }`}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-md border [&_svg]:size-4 ${
          isPrimary ? "border-transparent bg-brand text-white" : "border-line bg-surface text-ink"
        }`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-ui font-medium text-ink">{title}</span>
        <span className="truncate text-2xs text-muted">{description}</span>
      </span>
    </button>
  );
}

export function CreateRow({ folderName }: { folderName: string }) {
  const { createBoard, createFolder, startRetro, openTemplates } = useWorkspaceActions();

  return (
    <section aria-label="Create" className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
      <CreateCard icon={<LuPlus />} title="Blank board" description="Sketch freely on an empty canvas" onClick={createBoard} isPrimary />
      <CreateCard icon={<LuTimer />} title="Retrospective" description="Timer, dot voting and private mode" onClick={startRetro} />
      <CreateCard icon={<LuLayoutTemplate />} title="From a template" description="10 templates to start from" onClick={openTemplates} />
      <CreateCard icon={<LuFolderPlus />} title="New folder" description={`Inside ${folderName}`} onClick={createFolder} isDashed />
    </section>
  );
}
