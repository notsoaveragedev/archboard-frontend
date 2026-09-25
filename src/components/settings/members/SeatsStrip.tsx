import { Progress } from "antd";
import { LuArrowRight } from "react-icons/lu";
import { Link } from "react-router";
import { palette } from "../../../theme/palette";
import { PAID_SEATS } from "./memberAccess";

type SeatsStripProps = {
  usedSeats: number;
  canManageSeats: boolean;
};

export function SeatsStrip({ usedSeats, canManageSeats }: SeatsStripProps) {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-lg border border-line px-4 py-3 text-ui">
      <p className="flex-1">
        <span className="font-medium tabular-nums">
          {usedSeats} of {PAID_SEATS}
        </span>{" "}
        paid seats used <span className="text-muted">· Viewers and guests are free</span>
      </p>
      <Progress
        percent={(usedSeats / PAID_SEATS) * 100}
        showInfo={false}
        size="small"
        strokeColor={palette.ink}
        railColor={palette.hover}
        className="m-0 w-40"
      />
      {canManageSeats && (
        <Link
          to="/app/settings/workspace/billing"
          className="flex items-center gap-1 font-medium text-ink hover:underline"
        >
          Manage seats
          <LuArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
