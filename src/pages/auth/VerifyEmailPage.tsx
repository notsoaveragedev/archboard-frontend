import { Navigate, useLocation } from "react-router";
import { resendVerification } from "../../api/auth";
import { useAuth } from "../../auth/AuthContext";
import { CodeVerificationForm } from "../../components/auth/CodeVerificationForm";

type VerifyEmailState = { email?: string } | null;

export function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const email = (useLocation().state as VerifyEmailState)?.email;

  if (!email) return <Navigate to="/signup" replace />;

  return (
    <CodeVerificationForm
      title="Verify your email"
      email={email}
      backTo="/signup"
      backLabel="Use a different email"
      onVerify={(code) => verifyEmail({ email, code })}
      onResend={() => resendVerification(email)}
    />
  );
}
