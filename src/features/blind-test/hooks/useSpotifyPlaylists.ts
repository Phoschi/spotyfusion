import { useEffect, useState } from "react";
import type { Playlist } from "../../../shared/types/PlaylistTypes";
import { fetchUserPlaylists } from "../../../shared/services/spotifyPlaylistService";
import { mockPlaylists } from "../blindTest.mock";

export function useSpotifyPlaylists(accessToken: string | null) {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    fetchUserPlaylists(accessToken)
      .then(setPlaylists)
      .catch((err) => {
        console.error(err);
        setError("Impossible de récupérer les playlists. Fallback sur mock.");
        setPlaylists(mockPlaylists);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  return { playlists, loading, error };
}
