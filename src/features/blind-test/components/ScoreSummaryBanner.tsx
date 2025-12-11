// src/features/blind-test/components/ScoreSummaryBanner.tsx

import React from "react";

type Props = {
  score: number;
  total: number;
};

export const ScoreSummaryBanner: React.FC<Props> = ({ score, total }) => (
  <section
    style={{
      padding: "12px 16px",
      marginBottom: "16px",
      borderRadius: "8px",
      background: "#1db954",
      color: "#fff",
      fontWeight: 600,
    }}
  >
    {score} / {total} pts
  </section>
);
