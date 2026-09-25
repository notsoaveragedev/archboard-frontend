import { Button, Segmented } from "antd";
import { useState } from "react";
import { useWorkspaceActions } from "../../hooks/useWorkspaceActions";
import type { Template } from "../../types/workspace";
import { BoardThumbnail } from "./BoardThumbnail";

type CategoryFilter = "All" | Template["category"];

const CATEGORIES: CategoryFilter[] = ["All", "Engineering", "Product", "Agile", "Planning"];

export function TemplateGrid({ templates }: { templates: Template[] }) {
  const { createFromTemplate } = useWorkspaceActions();
  const [category, setCategory] = useState<CategoryFilter>("All");
  const visibleTemplates = category === "All" ? templates : templates.filter((item) => item.category === category);

  return (
    <>
      <Segmented
        aria-label="Template category"
        value={category}
        onChange={(value) => setCategory(value as CategoryFilter)}
        options={CATEGORIES}
        className="mb-5 [&_.ant-segmented-item-label]:px-3 [&_.ant-segmented-item-label]:font-medium"
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(16.25rem,1fr))] gap-4">
        {visibleTemplates.map((template) => (
          <article
            key={template.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors focus-within:ring-2 focus-within:ring-brand/30 hover:border-line-strong"
          >
            <BoardThumbnail shapes={template.thumbnail}>
              <span className="absolute top-2 left-2 inline-flex h-5 items-center rounded-md border border-line bg-surface px-1.5 text-2xs font-medium text-muted">
                {template.category}
              </span>
            </BoardThumbnail>
            <div className="flex flex-1 flex-col gap-3 px-3 py-2.5">
              <div className="flex-1">
                <div className="text-ui font-medium">{template.name}</div>
                <p className="mt-0.5 text-2xs leading-normal text-muted">{template.description}</p>
              </div>
              <div className="flex h-7 items-center justify-between">
                <span className="text-2xs text-muted tabular-nums">Used {template.usedCount.toLocaleString()} times</span>
                <Button
                  size="small"
                  onClick={() => createFromTemplate(template.name)}
                  className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
                >
                  Use template
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
