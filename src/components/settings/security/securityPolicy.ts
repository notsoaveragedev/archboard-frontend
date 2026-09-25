import type { AuthMethod } from "../../../types/rbac";

export type SecurityPolicy = {
  requireTwoFactor: boolean;
  signInMethods: AuthMethod[];
  sessionLength: string;
  allowedDomains: string[];
  autoJoin: boolean;
  autoJoinRole: "member" | "viewer";
  allowGuests: boolean;
  defaultAccess: "workspace" | "restricted";
  publicLinks: boolean;
  maxLinkAccess: "view" | "edit";
  linkExpiry: string;
};

export type PolicyChange = (patch: Partial<SecurityPolicy>) => void;

export const INITIAL_POLICY: SecurityPolicy = {
  requireTwoFactor: false,
  signInMethods: ["password", "google", "github"],
  sessionLength: "30d",
  allowedDomains: ["@platform.dev"],
  autoJoin: true,
  autoJoinRole: "member",
  allowGuests: true,
  defaultAccess: "workspace",
  publicLinks: true,
  maxLinkAccess: "view",
  linkExpiry: "never",
};

export const SIGN_IN_METHODS: { value: AuthMethod; label: string }[] = [
  { value: "password", label: "Email & password" },
  { value: "google", label: "Google" },
  { value: "github", label: "GitHub" },
];

export const SESSION_LENGTHS = [
  { value: "12h", label: "12 hours" },
  { value: "1d", label: "1 day" },
  { value: "7d", label: "7 days" },
  { value: "14d", label: "14 days" },
  { value: "30d", label: "30 days" },
];

export const LINK_EXPIRY_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

// Accepts "platform.dev" or "@platform.dev" and stores the "@" form.
export function normalizeDomain(value: string) {
  const domain = value.trim().toLowerCase().replace(/^@+/, "");
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain) ? `@${domain}` : null;
}
