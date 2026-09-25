import { useState, type ReactNode } from "react";
import { workspaces as initialWorkspaces } from "../mocks/workspace";
import type { Workspace } from "../types/workspace";
import { WorkspaceContext } from "./WorkspaceContext";

const TILE_COLORS = ["bg-ink", "bg-[#8E4EC6]", "bg-[#12A594]", "bg-[#F76B15]", "bg-brand"];

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [currentId, setCurrentId] = useState(initialWorkspaces[0].id);
  const currentWorkspace = workspaces.find((workspace) => workspace.id === currentId) ?? workspaces[0];

  function createWorkspace(name: string) {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name,
      initials: initialsOf(name),
      memberCount: 1,
      plan: "Team",
      tileClass: TILE_COLORS[workspaces.length % TILE_COLORS.length],
    };
    setWorkspaces((current) => [...current, workspace]);
    setCurrentId(workspace.id);
    return workspace;
  }

  return (
    <WorkspaceContext value={{ workspaces, currentWorkspace, switchWorkspace: setCurrentId, createWorkspace }}>
      {children}
    </WorkspaceContext>
  );
}
