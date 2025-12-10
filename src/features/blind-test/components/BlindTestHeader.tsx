// src/features/blind-test/components/BlindTestHeader.tsx

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
};

export const BlindTestHeader: React.FC<Props> = ({ title, subtitle }) => (
  <header style={{ marginBottom: "24px" }}>
    <h2>{title}</h2>
    {subtitle && (
      <p style={{ marginTop: "4px", opacity: 0.8 }}>{subtitle}</p>
    )}
  </header>
);
