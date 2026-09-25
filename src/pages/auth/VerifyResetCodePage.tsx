import { Navigate, useLocation, useNavigate } from "react-router";
import { requestPasswordReset, verifyResetCode } from "../../api/auth";
import { CodeVerificationForm } from "../../components/auth/CodeVerificationForm";

type VerifyResetState = { email?: string } | null;

export function VerifyResetCodePage() {
  const navigate = useNavigate();
  const email = (useLocation().state as VerifyResetState)?.email;

  if (!email) return <Navigate to="/forgot-password" replace />;

  const handleVerify = async (code: string) => {
    const { resetToken } = await verifyResetCode(email, code);
    navigate("/reset-password", { replace: true, state: { resetToken } });
  };

  return (
    <CodeVerificationForm
      title="Check your inbox"
      email={email}
      backTo="/forgot-password"
      backLabel="Use a different email"
      onVerify={handleVerify}
      onResend={() => requestPasswordReset(email)}
    />
  );
}
