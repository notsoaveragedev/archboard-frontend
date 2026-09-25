import { DatePicker, type TimeRangePickerProps } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { platformMembers } from "../../../mocks/rbac";
import { CustomInput } from "../../ui/CustomInput";
import { CustomSelect } from "../../ui/CustomSelect";
import { MemberAvatar } from "../../ui/MemberAvatar";
import { SystemTile } from "./ActorCell";
import { EVENT_TYPES, lastDays, type AuditFilters, type EventType } from "./auditMeta";

const PRESETS: TimeRangePickerProps["presets"] = [
  { label: "Last 24 hours", value: [dayjs().subtract(1, "day"), dayjs()] },
  { label: "Last 7 days", value: lastDays(7) },
  { label: "Last 30 days", value: lastDays(30) },
  { label: "Last 90 days", value: lastDays(90) },
];

const ACTOR_OPTIONS = [
  ...platformMembers.map((member) => ({
    value: member.id,
    name: member.name,
    label: (
      <span className="flex items-center gap-2">
        <MemberAvatar member={member} size="xs" showTooltip={false} />
        {member.name}
      </span>
    ),
  })),
  {
    value: "system",
    name: "System",
    label: (
      <span className="flex items-center gap-2">
        <SystemTile />
        System
      </span>
    ),
  },
];

// Events are kept for 90 days, so older dates can't be picked.
const isOutsideRetention = (date: Dayjs) => date.isAfter(dayjs(), "day") || date.isBefore(lastDays(90)[0], "day");

type AuditToolbarProps = {
  filters: AuditFilters;
  onChange: (patch: Partial<AuditFilters>) => void;
};

export function AuditToolbar({ filters, onChange }: AuditToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <DatePicker.RangePicker
        value={filters.range}
        presets={PRESETS}
        disabledDate={isOutsideRetention}
        allowClear={false}
        format="MMM D, YYYY"
        onChange={(range) => range?.[0] && range[1] && onChange({ range: [range[0].startOf("day"), range[1].endOf("day")] })}
        aria-label="Date range"
        className="w-64"
      />
      <CustomSelect
        size="middle"
        value={filters.actor}
        onChange={(actor) => onChange({ actor })}
        options={ACTOR_OPTIONS}
        showSearch={{ optionFilterProp: "name" }}
        allowClear
        placeholder="All actors"
        aria-label="Actor"
        className="w-44"
      />
      <CustomSelect<EventType>
        size="middle"
        value={filters.type}
        onChange={(type) => onChange({ type })}
        options={EVENT_TYPES}
        allowClear
        placeholder="All events"
        aria-label="Event type"
        className="w-36"
      />
      <div className="ml-auto w-56">
        <CustomInput
          type="search"
          size="middle"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Search targets"
          aria-label="Search targets"
        />
      </div>
    </div>
  );
}
