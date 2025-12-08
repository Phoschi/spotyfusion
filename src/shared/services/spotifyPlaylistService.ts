// features/blind-test/services/spotifyService.ts
import type { Playlist } from "../types/PlaylistTypes";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export async function fetchUserPlaylists(accessToken: string): Promise<Playlist[]> {
    const response = await fetch(`${SPOTIFY_API_URL}/me/playlists?limit=20`, {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Impossible de récupérer les playlists Spotify");
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.images && item.images.length > 0 ? item.images[0].url : "",
        selected: false,
    }));

}
