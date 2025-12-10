// src/features/blind-test/pages/BlindTestSetupPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { BlindTestLayout } from "../components/BlindTestLayout";
import { BlindTestHeader } from "../components/BlindTestHeader";
import { PlaylistSelectionGrid } from "../components/PlaylistSelectionGrid";
import { StartBlindTestButton } from "../components/StartBlindTestButton";
import { useBlindTestSetup } from "../hooks/useBlindTestSetup";
import { BLIND_TEST_QUESTION_COUNT } from "../types/blindTestConstants";
import {
  globalFontPrimary,
  globalTextPrimary,
  globalTextSecondary,
} from "../../../style/globalStyles";

export const BlindTestSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    playlists,
    selectedPlaylist,
    selectPlaylist,
    isLoading,
    error,
  } = useBlindTestSetup();

  const handleStart = () => {
    if (!selectedPlaylist) return;

    navigate("/blind-test/game", {
      state: {
        playlist: selectedPlaylist,
        questionCount: BLIND_TEST_QUESTION_COUNT,
      },
    });
  };

  return (
    <BlindTestLayout>
      {/* Titre principal : même style que Dashboard */}
      <h2
        style={{
          ...globalTextPrimary,
          ...globalFontPrimary,
          fontSize: "34px",
          margin: "0 0",
        }}
      >
        Blind Test Musical
      </h2>
      <h4
        style={{
          ...globalTextSecondary,
          ...globalFontPrimary,
          fontSize: "16px",
          marginTop: "0",
          marginBottom: "24px",
        }}
      >
        Teste tes connaissances musicales en devinant les morceaux de tes
        playlists.
      </h4>

      {/* Sous-titre + section playlists */}
      <BlindTestHeader
        title="Mes playlists"
        subtitle="Choisis une playlist pour générer ton blind test."
      />

      {isLoading && <p>Chargement des playlists…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && (
        <>
          <PlaylistSelectionGrid
            playlists={playlists}
            selectedPlaylistId={selectedPlaylist?.id ?? null}
            onSelectPlaylist={selectPlaylist}
          />
          <StartBlindTestButton
            disabled={!selectedPlaylist}
            onClick={handleStart}
          />
        </>
      )}
    </BlindTestLayout>
  );
};
