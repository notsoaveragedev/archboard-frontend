import { useEffect, useEffectEvent } from "react";
import { useBlocker } from "react-router";
import { useConfirm } from "./useConfirm";

// Guards in-app navigation (router blocker) and tab close/reload (beforeunload) while a form is dirty.
export function useUnsavedChanges(isDirty: boolean, pageName: string) {
  const confirm = useConfirm();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  const askToLeave = useEffectEvent(async () => {
    const isConfirmed = await confirm({
      title: "Discard unsaved changes?",
      description: `Your changes to ${pageName} will be lost.`,
      confirmLabel: "Discard",
      isDanger: true,
    });
    if (isConfirmed) blocker.proceed?.();
    else blocker.reset?.();
  });

  useEffect(() => {
    if (blocker.state === "blocked") askToLeave();
  }, [blocker.state]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
}
