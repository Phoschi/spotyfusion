// src/features/blind-test/components/BlindTestHeader.tsx

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
};

export const BlindTestHeader: React.FC<Props> = ({ title, subtitle }) => (
  <header className="blindtest-section-header">
    <h2 className="blindtest-section-header__title">{title}</h2>
    {subtitle && (
      <p className="blindtest-section-header__subtitle">{subtitle}</p>
    )}
  </header>
);
