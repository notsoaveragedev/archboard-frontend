import { Button } from "antd";
import { useAuth } from "../../auth/AuthContext";

// Temporary page until MainLayout and the dashboard are built.
export function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-sm">Signed in as {user?.email}</p>
      <Button onClick={signOut}>
        Log out
      </Button>
    </div>
  );
}
