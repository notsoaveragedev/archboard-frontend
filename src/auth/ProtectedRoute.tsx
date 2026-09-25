import { Navigate, Outlet, useLocation } from "react-router";
import { FullPageLoader } from "../components/ui/FullPageLoader";
import { useAuth } from "./AuthContext";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
