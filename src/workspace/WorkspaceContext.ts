import { createContext, use } from "react";
import type { Workspace } from "../types/workspace";

type WorkspaceContextValue = {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string) => Workspace;
  updateWorkspace: (workspaceId: string, changes: Partial<Workspace>) => void;
  removeWorkspace: (workspaceId: string) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
  const context = use(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return context;
}
