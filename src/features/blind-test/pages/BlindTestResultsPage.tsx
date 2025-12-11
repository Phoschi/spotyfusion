// src/features/blind-test/pages/BlindTestResultsPage.tsx

import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import type {
  SpotifyPlaylist,
  SpotifyTrack,
} from "../../../shared/types/spotifyBlindTestTypes";
import { BlindTestLayout } from "../components/BlindTestLayout";
import { ResultsHeaderBar } from "../components/ResultsHeaderBar";
import { ScoreSummaryBanner } from "../components/ScoreSummaryBanner";
import { PlayedTracksList } from "../components/PlayedTracksList";
import type { BlindTestResult } from "../types/blindTestTypes";

type LocationState = {
  playlist: SpotifyPlaylist;
  result: BlindTestResult;
  playedTracks: SpotifyTrack[];
};

export const BlindTestResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state) {
    return <Navigate to="/blind-test" replace />;
  }

  const { playlist, result, playedTracks } = state;

  const handleReplay = () => {
    navigate("/blind-test/game", {
      state: {
        playlist,
        questionCount: result.totalQuestions,
      },
    });
  };

  return (
    <BlindTestLayout>
      <ResultsHeaderBar playlistName={playlist.name} />
      <ScoreSummaryBanner score={result.score} total={result.totalQuestions} />
      <PlayedTracksList tracks={playedTracks} />

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button type="button" onClick={handleReplay}>
          Rejouer
        </button>
      </div>
    </BlindTestLayout>
  );
};
