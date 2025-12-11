// src/features/blind-test/components/StartBlindTestButton.tsx

import React from "react";

type Props = {
  disabled: boolean;
  onClick: () => void;
};

export const StartBlindTestButton: React.FC<Props> = ({
  disabled,
  onClick,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="blindtest-start-button"
  >
    <span className="blindtest-start-button__icon">
      {/* Icône play simple en SVG pour rester propre */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="blindtest-start-button__icon-svg"
      >
        <circle cx="12" cy="12" r="11" />
        <polygon points="10,8 16,12 10,16" />
      </svg>
    </span>
    <span className="blindtest-start-button__label">
      Commencer le Blind Test
    </span>
  </button>
);
