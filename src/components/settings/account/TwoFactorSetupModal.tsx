import { Button, Checkbox, Modal, QRCode, Steps } from "antd";
import { useState } from "react";
import { OtpForm } from "../../auth/OtpForm";
import { otpauthUrl, totpSecret } from "../../../mocks/accountSettings";
import { BackupCodesPanel, CopyButton } from "./BackupCodes";

type TwoFactorSetupModalProps = {
  open: boolean;
  onClose: () => void;
  onEnabled: () => void;
};

const STEPS = [{ title: "Scan" }, { title: "Verify" }, { title: "Backup codes" }];
const groupedSecret = totpSecret.match(/.{1,4}/g)?.join(" ") ?? totpSecret;

export function TwoFactorSetupModal({ open, onClose, onEnabled }: TwoFactorSetupModalProps) {
  const [step, setStep] = useState(0);
  const [hasSavedCodes, setHasSavedCodes] = useState(false);

  function reset() {
    setStep(0);
    setHasSavedCodes(false);
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      afterClose={reset}
      title="Enable two-factor authentication"
      footer={null}
      width="30rem"
      maskClosable={false}
      closable={step < 2}
      keyboard={step < 2}
      destroyOnHidden
    >
      <div className="flex flex-col gap-5 pt-2">
        <Steps size="small" current={step} items={STEPS} />

        {step === 0 && (
          <>
            <p className="text-ui text-muted">
              Scan this QR code with an authenticator app like 1Password, Authy or Google Authenticator.
            </p>
            <div className="flex items-center gap-5">
              <div className="shrink-0 rounded-lg border border-line p-3">
                <QRCode value={otpauthUrl} size={160} bordered={false} />
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <span className="text-ui font-medium">Can't scan? Enter this key</span>
                <code className="font-mono text-ui tracking-wider break-words">{groupedSecret}</code>
                <div>
                  <CopyButton text={totpSecret} label="Copy key" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={() => setStep(1)}>
                Continue
              </Button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-ui text-muted">Enter the 6-digit code your authenticator app shows for archboard.</p>
            <OtpForm label="6-digit code" onVerify={async () => setStep(2)} />
          </>
        )}

        {step === 2 && (
          <>
            <BackupCodesPanel />
            <Checkbox checked={hasSavedCodes} onChange={(event) => setHasSavedCodes(event.target.checked)}>
              I've saved my backup codes
            </Checkbox>
            <div className="flex justify-end">
              <Button type="primary" disabled={!hasSavedCodes} onClick={onEnabled}>
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
