// src/features/blind-test/components/CircularTimer.tsx

import React from "react";

type Props = {
  progress: number;      // entre 0 et 1
  secondsLeft: number;   // secondes restantes
};

export const CircularTimer: React.FC<Props> = ({
  progress,
  secondsLeft,
}) => {
  const size = 160;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const offset = circumference * (1 - clampedProgress);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size}>
        {/* Cercle de fond */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2b2b2b"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Cercle de progression */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#1DB954"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Texte au centre */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="32"
          fontWeight="700"
          fill="#ffffff"
        >
          {secondsLeft}
        </text>
      </svg>
      <span
        style={{
          marginTop: "8px",
          fontSize: "12px",
          opacity: 0.7,
        }}
      >
        Temps restant
      </span>
    </div>
  );
};
