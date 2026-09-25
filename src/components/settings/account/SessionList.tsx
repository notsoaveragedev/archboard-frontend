import { Button, Tag } from "antd";
import { LuMonitor, LuSmartphone } from "react-icons/lu";
import { formatRelative } from "../../../lib/format";
import type { Session } from "../../../types/rbac";
import { SettingsCard } from "../SettingsBlocks";

function sessionName(session: Session) {
  return `${session.browser.replace(/\s[\d.]+$/, "")} on ${session.os}`;
}

type SessionListProps = {
  sessions: Session[];
  onRevoke: (session: Session, name: string) => void;
};

export function SessionList({ sessions, onRevoke }: SessionListProps) {
  const hasOthers = sessions.some((session) => !session.isCurrent);

  return (
    <SettingsCard footer={hasOthers ? undefined : "No other active sessions."}>
      <ul className="divide-y divide-line-soft">
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} onRevoke={() => onRevoke(session, sessionName(session))} />
        ))}
      </ul>
    </SettingsCard>
  );
}

function SessionRow({ session, onRevoke }: { session: Session; onRevoke: () => void }) {
  const Icon = session.deviceType === "mobile" ? LuSmartphone : LuMonitor;
  const activity = session.isCurrent ? "Active now" : formatRelative(session.lastActiveAt);

  return (
    <li className="group flex items-center gap-3 px-5 py-3.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line bg-app text-muted">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-ui font-medium">
          {sessionName(session)}
          {session.isCurrent && (
            <Tag className="m-0 inline-flex items-center gap-1.5 border-0 bg-success-soft text-2xs text-success">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              This device
            </Tag>
          )}
        </div>
        <div className="mt-0.5 text-2xs text-muted tabular-nums">
          {session.location} · {session.ip} · {activity}
        </div>
      </div>
      {!session.isCurrent && (
        <Button
          type="text"
          size="small"
          onClick={onRevoke}
          className="text-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        >
          Revoke
        </Button>
      )}
    </li>
  );
}
