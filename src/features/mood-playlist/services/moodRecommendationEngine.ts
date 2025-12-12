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
 * Transforme les sliders en mots-clés pour la recherche (fallback),
 * avec plus de granularité pour mieux refléter les extrêmes.
 */
export function buildMoodTokensFromParams(
  params: RecommendationsParams
): string[] {
  const tokens = new Set<string>();

  const d = params.target_danceability ?? 0.5;
  const e = params.target_energy ?? 0.5;
  const v = params.target_valence ?? 0.5;

  // Danceability
  if (d >= 0.85) {
    tokens.add("dance");
    tokens.add("party");
    tokens.add("club");
    tokens.add("groove");
  } else if (d >= 0.6) {
    tokens.add("groove");
    tokens.add("rhythmic");
  } else if (d <= 0.15) {
    tokens.add("piano");
    tokens.add("intimate");
    tokens.add("acoustic");
  } else if (d <= 0.4) {
    tokens.add("acoustic");
    tokens.add("chill");
  }

  // Energy
  if (e >= 0.85) {
    tokens.add("energetic");
    tokens.add("workout");
    tokens.add("intense");
  } else if (e >= 0.6) {
    tokens.add("upbeat");
    tokens.add("uplifting");
  } else if (e <= 0.15) {
    tokens.add("sleep");
    tokens.add("calm");
    tokens.add("ambient");
  } else if (e <= 0.4) {
    tokens.add("relax");
    tokens.add("soft");
  }

  // Valence (positivité)
  if (v >= 0.85) {
    tokens.add("happy");
    tokens.add("feel-good");
    tokens.add("joyful");
  } else if (v >= 0.6) {
    tokens.add("positive");
    tokens.add("uplifting");
  } else if (v <= 0.15) {
    tokens.add("sad");
    tokens.add("melancholic");
    tokens.add("heartbreak");
  } else if (v <= 0.4) {
    tokens.add("moody");
    tokens.add("dark");
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

  // 1) Dé-dup des tracks sur l'id pour réduire les répétitions
  const uniqueTrackMap = new Map<string, SpotifyTrack>();
  for (const track of tracks) {
    if (track.id && !uniqueTrackMap.has(track.id)) {
      uniqueTrackMap.set(track.id, track);
    }
  }
  const uniqueTracks = Array.from(uniqueTrackMap.values());

  const ids = uniqueTracks.map((t) => t.id);
  const featuresMap = await getAudioFeaturesForTracks(ids);

  const featuresKeys = Object.keys(featuresMap);
  const hasAnyFeatures = featuresKeys.length > 0;
  console.log("[Mood] featuresMap size:", featuresKeys.length);

  // 2) Si aucune feature dispo (403), on renvoie tel quel, mais dé-dupliqué
  if (!hasAnyFeatures) {
    console.warn(
      "[Mood] Aucune audio-feature dispo, retour sans re-ranking (403 ?)"
    );
    return uniqueTracks
      .slice(0, limit)
      .map((track) => track as RecommendationTrack);
  }

  const targetDance = params.target_danceability ?? 0.5;
  const targetEnergy = params.target_energy ?? 0.5;
  const targetValence = params.target_valence ?? 0.5;

  // Poids dynamiques : plus on s'écarte de 0.5, plus la dimension compte
  const weightFor = (target: number) => 0.7 + Math.abs(target - 0.5) * 1.6;
  const wDance = weightFor(targetDance);
  const wEnergy = weightFor(targetEnergy);
  const wValence = weightFor(targetValence);

  type ScoredTrack = {
    track: SpotifyTrack;
    moodDistance: number;
    totalScore: number;
    audioFeatures?: AudioFeatures;
  };

  // On utilise les artistes seeds pour renforcer la cohérence
  const seedArtistIds = new Set(params.seed_artists ?? []);

  const scored: ScoredTrack[] = uniqueTracks.map((track) => {
    const f = featuresMap[track.id];

    if (!f) {
      return {
        track,
        moodDistance: Number.POSITIVE_INFINITY,
        totalScore: Number.POSITIVE_INFINITY,
        audioFeatures: undefined,
      };
    }

    const dD = f.danceability - targetDance;
    const dE = f.energy - targetEnergy;
    const dV = f.valence - targetValence;

    // Distance pondérée par l'importance des sliders
    const moodDistance =
      dD * dD * wDance + dE * dE * wEnergy + dV * dV * wValence;

    // Légère préférence pour les titres populaires
    const popularity =
      typeof (track as any).popularity === "number"
        ? (track as any).popularity / 100
        : 0.5;

    // Légère préférence pour les titres récents
    const releaseDateStr = (track as any).album?.release_date as
      | string
      | undefined;
    let recency = 0.5;
    if (releaseDateStr) {
      const releaseTime = new Date(releaseDateStr).getTime();
      if (!Number.isNaN(releaseTime)) {
        const ageYears =
          (Date.now() - releaseTime) / (1000 * 60 * 60 * 24 * 365);
        const clampedAge = Math.max(0, Math.min(ageYears, 20));
        recency = 1 - clampedAge / 20; // 0 = très vieux, 1 = très récent
      }
    }

    const popularityPenalty = (1 - popularity) * 0.25;
    const recencyPenalty = (1 - recency) * 0.15;

    // Bonus si le titre appartient à un artiste seed (ex: Booba)
    const isSeedArtistTrack =
      Array.isArray((track as any).artists) &&
      (track as any).artists.some((artist: { id?: string }) =>
        artist?.id ? seedArtistIds.has(artist.id) : false
      );

    // Si ce n'est pas un titre de l'artiste seed, légère pénalité
    const artistPenalty = isSeedArtistTrack ? 0 : 0.35;

    // Jitter léger pour éviter d'avoir TOUJOURS exactement le même ordre
    const randomJitter = Math.random() * 0.05;

    const totalScore =
      moodDistance * 0.7 +
      popularityPenalty +
      recencyPenalty +
      artistPenalty +
      randomJitter;

    return {
      track,
      moodDistance,
      totalScore,
      audioFeatures: f,
    };
  });

  // 3) On filtre les titres beaucoup trop loin du mood ciblé,
  // en gardant un seuil dynamique basé sur le 85e percentile.
  const finiteMoodDistances = scored
    .map((s) => s.moodDistance)
    .filter((d) => Number.isFinite(d))
    .sort((a, b) => a - b);

  let maxDistanceThreshold: number | null = null;
  if (finiteMoodDistances.length > 0) {
    const idx = Math.floor(finiteMoodDistances.length * 0.85);
    const base =
      finiteMoodDistances[idx] ??
      finiteMoodDistances[finiteMoodDistances.length - 1];
    maxDistanceThreshold = base * 1.4;
  }

    const filtered = scored.filter((s) => {
    if (!Number.isFinite(s.moodDistance) || maxDistanceThreshold == null) {
      return true;
    }
    return s.moodDistance <= maxDistanceThreshold;
  });

  // 4) Tri initial sur le score composite (plus pertinent en premier)
  filtered.sort((a, b) => a.totalScore - b.totalScore);

  // 5) On prend le top N, puis on applique un "soft shuffle"
  const top = filtered.slice(0, limit);

  const windowSize = 4;
  for (let i = 0; i < top.length; i++) {
    const maxJ = Math.min(top.length - 1, i + windowSize - 1);
    const j = Math.floor(Math.random() * (maxJ - i + 1)) + i;
    const tmp = top[i];
    top[i] = top[j];
    top[j] = tmp;
  }

return top.map(({ track, moodDistance, audioFeatures }) => {
  const base = track as RecommendationTrack;

  return {
    ...base,
    energy: audioFeatures?.energy,
    audioFeatures,
    moodScore: Number.isFinite(moodDistance) ? moodDistance : undefined,
  };
});

}
