// src/features/blind-test/pages/BlindTestGamePage.tsx

import React, { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import type {
  SpotifyPlaylist,
  SpotifyTrack,
} from "../../../shared/types/spotifyBlindTestTypes";
import { BlindTestLayout } from "../components/BlindTestLayout";
import { GameHeaderBar } from "../components/GameHeaderBar";
import { AudioPreviewPlayer } from "../components/AudioPreviewPlayer";
import { AnswerButtonsList } from "../components/AnswerButtonsList";
import { useBlindTestGame } from "../hooks/useBlindTestGame";
import type { BlindTestGameConfig } from "../types/blindTestTypes";

type LocationState = {
  playlist: SpotifyPlaylist;
  questionCount: number;
};

export const BlindTestGamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const config: BlindTestGameConfig | null = useMemo(() => {
    if (!state) return null;
    return {
      playlist: state.playlist,
      questionCount: state.questionCount,
    };
  }, [state]);

  const {
    phase,
    isLoading,
    error,
    currentQuestion,
    currentIndex,
    totalQuestions,
    feedback,
    result,
    playedTracks,
    score,
    selectAnswer,
    goToNextQuestion,
  } = useBlindTestGame(config);

  const [roundStarted, setRoundStarted] = useState(false);

  // Reset du round à chaque nouvelle question
  useEffect(() => {
    setRoundStarted(false);
  }, [currentQuestion?.id]);

  // Redirection si on arrive sans config (refresh / navigation directe)
  if (!config) {
    return <Navigate to="/blind-test" replace />;
  }

  // Navigation vers la page de résultats quand la partie est finie
  useEffect(() => {
    if (phase === "finished" && result) {
      navigate("/blind-test/results", {
        replace: true,
        state: {
          playlist: config.playlist,
          result,
          playedTracks,
        } as {
          playlist: SpotifyPlaylist;
          result: typeof result;
          playedTracks: SpotifyTrack[];
        },
      });
    }
  }, [phase, result, playedTracks, config, navigate]);

  const handleBackToPlaylists = () => {
    navigate("/blind-test", { replace: true });
  };

  const handleStartRound = () => {
    setRoundStarted(true);
  };

  // 🔹 Quand le timer arrive à 0 et qu'aucune réponse n'a été donnée,
  //    on passe automatiquement à la question suivante.
  const handleTimerComplete = () => {
    if (!roundStarted) return;
    if (!feedback) {
      goToNextQuestion();
    }
  };

  // 🔹 Quand une réponse est sélectionnée, on passe automatiquement
  //    à la question suivante après un court délai (pour laisser
  //    le temps de voir le feedback visuel si besoin).
  useEffect(() => {
    if (!feedback) return;

    const timeoutId = window.setTimeout(() => {
      goToNextQuestion();
    }, 1200); // 1.2 seconde, à ajuster

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedback, goToNextQuestion]);

  return (
    <BlindTestLayout>
      <GameHeaderBar
        playlist={config.playlist}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
      />

      <div
        style={{
          maxWidth: "640px",
          margin: "40px auto 0",
        }}
      >
        {error && (
          <div style={{ marginTop: "24px" }}>
            <p style={{ color: "#ff4d4f", marginBottom: "16px" }}>
              {error.startsWith("Not enough tracks")
                ? "Cette playlist ne contient pas assez de morceaux pour générer un blind test. Choisis une autre playlist."
                : error}
            </p>
            <button type="button" onClick={handleBackToPlaylists}>
              Retour à la sélection des playlists
            </button>
          </div>
        )}

        {!error && isLoading && <p>Chargement des questions…</p>}

        {!error && !isLoading && currentQuestion && (
          <>
            <AudioPreviewPlayer
              trackId={currentQuestion.track.id}
              spotifyUrl={currentQuestion.track.external_urls.spotify}
              roundStarted={roundStarted}
              onStartRound={handleStartRound}
              score={score}
              onTimerComplete={handleTimerComplete} // 🔹 nouveau
            />

            {/* Réponses visibles uniquement quand le round est démarré */}
            {roundStarted && (
              <AnswerButtonsList
                choices={currentQuestion.choices}
                feedback={feedback}
                onSelect={selectAnswer}
              />
            )}
          </>
        )}
      </div>
    </BlindTestLayout>
  );
};
