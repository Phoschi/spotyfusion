// src/shared/spotify/spotifyUserService.ts
import { fetchSpotify } from "./spotifyHttp";
import type { SpotifyUserProfile } from "../types/spotifyMoodTypes";

export async function getCurrentUserProfile(): Promise<SpotifyUserProfile> {
  return fetchSpotify<SpotifyUserProfile>("/me");
}
