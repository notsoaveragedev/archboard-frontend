import { Segmented, Switch } from "antd";
import { CustomSelect } from "../../ui/CustomSelect";
import { SettingRow, SettingsCard, SettingsSection } from "../SettingsBlocks";
import { LINK_EXPIRY_OPTIONS, type PolicyChange, type SecurityPolicy } from "./securityPolicy";

const LINK_ACCESS_OPTIONS: { value: SecurityPolicy["maxLinkAccess"]; label: string }[] = [
  { value: "view", label: "Can view" },
  { value: "edit", label: "Can view and edit" },
];

export function SharingCard({ policy, onChange }: { policy: SecurityPolicy; onChange: PolicyChange }) {
  return (
    <SettingsSection title="Sharing" description="Defaults for new boards and links that anyone can open.">
      <SettingsCard>
        <SettingRow
          label="Default access for new boards"
          description="Workspace boards are visible to every member. Restricted boards only to people you add."
        >
          <Segmented<SecurityPolicy["defaultAccess"]>
            value={policy.defaultAccess}
            onChange={(defaultAccess) => onChange({ defaultAccess })}
            options={[
              { value: "workspace", label: "Workspace" },
              { value: "restricted", label: "Restricted" },
            ]}
            className="w-56 [&_.ant-segmented-item]:flex-1"
          />
        </SettingRow>

        <SettingRow label="Public links" description="Let members create links that anyone on the internet can open.">
          <Switch checked={policy.publicLinks} onChange={(publicLinks) => onChange({ publicLinks })} />
        </SettingRow>

        {policy.publicLinks && (
          <div className="rounded-b-lg bg-hover-subtle pl-5">
            <SettingRow label="Maximum link access" description="The most a public link can allow.">
              <CustomSelect<SecurityPolicy["maxLinkAccess"]>
                size="middle"
                value={policy.maxLinkAccess}
                onChange={(maxLinkAccess) => onChange({ maxLinkAccess })}
                options={LINK_ACCESS_OPTIONS}
                className="w-56"
              />
            </SettingRow>
            <div className="border-t border-line-soft">
              <SettingRow label="Require link expiry" description="New public links stop working after this time.">
                <CustomSelect
                  size="middle"
                  value={policy.linkExpiry}
                  onChange={(linkExpiry) => onChange({ linkExpiry })}
                  options={LINK_EXPIRY_OPTIONS}
                  className="w-56"
                />
              </SettingRow>
            </div>
          </div>
        )}
      </SettingsCard>
    </SettingsSection>
  );
}
