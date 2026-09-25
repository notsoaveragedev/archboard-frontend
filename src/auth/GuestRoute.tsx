import { Navigate, Outlet, useLocation, type Location } from "react-router";
import { FullPageLoader } from "../components/ui/FullPageLoader";
import { useAuth } from "./AuthContext";

type LocationState = { from?: Location } | null;

export function GuestRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;

  if (user) {
    const from = (location.state as LocationState)?.from;
    const redirectTo = from ? `${from.pathname}${from.search}` : "/app";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
