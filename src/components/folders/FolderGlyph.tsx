import { FOLDER_COLORS, FOLDER_ICONS } from "../../lib/folderAppearance";
import type { FolderColor, FolderIcon } from "../../types/workspace";

type FolderGlyphProps = {
  color: FolderColor;
  icon: FolderIcon;
  variant?: "icon" | "tile";
  className?: string;
};

// "icon": just the colored glyph (tree rows). "tile": glyph on a tinted square (cards, previews).
export function FolderGlyph({ color, icon, variant = "icon", className = "" }: FolderGlyphProps) {
  const { fg, bg } = FOLDER_COLORS[color];
  const Icon = FOLDER_ICONS[icon].icon;

  if (variant === "icon") return <Icon style={{ color: fg }} className={`shrink-0 ${className}`} />;

  return (
    <span
      style={{ color: fg, backgroundColor: bg }}
      className={`flex shrink-0 items-center justify-center rounded-md ${className}`}
    >
      <Icon />
    </span>
  );
}
