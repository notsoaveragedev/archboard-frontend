import { Alert, Button, Modal, Select, Tag, Tooltip } from "antd";
import { useState } from "react";
import { LuLink } from "react-icons/lu";
import { z } from "zod";
import { useToast } from "../../../hooks/useToast";
import { findRole } from "../../../rbac/permissions";
import { useRbac } from "../../../rbac/RbacContext";
import type { Invite, RoleId, WorkspaceMember } from "../../../types/rbac";
import { useWorkspace } from "../../../workspace/WorkspaceContext";
import { CustomInput } from "../../ui/CustomInput";
import { CustomSelect } from "../../ui/CustomSelect";
import { inviteRoles } from "./memberAccess";

const INVITE_LINK = "https://archboard.app/join/platform-7f3k";
const emailSchema = z.email();

type InviteMembersModalProps = {
  open: boolean;
  onClose: () => void;
  members: WorkspaceMember[];
  invites: Invite[];
  seatsLeft: number;
  onSend: (emails: string[], roleId: RoleId) => void;
};

function emailIssue(email: string, members: WorkspaceMember[], invites: Invite[]) {
  if (!emailSchema.safeParse(email).success) return "This isn't a valid email address.";
  const member = members.find((item) => item.email === email);
  if (member) return `${member.name} is already a member.`;
  if (invites.some((invite) => invite.email === email)) return "Already invited. Resend it from Invitations.";
  return null;
}

export function InviteMembersModal({ open, onClose, members, invites, seatsLeft, onSend }: InviteMembersModalProps) {
  const toast = useToast();
  const { roles, currentRole } = useRbac();
  const { currentWorkspace } = useWorkspace();
  const [emails, setEmails] = useState<string[]>([]);
  const [roleId, setRoleId] = useState<RoleId>("member");
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const role = findRole(roles, roleId);
  const validEmails = emails.filter((email) => !emailIssue(email, members, invites));
  const invalidCount = emails.length - validEmails.length;
  const isOverSeatLimit = role.seat === "paid" && validEmails.length > seatsLeft;

  const roleOptions = inviteRoles(roles, currentRole).map((item) => ({
    value: item.id,
    label: item.name,
    description: item.description,
  }));

  function close() {
    setEmails([]);
    setIsMessageOpen(false);
    onClose();
  }

  function send() {
    onSend(validEmails, roleId);
    close();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(INVITE_LINK);
    toast.success("Invite link copied", "Anyone with an @platform.dev email can join as Viewer.");
  }

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      width="32.5rem"
      destroyOnHidden
      title={
        <div>
          <h2 className="mb-1 text-md font-semibold">Invite to {currentWorkspace.name}</h2>
          <p className="text-ui font-normal text-muted">
            They'll get an email with a link to join. Invites expire in 7 days.
          </p>
        </div>
      }
      styles={{ container: { padding: 0 }, header: { padding: "1.25rem 1.25rem 0", marginBottom: 0 } }}
    >
      <div className="flex flex-col gap-4 px-5 pt-4 pb-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-emails" className="text-ui font-medium">
            Email addresses
          </label>
          <Select
            id="invite-emails"
            mode="tags"
            open={false}
            size="large"
            autoFocus
            value={emails}
            onChange={(values) => setEmails(values.map((value) => value.trim().toLowerCase()).filter(Boolean))}
            tokenSeparators={[",", " ", "\n", ";"]}
            placeholder="ana@platform.dev, wei@platform.dev"
            suffixIcon={null}
            tagRender={({ value, closable, onClose }) => {
              const issue = emailIssue(value, members, invites);
              return (
                <Tooltip title={issue}>
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    className={`my-0.5 me-1 text-ui ${issue ? "border-danger-line bg-danger-soft text-danger-text" : "border-[#C9D6FF] bg-brand-soft"}`}
                  >
                    {value}
                  </Tag>
                </Tooltip>
              );
            }}
          />
          <span className="text-2xs text-muted">
            {invalidCount > 0
              ? `${invalidCount} ${invalidCount === 1 ? "address" : "addresses"} can't be invited. Hover for the reason.`
              : "Separate emails with commas, spaces or new lines."}
          </span>
        </div>

        <CustomSelect<RoleId>
          label="Role"
          value={roleId}
          onChange={setRoleId}
          options={roleOptions}
          optionRender={(option) => (
            <div className="flex flex-col py-0.5">
              <span className="text-ui font-medium">{option.data.label}</span>
              <span className="text-2xs text-muted">{option.data.description}</span>
            </div>
          )}
        />

        {isMessageOpen ? (
          <CustomInput
            label="Message"
            autoFocus
            maxLength={300}
            placeholder="Join us to review the Q4 architecture boards."
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsMessageOpen(true)}
            className="w-fit cursor-pointer text-ui font-medium text-brand hover:underline"
          >
            Add a message
          </button>
        )}

        {isOverSeatLimit && (
          <Alert
            type="warning"
            showIcon
            title={`${seatsLeft} paid ${seatsLeft === 1 ? "seat" : "seats"} left. Owners can add seats in Plan & billing.`}
            description="Viewers use a free seat, so you can still invite them."
          />
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={close}>Cancel</Button>
          <Button type="primary" disabled={validEmails.length === 0 || isOverSeatLimit} onClick={send}>
            {validEmails.length > 1 ? `Send ${validEmails.length} invites` : "Send invite"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-b-xl border-t border-line bg-app px-5 py-3">
        <span className="flex items-center gap-2 text-ui text-muted">
          <LuLink className="size-3.75" />
          Anyone with an @platform.dev email can join as Viewer
        </span>
        <Button size="small" onClick={copyLink}>
          Copy link
        </Button>
      </div>
    </Modal>
  );
}
