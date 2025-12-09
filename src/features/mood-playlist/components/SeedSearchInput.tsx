// src/features/mood-playlist/components/SeedSearchInput.tsx
import React, { useState } from "react";
import type { SearchResultItem } from "../types/moodTypes";


type Props = {
  onSearch: (query: string) => void;
  results: SearchResultItem[];
  isLoading: boolean;
  onSelect: (item: SearchResultItem) => void;
  disabled?: boolean;
};

export const SeedSearchInput: React.FC<Props> = ({
  onSearch,
  results,
  isLoading,
  onSelect,
  disabled,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="mp-seed-search">
      <form onSubmit={handleSubmit}>
        <div className="mp-input-wrapper">
          <input
            type="text"
            placeholder="Rechercher artistes, pistes ou genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={disabled}
          />
          <button type="submit" disabled={disabled || !query.trim()}>
            Rechercher
          </button>
        </div>
      </form>

      {isLoading && <p className="mp-helper">Recherche en cours…</p>}

      {!isLoading && results.length > 0 && (
        <ul className="mp-search-results">
          {results.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <button
                type="button"
                onClick={() => {
                  onSelect(item);
                  setQuery("");
                }}
              >
                <span className="mp-result-title">{item.name}</span>
                <span className="mp-result-subtitle">{item.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
