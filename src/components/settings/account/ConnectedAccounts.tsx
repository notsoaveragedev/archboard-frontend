import { Button, Tooltip } from "antd";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { formatDate } from "../../../lib/format";
import { connectedAccounts, type ConnectedAccount } from "../../../mocks/accountSettings";
import { SettingsCard } from "../SettingsBlocks";

const ICONS = { google: FcGoogle, github: FaGithub };

export function ConnectedAccounts({ hasPassword }: { hasPassword: boolean }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [accounts, setAccounts] = useState(connectedAccounts);
  const connectedCount = accounts.filter((account) => account.account).length;
  const isOnlySignIn = !hasPassword && connectedCount === 1;

  function update(provider: ConnectedAccount["provider"], changes: Partial<ConnectedAccount>) {
    setAccounts((current) => current.map((item) => (item.provider === provider ? { ...item, ...changes } : item)));
  }

  function connect(account: ConnectedAccount) {
    update(account.provider, { account: "priya-sharma", connectedAt: new Date().toISOString() });
    toast.success(`${account.name} connected`, `You can now sign in with ${account.name}.`);
  }

  async function disconnect(account: ConnectedAccount) {
    const isConfirmed = await confirm({
      title: `Disconnect ${account.name}?`,
      description: `You won't be able to sign in with ${account.name} until you connect it again.`,
      confirmLabel: "Disconnect",
      isDanger: true,
    });
    if (!isConfirmed) return;
    update(account.provider, { account: null, connectedAt: null });
    toast.success(`${account.name} disconnected`);
  }

  return (
    <SettingsCard>
      {accounts.map((account) => {
        const Icon = ICONS[account.provider];
        return (
          <div key={account.provider} className="flex min-h-16 items-center gap-3 px-5 py-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-ui font-medium">{account.name}</div>
              <div className="mt-0.5 text-ui text-muted">
                {account.account && account.connectedAt
                  ? `Connected as ${account.account} · ${formatDate(account.connectedAt)}`
                  : "Not connected"}
              </div>
            </div>
            {account.account ? (
              <Tooltip title={isOnlySignIn ? "This is your only way to sign in. Set a password first." : undefined}>
                <span className="inline-flex">
                  <Button disabled={isOnlySignIn} onClick={() => disconnect(account)}>
                    Disconnect
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button onClick={() => connect(account)}>Connect</Button>
            )}
          </div>
        );
      })}
    </SettingsCard>
  );
}
