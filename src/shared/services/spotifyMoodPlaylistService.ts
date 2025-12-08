// src/shared/services/spotifyMoodPlaylistService.ts
import { getAccessToken } from "./spotifyAuthService";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type TimeRange = "short_term" | "medium_term" | "long_term";

export type SpotifyImage = {
  url: string;
  width?: number | null;
  height?: number | null;
};

export type SpotifyArtist = {
  id: string;
  name: string;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
  };
  uri: string;
};

export type SpotifyUserProfile = {
  id: string;
  display_name: string;
  product: string;
  images: SpotifyImage[];
};

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
  /** Energy exposée directement pour l'UI si besoin */
  energy?: number;
  /** Audio-features complètes (optionnel, utile pour affichage avancé) */
  audioFeatures?: AudioFeatures;
  /** Score interne de proximité avec les sliders (plus petit = plus proche) */
  moodScore?: number;
};

/* -------------------------------------------------------------------------- */
/*                                FETCH WRAPPER                               */
/* -------------------------------------------------------------------------- */

async function fetchSpotify<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    const err = new Error("No access token available") as Error & {
      status?: number;
      code?: string;
    };
    err.status = 401;
    err.code = "NO_TOKEN";
    throw err;
  }

  const res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorBody: unknown = {};
    try {
      errorBody = await res.json();
    } catch {
      // ignore JSON parsing error
    }

    console.error("Spotify API error", res.status, errorBody);

    const err = new Error(
      (errorBody as any)?.error?.message || `Spotify API error (${res.status})`
    ) as Error & { status?: number; spotifyError?: unknown };

    err.status = res.status;
    err.spotifyError = errorBody;
    throw err;
  }

  return res.json();
}

/* -------------------------------------------------------------------------- */
/*                              FALLBACK HELPERS                              */
/* -------------------------------------------------------------------------- */

async function getArtistNameById(id: string): Promise<string | null> {
  try {
    const artist = await fetchSpotify<{ name: string }>(`/artists/${id}`);
    return artist.name ?? null;
  } catch (e) {
    console.error("Erreur fallback artiste", e);
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
      if (feat && feat.id) map[feat.id] = feat;
    }
    return map;
  } catch (e) {
    // Ici tu verras le 403 éventuel
    console.error("Erreur audio features fallback", e);
    // On renvoie un objet vide => on fera un fallback dans le ranking
    return {};
  }
}

/**
 * Transforme les sliders en mots-clés pour la recherche (fallback).
 *
 * Exemple :
 *  - beaucoup de danceability + energy + valence -> "dance party upbeat"
 *  - peu d'energy et valence basse -> "sad chill"
 */
function buildMoodTokensFromParams(params: RecommendationsParams): string[] {
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
 *
 * - Récupère les audio-features pour tous les morceaux
 * - Calcule une distance quadratique aux valeurs cibles
 * - Trie par ce score (plus petit = plus proche de la cible)
 * - Retourne des RecommendationTrack enrichis
 *
 * Si les audio-features sont indisponibles (403), on renvoie simplement les
 * tracks d'origine en RecommendationTrack sans ranking "mood".
 */
async function rankTracksByAudioFeatures(
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

  // Si on ne récupère aucune feature (ton cas avec le 403),
  // on ne tente pas de ranking complexe et on renvoie simplement la liste.
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
        audioFeatures: undefined,
      };
    }

    const dD = f.danceability - targetDance;
    const dE = f.energy - targetEnergy;
    const dV = f.valence - targetValence;

    // Distance euclidienne au carré (plus petit = plus proche de la cible)
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

/* -------------------------------------------------------------------------- */
/*                                 PUBLIC API                                 */
/* -------------------------------------------------------------------------- */

