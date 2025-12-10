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
    return <p>Aucune playlist disponible.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "12px",
      }}
    >
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
