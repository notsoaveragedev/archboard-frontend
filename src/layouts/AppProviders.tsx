import { Outlet } from "react-router";
import { FoldersProvider } from "../folders/FoldersProvider";
import { RbacProvider } from "../rbac/RbacProvider";
import { WorkspaceProvider } from "../workspace/WorkspaceProvider";

// Shared by the app shell and settings, so workspace, role and folder state survive moving between them.
export function AppProviders() {
  return (
    <WorkspaceProvider>
      <RbacProvider>
        <FoldersProvider>
          <Outlet />
        </FoldersProvider>
      </RbacProvider>
    </WorkspaceProvider>
  );
}
