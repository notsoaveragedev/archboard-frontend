import { Alert, Button, Checkbox } from "antd";
import { Link, useLocation, useNavigate } from "react-router";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { OAuthButtons } from "../../components/auth/OAuthButtons";
import { CustomInput } from "../../components/ui/CustomInput";
import { useForm } from "../../hooks/useForm";
import { loginSchema } from "../../lib/schemas";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // On success GuestRoute redirects, so we only navigate for extra steps (MFA, unverified email).
  const { formProps, fieldErrors, formError, isPending } = useForm({
    schema: loginSchema,
    onSubmit: async (values) => {
      try {
        const mfaChallenge = await signIn(values);
        if (mfaChallenge) {
          navigate("/login/mfa", { state: { ...location.state, mfaToken: mfaChallenge.mfaToken } });
        }
      } catch (error) {
        if (error instanceof ApiError && error.code === "EMAIL_NOT_VERIFIED") {
          navigate("/verify-email", { state: { email: values.email } });
          return;
        }
        throw error;
      }
    },
  });

  return (
    <>
      <AuthHeader title="Log in to archboard" description="Welcome back. Pick up where you left off." />
      <OAuthButtons />

      <form {...formProps} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          placeholder="Enter your password"
          error={fieldErrors.password}
          labelAction={
            <Link to="/forgot-password" className="text-ui text-muted hover:text-ink">
              Forgot password?
            </Link>
          }
        />

        <Checkbox name="remember" defaultChecked>
          Keep me logged in for 30 days
        </Checkbox>

        {formError && <Alert type="error" showIcon title={formError} />}

        <Button type="primary" htmlType="submit" size="large" block loading={isPending} className="mt-2">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-ui text-muted">
        New to archboard?{" "}
        <Link to="/signup" className="font-medium">
          Create an account
        </Link>
      </p>
    </>
  );
}
