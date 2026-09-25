import { useEffect, useEffectEvent } from "react";

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
export const searchShortcutLabel = isMac ? "⌘K" : "Ctrl K";

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return !!element && (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName));
}

// ⌘K / Ctrl+K toggles search from anywhere; "/" opens it when the user isn't typing.
export function useSearchShortcut(onToggle: () => void, onOpen: () => void) {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      onToggle();
    } else if (event.key === "/" && !isTypingTarget(event.target)) {
      event.preventDefault();
      onOpen();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
