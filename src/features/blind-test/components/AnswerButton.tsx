// src/features/blind-test/components/AnswerButton.tsx

import React from "react";

type Props = {
  label: string;
  isSelected: boolean;
  isCorrect: boolean;
  showFeedback: boolean;
  disabled: boolean;
  onClick: () => void;
};

export const AnswerButton: React.FC<Props> = ({
  label,
  isSelected,
  isCorrect,
  showFeedback,
  disabled,
  onClick,
}) => {
  let background = "#222";

  if (showFeedback && isSelected && isCorrect) {
    background = "#1db954";
  } else if (showFeedback && isSelected && !isCorrect) {
    background = "#e22134";
  } else if (showFeedback && isCorrect) {
    background = "#1db954";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "12px 16px",
        marginBottom: "8px",
        borderRadius: "8px",
        border: "none",
        background,
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "center",
      }}
    >
      {label}
    </button>
  );
};
