import { Button, Checkbox, Modal } from "antd";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "../../../hooks/useForm";
import { useToast } from "../../../hooks/useToast";
import { isPasswordValid } from "../../../lib/validation";
import { PasswordStrength } from "../../auth/PasswordStrength";
import { CustomInput } from "../../ui/CustomInput";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().refine(isPasswordValid, "Use 8+ characters with upper and lowercase letters and a number."),
    confirmPassword: z.string(),
    signOutOthers: z.string().optional(),
  })
  .refine((values) => values.confirmPassword === values.newPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onChanged: (signedOutOthers: boolean) => void;
};

export function ChangePasswordModal({ open, onClose, onChanged }: ChangePasswordModalProps) {
  return (
    <Modal open={open} onCancel={onClose} title="Change password" footer={null} width="26rem" destroyOnHidden>
      <ChangePasswordForm onClose={onClose} onChanged={onChanged} />
    </Modal>
  );
}

function ChangePasswordForm({ onClose, onChanged }: Omit<ChangePasswordModalProps, "open">) {
  const toast = useToast();
  const [newPassword, setNewPassword] = useState("");

  const { formProps, fieldErrors, isPending } = useForm({
    schema: changePasswordSchema,
    onSubmit: async ({ signOutOthers }) => {
      onChanged(Boolean(signOutOthers));
      toast.success(
        "Password changed",
        signOutOthers ? "Other sessions were signed out." : "Use your new password next time you sign in.",
      );
    },
  });

  return (
    <form {...formProps} className="flex flex-col gap-4 pt-2">
      <CustomInput
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        autoFocus
        error={fieldErrors.currentPassword}
      />
      <CustomInput
        label="New password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        error={fieldErrors.newPassword}
        hint={<PasswordStrength password={newPassword} />}
      />
      <CustomInput
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
      />
      <Checkbox name="signOutOthers" defaultChecked>
        Sign out of other sessions
      </Checkbox>
      <div className="flex justify-end gap-2 pt-1">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Change password
        </Button>
      </div>
    </form>
  );
}
