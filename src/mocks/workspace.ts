import type { Board, Folder, Member, Template, ThumbnailShape, Workspace } from "../types/workspace";

// Temporary data for UI work. Replaced by API calls once the backend is ready.

export const workspaces: Workspace[] = [
  { id: "platform", name: "Platform Team", initials: "PT", memberCount: 6, plan: "Team", tileClass: "bg-ink" },
  { id: "design", name: "Design Guild", initials: "DG", memberCount: 12, plan: "Team", tileClass: "bg-[#8E4EC6]" },
  { id: "personal", name: "Personal", initials: "P", memberCount: 1, plan: "Personal", tileClass: "bg-[#12A594]" },
];

export const folders: Folder[] = [
  { id: "eng", name: "Engineering", parentId: null },
  { id: "sd", name: "System design", parentId: "eng" },
  { id: "pay", name: "Payments", parentId: "sd" },
  { id: "infra", name: "Infrastructure", parentId: "eng" },
  { id: "rfc", name: "RFC reviews", parentId: "infra" },
  { id: "retro", name: "Retrospectives", parentId: null },
  { id: "q4", name: "Sprint retros · Q4", parentId: "retro" },
  { id: "product", name: "Product & design", parentId: null },
  { id: "personal", name: "Personal", parentId: null },
];

const node = (x: number, y: number, w = 22, h = 14): ThumbnailShape => ({ x, y, w, h });
const sticky = (x: number, y: number, w: number, h: number): ThumbnailShape => ({ x, y, w, h, isSticky: true });

const layouts = {
  a: [node(6, 42), node(32, 42), node(58, 24), node(58, 60), node(82, 24, 14), node(82, 60, 14), sticky(78, 4, 16, 14), node(32, 76)],
  b: [node(8, 30), node(8, 60), node(38, 45), node(66, 20), node(66, 45), node(66, 70), sticky(36, 8, 18, 16)],
  c: [node(10, 20, 30, 16), node(50, 20, 30, 16), node(10, 56, 70, 14), node(30, 80, 30, 12), sticky(82, 50, 14, 18)],
  d: [node(6, 50), node(30, 50), node(54, 30), node(54, 70), node(78, 50, 16)],
  e: [node(14, 18), node(44, 18), node(74, 18, 18), node(14, 58), node(44, 58), sticky(72, 56, 18, 20)],
};

export const boards: Board[] = [
  { id: "1", folderId: "sd", name: "Payments architecture", status: "live", statusLabel: "Live now", owner: "Priya", editedLabel: "Just now", editedOrder: 0, createdOrder: 12, collaborators: "Rahul, Ana", thumbnail: layouts.a },
  { id: "2", folderId: "sd", name: "Rate limiter design", status: "shared", statusLabel: "Shared · 5", owner: "Priya", editedLabel: "2 days ago", editedOrder: 2, createdOrder: 11, thumbnail: layouts.b },
  { id: "3", folderId: "sd", name: "News feed ranking", status: "draft", statusLabel: "Draft", owner: "Rahul", editedLabel: "3 days ago", editedOrder: 3, createdOrder: 10, thumbnail: layouts.c },
  { id: "4", folderId: "sd", name: "Chat service", status: "shared", statusLabel: "Shared · 3", owner: "Ana", editedLabel: "Last week", editedOrder: 7, createdOrder: 9, thumbnail: layouts.e },
  { id: "5", folderId: "sd", name: "Web crawler", status: "draft", statusLabel: "Draft", owner: "Priya", editedLabel: "Sep 2", editedOrder: 20, createdOrder: 8, thumbnail: layouts.d },
  { id: "6", folderId: "sd", name: "Distributed cache", status: "shared", statusLabel: "Shared · 6", owner: "Priya", editedLabel: "Aug 28", editedOrder: 25, createdOrder: 7, thumbnail: layouts.b },
  { id: "7", folderId: "pay", name: "Ledger service", status: "draft", statusLabel: "Draft", owner: "Priya", editedLabel: "Aug 20", editedOrder: 33, createdOrder: 6, thumbnail: layouts.d },
  { id: "8", folderId: "pay", name: "Refund flow", status: "draft", statusLabel: "Draft", owner: "Rahul", editedLabel: "Aug 18", editedOrder: 35, createdOrder: 5, thumbnail: layouts.c },
  { id: "9", folderId: "infra", name: "Kubernetes rollout", status: "shared", statusLabel: "Shared · 4", owner: "Ana", editedLabel: "Sep 10", editedOrder: 12, createdOrder: 4, thumbnail: layouts.e },
  { id: "10", folderId: "rfc", name: "RFC: Event bus", status: "draft", statusLabel: "Draft", owner: "Priya", editedLabel: "Sep 1", editedOrder: 21, createdOrder: 3, thumbnail: layouts.b },
  { id: "11", folderId: "q4", name: "Sprint 42 retro", status: "shared", statusLabel: "Shared · 6", owner: "Priya", editedLabel: "Sep 14", editedOrder: 8, createdOrder: 2, thumbnail: layouts.a },
  { id: "12", folderId: "product", name: "Onboarding journey", status: "draft", statusLabel: "Draft", owner: "Marcus", editedLabel: "Sep 5", editedOrder: 17, createdOrder: 1, thumbnail: layouts.c },
];

