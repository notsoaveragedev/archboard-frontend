// Temporary data for the account settings pages. The current user is Priya (platformMembers[0]).

export const passwordLastChanged = "2026-08-14T09:30:00Z";
export const twoFactorSince = "2026-09-12T11:20:00Z";

export const totpSecret = "JBSWY3DPEHPK3PXPKRSXG5CTMVRXEZLU";
export const otpauthUrl = `otpauth://totp/archboard:priya@platform.dev?secret=${totpSecret}&issuer=archboard`;

export const backupCodes = [
  "4f7k-2m9q",
  "h8xw-3n2c",
  "p6rt-9vbz",
  "k2dj-7q4s",
  "m9ce-5wxa",
  "t3gy-8fln",
  "z7ua-1kpd",
  "b5nh-6rje",
  "w4qm-2tzc",
  "e8vs-3hby",
];

export type ConnectedAccount = {
  provider: "google" | "github";
  name: string;
  account: string | null;
  connectedAt: string | null;
};

export const connectedAccounts: ConnectedAccount[] = [
  { provider: "google", name: "Google", account: "priya@gmail.com", connectedAt: "2026-09-02T08:15:00Z" },
  { provider: "github", name: "GitHub", account: null, connectedAt: null },
];

export const notificationTypes = [
  { id: "shared", label: "Shared with you", description: "Someone gives you access to a board or folder.", inApp: true, email: true },
  { id: "accessRequests", label: "Access requests", description: "Someone asks to view or edit your board.", inApp: true, email: true },
  { id: "accessApproved", label: "Access approved", description: "Your request to open a board was approved.", inApp: true, email: false },
];

export const storage = {
  usedGb: 1.8,
  totalGb: 5,
  parts: [
    { label: "Boards", gb: 0.9, className: "bg-ink" },
    { label: "Images", gb: 0.7, className: "bg-brand" },
    { label: "Version history", gb: 0.2, className: "bg-subtle" },
  ],
};
