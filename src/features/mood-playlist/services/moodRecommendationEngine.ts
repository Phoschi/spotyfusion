// src/features/mood-playlist/services/moodRecommendationEngine.ts
import { fetchSpotify } from "../../../shared/services/spotifyHttp";
import type { SpotifyTrack } from "../../../shared/types/spotifyMoodTypes";
import type {
  AudioFeatures,
  RecommendationTrack,
  RecommendationsParams,
} from "../types/moodTypes";

export async function getArtistNameById(
  id: string
): Promise<string | null> {
  try {
    const artist = await fetchSpotify<{ name: string }>(`/artists/${id}`);
    return artist.name ?? null;
  } catch (error) {
    console.error("Erreur fallback artiste", error);
    return null;
  }
}

async function getAudioFeaturesForTracks(
  ids: string[]
): Promise<Record<string, AudioFeatures>> {
  if (!ids.length) return {};

  type SpotifyAudioFeaturesResponse = {
    audio_features: AudioFeatures[];
  };

  try {
    const data = await fetchSpotify<SpotifyAudioFeaturesResponse>(
      `/audio-features?ids=${ids.join(",")}`
    );

    const map: Record<string, AudioFeatures> = {};
    for (const feat of data.audio_features || []) {
      if (feat && feat.id) {
        map[feat.id] = feat;
      }
    }
    return map;
  } catch (error) {
    console.error("Erreur audio features fallback", error);
    return {};
  }
}

/**
 * Transforme les sliders en mots-clés pour la recherche (fallback).
 */
export function buildMoodTokensFromParams(
  params: RecommendationsParams
): string[] {
  const tokens = new Set<string>();

  const d = params.target_danceability ?? 0.5;
  const e = params.target_energy ?? 0.5;
  const v = params.target_valence ?? 0.5;

  // Danceability
  if (d > 0.7) {
    tokens.add("dance");
    tokens.add("party");
  } else if (d < 0.3) {
    tokens.add("acoustic");
    tokens.add("chill");
  }

  // Energy
  if (e > 0.7) {
    tokens.add("energetic");
    tokens.add("workout");
  } else if (e < 0.3) {
    tokens.add("relax");
    tokens.add("ambient");
  }

  // Valence
  if (v > 0.7) {
    tokens.add("happy");
    tokens.add("upbeat");
  } else if (v < 0.3) {
    tokens.add("sad");
    tokens.add("melancholic");
  }

  return Array.from(tokens);
}

/**
 * Classe et enrichit une liste de tracks en fonction des sliders
 * (danceability / energy / valence).
 */
export async function rankTracksByAudioFeatures(
  tracks: SpotifyTrack[],
  params: RecommendationsParams
): Promise<RecommendationTrack[]> {
  if (!tracks.length) return [];

  const limit = params.limit ?? 30;

  const ids = tracks.map((t) => t.id);
  const featuresMap = await getAudioFeaturesForTracks(ids);

  const featuresKeys = Object.keys(featuresMap);
  const hasAnyFeatures = featuresKeys.length > 0;
  console.log("[Mood] featuresMap size:", featuresKeys.length);

  // Si aucune feature dispo (403), on renvoie tel quel
  if (!hasAnyFeatures) {
    console.warn(
      "[Mood] Aucune audio-feature dispo, retour sans re-ranking (403 ?)"
    );
    return tracks.slice(0, limit).map((track) => ({
      ...track,
    }));
  }

  const targetDance = params.target_danceability ?? 0.5;
  const targetEnergy = params.target_energy ?? 0.5;
  const targetValence = params.target_valence ?? 0.5;

  const scored = tracks.map((track) => {
    const f = featuresMap[track.id];

    if (!f) {
      return {
        track,
        score: Number.POSITIVE_INFINITY,
        audioFeatures: undefined as AudioFeatures | undefined,
      };
    }

    const dD = f.danceability - targetDance;
    const dE = f.energy - targetEnergy;
    const dV = f.valence - targetValence;

    const score = dD * dD + dE * dE + dV * dV;

    return {
      track,
      score,
      audioFeatures: f,
    };
  });

  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map(({ track, score, audioFeatures }) => {
    const rec: RecommendationTrack = {
      ...track,
      energy: audioFeatures?.energy,
      audioFeatures,
      moodScore: Number.isFinite(score) ? score : undefined,
    };
    return rec;
  });
}
