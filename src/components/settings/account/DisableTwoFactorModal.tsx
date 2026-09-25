import { Button, Modal } from "antd";
import { z } from "zod";
import { useForm } from "../../../hooks/useForm";
import { CustomInput } from "../../ui/CustomInput";

const confirmPasswordSchema = z.object({
  password: z.string().min(1, "Enter your password."),
});

type DisableTwoFactorModalProps = {
  open: boolean;
  onClose: () => void;
  onDisabled: () => void;
};

export function DisableTwoFactorModal({ open, onClose, onDisabled }: DisableTwoFactorModalProps) {
  return (
    <Modal open={open} onCancel={onClose} title="Disable two-factor authentication?" footer={null} width="26rem" destroyOnHidden>
      <DisableForm onClose={onClose} onDisabled={onDisabled} />
    </Modal>
  );
}

function DisableForm({ onClose, onDisabled }: Omit<DisableTwoFactorModalProps, "open">) {
  const { formProps, fieldErrors, isPending } = useForm({
    schema: confirmPasswordSchema,
    onSubmit: async () => onDisabled(),
  });

  return (
    <form {...formProps} className="flex flex-col gap-4 pt-1">
      <p className="text-ui text-muted">
        Your account will be protected by your password only, and your backup codes will stop working.
      </p>
      <CustomInput
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        error={fieldErrors.password}
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" danger htmlType="submit" loading={isPending}>
          Disable 2FA
        </Button>
      </div>
    </form>
  );
}
