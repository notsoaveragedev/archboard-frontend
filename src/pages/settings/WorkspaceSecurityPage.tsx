import { useState } from "react";
import { SaveBar } from "../../components/settings/SaveBar";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { AuthenticationCard } from "../../components/settings/security/AuthenticationCard";
import { MembershipCard } from "../../components/settings/security/MembershipCard";
import { SharingCard } from "../../components/settings/security/SharingCard";
import { INITIAL_POLICY, type SecurityPolicy } from "../../components/settings/security/securityPolicy";
import { useToast } from "../../hooks/useToast";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";

export function WorkspaceSecurityPage() {
  const toast = useToast();
  const [savedPolicy, setSavedPolicy] = useState(INITIAL_POLICY);
  const [policy, setPolicy] = useState(INITIAL_POLICY);

  const isDirty = JSON.stringify(policy) !== JSON.stringify(savedPolicy);
  useUnsavedChanges(isDirty, "Security & access");

  function change(patch: Partial<SecurityPolicy>) {
    setPolicy((current) => ({ ...current, ...patch }));
  }

  function save() {
    setSavedPolicy(policy);
    toast.success("Security settings saved", "The new policy applies to everyone in the workspace.");
  }

  return (
    <SettingsPage title="Security & access" description="Sign-in, membership and sharing policies for this workspace.">
      <AuthenticationCard policy={policy} onChange={change} />
      <MembershipCard policy={policy} onChange={change} />
      <SharingCard policy={policy} onChange={change} />
      <SaveBar isDirty={isDirty} onSave={save} onReset={() => setPolicy(savedPolicy)} />
    </SettingsPage>
  );
}
