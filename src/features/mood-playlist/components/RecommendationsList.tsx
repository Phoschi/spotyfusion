// src/features/mood-playlist/components/RecommendationsList.tsx
import React, { useState } from "react";
import type {
  RecommendationTrack,
  SpotifyArtist,
} from "../../../shared/services/spotifyMoodPlaylistService";
type Props = {
  tracks: RecommendationTrack[];
  onSavePlaylist: (name: string) => void;
  isSaving: boolean;
};

export const RecommendationsList: React.FC<Props> = ({
  tracks,
  onSavePlaylist,
  isSaving,
}) => {
  const [playlistName, setPlaylistName] = useState("Mood Playlist");

  if (!tracks.length) {
    return null;
  }

  return (
    <section className="mp-reco-section">
      <header className="mp-reco-header">
        <h2>Recommandations</h2>
        <div className="mp-reco-actions">
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="mp-input"
          />
          <button
            type="button"
            className="mp-btn-secondary"
            onClick={() => onSavePlaylist(playlistName)}
            disabled={isSaving || !playlistName.trim()}
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder la playlist"}
          </button>
        </div>
      </header>

      <ul className="mp-reco-list">
        {tracks.map((track) => (
          <li key={track.id} className="mp-reco-item">
            <div className="mp-reco-main">
              {track.album.images?.[0] && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="mp-reco-cover"
                />
              )}
              <div>
                <p className="mp-reco-title">{track.name}</p>
                <p className="mp-reco-artist">
                  {track.artists.map((a: SpotifyArtist) => a.name).join(", ")}
                </p>
              </div>
            </div>
            <div className="mp-reco-meta">
              <span className="mp-reco-energy-label">
                Energy:{" "}
                <strong>
                  {track.energy !== undefined
                    ? track.energy.toFixed(2)
                    : "N/A"}
                </strong>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
