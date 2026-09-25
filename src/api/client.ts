export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/v1";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
}

async function send(path: string, options: RequestInit) {
  try {
    return await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Can't reach the server. Check your connection and try again.");
  }
}

async function parse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? "UNKNOWN",
      body?.error?.message ?? "Something went wrong. Please try again.",
    );
  }

  return body as T;
}

// Concurrent 401s share one refresh call instead of each rotating the token.
export function refreshAccessToken() {
  refreshPromise ??= send("/auth/refresh", { method: "POST" })
    .then((res) => parse<{ accessToken: string }>(res))
    .then((data) => {
      accessToken = data.accessToken;
      return accessToken;
    })
    .catch(() => {
      accessToken = null;
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  // A 401 only means "token expired" if we sent one; otherwise it's bad credentials.
  const hadToken = accessToken !== null;
  let res = await send(path, options);

  if (res.status === 401 && hadToken && path !== "/auth/refresh") {
    const token = await refreshAccessToken();
    if (token) res = await send(path, options);
  }

  return parse<T>(res);
}
