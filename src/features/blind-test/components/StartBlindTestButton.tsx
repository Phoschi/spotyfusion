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
    style={{
      marginTop: "24px",
      padding: "12px 24px",
      borderRadius: "999px",
      border: "none",
      background: disabled ? "#555" : "#1db954",
      color: "#fff",
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    Commencer le Blind Test
  </button>
);
