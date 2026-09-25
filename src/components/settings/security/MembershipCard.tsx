import { Select, Switch, Tag } from "antd";
import { SettingRow, SettingsCard, SettingsSection } from "../SettingsBlocks";
import { normalizeDomain, type PolicyChange, type SecurityPolicy } from "./securityPolicy";

const AUTO_JOIN_ROLES = [
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

export function MembershipCard({ policy, onChange }: { policy: SecurityPolicy; onChange: PolicyChange }) {
  const hasDomains = policy.allowedDomains.length > 0;
  const domainList = hasDomains ? policy.allowedDomains.join(", ") : "an allowed domain";

  function changeDomains(values: string[]) {
    const domains = values.map(normalizeDomain).filter((domain): domain is string => domain !== null);
    onChange({ allowedDomains: [...new Set(domains)], autoJoin: domains.length > 0 && policy.autoJoin });
  }

  return (
    <SettingsSection title="Membership" description="Who can join this workspace and who members can share with.">
      <SettingsCard>
        <SettingRow label="Allowed email domains" description="Only these domains can be invited as members." layout="stacked">
          <Select
            mode="tags"
            value={policy.allowedDomains}
            onChange={changeDomains}
            tokenSeparators={[",", " "]}
            open={false}
            suffixIcon={null}
            placeholder="Type a domain, like @platform.dev"
            aria-label="Allowed email domains"
            tagRender={({ label, closable, onClose }) => (
              <Tag closable={closable} onClose={onClose} className="my-0.5 me-1 border-line bg-hover text-ui text-ink">
                {label}
              </Tag>
            )}
            className="w-full"
          />
        </SettingRow>

        <SettingRow
          label="Auto-join"
          description={
            hasDomains
              ? `Anyone with a verified ${domainList} email can join without an invite.`
              : "Add an allowed domain to let people join without an invite."
          }
        >
          <div className="flex items-center gap-3">
            <Select
              size="small"
              value={policy.autoJoinRole}
              onChange={(autoJoinRole) => onChange({ autoJoinRole })}
              options={AUTO_JOIN_ROLES}
              disabled={!hasDomains || !policy.autoJoin}
              aria-label="Auto-join role"
              prefix={<span className="text-muted">Join as</span>}
              className="w-36"
            />
            <Switch
              checked={hasDomains && policy.autoJoin}
              disabled={!hasDomains}
              onChange={(autoJoin) => onChange({ autoJoin })}
            />
          </div>
        </SettingRow>

        <SettingRow label="Allow guests" description="Let members share boards with people outside these domains.">
          <Switch checked={policy.allowGuests} onChange={(allowGuests) => onChange({ allowGuests })} />
        </SettingRow>
      </SettingsCard>
    </SettingsSection>
  );
}
