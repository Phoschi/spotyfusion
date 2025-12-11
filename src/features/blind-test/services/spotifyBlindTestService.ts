// src/features/blind-test/services/spotifyBlindTestService.ts

import type {
  SpotifyPlaylist,
  SpotifyTrack,
} from "../../../shared/types/spotifyBlindTestTypes";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const AUTH_STORAGE_KEY = "spotyfusion_auth";

type StoredAuth = {
  accessToken: string;
  expiresAt: number;
};

type SpotifyPaginatedResponse<T> = {
  items: T[];
  next: string | null;
};

type SpotifyPlaylistTrackItem = {
  track: SpotifyTrack | null;
};

type SpotifyPlaylistTracksResponse =
  SpotifyPaginatedResponse<SpotifyPlaylistTrackItem>;

const getValidAccessToken = (): string => {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    throw new Error("No Spotify auth data found");
  }

  let parsed: StoredAuth;
  try {
    parsed = JSON.parse(raw) as StoredAuth;
  } catch {
    throw new Error("Invalid auth data in storage");
  }

  if (!parsed.accessToken || Date.now() > parsed.expiresAt) {
    throw new Error("Spotify access token expired");
  }

  return parsed.accessToken;
};

const spotifyFetch = async <T>(
  endpoint: string,
  init?: RequestInit
): Promise<T> => {
  const token = getValidAccessToken();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${SPOTIFY_API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      (body as any).error?.message ??
      `Spotify API error (${response.status})`;
    throw new Error(message);
  }

  return (await response.json()) as T;
};

// --- Public API ---

export const spotifyBlindTestService = {
  async fetchUserPlaylists(limit = 50): Promise<SpotifyPlaylist[]> {
    const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyPlaylist>>(
      `/me/playlists?limit=${limit}`
    );
    return data.items;
  },

  async fetchPlaylistTracks(
    playlistId: string,
    limit = 100
  ): Promise<SpotifyTrack[]> {
    const tracks: SpotifyTrack[] = [];

    let nextUrl: string | null =
      `${SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks?limit=${limit}`;

    while (nextUrl) {
      const page: SpotifyPlaylistTracksResponse =
        await spotifyFetch<SpotifyPlaylistTracksResponse>(nextUrl);

      page.items.forEach((item: SpotifyPlaylistTrackItem) => {
        if (item.track) {
          tracks.push(item.track);
        }
      });

      nextUrl = page.next;
    }

    console.log(
      `DEBUG BlindTest: ${tracks.length} tracks récupérés (sans filtrer sur preview_url) pour la playlist ${playlistId}`
    );

    return tracks;
  },
};
