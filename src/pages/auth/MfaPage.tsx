import { Alert, Button } from "antd";
import { useState } from "react";
import { LuShieldCheck } from "react-icons/lu";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { BackLink } from "../../components/auth/BackLink";
import { OtpForm } from "../../components/auth/OtpForm";
import { CustomInput } from "../../components/ui/CustomInput";
import { useForm } from "../../hooks/useForm";
import { backupCodeSchema } from "../../lib/schemas";

type MfaLocationState = { mfaToken?: string } | null;

export function MfaPage() {
  const mfaToken = (useLocation().state as MfaLocationState)?.mfaToken;

  if (!mfaToken) return <Navigate to="/login" replace />;

  return <MfaForm mfaToken={mfaToken} />;
}

function MfaForm({ mfaToken }: { mfaToken: string }) {
  const { completeMfa } = useAuth();
  const [useBackupCode, setUseBackupCode] = useState(false);

  return (
    <>
      <BackLink to="/login">Back to log in</BackLink>
      <AuthHeader
        icon={<LuShieldCheck />}
        title="Two-factor authentication"
        description={
          useBackupCode
            ? "Enter one of the backup codes you saved when you turned on two-factor authentication."
            : "Enter the 6-digit code from your authenticator app."
        }
      />

      {useBackupCode ? (
        <BackupCodeForm onVerify={(backupCode) => completeMfa({ mfaToken, backupCode })} />
      ) : (
        <OtpForm label="Authentication code" onVerify={(code) => completeMfa({ mfaToken, code })} />
      )}

      <p className="mt-6 text-center text-[13px] text-muted">
        {useBackupCode ? "Have your authenticator app? " : "Lost access to your app? "}
        <Button
          type="link"
          size="small"
          onClick={() => setUseBackupCode((current) => !current)}
          className="h-auto p-0 font-medium"
        >
          {useBackupCode ? "Use authentication code" : "Use a backup code"}
        </Button>
      </p>
    </>
  );
}

function BackupCodeForm({ onVerify }: { onVerify: (backupCode: string) => Promise<void> }) {
  const { formProps, fieldErrors, formError, isPending } = useForm({
    schema: backupCodeSchema,
    onSubmit: ({ backupCode }) => onVerify(backupCode),
  });

  return (
    <form {...formProps} className="flex flex-col gap-4">
      <CustomInput
        label="Backup code"
        name="backupCode"
        autoComplete="off"
        placeholder="xxxx-xxxx"
        className="font-mono"
        autoFocus
        error={fieldErrors.backupCode}
      />

      {formError && <Alert type="error" showIcon title={formError} />}

      <Button type="primary" htmlType="submit" size="large" block loading={isPending} className="mt-2">
        Verify
      </Button>
    </form>
  );
}
