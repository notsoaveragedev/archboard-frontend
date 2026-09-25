import { LuInfo } from "react-icons/lu";
import { GrantCell } from "./GrantCell";

const RESOURCE_ROLES = [
  { name: "Viewer", description: "Can view" },
  { name: "Editor", description: "Full access" },
];

const ACTIONS = [
  { label: "View", description: "Open the board and follow live cursors", minLevel: 0 },
  { label: "Edit", description: "Change shapes, text and layout", minLevel: 1 },
  { label: "Export", description: "Download PNG, SVG and PDF", minLevel: 1 },
  { label: "Share", description: "Invite people and manage access", minLevel: 1 },
];

export function ResourceRolesMatrix() {
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <table className="w-full border-separate border-spacing-0 text-ui">
          <thead>
            <tr>
              <th scope="col" className="w-80 border-b border-line px-4 pb-2.5 text-left align-bottom font-medium text-muted">
                Action
              </th>
              {RESOURCE_ROLES.map((role) => (
                <th key={role.name} scope="col" className="border-b border-line px-2 pt-3 pb-2.5 font-normal">
                  <span className="block font-medium text-ink">{role.name}</span>
                  <span className="block text-2xs text-muted">{role.description}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIONS.map((action) => (
              <tr key={action.label} className="group [&:last-child>*]:border-b-0">
                <th scope="row" className="border-b border-line-soft px-4 py-2.5 text-left font-normal group-hover:bg-hover-subtle">
                  <span className="block text-ink">{action.label}</span>
                  <span className="block text-2xs text-muted">{action.description}</span>
                </th>
                {RESOURCE_ROLES.map((role, level) => (
                  <td key={role.name} className="border-b border-line-soft text-center group-hover:bg-hover-subtle">
                    <GrantCell grant={level >= action.minLevel ? "all" : undefined} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex items-center gap-2 text-ui text-muted">
        <LuInfo className="size-3.5 shrink-0" />
        Sharing a folder shares everything inside it. The highest role wins.
      </p>
    </>
  );
}
