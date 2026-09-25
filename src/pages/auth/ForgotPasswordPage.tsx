import { Alert, Button } from "antd";
import { useNavigate } from "react-router";
import { requestPasswordReset } from "../../api/auth";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { BackLink } from "../../components/auth/BackLink";
import { CustomInput } from "../../components/ui/CustomInput";
import { useForm } from "../../hooks/useForm";
import { forgotPasswordSchema } from "../../lib/schemas";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const { formProps, fieldErrors, formError, isPending } = useForm({
    schema: forgotPasswordSchema,
    onSubmit: async ({ email }) => {
      await requestPasswordReset(email);
      navigate("/forgot-password/verify", { state: { email } });
    },
  });

  return (
    <>
      <BackLink to="/login">Back to log in</BackLink>
      <AuthHeader
        title="Reset your password"
        description="Enter the email on your account and we'll send you a 6-digit code."
      />

      <form {...formProps} className="flex flex-col gap-4">
        <CustomInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          autoFocus
          error={fieldErrors.email}
        />

        {formError && <Alert type="error" showIcon title={formError} />}

        <Button type="primary" htmlType="submit" size="large" block loading={isPending} className="mt-2">
          Send code
        </Button>
      </form>
    </>
  );
}
