// src/features/blind-test/hooks/useBlindTestSetup.ts

import { useEffect, useState } from "react";
import { spotifyBlindTestService } from "../services/spotifyBlindTestService";
import type { SpotifyPlaylist } from "../../../shared/types/spotifyBlindTestTypes";

type UseBlindTestSetupState = {
  playlists: SpotifyPlaylist[];
  selectedPlaylist: SpotifyPlaylist | null;
  isLoading: boolean;
  error: string | null;
  selectPlaylist: (playlistId: string) => void;
  reloadPlaylists: () => void;
};

export const useBlindTestSetup = (): UseBlindTestSetupState => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlaylists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await spotifyBlindTestService.fetchUserPlaylists();
      setPlaylists(data);
      if (!selectedPlaylist && data.length > 0) {
        setSelectedPlaylist(data[0]);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load playlists.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPlaylist = (playlistId: string) => {
    const found = playlists.find((p) => p.id === playlistId) ?? null;
    setSelectedPlaylist(found);
  };

  return {
    playlists,
    selectedPlaylist,
    isLoading,
    error,
    selectPlaylist,
    reloadPlaylists: loadPlaylists,
  };
};
