import { Checkbox } from "antd";
import { useState } from "react";
import { SettingsCard, SettingsSection } from "../../components/settings/SettingsBlocks";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { notificationTypes } from "../../mocks/accountSettings";

type Channel = "inApp" | "email";

export function NotificationsPage() {
  const [settings, setSettings] = useState(notificationTypes);

  function toggle(id: string, channel: Channel, checked: boolean) {
    setSettings((current) => current.map((item) => (item.id === id ? { ...item, [channel]: checked } : item)));
  }

  return (
    <SettingsPage title="Notifications" description="Choose what reaches you in the app and by email.">
      <SettingsSection title="Activity" description="Pick a channel for each kind of update.">
        <SettingsCard>
          <div className="grid grid-cols-[1fr_5rem_5rem] px-5 py-2.5 text-2xs font-medium text-muted">
            <span>Notification</span>
            <span className="text-center">In-app</span>
            <span className="text-center">Email</span>
          </div>
          {settings.map((item) => (
            <div key={item.id} className="grid min-h-16 grid-cols-[1fr_5rem_5rem] items-center px-5 py-3.5">
              <div className="min-w-0">
                <div className="text-ui font-medium">{item.label}</div>
                <div className="mt-0.5 text-ui text-muted">{item.description}</div>
              </div>
              <div className="flex justify-center">
                <Checkbox
                  aria-label={`${item.label} in-app`}
                  checked={item.inApp}
                  onChange={(event) => toggle(item.id, "inApp", event.target.checked)}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  aria-label={`${item.label} by email`}
                  checked={item.email}
                  onChange={(event) => toggle(item.id, "email", event.target.checked)}
                />
              </div>
            </div>
          ))}
        </SettingsCard>
      </SettingsSection>

    </SettingsPage>
  );
}
