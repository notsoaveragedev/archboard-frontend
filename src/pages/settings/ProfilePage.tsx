import { Avatar, Button, Modal, Steps, Tag, Upload } from "antd";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";
import { OtpForm } from "../../components/auth/OtpForm";
import { ResendCode } from "../../components/auth/ResendCode";
import { SaveBar } from "../../components/settings/SaveBar";
import { SettingRow, SettingsCard, SettingsSection } from "../../components/settings/SettingsBlocks";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { CustomInput } from "../../components/ui/CustomInput";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import { changeEmailSchema, profileSchema } from "../../lib/schemas";
import { platformMembers } from "../../mocks/rbac";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const me = platformMembers[0];

export function ProfilePage() {
  const toast = useToast();
  const [savedName, setSavedName] = useState(me.name);
  const [name, setName] = useState(me.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [email, setEmail] = useState(me.email);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const isDirty = name.trim() !== savedName;
  useUnsavedChanges(isDirty, "your profile");

  function saveProfile() {
    const result = profileSchema.safeParse({ name });
    if (!result.success) {
      setNameError(result.error.issues[0].message);
      return;
    }
    setSavedName(result.data.name);
    setName(result.data.name);
    toast.success("Profile saved");
  }

  function choosePhoto(file: File) {
    if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) {
      toast.error("Couldn't upload photo", "Use a JPG or PNG under 5 MB.");
      return false;
    }
    setPhotoUrl(URL.createObjectURL(file));
    toast.success("Photo updated");
    return false;
  }

  return (
    <SettingsPage title="Profile" description="How you appear to other people in archboard.">
      <SettingsSection title="Personal info">
        <SettingsCard>
          <SettingRow label="Photo" description="A square PNG or JPG, up to 5 MB.">
            <div className="flex items-center gap-3">
              <Avatar
                src={photoUrl}
                style={{ width: "2.5rem", height: "2.5rem", backgroundColor: me.color.bg, color: me.color.fg, fontWeight: 600 }}
              >
                {me.initials}
              </Avatar>
              <Upload accept="image/*" showUploadList={false} beforeUpload={choosePhoto}>
                <Button icon={<LuUpload />}>Upload photo</Button>
              </Upload>
              {photoUrl && (
                <Button type="text" onClick={() => setPhotoUrl(null)} className="text-muted">
                  Remove
                </Button>
              )}
            </div>
          </SettingRow>

          <SettingRow label="Full name" description="Shown on boards and live cursors." layout="stacked">
            <CustomInput
              aria-label="Full name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setNameError(null);
              }}
              error={nameError}
              size="middle"
              className="max-w-96"
            />
          </SettingRow>

          <SettingRow
            label="Email"
            description={
              <span className="flex items-center gap-2">
                {email}
                <Tag className="m-0 border-0 bg-hover text-2xs text-muted">Verified</Tag>
              </span>
            }
          >
            <Button onClick={() => setIsEmailModalOpen(true)}>Change email</Button>
          </SettingRow>
        </SettingsCard>
      </SettingsSection>

      <SaveBar isDirty={isDirty} onSave={saveProfile} onReset={() => setName(savedName)} />

      <ChangeEmailModal
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onChanged={(newEmail) => {
          setEmail(newEmail);
          setIsEmailModalOpen(false);
          toast.success("Email updated", `Use ${newEmail} to sign in from now on.`);
        }}
      />
    </SettingsPage>
  );
}

type ChangeEmailModalProps = {
  open: boolean;
  onClose: () => void;
  onChanged: (email: string) => void;
};

function ChangeEmailModal({ open, onClose, onChanged }: ChangeEmailModalProps) {
  return (
    <Modal open={open} onCancel={onClose} title="Change email" footer={null} destroyOnHidden width="26rem">
      <ChangeEmailSteps onClose={onClose} onChanged={onChanged} />
    </Modal>
  );
}

function ChangeEmailSteps({ onClose, onChanged }: Omit<ChangeEmailModalProps, "open">) {
  const toast = useToast();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const { formProps, fieldErrors, isPending } = useForm({
    schema: changeEmailSchema,
    onSubmit: async ({ email }) => setPendingEmail(email),
  });

  return (
    <div className="flex flex-col gap-5 pt-2">
      <Steps size="small" current={pendingEmail ? 1 : 0} items={[{ title: "New email" }, { title: "Verify" }]} />

      {pendingEmail ? (
        <>
          <p className="text-ui text-muted">
            We sent a 6-digit code to <span className="font-medium text-ink">{pendingEmail}</span>.
          </p>
          <OtpForm label="Verification code" onVerify={async () => onChanged(pendingEmail)} />
          <ResendCode onResend={async () => toast.success("New code sent", `Check ${pendingEmail}.`)} />
        </>
      ) : (
        <form {...formProps} className="flex flex-col gap-4">
          <CustomInput label="New email" name="email" type="email" autoFocus error={fieldErrors.email} />
          <CustomInput
            label="Current password"
            name="password"
            type="password"
            autoComplete="current-password"
            error={fieldErrors.password}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Send code
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
