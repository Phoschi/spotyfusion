// src/shared/spotify/spotifyHttp.ts
import { getAccessToken } from "../services/spotifyAuthService";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export type SpotifyApiError = Error & {
  status?: number;
  spotifyError?: unknown;
  code?: string;
};

export async function fetchSpotify<T>(
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    const err = new Error("No access token available") as SpotifyApiError;
    err.status = 401;
    err.code = "NO_TOKEN";
    throw err;
  }

  const res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorBody: unknown = {};
    try {
      errorBody = await res.json();
    } catch {
    }

    console.error("Spotify API error", res.status, errorBody);

    const err = new Error(
      (errorBody as any)?.error?.message || `Spotify API error (${res.status})`
    ) as SpotifyApiError;
    err.status = res.status;
    err.spotifyError = errorBody;
    throw err;
  }

  return res.json();
}
