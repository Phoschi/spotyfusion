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
      <div className="blindtest-setup">
        {/* Titre principal + tagline (style maquette) */}
        <header className="blindtest-setup__intro">
          <h1
            className="blindtest-setup__title"
            style={{
              ...globalTextPrimary,
              ...globalFontPrimary,
            }}
          >
            Blind Test Musical
          </h1>
          <p
            className="blindtest-setup__subtitle"
            style={{
              ...globalTextSecondary,
              ...globalFontPrimary,
            }}
          >
            Testez vos connaissances musicales en devinant les morceaux.
          </p>
        </header>

        {/* Section playlists */}
        <BlindTestHeader
          title="Mes playlists"
          subtitle="Choisis une playlist pour générer ton blind test."
        />

        {isLoading && (
          <p className="blindtest-setup__status-message">
            Chargement des playlists…
          </p>
        )}
        {error && (
          <p className="blindtest-setup__status-message blindtest-setup__status-message--error">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <>
            <PlaylistSelectionGrid
              playlists={playlists}
              selectedPlaylistId={selectedPlaylist?.id ?? null}
              onSelectPlaylist={selectPlaylist}
            />

            {/* Bouton aligné en bas à gauche comme sur la maquette */}
            <div className="blindtest-setup__actions">
              <StartBlindTestButton
                disabled={!selectedPlaylist}
                onClick={handleStart}
              />
            </div>
          </>
        )}
      </div>
    </BlindTestLayout>
  );
};
