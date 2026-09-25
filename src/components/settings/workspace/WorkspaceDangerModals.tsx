import { Alert, Button, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useFolders } from "../../../folders/FoldersContext";
import { useToast } from "../../../hooks/useToast";
import { CURRENT_MEMBER_ID, platformMembers } from "../../../mocks/rbac";
import { boards } from "../../../mocks/workspace";
import { findRole, BUILT_IN_ROLES } from "../../../rbac/permissions";
import { useRbac } from "../../../rbac/RbacContext";
import { useWorkspace } from "../../../workspace/WorkspaceContext";
import { CustomInput } from "../../ui/CustomInput";
import { CustomSelect } from "../../ui/CustomSelect";
import { MemberAvatar } from "../../ui/MemberAvatar";

type ModalProps = { open: boolean; onClose: () => void };

const candidates = platformMembers.filter((member) => member.id !== CURRENT_MEMBER_ID && member.roleId !== "guest");

export function TransferOwnershipModal({ open, onClose }: ModalProps) {
  const toast = useToast();
  const { currentWorkspace } = useWorkspace();
  const { setOwnRole } = useRbac();
  const [memberId, setMemberId] = useState<string>();
  const [password, setPassword] = useState("");
  const newOwner = candidates.find((member) => member.id === memberId);

  function transfer() {
    if (!newOwner) return;
    setOwnRole("admin");
    onClose();
    toast.success("Ownership transferred", `${newOwner.name} is now the Owner of ${currentWorkspace.name}.`);
  }

  return (
    <Modal open={open} onCancel={onClose} title="Transfer ownership" footer={null} destroyOnHidden width="28rem">
      <div className="flex flex-col gap-4 pt-2">
        <p className="text-ui text-muted">You'll become an Admin. Only the new Owner can undo this.</p>
        <CustomSelect
          label="New owner"
          placeholder="Choose a member"
          value={memberId}
          onChange={setMemberId}
          showSearch={{ optionFilterProp: "title" }}
          options={candidates.map((member) => ({
            value: member.id,
            title: member.name,
            label: (
              <span className="flex items-center gap-2">
                <MemberAvatar member={member} size="xs" showTooltip={false} />
                {member.name}
                <span className="text-2xs text-muted">{findRole(BUILT_IN_ROLES, member.roleId).name}</span>
              </span>
            ),
          }))}
        />
        <CustomInput
          label="Your password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" danger disabled={!newOwner || !password} onClick={transfer}>
            Transfer ownership
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function DeleteWorkspaceModal({ open, onClose }: ModalProps) {
  const toast = useToast();
  const navigate = useNavigate();
  const { folders } = useFolders();
  const { currentWorkspace, removeWorkspace } = useWorkspace();
  const [typedName, setTypedName] = useState("");

  function deleteWorkspace() {
    const { id, name } = currentWorkspace;
    onClose();
    removeWorkspace(id);
    navigate("/app");
    toast.warning(`${name} deleted`, "Its boards, folders and history are gone.");
  }

  return (
    <Modal open={open} onCancel={onClose} title="Delete workspace" footer={null} destroyOnHidden width="28rem">
      <div className="flex flex-col gap-4 pt-2">
        <Alert
          type="error"
          showIcon
          title={`This permanently deletes ${boards.length} boards, ${folders.length} folders and all version history for ${currentWorkspace.memberCount} members.`}
        />
        <CustomInput
          label={`Type ${currentWorkspace.name} to confirm`}
          value={typedName}
          onChange={(event) => setTypedName(event.target.value)}
          autoComplete="off"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" danger disabled={typedName !== currentWorkspace.name} onClick={deleteWorkspace}>
            Delete workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
}
