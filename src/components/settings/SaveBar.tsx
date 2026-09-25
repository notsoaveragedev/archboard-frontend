import { useEffect, useEffectEvent } from "react";
import { isMac } from "../../hooks/useSearchShortcut";

type SaveBarProps = {
  isDirty: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onReset: () => void;
};

// Floating bar for explicit-save pages. ⌘S / Ctrl+S saves while there are changes.
export function SaveBar({ isDirty, isSaving = false, onSave, onReset }: SaveBarProps) {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s" && isDirty) {
      event.preventDefault();
      onSave();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isDirty) return null;

  return (
    <div
      role="region"
      aria-label="Unsaved changes"
      className="sticky bottom-6 z-10 mx-auto mt-8 flex h-12 w-fit items-center gap-3 rounded-xl bg-ink pr-1.5 pl-4 text-ui text-white shadow-overlay motion-safe:animate-rise"
    >
      <span>Unsaved changes</span>
      <button
        type="button"
        onClick={onReset}
        className="h-8 cursor-pointer rounded-md px-3 font-medium text-white/85 hover:bg-white/10 hover:text-white"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex h-8 cursor-pointer items-center gap-2 rounded-md bg-white px-3 font-medium text-ink hover:bg-white/90 disabled:opacity-70"
      >
        {isSaving ? "Saving…" : "Save changes"}
        <kbd className="font-mono text-3xs text-muted">{isMac ? "⌘S" : "Ctrl S"}</kbd>
      </button>
    </div>
  );
}
