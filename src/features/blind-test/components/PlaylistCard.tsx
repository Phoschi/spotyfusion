// src/features/blind-test/components/PlaylistCard.tsx

import React from "react";
import type { SpotifyPlaylist } from "../../../shared/types/spotifyBlindTestTypes";

type Props = {
  playlist: SpotifyPlaylist;
  isSelected: boolean;
  onSelect: () => void;
};

export const PlaylistCard: React.FC<Props> = ({
  playlist,
  isSelected,
  onSelect,
}) => {
  const coverUrl = playlist.images[0]?.url;

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        border: isSelected ? "2px solid #1db954" : "1px solid #444",
        borderRadius: "8px",
        padding: "8px",
        background: isSelected ? "#222" : "#111",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {coverUrl && (
        <img
          src={coverUrl}
          alt={playlist.name}
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
      )}
      <div style={{ marginTop: "8px" }}>
        <div>{playlist.name}</div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          {playlist.tracks.total} titres
        </div>
      </div>
    </button>
  );
};
