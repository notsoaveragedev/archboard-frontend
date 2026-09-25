import { LuBot } from "react-icons/lu";
import { platformMembers } from "../../../mocks/rbac";
import type { AuditEvent } from "../../../types/rbac";
import { MemberAvatar } from "../../ui/MemberAvatar";

export function SystemTile() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-line bg-app text-muted">
      <LuBot className="size-3" />
    </span>
  );
}

export function ActorCell({ actor }: { actor: AuditEvent["actor"] }) {
  const member = actor.type === "user" ? platformMembers.find((item) => item.id === actor.memberId) : undefined;

  return (
    <span className="flex min-w-0 items-center gap-2">
      {member ? <MemberAvatar member={member} size="xs" showTooltip={false} /> : <SystemTile />}
      <span className="truncate">{member?.name ?? "System"}</span>
    </span>
  );
}
