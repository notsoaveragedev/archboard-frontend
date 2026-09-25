import { LuMail } from "react-icons/lu";
import { AuthHeader } from "./AuthHeader";
import { BackLink } from "./BackLink";
import { OtpForm } from "./OtpForm";
import { ResendCode } from "./ResendCode";

type CodeVerificationFormProps = {
  title: string;
  email: string;
  backTo: string;
  backLabel: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
};

export function CodeVerificationForm({ title, email, backTo, backLabel, onVerify, onResend }: CodeVerificationFormProps) {
  return (
    <>
      <BackLink to={backTo}>{backLabel}</BackLink>
      <AuthHeader
        icon={<LuMail />}
        title={title}
        description={
          <>
            We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. It expires in 10 minutes.
          </>
        }
      />
      <OtpForm label="Verification code" onVerify={onVerify} />
      <ResendCode onResend={onResend} />
    </>
  );
}
