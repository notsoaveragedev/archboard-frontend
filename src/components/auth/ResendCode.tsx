import { App, Button } from "antd";
import { useState } from "react";
import { getErrorMessage } from "../../api/client";
import { useCountdown } from "../../hooks/useCountdown";

const RESEND_COOLDOWN_SECONDS = 30;

function formatSeconds(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function ResendCode({ onResend }: { onResend: () => Promise<void> }) {
  const { message } = App.useApp();
  const { seconds, restart } = useCountdown(RESEND_COOLDOWN_SECONDS);
  const [isSending, setIsSending] = useState(false);

  async function handleResend() {
    setIsSending(true);
    try {
      await onResend();
      message.success("A new code is on its way.");
      restart();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <p className="mt-6 text-center text-[13px] text-muted">
      Didn't get it?{" "}
      {seconds > 0 ? (
        <span>
          Resend in <span className="font-mono text-ink">{formatSeconds(seconds)}</span>
        </span>
      ) : (
        <Button type="link" size="small" loading={isSending} onClick={handleResend} className="h-auto p-0 font-medium">
          Resend code
        </Button>
      )}
    </p>
  );
}
