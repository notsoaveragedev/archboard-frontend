import { Table, Tooltip, type TableColumnsType } from "antd";
import dayjs from "dayjs";
import { LuChevronRight } from "react-icons/lu";
import type { AuditEvent } from "../../../types/rbac";
import { ActorCell } from "./ActorCell";
import { AuditEventDetails } from "./AuditEventDetails";
import { ACTIONS, TARGET_ICONS } from "./auditMeta";

const fullTimestamp = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "long" });

const columns: TableColumnsType<AuditEvent> = [
  {
    title: "Time",
    key: "time",
    width: "9rem",
    render: (_, event) => (
      <Tooltip title={fullTimestamp(event.createdAt)}>
        <span className="text-muted tabular-nums">{dayjs(event.createdAt).format("MMM D, HH:mm")}</span>
      </Tooltip>
    ),
  },
  {
    title: "Actor",
    key: "actor",
    width: "12rem",
    render: (_, event) => <ActorCell actor={event.actor} />,
  },
  {
    title: "Action",
    key: "action",
    render: (_, event) => (
      <span title={event.action} className="block truncate">
        {ACTIONS[event.action].label}
      </span>
    ),
  },
  {
    title: "Target",
    key: "target",
    width: "12rem",
    render: (_, event) => {
      const Icon = TARGET_ICONS[event.target.type];
      return (
        <span className="flex min-w-0 items-center gap-2">
          <Icon aria-label={event.target.type} className="size-3.5 shrink-0 text-muted" />
          <span className="truncate">{event.target.name}</span>
        </span>
      );
    },
  },
  {
    title: "IP",
    key: "ip",
    width: "8rem",
    render: (_, event) => <span className="font-mono text-2xs text-muted">{event.ip}</span>,
  },
];

export function AuditTable({ events }: { events: AuditEvent[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <Table<AuditEvent>
        rowKey="id"
        size="middle"
        tableLayout="fixed"
        columns={columns}
        dataSource={events}
        pagination={false}
        expandable={{
          expandedRowRender: (event) => <AuditEventDetails event={event} />,
          expandRowByClick: true,
          columnWidth: "2.5rem",
          expandIcon: ({ expanded, onExpand, record }) => (
            <button
              type="button"
              aria-label={expanded ? "Hide details" : "Show details"}
              aria-expanded={expanded}
              onClick={(event) => {
                event.stopPropagation();
                onExpand(record, event);
              }}
              className="flex size-6 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink"
            >
              <LuChevronRight className={`size-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>
          ),
        }}
        classNames={{
          header: { cell: "h-10! border-b border-line text-ui font-medium whitespace-nowrap text-muted" },
          body: { row: "group cursor-pointer", cell: "text-ui text-ink" },
        }}
        className="[&_.ant-table-expanded-row>td]:bg-hover-subtle [&_.ant-table-tbody>tr:last-child>td]:border-b-0"
      />
    </div>
  );
}
