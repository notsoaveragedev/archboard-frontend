import { useNavigate } from "react-router";
import { useDashboardLocation } from "./useDashboardLocation";
import { useToast } from "./useToast";

// Uses mock data for now; these become API mutations once the backend is ready.
export function useWorkspaceActions() {
  const toast = useToast();
  const navigate = useNavigate();
  const { folder } = useDashboardLocation();
  const location = folder ? folder.name : "your workspace";

  return {
    createBoard: () => toast.success("Board created", `"Untitled board" was added to ${location}.`),
    createFolder: () => toast.success("Folder created", `"Untitled folder" was added to ${location}.`),
    startRetro: () =>
      toast.success("Retrospective ready", "Timer, dot voting and private mode are set up on your new board."),
    createFromTemplate: (templateName: string) =>
      toast.success("Board created from template", `"${templateName}" was added to ${location}.`),
    openTemplates: () => navigate("/app/templates"),
  };
}
