import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { SectionErrorBoundary } from "../components/errors/SectionErrorBoundary";
import { Sidebar } from "../components/layout/Sidebar";
import { TopBar } from "../components/layout/TopBar";
import { useSearchShortcut } from "../hooks/useSearchShortcut";
import { importWithReload } from "../lib/lazyPage";
import { LAST_APP_PATH_KEY } from "../lib/navigation";

// Modals aren't needed for the first paint, so their code loads the first time they open.
const CommandPalette = lazy(() =>
  importWithReload(() => import("../components/layout/CommandPalette")).then((m) => ({ default: m.CommandPalette })),
);
const InviteModal = lazy(() =>
  importWithReload(() => import("../components/layout/InviteModal")).then((m) => ({ default: m.InviteModal })),
);

export function MainLayout() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasOpenedInvite, setHasOpenedInvite] = useState(false);
  const [hasOpenedSearch, setHasOpenedSearch] = useState(false);

  function openInvite() {
    setHasOpenedInvite(true);
    setIsInviteOpen(true);
  }

  function openSearch() {
    setHasOpenedSearch(true);
    setIsSearchOpen(true);
  }

  function toggleSearch() {
    setHasOpenedSearch(true);
    setIsSearchOpen((open) => !open);
  }

  const navigate = useNavigate();
  useSearchShortcut(toggleSearch, openSearch, () => navigate("/app/settings/profile"));

  // Settings' "Back to app" returns to the last page you were on.
  const { pathname, search } = useLocation();
  useEffect(() => {
    sessionStorage.setItem(LAST_APP_PATH_KEY, pathname + search);
  }, [pathname, search]);

  return (
    <div className="flex h-screen min-w-275 bg-surface">
      <SectionErrorBoundary>
        <Sidebar onInvite={openInvite} />
      </SectionErrorBoundary>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <SectionErrorBoundary>
          <TopBar onInvite={openInvite} onOpenSearch={openSearch} />
        </SectionErrorBoundary>
        <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-x-0 top-14 bottom-0" />
        <main className="relative flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Suspense fallback={null}>
        {hasOpenedInvite && <InviteModal open={isInviteOpen} onClose={() => setIsInviteOpen(false)} />}
        {hasOpenedSearch && (
          <CommandPalette open={isSearchOpen} onClose={() => setIsSearchOpen(false)} onInvite={openInvite} />
        )}
      </Suspense>
    </div>
  );
}
