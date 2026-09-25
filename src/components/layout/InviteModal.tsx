import { Button, Modal, Select, Tag } from "antd";
import { useState } from "react";
import { LuLink } from "react-icons/lu";
import { useToast } from "../../hooks/useToast";
import { isValidEmail } from "../../lib/schemas";
import { members as initialMembers } from "../../mocks/workspace";
import type { Member } from "../../types/workspace";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { MemberAvatar } from "../ui/MemberAvatar";

const ROLE_OPTIONS = [
  { value: "Can edit", label: "Can edit" },
  { value: "Can view", label: "Can view" },
];

const INVITE_LINK = "https://archboard.app/join/platform-7f3k";

type InviteModalProps = {
  open: boolean;
  onClose: () => void;
};

export function InviteModal({ open, onClose }: InviteModalProps) {
  const toast = useToast();
  const { currentWorkspace: workspace } = useWorkspace();
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState<Member["role"]>("Can edit");
  const [members, setMembers] = useState(initialMembers);

  const validEmails = emails.filter(isValidEmail);

  function sendInvites() {
    const invited: Member[] = validEmails.map((email) => ({
      id: email,
      name: email.split("@")[0],
      email,
      initials: email.slice(0, 2).toUpperCase(),
      role,
      color: { bg: "#EEF0F3", fg: "#0B1220", ring: "#A3AAB6" },
      isPending: true,
    }));
    setMembers((current) => [...current, ...invited]);
    setEmails([]);
    toast.success(
      `Invite sent to ${invited.length} ${invited.length === 1 ? "person" : "people"}`,
      `They will join ${workspace.name} as ${role === "Can edit" ? "editors" : "viewers"}.`,
    );
  }

  async function copyLink() {
    await navigator.clipboard.writeText(INVITE_LINK);
    toast.success("Invite link copied", "Anyone with the link can join as a viewer.");
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="32.5rem"
      title={
        <div>
          <h2 className="mb-1 text-md font-semibold">Invite to {workspace.name}</h2>
          <p className="text-ui font-normal text-muted">Members can open every folder in this workspace.</p>
        </div>
      }
      styles={{ container: { padding: 0 }, header: { padding: "1.25rem 1.25rem 0", marginBottom: 0 } }}
    >
      <div className="flex flex-col gap-2 px-5 py-4">
        <div className="flex gap-2">
          <Select
            mode="tags"
            open={false}
            value={emails}
            onChange={setEmails}
            tokenSeparators={[",", " "]}
            placeholder="name@company.com, …"
            aria-label="Email addresses"
            suffixIcon={null}
            tagRender={({ label, value, closable, onClose }) => (
              <Tag
                closable={closable}
                onClose={onClose}
                className={isValidEmail(value) ? "border-[#C9D6FF] bg-brand-soft" : "border-danger-line bg-danger-soft"}
              >
                {label}
              </Tag>
            )}
            className="min-w-0 flex-1"
          />
          <Select value={role} onChange={setRole} options={ROLE_OPTIONS} aria-label="Role" className="w-28" />
          <Button type="primary" disabled={validEmails.length === 0} onClick={sendInvites}>
            Send
          </Button>
        </div>
        <span className="text-2xs text-muted">Press Enter or comma to add. Editors can change boards, viewers can only view them.</span>
      </div>

      <div className="flex max-h-65 flex-col gap-1 overflow-auto border-t border-line px-5 py-3">
        <span className="mb-1 text-2xs font-medium text-muted">Members</span>
        {members.map((member, index) => (
          <div key={member.id} className="flex h-11 items-center gap-2.5">
            <MemberAvatar member={member} />
            <span className="flex min-w-0 flex-1 flex-col leading-snug">
              <span className="text-ui font-medium">
                {member.name}
                {index === 0 && " (you)"}
              </span>
              <span className="text-2xs text-muted">{member.email}</span>
            </span>
            {member.isPending && <Tag className="m-0 border-0 bg-hover text-2xs text-muted">Pending</Tag>}
            <span className="min-w-19 text-right text-ui text-muted">{member.role}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-b-lg border-t border-line bg-app px-5 py-3">
        <span className="flex items-center gap-2 text-ui">
          <LuLink className="size-3.75 text-muted" />
          Anyone with the link can join as viewer
        </span>
        <Button size="small" onClick={copyLink}>
          Copy link
        </Button>
      </div>
    </Modal>
  );
}
