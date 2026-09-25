import { useState } from "react";
import { Outlet } from "react-router";
import { CommandPalette } from "../components/layout/CommandPalette";
import { InviteModal } from "../components/layout/InviteModal";
import { Sidebar } from "../components/layout/Sidebar";
import { TopBar } from "../components/layout/TopBar";
import { useSearchShortcut } from "../hooks/useSearchShortcut";
import { WorkspaceProvider } from "../workspace/WorkspaceProvider";

export function MainLayout() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openInvite = () => setIsInviteOpen(true);
  const openSearch = () => setIsSearchOpen(true);

  useSearchShortcut(() => setIsSearchOpen((open) => !open), openSearch);

  return (
    <WorkspaceProvider>
      <div className="flex h-screen min-w-275 bg-surface">
        <Sidebar onInvite={openInvite} />

        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <TopBar onInvite={openInvite} onOpenSearch={openSearch} />
          <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-x-0 top-14 bottom-0" />
          <main className="relative flex-1 overflow-auto">
            <div className="mx-auto w-full max-w-7xl px-8 py-8">
              <Outlet />
            </div>
          </main>
        </div>

        <InviteModal open={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        <CommandPalette open={isSearchOpen} onClose={() => setIsSearchOpen(false)} onInvite={openInvite} />
      </div>
    </WorkspaceProvider>
  );
}
