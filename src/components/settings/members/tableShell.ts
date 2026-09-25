import { useEffect } from "react";

// Same shell as BoardTable, with fixed 48px rows.
export const TABLE_CLASS_NAMES = {
  header: { cell: "h-10! border-b border-line text-ui font-medium whitespace-nowrap text-muted" },
  body: { row: "group", cell: "h-12 py-1.5! text-ui text-ink" },
};

export const TABLE_CLASS = "[&_.ant-table-tbody>tr:last-child>td]:border-b-0";

export const TABLE_WRAPPER_CLASS = "overflow-hidden rounded-lg border border-line bg-surface";

export const FADE_IN_CLASS = "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100";

// Listens on document so it runs before the settings layout's window-level "Esc goes back" handler.
export function useEscapeToClear(isActive: boolean, clear: () => void) {
  useEffect(() => {
    if (!isActive) return;
    const clearOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      clear();
    };
    document.addEventListener("keydown", clearOnEscape);
    return () => document.removeEventListener("keydown", clearOnEscape);
  }, [isActive, clear]);
}

export function selectionSummary(selected: number, total: number, noun: string) {
  if (selected > 0) return `${selected} of ${total} selected`;
  return `${total} ${noun}${total === 1 ? "" : "s"}`;
}
