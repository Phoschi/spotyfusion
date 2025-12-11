// src/features/blind-test/components/AudioPreviewPlayer.tsx

import React, { useEffect, useState } from "react";
import { CircularTimer } from "./CircularTimer";
import { AUDIO_PREVIEW_DURATION_MS } from "../types/blindTestConstants";

type Props = {
  trackId: string;
  spotifyUrl: string;
  score: number;
  onTimerComplete?: () => void;
};

export const AudioPreviewPlayer: React.FC<Props> = ({
  trackId,
  score,
  onTimerComplete,
}) => {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    setElapsedMs(0);

    const start = Date.now();

    const intervalId = window.setInterval(() => {
      const diff = Date.now() - start;

      if (diff >= AUDIO_PREVIEW_DURATION_MS) {
        setElapsedMs(AUDIO_PREVIEW_DURATION_MS);
        window.clearInterval(intervalId);

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
  }, [trackId, onTimerComplete]);

  const progress = Math.min(elapsedMs / AUDIO_PREVIEW_DURATION_MS, 1);
  const secondsLeft = Math.max(
    0,
    Math.ceil((AUDIO_PREVIEW_DURATION_MS - elapsedMs) / 1000)
  );

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
      <CircularTimer progress={progress} secondsLeft={secondsLeft} />

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

      <p
        style={{
          marginTop: "8px",
          fontSize: "12px",
          opacity: 0.7,
          textAlign: "center",
        }}
      >
        Clique sur le lecteur pour écouter l&apos;extrait puis choisis la bonne
        réponse.
      </p>

      {/* Ligne player (gauche) + flèche (droite) */}
      <div className="sf-blindtest-player-row">
        {/* Player Spotify croppé à gauche */}
        <div className="sf-blindtest-player-wrapper">
          <iframe
            key={trackId}
            src={`https://open.spotify.com/embed/track/${trackId}`}
            className="sf-blindtest-player-iframe"
            allow="encrypted-media"
            loading="lazy"
          />
          <div className="sf-blindtest-player-info-mask" />
        </div>

        {/* Flèche à droite, pointant vers la gauche */}
        <div className="sf-blindtest-player-arrow">
          <span className="sf-blindtest-player-arrow-icon">⇦</span>
          <div className="sf-blindtest-player-arrow-text">
            Clique ici
            <br />
            pour écouter
          </div>
        </div>
      </div>

    </section>
  );
};
