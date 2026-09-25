import { Alert, Button, Result } from "antd";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { resetPassword } from "../../api/auth";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { PasswordChecklist, PasswordStrength } from "../../components/auth/PasswordStrength";
import { CustomInput } from "../../components/ui/CustomInput";
import { useForm } from "../../hooks/useForm";
import { resetPasswordSchema } from "../../lib/schemas";
import { getPasswordRules } from "../../lib/validation";

type ResetLocationState = { resetToken?: string } | null;

export function ResetPasswordPage() {
  const resetToken = (useLocation().state as ResetLocationState)?.resetToken;

  if (!resetToken) return <Navigate to="/forgot-password" replace />;

  return <ResetPasswordForm resetToken={resetToken} />;
}

function ResetPasswordForm({ resetToken }: { resetToken: string }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDone, setIsDone] = useState(false);

  const { formProps, fieldErrors, formError, isPending } = useForm({
    schema: resetPasswordSchema,
    onSubmit: async (values) => {
      await resetPassword(resetToken, values.password);
      setIsDone(true);
    },
  });

  const rules = [
    ...getPasswordRules(password),
    { label: "Passwords match", passed: password.length > 0 && password === confirmPassword },
  ];

  if (isDone) {
    return (
      <Result
        status="success"
        title="Password updated"
        subTitle="Use your new password next time you log in. Other devices have been signed out."
        extra={
          <Button type="primary" size="large" onClick={() => navigate("/login", { replace: true })}>
            Back to log in
          </Button>
        }
      />
    );
  }

  return (
    <>
      <AuthHeader title="Choose a new password" description="You'll be logged out of other devices after saving." />

      <form {...formProps} className="flex flex-col gap-4">
        <CustomInput
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          autoFocus
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          hint={<PasswordStrength password={password} />}
        />
        <CustomInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
        />
        <PasswordChecklist rules={rules} />

        {formError && <Alert type="error" showIcon title={formError} />}

        <Button type="primary" htmlType="submit" size="large" block loading={isPending} className="mt-2">
          Save password
        </Button>
      </form>
    </>
  );
}
