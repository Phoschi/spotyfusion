// src/features/blind-test/components/PlaylistSelectionGrid.tsx

import React from "react";
import type { SpotifyPlaylist } from "../../../shared/types/spotifyBlindTestTypes";
import { PlaylistCard } from "./PlaylistCard";

type Props = {
  playlists: SpotifyPlaylist[];
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string) => void;
};

export const PlaylistSelectionGrid: React.FC<Props> = ({
  playlists,
  selectedPlaylistId,
  onSelectPlaylist,
}) => {
  if (playlists.length === 0) {
    return (
      <p className="blindtest-setup__status-message">
        Aucune playlist disponible.
      </p>
    );
  }

  return (
    <div className="blindtest-playlist-grid">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          isSelected={playlist.id === selectedPlaylistId}
          onSelect={() => onSelectPlaylist(playlist.id)}
        />
      ))}
    </div>
  );
};
