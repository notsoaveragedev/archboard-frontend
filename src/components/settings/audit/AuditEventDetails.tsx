import { Descriptions } from "antd";
import { LuArrowRight } from "react-icons/lu";
import type { AuditEvent } from "../../../types/rbac";

export function AuditEventDetails({ event }: { event: AuditEvent }) {
  return (
    <Descriptions
      size="small"
      column={2}
      colon={false}
      classNames={{ label: "w-28 text-ui text-muted", content: "text-ui text-ink" }}
      className="py-1 pl-10"
      items={[
        {
          key: "changes",
          label: "Changes",
          span: 2,
          children: event.changes?.length ? (
            <div className="flex flex-col gap-1">
              {event.changes.map((change) => (
                <span key={change.field} className="flex flex-wrap items-center gap-1.5">
                  <span className="text-muted">{change.field}:</span>
                  <span>{change.from}</span>
                  <LuArrowRight aria-label="changed to" className="size-3 text-subtle" />
                  <span className="font-medium">{change.to}</span>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted">No field changes</span>
          ),
        },
        { key: "agent", label: "User agent", children: event.userAgent },
        { key: "location", label: "Location", children: event.location },
        {
          key: "id",
          label: "Event ID",
          children: <span className="font-mono text-2xs text-muted">evt_{event.id}_{event.workspaceId}</span>,
        },
      ]}
    />
  );
}
