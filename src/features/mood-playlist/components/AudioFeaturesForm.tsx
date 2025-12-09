// src/features/mood-playlist/components/AudioFeaturesForm.tsx
import React from "react";
import { AudioFeatureSlider } from "./AudioFeatureSlider";
import type { AudioFeaturesState } from "../hooks/useMoodPlaylist";

type Props = {
  audioFeatures: AudioFeaturesState;
  onChangeFeature: (key: keyof AudioFeaturesState, value: number) => void;
};

export const AudioFeaturesForm: React.FC<Props> = ({
  audioFeatures,
  onChangeFeature,
}) => {
  return (
    <section className="mp-card mp-card-left">
      <h2 className="mp-card-title">Caractéristiques Audio</h2>

      <AudioFeatureSlider
        label="Danceability"
        description="À quel point la musique est adaptée à la danse"
        value={audioFeatures.danceability}
        onChange={(v) => onChangeFeature("danceability", v)}
        testId="slider-danceability"
      />

      <AudioFeatureSlider
        label="Energy"
        description="Intensité et activité de la musique"
        value={audioFeatures.energy}
        onChange={(v) => onChangeFeature("energy", v)}
        testId="slider-energy"
      />

      <AudioFeatureSlider
        label="Valence (Positivité)"
        description="Humeur positive ou négative de la musique"
        value={audioFeatures.valence}
        onChange={(v) => onChangeFeature("valence", v)}
        testId="slider-valence"
      />
    </section>
  );
};
