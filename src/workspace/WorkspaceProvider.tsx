import { useState, type ReactNode } from "react";
import { workspaces as initialWorkspaces } from "../mocks/workspace";
import type { Workspace } from "../types/workspace";
import { WorkspaceContext } from "./WorkspaceContext";
import { TILE_COLORS, initialsOf } from "./workspaceUtils";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [currentId, setCurrentId] = useState(initialWorkspaces[0].id);
  const currentWorkspace = workspaces.find((workspace) => workspace.id === currentId) ?? workspaces[0];

  function createWorkspace(name: string) {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      initials: initialsOf(name),
      memberCount: 1,
      plan: "Team",
      tileClass: TILE_COLORS[workspaces.length % TILE_COLORS.length],
    };
    setWorkspaces((current) => [...current, workspace]);
    setCurrentId(workspace.id);
    return workspace;
  }

  function updateWorkspace(workspaceId: string, changes: Partial<Workspace>) {
    setWorkspaces((current) =>
      current.map((workspace) => (workspace.id === workspaceId ? { ...workspace, ...changes } : workspace)),
    );
  }

  // Leaving or deleting moves you to the next workspace you still belong to.
  function removeWorkspace(workspaceId: string) {
    const remaining = workspaces.filter((workspace) => workspace.id !== workspaceId);
    setWorkspaces(remaining);
    if (currentId === workspaceId) setCurrentId(remaining[0].id);
  }

  return (
    <WorkspaceContext
      value={{ workspaces, currentWorkspace, switchWorkspace: setCurrentId, createWorkspace, updateWorkspace, removeWorkspace }}
    >
      {children}
    </WorkspaceContext>
  );
}
