import { Button, Checkbox, Modal } from "antd";
import { useState } from "react";
import { CustomInput } from "../../ui/CustomInput";

const CONFIRM_PHRASE = "delete my account";

type DeleteAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onDeleted: (exportFirst: boolean) => void;
};

export function DeleteAccountModal({ open, onClose, onDeleted }: DeleteAccountModalProps) {
  const [phrase, setPhrase] = useState("");
  const [exportFirst, setExportFirst] = useState(true);

  function reset() {
    setPhrase("");
    setExportFirst(true);
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      afterClose={reset}
      title="Delete your account?"
      width="26rem"
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} autoFocus>
            Cancel
          </Button>
          <Button type="primary" danger disabled={phrase.trim() !== CONFIRM_PHRASE} onClick={() => onDeleted(exportFirst)}>
            Delete account
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        <p className="text-ui text-muted">
          This permanently deletes your profile, your Personal workspace and every board you own. It can't be undone.
        </p>
        <CustomInput
          label={`Type "${CONFIRM_PHRASE}" to confirm`}
          value={phrase}
          onChange={(event) => setPhrase(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <Checkbox checked={exportFirst} onChange={(event) => setExportFirst(event.target.checked)}>
          Export my data first
        </Checkbox>
      </div>
    </Modal>
  );
}
