import { API_URL, api, refreshAccessToken, setAccessToken } from "./client";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type OAuthProvider = "github" | "google";

export type LoginInput = { email: string; password: string; remember: boolean };
export type RegisterInput = { name: string; email: string; password: string };
export type VerifyEmailInput = { email: string; code: string };
export type MfaInput = { mfaToken: string; code?: string; backupCode?: string };
export type MfaChallenge = { mfaToken: string };

type Session = { accessToken: string; user: User };

function startSession(session: Session) {
  setAccessToken(session.accessToken);
  return session.user;
}

function post<T>(path: string, body?: unknown) {
  return api<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
}

export async function login(input: LoginInput): Promise<User | MfaChallenge> {
  const data = await post<Session | MfaChallenge>("/auth/login", input);
  return "mfaToken" in data ? data : startSession(data);
}

export async function verifyMfa(input: MfaInput) {
  return startSession(await post<Session>("/auth/mfa/verify", input));
}

export function register(input: RegisterInput) {
  return post<void>("/auth/register", input);
}

export async function verifyEmail(input: VerifyEmailInput) {
  return startSession(await post<Session>("/auth/verify-email", input));
}

export function resendVerification(email: string) {
  return post<void>("/auth/resend-verification", { email });
}

export function requestPasswordReset(email: string) {
  return post<void>("/auth/forgot-password", { email });
}

export function verifyResetCode(email: string, code: string) {
  return post<{ resetToken: string }>("/auth/verify-reset-code", { email, code });
}

export function resetPassword(resetToken: string, password: string) {
  return post<void>("/auth/reset-password", { resetToken, password });
}

// Signing out locally must always succeed; revoking the server session is best-effort.
export async function logout() {
  await post("/auth/logout").catch(() => undefined);
  setAccessToken(null);
}

export async function restoreSession() {
  const token = await refreshAccessToken();
  if (!token) return null;

  try {
    const { user } = await api<{ user: User }>("/auth/me");
    return user;
  } catch {
    return null;
  }
}

export function startOAuth(provider: OAuthProvider) {
  window.location.assign(`${API_URL}/auth/oauth/${provider}`);
}
