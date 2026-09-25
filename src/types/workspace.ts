export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
};

export type BoardStatus = "live" | "shared" | "draft";

export type ThumbnailShape = {
  x: number;
  y: number;
  w: number;
  h: number;
  isSticky?: boolean;
};

export type Board = {
  id: string;
  folderId: string;
  name: string;
  status: BoardStatus;
  statusLabel: string;
  owner: string;
  editedLabel: string;
  editedOrder: number;
  createdOrder: number;
  collaborators?: string;
  thumbnail: ThumbnailShape[];
};

export type Template = {
  id: string;
  name: string;
  description: string;
  category: "Engineering" | "Product" | "Agile" | "Planning";
  usedCount: number;
  thumbnail: ThumbnailShape[];
};

export type Member = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: "Owner" | "Can edit" | "Can view";
  color: { bg: string; fg: string; ring: string };
  isPending?: boolean;
};

export type Workspace = {
  id: string;
  name: string;
  initials: string;
  memberCount: number;
  plan: "Team" | "Personal";
  tileClass: string;
};
