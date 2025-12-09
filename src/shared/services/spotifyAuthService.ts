// src/shared/services/spotifyAuthService.ts

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;
const SCOPES = (import.meta.env.VITE_SPOTIFY_SCOPES as string)?.split(" ") ?? [];

const STORAGE_KEY = "spotyfusion_auth";
const CODE_VERIFIER_KEY = "spotyfusion_code_verifier";

export type SpotifyAuthData = {
  accessToken: string;
  expiresAt: number;
};

/**
 * --- Helpers PKCE ---
 */

const generateRandomString = (length: number): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = window.crypto.getRandomValues(new Uint8Array(length));

  return Array.from(values).reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64UrlEncode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const createCodeChallenge = async (verifier: string): Promise<string> => {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
};

/**
 * --- Public API ---
 */

// Étape 1 : construire l’URL de login avec PKCE
export const buildSpotifyLoginUrlWithPkce = async (): Promise<string> => {
  if (!CLIENT_ID || !REDIRECT_URI) {
    console.error("Spotify CLIENT_ID ou REDIRECT_URI manquant dans les env.");
  }

  const codeVerifier = generateRandomString(64);
  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

  const codeChallenge = await createCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

// Étape 2 : échanger le "code" contre un access token
export const exchangeCodeForToken = async (code: string): Promise<void> => {
  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);

  if (!codeVerifier) {
    console.error("code_verifier manquant en localStorage");
    throw new Error("Missing PKCE code_verifier");
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    console.error("Erreur lors de l'échange code/token", await response.text());
    throw new Error("Failed to exchange code for token");
  }

  const data = await response.json() as {
    access_token: string;
    expires_in: number;
  };

  saveAuthData(data.access_token, data.expires_in);
  localStorage.removeItem(CODE_VERIFIER_KEY);
};

// Gestion du token
export const saveAuthData = (
  accessToken: string,
  expiresInSeconds: number
) => {
  const expiresAt = Date.now() + expiresInSeconds * 1000;

  const data: SpotifyAuthData = {
    accessToken,
    expiresAt,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getAuthData = (): SpotifyAuthData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SpotifyAuthData;
    if (parsed.expiresAt <= Date.now()) {
      clearAuthData();
      return null;
    }
    return parsed;
  } catch {
    clearAuthData();
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getAccessToken = (): string | null => {
  const data = getAuthData();
  return data?.accessToken ?? null;
};
