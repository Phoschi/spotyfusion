// src/features/mood-playlist/components/GenerateButtonBar.tsx
import React from "react";

type Props = {
  onGenerate: () => void;
  disabled?: boolean;
};

export const GenerateButtonBar: React.FC<Props> = ({
  onGenerate,
  disabled,
}) => {
  return (
    <div className="mp-generate-bar">
      <button
        type="button"
        className="mp-btn-primary mp-generate-btn"
        onClick={onGenerate}
        disabled={disabled}
      >
        <span className="mp-generate-icon">⚡</span>
        Générer les recommandations
      </button>
    </div>
  );
};
