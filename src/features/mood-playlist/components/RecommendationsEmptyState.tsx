// src/features/mood-playlist/components/RecommendationsEmptyState.tsx
import React from "react";

export const RecommendationsEmptyState: React.FC = () => (
  <div className="mp-reco-empty">
    <h2>Recommandations</h2>
    <div className="mp-reco-empty-inner">
      <div className="mp-music-icon">♪</div>
      <p className="mp-reco-empty-title">
        Aucune recommandation pour le moment
      </p>
      <p className="mp-reco-empty-subtitle">
        Configurez vos préférences et ajoutez des semences, puis cliquez sur
        &quot;Générer les recommandations&quot;.
      </p>
    </div>
  </div>
);
