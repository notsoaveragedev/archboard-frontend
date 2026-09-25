import { Tag, Tooltip } from "antd";
import { LuCheck, LuMinus } from "react-icons/lu";
import type { Grant } from "../../../types/rbac";

export function GrantCell({ grant }: { grant?: Grant }) {
  if (grant === "all") return <LuCheck role="img" aria-label="Allowed" className="mx-auto size-4 text-ink" />;

  if (grant === "own") {
    return (
      <Tooltip title="Only items they created">
        <Tag aria-label="Allowed for their own items" className="m-0 border-0 bg-hover text-2xs text-muted">
          Own
        </Tag>
      </Tooltip>
    );
  }

  return <LuMinus role="img" aria-label="Not allowed" className="mx-auto size-4 text-subtle" />;
}
