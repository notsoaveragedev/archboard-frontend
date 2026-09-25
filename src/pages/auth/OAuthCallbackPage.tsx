import { Button, Result } from "antd";
import { useNavigate, useSearchParams } from "react-router";

const OAUTH_ERRORS: Record<string, string> = {
  account_exists:
    "An account with this email already exists. Log in with your password, then connect this provider from Settings.",
  access_denied: "Sign-in was cancelled. You can try again or use your email and password.",
};

// On success the backend sets the refresh cookie, AuthProvider restores the session
// and GuestRoute redirects, so this page only renders when sign-in failed.
export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = OAUTH_ERRORS[searchParams.get("error") ?? ""] ?? "We couldn't sign you in. Please try again.";

  return (
    <Result
      status="error"
      title="Sign-in didn't complete"
      subTitle={message}
      extra={
        <Button type="primary" size="large" onClick={() => navigate("/login", { replace: true })}>
          Back to log in
        </Button>
      }
    />
  );
}
