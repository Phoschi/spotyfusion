// src/features/mood-playlist/components/SeedSelectorPanel.tsx
import React from "react";
import type { Seed } from "../hooks/useMoodPlaylist";
import type { SearchResultItem } from "../types/moodTypes";
import { SeedSearchInput } from "./SeedSearchInput";
import { SeedTag } from "./SeedTag";

type Props = {
  seeds: Seed[];
  maxSeeds: number;
  searchResults: SearchResultItem[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onAddSeed: (item: SearchResultItem) => void;
  onRemoveSeed: (id: string) => void;
};

const POPULAR_GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "R&B",
  "Country",
];

export const SeedSelectorPanel: React.FC<Props> = ({
  seeds,
  maxSeeds,
  searchResults,
  isSearching,
  onSearch,
  onAddSeed,
  onRemoveSeed,
}) => {
  const hasReachedLimit = seeds.length >= maxSeeds;

  return (
    <section className="mp-card mp-card-right">
      <h2 className="mp-card-title">Semences</h2>

      <SeedSearchInput
        onSearch={onSearch}
        results={searchResults}
        isLoading={isSearching}
        onSelect={onAddSeed}
        disabled={hasReachedLimit}
      />

      <div className="mp-popular-genres">
        <p className="mp-section-label">Genres populaires :</p>
        <div className="mp-genres-chips">
          {POPULAR_GENRES.map((genre) => (
            <button
              type="button"
              key={genre}
              className="mp-genre-chip"
              disabled={hasReachedLimit}
              onClick={() =>
                onAddSeed({
                  id: genre.toLowerCase(),
                  name: genre,
                  type: "genre",
                  subtitle: "Genre",
                })
              }
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="mp-selected-seeds">
        <p className="mp-section-label">Semences sélectionnées :</p>
        {seeds.length === 0 && (
          <p className="mp-helper">Aucune semence pour le moment.</p>
        )}
        <div className="mp-seed-tags">
          {seeds.map((seed) => (
            <SeedTag key={seed.id} seed={seed} onRemove={onRemoveSeed} />
          ))}
        </div>
      </div>

      <div className="mp-info-box">
        <p>
          Ajoutez jusqu&apos;à <strong>{maxSeeds}</strong> semences (artistes,
          pistes ou genres) pour personnaliser vos recommandations.
        </p>
      </div>
    </section>
  );
};
