// src/shared/spotify/spotifyPlaylistService.ts
import { fetchSpotify } from "./spotifyHttp";

export async function createPlaylist(
  userId: string,
  name: string
): Promise<{ id: string }> {
  const body = {
    name,
    public: false,
    description: "Playlist générée avec Spotyfusion - Mood Generator",
  };

  return fetchSpotify<{ id: string }>(`/users/${userId}/playlists`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function addTracksToPlaylist(
  playlistId: string,
  uris: string[]
): Promise<void> {
  if (!uris.length) return;

  await fetchSpotify(`/playlists/${playlistId}/tracks`, {
    method: "POST",
    body: JSON.stringify({ uris }),
  });
}
