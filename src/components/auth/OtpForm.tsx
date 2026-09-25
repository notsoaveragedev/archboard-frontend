import { Button, Input } from "antd";
import { useId, useState, useTransition, type FormEvent } from "react";
import { getErrorMessage } from "../../api/client";
import { FieldShell } from "../ui/FieldShell";

const CODE_LENGTH = 6;

type OtpFormProps = {
  label: string;
  onVerify: (code: string) => Promise<void>;
};

export function OtpForm({ label, onVerify }: OtpFormProps) {
  const labelId = useId();
  const messageId = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function verify(value: string) {
    if (value.length < CODE_LENGTH) {
      setError("Enter the 6-digit code.");
      return;
    }
    startTransition(async () => {
      try {
        await onVerify(value);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    verify(code);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldShell label={label} labelId={labelId} error={error} messageId={messageId}>
        <div role="group" aria-labelledby={labelId} aria-describedby={error ? messageId : undefined}>
          <Input.OTP
            length={CODE_LENGTH}
            size="large"
            autoComplete="one-time-code"
            autoFocus
            status={error ? "error" : undefined}
            onInput={(cells) => {
              setCode(cells.join(""));
              setError(null);
            }}
            onChange={verify}
          />
        </div>
      </FieldShell>

      <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
        Verify
      </Button>
    </form>
  );
}
