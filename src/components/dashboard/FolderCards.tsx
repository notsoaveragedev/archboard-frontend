import { Link } from "react-router";
import { FolderGlyph } from "../folders/FolderGlyph";
import { getChildren, pluralize } from "../../lib/folderTree";
import type { Board, Folder } from "../../types/workspace";
import { FolderActionsMenu } from "../folders/FolderActionsMenu";

type FolderCardsProps = {
  folders: Folder[];
  allFolders: Folder[];
  boards: Board[];
};

function folderMeta(folder: Folder, allFolders: Folder[], boards: Board[]) {
  const boardCount = boards.filter((board) => board.folderId === folder.id).length;
  const folderCount = getChildren(allFolders, folder.id).length;
  return [pluralize(boardCount, "board"), folderCount > 0 ? pluralize(folderCount, "folder") : ""]
    .filter(Boolean)
    .join(" · ");
}

export function FolderCards({ folders, allFolders, boards }: FolderCardsProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-ui font-medium">
        Folders <span className="ml-1 text-muted tabular-nums">{folders.length}</span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(13.75rem,1fr))] gap-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="group relative flex items-center gap-3 rounded-lg border border-line bg-surface p-3 transition-colors hover:border-line-strong hover:bg-hover-subtle"
          >
            <FolderGlyph color={folder.color} icon={folder.icon} variant="tile" className="size-8 [&_svg]:size-4" />
            <Link
              to={`/app/folders/${folder.id}`}
              className="flex min-w-0 flex-1 flex-col gap-0.5 text-ink after:absolute after:inset-0 hover:text-ink"
            >
              <span className="truncate text-ui font-medium">{folder.name}</span>
              <span className="text-2xs text-muted tabular-nums">{folderMeta(folder, allFolders, boards)}</span>
            </Link>
            <FolderActionsMenu
              folder={folder}
              className="relative z-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [&.ant-dropdown-open]:opacity-100"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
