import { Button, Modal } from "antd";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { useForm } from "../../hooks/useForm";
import { FOLDER_COLORS, FOLDER_ICONS } from "../../lib/folderAppearance";
import { FolderGlyph } from "./FolderGlyph";
import { getAncestors, getDescendantIds } from "../../lib/folderTree";
import { folderSchema } from "../../lib/schemas";
import type { Folder, FolderColor, FolderIcon } from "../../types/workspace";
import { CustomInput } from "../ui/CustomInput";
import { CustomSelect } from "../ui/CustomSelect";

export type FolderFormValues = Pick<Folder, "name" | "parentId" | "color" | "icon">;

type FolderFormModalProps = {
  open: boolean;
  folder?: Folder;
  defaultParentId: string | null;
  folders: Folder[];
  onSubmit: (values: FolderFormValues) => void;
  onClose: () => void;
};

const ROOT = "root";

export function FolderFormModal({ open, folder, onClose, ...props }: FolderFormModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={folder ? "Edit folder" : "New folder"}
      footer={null}
      destroyOnHidden
      width="28rem"
    >
      <FolderForm folder={folder} onClose={onClose} {...props} />
    </Modal>
  );
}

function FolderForm({ folder, defaultParentId, folders, onSubmit, onClose }: Omit<FolderFormModalProps, "open">) {
  const [name, setName] = useState(folder?.name ?? "");
  const [color, setColor] = useState<FolderColor>(folder?.color ?? "gray");
  const [icon, setIcon] = useState<FolderIcon>(folder?.icon ?? "folder");
  const [parentId, setParentId] = useState(folder ? (folder.parentId ?? ROOT) : (defaultParentId ?? ROOT));

  // A folder can't move inside itself or its own subfolders.
  const blockedIds = folder ? new Set(getDescendantIds(folders, folder.id)) : new Set<string>();
  const parentOptions = [
    { value: ROOT, label: "Workspace root" },
    ...folders
      .filter((item) => !blockedIds.has(item.id))
      .map((item) => ({
        value: item.id,
        label: getAncestors(folders, item.id)
          .map((ancestor) => ancestor.name)
          .join(" / "),
      })),
  ];

  const { formProps, fieldErrors } = useForm({
    schema: folderSchema,
    onSubmit: async (values) => onSubmit({ name: values.name, color, icon, parentId: parentId === ROOT ? null : parentId }),
  });

  return (
    <form {...formProps} className="flex flex-col gap-5 pt-2">
      <div className="flex items-end gap-3">
        <FolderGlyph color={color} icon={icon} variant="tile" className="size-9.5 text-lg" />
        <div className="flex-1">
          <CustomInput
            label="Name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Architecture reviews"
            autoFocus
            error={fieldErrors.name}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-ui font-medium">Color</span>
        <div role="radiogroup" aria-label="Folder color" className="flex gap-2">
          {(Object.keys(FOLDER_COLORS) as FolderColor[]).map((key) => {
            const isSelected = key === color;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={FOLDER_COLORS[key].label}
                title={FOLDER_COLORS[key].label}
                onClick={() => setColor(key)}
                style={{ backgroundColor: FOLDER_COLORS[key].fg }}
                className={`flex size-6 cursor-pointer items-center justify-center rounded-full text-white transition-shadow ${
                  isSelected ? "ring-2 ring-line-strong ring-offset-2" : "hover:ring-2 hover:ring-line hover:ring-offset-1"
                }`}
              >
                {isSelected && <LuCheck className="size-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-ui font-medium">Icon</span>
        <div role="radiogroup" aria-label="Folder icon" className="grid grid-cols-6 gap-1.5">
          {(Object.keys(FOLDER_ICONS) as FolderIcon[]).map((key) => {
            const isSelected = key === icon;
            const Icon = FOLDER_ICONS[key].icon;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={FOLDER_ICONS[key].label}
                title={FOLDER_ICONS[key].label}
                onClick={() => setIcon(key)}
                style={isSelected ? { color: FOLDER_COLORS[color].fg, backgroundColor: FOLDER_COLORS[color].bg } : undefined}
                className={`flex h-9 cursor-pointer items-center justify-center rounded-md border transition-colors [&_svg]:size-4 ${
                  isSelected ? "border-line-strong" : "border-line text-muted hover:bg-hover hover:text-ink"
                }`}
              >
                <Icon />
              </button>
            );
          })}
        </div>
      </div>

      <CustomSelect
        label="Location"
        value={parentId}
        onChange={setParentId}
        options={parentOptions}
        showSearch={{ optionFilterProp: "label" }}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          {folder ? "Save changes" : "Create folder"}
        </Button>
      </div>
    </form>
  );
}
