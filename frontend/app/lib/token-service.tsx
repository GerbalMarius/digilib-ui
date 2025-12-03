const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

let accessTokenMemory: string | null = null;
let refreshTokenMemory: string | null = null;

export function setTokens(accessToken: string, refreshToken: string) {
  accessTokenMemory = accessToken;
  refreshTokenMemory = refreshToken;

  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getAccessToken(): string | null {
  if (accessTokenMemory) return accessTokenMemory;

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
    accessTokenMemory = stored;
    return stored;
  }

  return null;
}

export function getRefreshToken(): string | null {
  if (refreshTokenMemory) return refreshTokenMemory;

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(REFRESH_TOKEN_KEY);
    refreshTokenMemory = stored;
    return stored;
  }

  return null;
}

export function clearTokens() {
  accessTokenMemory = null;
  refreshTokenMemory = null;

  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
