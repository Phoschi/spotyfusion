// src/features/mood-playlist/components/RecommendationsList.tsx
import React, { useState } from "react";
import type { RecommendationTrack } from "../types/moodTypes";
import type { SpotifyArtist } from "../../../shared/types/spotifyMoodTypes";
import "../../../features/mood-playlist/services/spotifyMoodPlaylistService";

type Props = {
  tracks: RecommendationTrack[];
  onSavePlaylist: (name: string) => void;
  isSaving: boolean;
};

// Helper to format ms to mm:ss
const formatMs = (ms: number) => {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
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
        <h2>Recommandations ({tracks.length})</h2>
        <div className="mp-reco-actions">
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="mp-input-name"
            placeholder="Nom de la playlist"
          />
          <button
            type="button"
            className="mp-btn-secondary"
            onClick={() => onSavePlaylist(playlistName)}
            disabled={isSaving || !playlistName.trim()}
          >
            {isSaving ? (
              "Sauvegarde..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Sauvegarder la Playlist
              </>
            )}
          </button>
        </div>
      </header>

      <ul className="mp-reco-list">
        {tracks.map((track, index) => {
          return (
            <li key={track.id} className="mp-reco-item">
              <div className="mp-reco-index">{index + 1}</div>

              <img
                src={track.album.images?.[0]?.url || ""}
                alt={track.name}
                className="mp-reco-cover"
              />

              <div className="mp-reco-main">
                <span className="mp-reco-title" title={track.name}>
                  {track.name}
                </span>
                <span
                  className="mp-reco-artist"
                  title={track.artists.map((a) => a.name).join(", ")}
                >
                  {track.artists.map((a: SpotifyArtist) => a.name).join(", ")}
                </span>
              </div>

              <div className="mp-reco-meta">
                {track.album.name}
              </div>

              <div className="mp-reco-meta">{formatMs(track.duration_ms)}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
