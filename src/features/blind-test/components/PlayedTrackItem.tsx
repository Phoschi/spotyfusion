// src/features/blind-test/components/PlayedTrackItem.tsx

import React from "react";
import type { SpotifyTrack } from "../../../shared/types/spotifyBlindTestTypes";

type Props = {
  track: SpotifyTrack;
};

export const PlayedTrackItem: React.FC<Props> = ({ track }) => {
  const coverUrl = track.album.images[0]?.url;
  const artists = track.artists.map((a) => a.name).join(", ");

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #333",
      }}
    >
      {coverUrl && (
        <img
          src={coverUrl}
          alt={track.name}
          style={{
            width: "48px",
            height: "48px",
            objectFit: "cover",
            marginRight: "12px",
          }}
        />
      )}
      <div>
        <div>{track.name}</div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>{artists}</div>
      </div>
    </li>
  );
};
