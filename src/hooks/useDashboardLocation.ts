import { useLocation, useMatch, useSearchParams } from "react-router";
import { useFolders } from "../folders/FoldersContext";

export type DashboardView = "recent" | "shared" | "starred" | "templates" | "trash";

export const VIEW_PATHS: Record<DashboardView, string> = {
  recent: "/app",
  shared: "/app/shared",
  starred: "/app/starred",
  templates: "/app/templates",
  trash: "/app/trash",
};

export const VIEW_LABELS: Record<DashboardView, string> = {
  recent: "Recent",
  shared: "Shared with me",
  starred: "Starred",
  templates: "Templates",
  trash: "Trash",
};

const VIEW_BY_PATH = Object.fromEntries(
  Object.entries(VIEW_PATHS).map(([view, path]) => [path, view as DashboardView]),
);

// useMatch works from the layout too, where useParams wouldn't see the child route's folderId.
export function useDashboardLocation() {
  const { folders } = useFolders();
  const folderMatch = useMatch("/app/folders/:folderId");
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const folderId = folderMatch?.params.folderId;
  const folder = folders.find((item) => item.id === folderId) ?? null;
  const view: DashboardView | null = folder ? null : (VIEW_BY_PATH[pathname] ?? "recent");
  const query = searchParams.get("q") ?? "";

  function setQuery(value: string) {
    setSearchParams(value ? { q: value } : {}, { replace: true });
  }

  return { view, folder, query, setQuery };
}
