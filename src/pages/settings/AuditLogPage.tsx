import { Button, Empty } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";
import { AuditTable } from "../../components/settings/audit/AuditTable";
import { AuditToolbar } from "../../components/settings/audit/AuditToolbar";
import { ACTIONS, lastDays, type AuditFilters } from "../../components/settings/audit/auditMeta";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { useToast } from "../../hooks/useToast";
import { workspaceAuditLog } from "../../mocks/auditLog";
import { platformMembers } from "../../mocks/rbac";
import type { AuditEvent } from "../../types/rbac";
import { useWorkspace } from "../../workspace/WorkspaceContext";

const PAGE_SIZE = 10;

function matchesFilters(event: AuditEvent, { range, actor, type, query }: AuditFilters) {
  const time = dayjs(event.createdAt);
  const actorId = event.actor.type === "user" ? event.actor.memberId : "system";
  const actorName = platformMembers.find((member) => member.id === actorId)?.name ?? "System";
  const text = `${event.target.name} ${ACTIONS[event.action].label} ${actorName}`.toLowerCase();

  return (
    !time.isBefore(range[0]) &&
    !time.isAfter(range[1]) &&
    (!actor || actor === actorId) &&
    (!type || ACTIONS[event.action].type === type) &&
    text.includes(query.trim().toLowerCase())
  );
}

export function AuditLogPage() {
  const toast = useToast();
  const { currentWorkspace } = useWorkspace();
  const [filters, setFilters] = useState<AuditFilters>({ range: lastDays(7), query: "" });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const events = workspaceAuditLog.filter((event) => matchesFilters(event, filters));
  const visibleEvents = events.slice(0, visibleCount);

  function changeFilters(patch: Partial<AuditFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
    setVisibleCount(PAGE_SIZE);
  }

  function exportCsv() {
    toast.success("Export ready", `audit-log-${dayjs().format("YYYY-MM-DD")}.csv downloaded.`);
  }

  return (
    <SettingsPage
      width="wide"
      title="Audit log"
      description={`Security and admin activity in ${currentWorkspace.name}. Events are kept for 90 days.`}
      actions={
        <Button icon={<LuDownload />} onClick={exportCsv} disabled={events.length === 0}>
          Export CSV
        </Button>
      }
    >
      <AuditToolbar filters={filters} onChange={changeFilters} />

      {events.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface py-14">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span className="text-ui text-muted">No events in this date range</span>}
          >
            <Button onClick={() => changeFilters({ range: lastDays(90), actor: undefined, type: undefined, query: "" })}>
              Last 90 days
            </Button>
          </Empty>
        </div>
      ) : (
        <>
          <AuditTable events={visibleEvents} />
          <div className="mt-3 flex items-center justify-between gap-4 text-ui text-muted">
            <span className="tabular-nums">
              Showing {visibleEvents.length} of {events.length} events
            </span>
            {visibleCount < events.length && (
              <Button onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Load more</Button>
            )}
          </div>
        </>
      )}
    </SettingsPage>
  );
}
