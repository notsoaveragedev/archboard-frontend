import { Button } from "antd";
import { useEffect, useEffectEvent } from "react";
import { LuChevronLeft } from "react-icons/lu";
import { Outlet, useNavigate } from "react-router";
import { SectionErrorBoundary } from "../components/errors/SectionErrorBoundary";
import { SettingsNav } from "../components/settings/SettingsNav";
import { LAST_APP_PATH_KEY } from "../lib/navigation";

const OPEN_POPUPS = [
  ".ant-dropdown:not(.ant-dropdown-hidden)",
  ".ant-select-dropdown:not(.ant-select-dropdown-hidden)",
  ".ant-picker-dropdown:not(.ant-picker-dropdown-hidden)",
  ".ant-popover:not(.ant-popover-hidden)",
  ".ant-drawer-open",
  ".ant-modal-wrap:not([style*='display: none'])",
].join(", ");

// Esc should close open popups (and skip typing fields) first, not leave settings.
function isInsideOverlay(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return !!element?.closest('[role="dialog"], input, textarea') || !!document.querySelector(OPEN_POPUPS);
}

export function SettingsLayout() {
  const navigate = useNavigate();
  const goBack = () => navigate(sessionStorage.getItem(LAST_APP_PATH_KEY) ?? "/app");

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape" && !isInsideOverlay(event.target)) goBack();
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen min-w-275 bg-surface">
      <aside className="flex min-h-0 w-64 shrink-0 flex-col border-r border-line bg-hover-subtle">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3">
          <Button type="text" icon={<LuChevronLeft />} onClick={goBack} className="flex-1 justify-start px-2 text-muted">
            Back to app
          </Button>
          <kbd className="kbd">Esc</kbd>
        </div>
        <nav aria-label="Settings" className="min-h-0 flex-1 overflow-auto px-3 py-4">
          <SectionErrorBoundary>
            <SettingsNav />
          </SectionErrorBoundary>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
