// src/features/blind-test/components/PlayedTracksList.tsx

import React from "react";
import type { SpotifyTrack } from "../../../shared/types/spotifyBlindTestTypes";
import { PlayedTrackItem } from "./PlayedTrackItem";

type Props = {
  tracks: SpotifyTrack[];
};

export const PlayedTracksList: React.FC<Props> = ({ tracks }) => (
  <section style={{ marginTop: "16px" }}>
    <h3 style={{ marginBottom: "8px" }}>Morceaux joués</h3>
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tracks.map((track) => (
        <PlayedTrackItem key={track.id} track={track} />
      ))}
    </ul>
  </section>
);
