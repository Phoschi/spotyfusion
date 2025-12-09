// src/features/mood-playlist/components/SeedTag.tsx
import React from "react";
import type { Seed } from "../hooks/useMoodPlaylist";

type Props = {
  seed: Seed;
  onRemove: (id: string) => void;
};

export const SeedTag: React.FC<Props> = ({ seed, onRemove }) => {
  return (
    <button
      type="button"
      className="mp-seed-tag"
      onClick={() => onRemove(seed.id)}
      aria-label={`Remove ${seed.label} seed`}
    >
      <span>{seed.label}</span>
      <span className="mp-seed-tag-remove">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </button>
  );
};
