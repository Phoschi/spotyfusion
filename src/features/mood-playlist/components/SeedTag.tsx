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
    >
      <span>{seed.label}</span>
      <span className="mp-seed-tag-remove">×</span>
    </button>
  );
};
