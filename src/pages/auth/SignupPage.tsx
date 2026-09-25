import { Alert, Button } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../../api/auth";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { OAuthButtons } from "../../components/auth/OAuthButtons";
import { PasswordChecklist, PasswordStrength } from "../../components/auth/PasswordStrength";
import { CustomInput } from "../../components/ui/CustomInput";
import { useForm } from "../../hooks/useForm";
import { signupSchema } from "../../lib/schemas";
import { getPasswordRules } from "../../lib/validation";

export function SignupPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const { formProps, fieldErrors, formError, isPending } = useForm({
    schema: signupSchema,
    onSubmit: async (values) => {
      await register(values);
      navigate("/verify-email", { state: { email: values.email } });
    },
  });

  return (
    <>
      <AuthHeader
        title="Create your account"
        description="Free to start. Invite your team when you're ready to map things out together."
      />
      <OAuthButtons />

      <form {...formProps} className="flex flex-col gap-4">
        <CustomInput label="Full name" name="name" autoComplete="name" placeholder="Priya Sharma" error={fieldErrors.name} />
        <CustomInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={fieldErrors.email}
        />
        <CustomInput
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          hint={
            <div className="mt-1">
              <PasswordStrength password={password} />
              <PasswordChecklist rules={getPasswordRules(password)} />
            </div>
          }
        />

        {formError && <Alert type="error" showIcon title={formError} />}

        <Button type="primary" htmlType="submit" size="large" block loading={isPending} className="mt-2">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-xs leading-normal text-muted">
        By creating an account you agree to the Terms and Privacy Policy.
        <br />
        Already have an account?{" "}
        <Link to="/login" className="font-medium">
          Log in
        </Link>
      </p>
    </>
  );
}
