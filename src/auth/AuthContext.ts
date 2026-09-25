import { createContext, use } from "react";
import type { LoginInput, MfaChallenge, MfaInput, User, VerifyEmailInput } from "../api/auth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signIn: (input: LoginInput) => Promise<MfaChallenge | null>;
  completeMfa: (input: MfaInput) => Promise<void>;
  verifyEmail: (input: VerifyEmailInput) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
