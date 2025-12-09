// src/features/mood-playlist/components/AudioFeatureSlider.tsx
import React from "react";

type Props = {
  label: string;
  description: string;
  value: number; // 0–1
  onChange: (value: number) => void;
  testId?: string;
};

export const AudioFeatureSlider: React.FC<Props> = ({
  label,
  description,
  value,
  onChange,
  testId,
}) => {

  return (
    <div className="mp-slider" data-testid={testId}>
      <div className="mp-slider-header">
        <span className="mp-slider-label">{label}</span>
        <span className="mp-slider-badge">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        className="mp-slider-input"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="mp-slider-description">{description}</p>
    </div>
  );
};
