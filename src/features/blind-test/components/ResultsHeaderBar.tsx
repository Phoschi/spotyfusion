// src/features/blind-test/components/ResultsHeaderBar.tsx

import React from "react";

type Props = {
  playlistName: string;
};

export const ResultsHeaderBar: React.FC<Props> = ({ playlistName }) => (
  <header style={{ marginBottom: "16px" }}>
    <h2>Résultats — {playlistName}</h2>
  </header>
);
