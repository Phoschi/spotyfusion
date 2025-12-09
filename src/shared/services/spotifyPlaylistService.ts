// features/blind-test/services/spotifyService.ts
import type { Playlist } from "../types/PlaylistTypes";
import type { Track } from "../types/SpotifyTypes";

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

export async function fetchPlaylistTracks(accessToken: string, playlistId: string): Promise<Track[]> {
    const response = await fetch(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks?market=FR&limit=50`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Impossible de récupérer les titres de la playlist");
    }

    const data = await response.json();
    console.log("Raw Tracks Data:", data.items);

    const tracks = data.items.map((item: any) => {
        const track = item.track;
        if (!track) return null; // Handle cases where track might be null
        return {
            id: track.id,
            name: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            previewUrl: track.preview_url,
            image: track.album.images && track.album.images.length > 0 ? track.album.images[0].url : "",
        };
    }).filter((t: any) => t !== null);

    const validTracks = tracks.filter((t: Track) => t.previewUrl !== null && t.previewUrl !== undefined);
    console.log(`Tracks found: ${tracks.length}, Tracks with preview: ${validTracks.length}`);

    return validTracks;
}

