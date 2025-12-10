// src/features/blind-test/components/AudioPreviewPlayer.tsx

import React, { useEffect, useState } from "react";
import { CircularTimer } from "./CircularTimer";
import { AUDIO_PREVIEW_DURATION_MS } from "../types/blindTestConstants";

type Props = {
  trackId: string;
  spotifyUrl: string;
  roundStarted: boolean;
  onStartRound: () => void;
  score: number;
  onTimerComplete?: () => void; // 🔹 nouveau callback
};

/**
 * Flow :
 * 1. Clic "Démarrer le round" => roundStarted = true, timer démarre, réponses affichées.
 * 2. L'utilisateur gère la lecture via le mini-player Spotify croppé.
 * 3. Quand le timer se termine, on appelle onTimerComplete (si fourni).
 */
export const AudioPreviewPlayer: React.FC<Props> = ({
  trackId,
  spotifyUrl,
  roundStarted,
  onStartRound,
  score,
  onTimerComplete,
}) => {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    // Reset du timer à chaque nouvelle question
    setElapsedMs(0);

    if (!roundStarted) {
      return;
    }

    const start = Date.now();

    const intervalId = window.setInterval(() => {
      const diff = Date.now() - start;
      if (diff >= AUDIO_PREVIEW_DURATION_MS) {
        setElapsedMs(AUDIO_PREVIEW_DURATION_MS);
        window.clearInterval(intervalId);

        // 🔹 notifier le parent que le timer est terminé
        if (onTimerComplete) {
          onTimerComplete();
        }

        return;
      }
      setElapsedMs(diff);
    }, 200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [trackId, roundStarted, onTimerComplete]);

  const progress = Math.min(elapsedMs / AUDIO_PREVIEW_DURATION_MS, 1);
  const secondsLeft = Math.max(
    0,
    Math.ceil((AUDIO_PREVIEW_DURATION_MS - elapsedMs) / 1000)
  );

  const handleClickStartRound = () => {
    onStartRound();
  };

  return (
    <section
      style={{
        marginBottom: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Timer circulaire */}
      <CircularTimer progress={progress} secondsLeft={secondsLeft} />

      {/* Score courant */}
      <div
        style={{
          marginTop: "4px",
          padding: "6px 18px",
          borderRadius: "999px",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontWeight: 700,
          fontSize: "16px",
        }}
      >
        {score} pt{score > 1 ? "s" : ""}
      </div>

      {/* Bouton pour démarrer le round (logique de jeu) */}
      {!roundStarted && (
        <>
          <button
            type="button"
            onClick={handleClickStartRound}
            style={{
              marginTop: "12px",
              borderRadius: "999px",
              padding: "10px 24px",
              border: "none",
              backgroundColor: "#ffffff",
              color: "#000000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Démarrer le round
          </button>
          <p
            style={{
              marginTop: "4px",
              fontSize: "12px",
              opacity: 0.7,
              textAlign: "center",
            }}
          >
            Après avoir démarré le round, utilise le lecteur ci-dessous
            pour lancer ou mettre en pause l&apos;extrait.
          </p>
        </>
      )}

      {/* Player Spotify croppé : jaquette / texte masqués, bouton Play visible à droite */}
      <div className="sf-blindtest-player-wrapper" style={{ marginTop: "8px" }}>
        <iframe
          key={trackId}
          src={`https://open.spotify.com/embed/track/${trackId}`}
          className="sf-blindtest-player-iframe"
          allow="encrypted-media"
          loading="lazy"
        />
        <div className="sf-blindtest-player-info-mask" />
      </div>

      {/* Lien direct en secours (optionnel) */}
      <div style={{ marginTop: "4px" }}>
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: "12px", opacity: 0.8 }}
        >
          Ouvrir dans Spotify
        </a>
      </div>
    </section>
  );
};