export const spotifyMoodPlaylistService = {
  /* --------------------------- Profil utilisateur -------------------------- */
  async getCurrentUserProfile(): Promise<SpotifyUserProfile> {
    return fetchSpotify<SpotifyUserProfile>("/me");
  },

  /* --------------------------------- Search -------------------------------- */
  async searchSeeds(query: string): Promise<SearchResultItem[]> {
    if (!query.trim()) return [];

    type SpotifySearchResponse = {
      tracks?: { items: SpotifyTrack[] };
      artists?: { items: SpotifyArtist[] };
    };

    const data = await fetchSpotify<SpotifySearchResponse>(
      `/search?q=${encodeURIComponent(query)}&type=artist,track&limit=5`
    );

    const artists: SearchResultItem[] =
      data.artists?.items.map((a) => ({
        id: a.id,
        name: a.name,
        type: "artist" as const,
        subtitle: "Artiste",
      })) ?? [];

    const tracks: SearchResultItem[] =
      data.tracks?.items.map((t) => ({
        id: t.id,
        name: t.name,
        type: "track" as const,
        subtitle: t.artists.map((artist) => artist.name).join(", "),
      })) ?? [];

    return [...artists, ...tracks];
  },

  /* -------------------------- Recommandations Spotify ---------------------- */
  async getRecommendations(
    params: RecommendationsParams
  ): Promise<RecommendationTrack[]> {
    const q = new URLSearchParams();

    if (params.seed_artists?.length) {
      q.set("seed_artists", params.seed_artists.join(","));
    }

    if (params.seed_tracks?.length) {
      q.set("seed_tracks", params.seed_tracks.join(","));
    }

    if (params.seed_genres?.length) {
      q.set("seed_genres", params.seed_genres.join(","));
    }

    if (params.target_danceability !== undefined) {
      q.set("target_danceability", String(params.target_danceability));
    }

    if (params.target_energy !== undefined) {
      q.set("target_energy", String(params.target_energy));
    }

    if (params.target_valence !== undefined) {
      q.set("target_valence", String(params.target_valence));
    }

    q.set("limit", String(params.limit ?? 30));

    type SpotifyRecommendationsResponse = {
      tracks: SpotifyTrack[];
    };

    try {
      // -------------------------- Tentative normale --------------------------
      const data = await fetchSpotify<SpotifyRecommendationsResponse>(
        `/recommendations?${q.toString()}`
      );

      // Même si /recommendations marche, on re-classe selon les sliders
      return rankTracksByAudioFeatures(data.tracks, params);
    } catch (error: any) {
      /* ---------------------------- FALLBACK 404 --------------------------- */
      if (error?.status === 404) {
        console.warn("Fallback: /recommendations inaccessible -> /search");

        const fallbackQueryParts: string[] = [];

        // Genre directement utilisable
        if (params.seed_genres?.length) {
          fallbackQueryParts.push(`genre:${params.seed_genres[0]}`);
        }

        // Artiste → convertir ID → nom
        if (params.seed_artists?.length) {
          const artistId = params.seed_artists[0];
          const artistName = await getArtistNameById(artistId);
          if (artistName) fallbackQueryParts.push(`artist:${artistName}`);
        }

        // Mots-clés basés sur les sliders (mood)
        const moodTokens = buildMoodTokensFromParams(params);
        console.log("[Mood] tokens depuis sliders:", moodTokens);

        if (moodTokens.length) {
          // On regroupe les tokens mood ensemble dans un bloc, pour éviter de casser
          // les parties genre:/artist: de la query
          fallbackQueryParts.push(moodTokens.join(" "));
        }

        const searchQuery =
          fallbackQueryParts.length > 0 ? fallbackQueryParts.join(" ") : "mood";

        console.log("[Mood] search query envoyée à /search:", searchQuery);

        type SpotifySearchTracksResponse = {
          tracks: { items: SpotifyTrack[] };
        };

        // 1) Première tentative : query complète (genre + artiste + mood tokens)
        const search = await fetchSpotify<SpotifySearchTracksResponse>(
          `/search?q=${encodeURIComponent(
            searchQuery
          )}&type=track&limit=${params.limit ?? 30}`
        );

        let tracks = search.tracks.items;
        console.log(
          "[Mood] nb de titres récupérés via /search (query complète):",
          tracks.length
        );

        // 2) Si aucun titre trouvé, on relâche la contrainte : on enlève les tokens mood
        if (!tracks.length) {
          console.warn(
            "[Mood] 0 titres pour la query complète, fallback sur une query simplifiée"
          );

          const simpleQueryParts: string[] = [];

          if (params.seed_genres?.length) {
            simpleQueryParts.push(`genre:${params.seed_genres[0]}`);
          }

          if (params.seed_artists?.length) {
            const artistId = params.seed_artists[0];
            const artistName = await getArtistNameById(artistId);
            if (artistName) simpleQueryParts.push(`artist:${artistName}`);
          }

          const simpleQuery =
            simpleQueryParts.length > 0 ? simpleQueryParts.join(" ") : "mood";

          console.log(
            "[Mood] query simplifiée envoyée à /search:",
            simpleQuery
          );

          const relaxedSearch = await fetchSpotify<SpotifySearchTracksResponse>(
            `/search?q=${encodeURIComponent(
              simpleQuery
            )}&type=track&limit=${params.limit ?? 30}`
          );

          tracks = relaxedSearch.tracks.items;
          console.log(
            "[Mood] nb de titres récupérés via /search (query simplifiée):",
            tracks.length
          );
        }

        // Si audio-features dispo, on re-classera selon les sliders,
        // sinon on renverra simplement les tracks (mais la query dépend déjà des seeds)
        return rankTracksByAudioFeatures(tracks, params);
      }

      throw error;
    }
  },

  /* ------------------------------ Playlist CRUD ---------------------------- */
  async createPlaylist(userId: string, name: string): Promise<{ id: string }> {
    const body = {
      name,
      public: false,
      description: "Playlist générée avec Spotyfusion - Mood Generator",
    };

    return fetchSpotify<{ id: string }>(`/users/${userId}/playlists`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async addTracksToPlaylist(playlistId: string, uris: string[]): Promise<void> {
    if (!uris.length) return;

    await fetchSpotify(`/playlists/${playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({ uris }),
    });
  },
};
