import { useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { LoginInput, MfaInput, User, VerifyEmailInput } from "../api/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .restoreSession()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(input: LoginInput) {
    const result = await authApi.login(input);
    if ("mfaToken" in result) return result;
    setUser(result);
    return null;
  }

  async function completeMfa(input: MfaInput) {
    setUser(await authApi.verifyMfa(input));
  }

  async function verifyEmail(input: VerifyEmailInput) {
    setUser(await authApi.verifyEmail(input));
  }

  async function signOut() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext value={{ user, isLoading, signIn, completeMfa, verifyEmail, signOut }}>{children}</AuthContext>
  );
}
