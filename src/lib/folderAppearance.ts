import type { IconType } from "react-icons";
import {
  LuBookOpen,
  LuBriefcase,
  LuCode,
  LuFlag,
  LuFolder,
  LuLayers,
  LuLightbulb,
  LuPalette,
  LuRocket,
  LuServer,
  LuTarget,
  LuUsers,
} from "react-icons/lu";
import type { FolderColor, FolderIcon } from "../types/workspace";

export const FOLDER_COLORS: Record<FolderColor, { label: string; fg: string; bg: string }> = {
  gray: { label: "Gray", fg: "#5B6474", bg: "#F0F2F5" },
  blue: { label: "Blue", fg: "#2D5BFF", bg: "#EAF0FF" },
  green: { label: "Green", fg: "#15803D", bg: "#E8F6EC" },
  amber: { label: "Amber", fg: "#B45309", bg: "#FFF6E5" },
  red: { label: "Red", fg: "#DC2626", bg: "#FDEDEE" },
  purple: { label: "Purple", fg: "#8E4EC6", bg: "#F3ECFA" },
  pink: { label: "Pink", fg: "#D6246E", bg: "#FDEEF4" },
  teal: { label: "Teal", fg: "#0E7C6F", bg: "#E4F6F3" },
};

export const FOLDER_ICONS: Record<FolderIcon, { label: string; icon: IconType }> = {
  folder: { label: "Folder", icon: LuFolder },
  briefcase: { label: "Briefcase", icon: LuBriefcase },
  code: { label: "Code", icon: LuCode },
  server: { label: "Server", icon: LuServer },
  rocket: { label: "Rocket", icon: LuRocket },
  layers: { label: "Layers", icon: LuLayers },
  palette: { label: "Palette", icon: LuPalette },
  users: { label: "Team", icon: LuUsers },
  book: { label: "Book", icon: LuBookOpen },
  lightbulb: { label: "Idea", icon: LuLightbulb },
  target: { label: "Target", icon: LuTarget },
  flag: { label: "Flag", icon: LuFlag },
};
