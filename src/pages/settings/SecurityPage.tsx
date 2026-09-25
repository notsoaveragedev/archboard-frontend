import { Alert, Button, Modal, Tag } from "antd";
import { useState } from "react";
import { BackupCodesPanel } from "../../components/settings/account/BackupCodes";
import { ChangePasswordModal } from "../../components/settings/account/ChangePasswordModal";
import { ConnectedAccounts } from "../../components/settings/account/ConnectedAccounts";
import { DisableTwoFactorModal } from "../../components/settings/account/DisableTwoFactorModal";
import { SessionList } from "../../components/settings/account/SessionList";
import { TwoFactorSetupModal } from "../../components/settings/account/TwoFactorSetupModal";
import { SettingRow, SettingsCard, SettingsSection } from "../../components/settings/SettingsBlocks";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../lib/format";
import { passwordLastChanged, twoFactorSince } from "../../mocks/accountSettings";
import { sessions as initialSessions } from "../../mocks/rbac";

type OpenModal = "password" | "setup2fa" | "disable2fa" | "backupCodes" | null;

const mutedTag = "m-0 border-0 bg-hover text-2xs text-muted";

export function SecurityPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(true);
  const [sessions, setSessions] = useState(initialSessions);
  const otherSessions = sessions.filter((session) => !session.isCurrent);
  const closeModal = () => setOpenModal(null);

  function enableTwoFactor() {
    setIsTwoFactorOn(true);
    closeModal();
    toast.success("Two-factor authentication enabled", "You'll enter a code from your app when you sign in.");
  }

  function disableTwoFactor() {
    setIsTwoFactorOn(false);
    closeModal();
    toast.warning("Two-factor authentication disabled");
  }

  async function regenerateCodes() {
    const isConfirmed = await confirm({
      title: "Regenerate backup codes?",
      description: "Old codes stop working.",
      confirmLabel: "Regenerate",
      isDanger: true,
    });
    if (isConfirmed) setOpenModal("backupCodes");
  }

  async function revokeSession(sessionId: string, name: string) {
    const isConfirmed = await confirm({
      title: `Revoke ${name}?`,
      description: "That device will need to sign in again.",
      confirmLabel: "Revoke",
      isDanger: true,
    });
    if (!isConfirmed) return;
    setSessions((current) => current.filter((session) => session.id !== sessionId));
    toast.success("Session revoked", `${name} was signed out.`);
  }

  async function signOutOthers() {
    const count = otherSessions.length;
    const label = `${count} other ${count === 1 ? "session" : "sessions"}`;
    const isConfirmed = await confirm({
      title: `Sign out of ${label}?`,
      description: "Those devices will need to sign in again.",
      confirmLabel: "Sign out",
      isDanger: true,
    });
    if (!isConfirmed) return;
    setSessions((current) => current.filter((session) => session.isCurrent));
    toast.success(`Signed out of ${label}`);
  }

  return (
    <SettingsPage title="Security" description="Password, two-factor authentication and active sessions.">
      {!isTwoFactorOn && (
        <Alert
          type="warning"
          showIcon
          className="mb-8"
          title="Platform Team requires two-factor authentication. Set it up to keep access after Oct 3, 2026."
          action={
            <Button size="small" onClick={() => setOpenModal("setup2fa")}>
              Set up now
            </Button>
          }
        />
      )}

      <SettingsSection title="Password">
        <SettingsCard>
          <SettingRow label="Password" description={`Last changed ${formatDate(passwordLastChanged)}`}>
            <Button onClick={() => setOpenModal("password")}>Change password</Button>
          </SettingRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Two-factor authentication" description="Add a second step when you sign in.">
        <SettingsCard>
          <SettingRow
            label="Authenticator app"
            description={
              isTwoFactorOn ? (
                <Tag className={`${mutedTag} inline-flex items-center gap-1.5`}>
                  <span className="size-1.5 rounded-full bg-success" aria-hidden />
                  On · since {formatDate(twoFactorSince)}
                </Tag>
              ) : (
                <Tag className={mutedTag}>Off</Tag>
              )
            }
          >
            {isTwoFactorOn ? (
              <Button type="text" danger onClick={() => setOpenModal("disable2fa")}>
                Disable
              </Button>
            ) : (
              <Button type="primary" onClick={() => setOpenModal("setup2fa")}>
                Enable 2FA
              </Button>
            )}
          </SettingRow>
          {isTwoFactorOn && (
            <SettingRow
              label="Backup codes"
              description={<span className="tabular-nums">8 of 10 remaining. Use one if you lose your device.</span>}
            >
              <Button onClick={regenerateCodes}>Regenerate</Button>
            </SettingRow>
          )}
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Connected accounts" description="Sign in to archboard with Google or GitHub.">
        <ConnectedAccounts hasPassword />
      </SettingsSection>

      <SettingsSection
        title="Active sessions"
        description="Devices signed in to your account."
        action={
          <Button disabled={otherSessions.length === 0} onClick={signOutOthers}>
            Sign out of all other sessions
          </Button>
        }
      >
        <SessionList sessions={sessions} onRevoke={(session, name) => revokeSession(session.id, name)} />
      </SettingsSection>

      <ChangePasswordModal
        open={openModal === "password"}
        onClose={closeModal}
        onChanged={(signedOutOthers) => {
          closeModal();
          if (signedOutOthers) setSessions((current) => current.filter((session) => session.isCurrent));
        }}
      />
      <TwoFactorSetupModal open={openModal === "setup2fa"} onClose={closeModal} onEnabled={enableTwoFactor} />
      <DisableTwoFactorModal open={openModal === "disable2fa"} onClose={closeModal} onDisabled={disableTwoFactor} />
      <Modal
        open={openModal === "backupCodes"}
        onCancel={closeModal}
        title="New backup codes"
        width="30rem"
        destroyOnHidden
        footer={
          <Button
            type="primary"
            onClick={() => {
              closeModal();
              toast.success("Backup codes regenerated", "Your old codes no longer work.");
            }}
          >
            Done
          </Button>
        }
      >
        <div className="pt-2">
          <BackupCodesPanel />
        </div>
      </Modal>
    </SettingsPage>
  );
}
