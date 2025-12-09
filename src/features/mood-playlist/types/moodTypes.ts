// src/features/mood-playlist/types/moodTypes.ts
import type { SpotifyTrack } from "../../../shared/types/spotifyMoodTypes";

export type SearchItemType = "artist" | "track" | "genre";

export type SearchResultItem = {
  id: string;
  name: string;
  type: SearchItemType;
  subtitle: string;
};

export type RecommendationsParams = {
  seed_artists?: string[];
  seed_tracks?: string[];
  seed_genres?: string[];
  target_danceability?: number;
  target_energy?: number;
  target_valence?: number;
  limit?: number;
};

export type AudioFeatures = {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
};

export type RecommendationTrack = SpotifyTrack & {
  duration_ms: number; // Added for display
  popularity?: number; // Added if needed
  energy?: number;
  audioFeatures?: AudioFeatures;
  matchScore?: number; // Renamed/Added to match component usage
  moodScore?: number; // Keeping for compatibility if used elsewhere
};
