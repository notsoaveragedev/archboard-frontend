import { Button } from "antd";
import { LuLock } from "react-icons/lu";
import { Outlet, useNavigate } from "react-router";
import { StatusScreen } from "../components/errors/StatusScreen";
import type { PermissionKey } from "../types/rbac";
import { usePermission } from "./RbacContext";

// Route guard for settings pages. UX only: the API enforces the same permission.
export function RequirePermission({ permission }: { permission: PermissionKey }) {
  const navigate = useNavigate();
  const { allowed } = usePermission(permission);

  if (allowed) return <Outlet />;

  return (
    <StatusScreen
      icon={<LuLock />}
      eyebrow="403"
      title="You don't have access to this page"
      description="Ask a workspace Owner or Admin if you need access."
      actions={
        <Button type="primary" onClick={() => navigate("/app/settings/profile")}>
          Back to your profile
        </Button>
      }
    />
  );
}
