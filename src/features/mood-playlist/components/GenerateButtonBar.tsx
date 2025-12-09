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
        <span className="mp-generate-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 3v4" />
            <path d="M7 5h4" />
            <path d="M3 7h4" />
          </svg>
        </span>
        Générer les recommandations
      </button>
    </div>
  );
};