export const templates: Template[] = [
  { id: "t1", name: "System architecture", description: "Clients, services, data stores and the arrows between them.", category: "Engineering", usedCount: 1240, thumbnail: layouts.a },
  { id: "t2", name: "Flowchart", description: "Map a process with steps, decisions and outcomes.", category: "Engineering", usedCount: 980, thumbnail: layouts.d },
  { id: "t3", name: "Retrospective", description: "Start, stop, continue with a timer and dot voting.", category: "Agile", usedCount: 860, thumbnail: layouts.e },
  { id: "t4", name: "Kanban", description: "To do, in progress and done columns for your team.", category: "Agile", usedCount: 740, thumbnail: layouts.c },
  { id: "t5", name: "User journey map", description: "Stages, actions and feelings across a customer journey.", category: "Product", usedCount: 520, thumbnail: layouts.b },
  { id: "t6", name: "Mind map", description: "Branch out from one idea to everything connected to it.", category: "Planning", usedCount: 610, thumbnail: layouts.d },
  { id: "t7", name: "Brainstorm", description: "Sticky notes in clusters, ready for private mode.", category: "Agile", usedCount: 450, thumbnail: layouts.e },
  { id: "t8", name: "Meeting notes", description: "Agenda, decisions and action items in one frame.", category: "Planning", usedCount: 390, thumbnail: layouts.c },
  { id: "t9", name: "Weekly planning", description: "Plan the week across days with priorities on top.", category: "Planning", usedCount: 330, thumbnail: layouts.b },
  { id: "t10", name: "Sequence diagram", description: "Actors, lifelines and messages for an API flow.", category: "Engineering", usedCount: 280, thumbnail: layouts.a },
];

export const starredBoardIds = ["1", "4"];

export const members: Member[] = [
  { id: "m1", name: "Priya Sharma", email: "priya@platform.dev", initials: "PS", role: "Owner", color: { bg: "#F3ECFA", fg: "#5E2E8C", ring: "#8E4EC6" } },
  { id: "m2", name: "Rahul Kumar", email: "rahul@platform.dev", initials: "RK", role: "Can edit", color: { bg: "#FEEFE5", fg: "#9A3C06", ring: "#F76B15" } },
  { id: "m3", name: "Ana López", email: "ana@platform.dev", initials: "AL", role: "Can view", color: { bg: "#E4F6F3", fg: "#0B6B60", ring: "#12A594" } },
  { id: "m4", name: "Marcus Lee", email: "marcus@platform.dev", initials: "ML", role: "Can edit", color: { bg: "#EEF0F3", fg: "#0B1220", ring: "#A3AAB6" }, isPending: true },
];

export const currentMember = members[0];

export function findMemberByFirstName(firstName: string) {
  return members.find((member) => member.name.split(" ")[0] === firstName);
}
