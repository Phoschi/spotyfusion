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
      className={`blindtest-playlist-card ${
        isSelected ? "blindtest-playlist-card--selected" : ""
      }`}
    >
      <div className="blindtest-playlist-card__cover-wrapper">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={playlist.name}
            className="blindtest-playlist-card__cover"
          />
        )}

        {isSelected && (
          <div className="blindtest-playlist-card__check">
            <span className="blindtest-playlist-card__check-icon">✓</span>
          </div>
        )}
      </div>

      <div className="blindtest-playlist-card__info">
        <div className="blindtest-playlist-card__title">{playlist.name}</div>
        <div className="blindtest-playlist-card__meta">
          {playlist.tracks.total} titres
        </div>
      </div>
    </button>
  );
};
