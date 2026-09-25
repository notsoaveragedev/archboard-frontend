import { Button, Modal } from "antd";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { getAncestors } from "../../lib/folderTree";
import { renameBoardSchema } from "../../lib/schemas";
import { useFolders } from "../../folders/FoldersContext";
import type { Board } from "../../types/workspace";
import { CustomInput } from "../ui/CustomInput";
import { CustomSelect } from "../ui/CustomSelect";

type BoardDialogProps = {
  board: Board;
  open: boolean;
  onClose: () => void;
};

export function RenameBoardModal({ board, open, onClose }: BoardDialogProps) {
  const toast = useToast();
  const { formProps, fieldErrors, isPending } = useForm({
    schema: renameBoardSchema,
    onSubmit: async ({ name }) => {
      toast.success("Board renamed", `"${board.name}" is now "${name}".`);
      onClose();
    },
  });

  return (
    <Modal open={open} onCancel={onClose} title="Rename board" footer={null} destroyOnHidden width="26rem">
      <form {...formProps} className="flex flex-col gap-5 pt-2">
        <CustomInput label="Board name" name="name" defaultValue={board.name} autoFocus error={fieldErrors.name} />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function MoveBoardModal({ board, open, onClose }: BoardDialogProps) {
  const toast = useToast();
  const { folders } = useFolders();
  const [targetId, setTargetId] = useState(board.folderId);
  const folderOptions = folders.map((folder) => ({
    value: folder.id,
    label: getAncestors(folders, folder.id)
      .map((item) => item.name)
      .join(" / "),
  }));
  const target = folderOptions.find((option) => option.value === targetId);

  function handleMove() {
    toast.success("Board moved", `"${board.name}" is now in ${target?.label}.`);
    onClose();
  }

  return (
    <Modal open={open} onCancel={onClose} title="Move board" footer={null} destroyOnHidden width="26rem">
      <div className="flex flex-col gap-5 pt-2">
        <CustomSelect
          label="Folder"
          value={targetId}
          onChange={setTargetId}
          options={folderOptions}
          showSearch={{ optionFilterProp: "label" }}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleMove} disabled={targetId === board.folderId}>
            Move
          </Button>
        </div>
      </div>
    </Modal>
  );
}
