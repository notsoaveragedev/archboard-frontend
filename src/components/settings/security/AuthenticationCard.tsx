import { Button, Checkbox, Switch, Tooltip } from "antd";
import { LuLogOut } from "react-icons/lu";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { platformMembers } from "../../../mocks/rbac";
import { pluralize } from "../../../lib/folderTree";
import { CustomSelect } from "../../ui/CustomSelect";
import { SettingRow, SettingsCard, SettingsSection } from "../SettingsBlocks";
import { SESSION_LENGTHS, SIGN_IN_METHODS, type PolicyChange, type SecurityPolicy } from "./securityPolicy";

const membersWithoutTwoFactor = platformMembers.filter((member) => !member.mfaEnabled).length;

export function AuthenticationCard({ policy, onChange }: { policy: SecurityPolicy; onChange: PolicyChange }) {
  const toast = useToast();
  const confirm = useConfirm();

  function toggleMethod(method: SecurityPolicy["signInMethods"][number], isChecked: boolean) {
    const methods = isChecked
      ? [...policy.signInMethods, method]
      : policy.signInMethods.filter((item) => item !== method);
    onChange({ signInMethods: methods });
  }

  async function signOutEveryone() {
    const isConfirmed = await confirm({
      title: "Sign out all members?",
      description: "Everyone except you will need to sign in again on every device.",
      confirmLabel: "Sign out all",
      isDanger: true,
    });
    if (isConfirmed) toast.success("All members signed out", "Everyone except you will need to sign in again.");
  }

  return (
    <SettingsSection title="Authentication" description="How members sign in and how long they stay signed in.">
      <SettingsCard>
        <SettingRow
          label="Require two-factor authentication"
          description={`Members without 2FA are asked to set it up at next sign-in. ${pluralize(membersWithoutTwoFactor, "member")} don't have it yet.`}
        >
          <Switch checked={policy.requireTwoFactor} onChange={(requireTwoFactor) => onChange({ requireTwoFactor })} />
        </SettingRow>

        <SettingRow label="Sign-in methods" description="Members can only sign in with the methods you allow.">
          <div className="flex w-56 flex-col gap-2">
            {SIGN_IN_METHODS.map((method) => {
              const isChecked = policy.signInMethods.includes(method.value);
              const isLast = isChecked && policy.signInMethods.length === 1;
              return (
                <Tooltip key={method.value} title={isLast ? "At least one sign-in method is required." : null} placement="left">
                  <Checkbox
                    checked={isChecked}
                    disabled={isLast}
                    onChange={(event) => toggleMethod(method.value, event.target.checked)}
                    className="w-fit"
                  >
                    {method.label}
                  </Checkbox>
                </Tooltip>
              );
            })}
          </div>
        </SettingRow>

        <SettingRow label="Session length" description="How long members stay signed in before signing in again.">
          <CustomSelect
            size="middle"
            value={policy.sessionLength}
            onChange={(sessionLength) => onChange({ sessionLength })}
            options={SESSION_LENGTHS}
            className="w-56"
          />
        </SettingRow>

        <SettingRow label="Sign out all members" description="End every session in this workspace, except yours.">
          <Button danger icon={<LuLogOut />} onClick={signOutEveryone}>
            Sign out all
          </Button>
        </SettingRow>
      </SettingsCard>
    </SettingsSection>
  );
}
