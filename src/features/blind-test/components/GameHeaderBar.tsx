// src/features/blind-test/components/GameHeaderBar.tsx

import React from "react";
import type { SpotifyPlaylist } from "../../../shared/types/spotifyBlindTestTypes";
import { QuestionProgressIndicator } from "./QuestionProgressIndicator";

type Props = {
  playlist: SpotifyPlaylist;
  currentIndex: number;
  totalQuestions: number;
};

export const GameHeaderBar: React.FC<Props> = ({
  playlist,
  currentIndex,
  totalQuestions,
}) => (
  <header
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    }}
  >
    <h2>{playlist.name}</h2>
    <QuestionProgressIndicator
      current={currentIndex + 1}
      total={totalQuestions}
    />
  </header>
);
