// src/features/mood-playlist/pages/MoodPlaylistPage.tsx
import React from "react";
import { useMoodPlaylist } from "../hooks/useMoodPlaylist";
import { AudioFeaturesForm } from "../components/AudioFeaturesForm";
import { SeedSelectorPanel } from "../components/SeedSelectorPanel";
import { GenerateButtonBar } from "../components/GenerateButtonBar";
import { RecommendationsEmptyState } from "../components/RecommendationsEmptyState";
import { RecommendationsList } from "../components/RecommendationsList";
import "../styles/mood-playlist.css";

export const MoodPlaylistPage: React.FC = () => {
  const {
    state,
    searchResults,
    isSearching,
    updateAudioFeature,
    addSeed,
    removeSeed,
    searchSeeds,
    generateRecommendations,
    savePlaylist,
    maxSeeds,
  } = useMoodPlaylist();

  const hasRecommendations = state.recommendations.length > 0;

  return (
    <div className="mp-page">
      <header className="mp-page-header">
        <h1>Générateur de Playlists</h1>
        <p>
          Créez des playlists personnalisées basées sur vos préférences
          musicales.
        </p>
      </header>

      <div className="mp-layout">
        <AudioFeaturesForm
          audioFeatures={state.audioFeatures}
          onChangeFeature={updateAudioFeature}
        />
        <SeedSelectorPanel
          seeds={state.seeds}
          maxSeeds={maxSeeds}
          searchResults={searchResults}
          isSearching={isSearching}
          onSearch={searchSeeds}
          onAddSeed={addSeed}
          onRemoveSeed={removeSeed}
        />
      </div>

      <GenerateButtonBar
        onGenerate={generateRecommendations}
        disabled={state.isGenerating}
      />

      {state.error && <p className="mp-error">{state.error}</p>}
      {state.successMessage && (
        <p className="mp-success">{state.successMessage}</p>
      )}

      {hasRecommendations ? (
        <RecommendationsList
          tracks={state.recommendations}
          onSavePlaylist={savePlaylist}
          isSaving={state.isSaving}
        />
      ) : (
        <RecommendationsEmptyState />
      )}
    </div>
  );
};

export default MoodPlaylistPage;
