// src/features/mood-playlist/services/spotifyMoodPlaylistService.ts
import { fetchSpotify } from "../../../shared/services/spotifyHttp";
import type { SpotifyTrack } from "../../../shared/types/spotifyMoodTypes";
import { getCurrentUserProfile } from "../../../shared/services/spotifyUserService";
import {
  createPlaylist,
  addTracksToPlaylist,
} from "../../../shared/services/spotifyPlaylistService";
import type {
  RecommendationTrack,
  RecommendationsParams,
} from "../types/moodTypes";
import { searchSeeds } from "./moodSearchService";
import {
  buildMoodTokensFromParams,
  getArtistNameById,
  rankTracksByAudioFeatures,
} from "./moodRecommendationEngine";

export const spotifyMoodPlaylistService = {
  getCurrentUserProfile,
  createPlaylist,
  addTracksToPlaylist,
  searchSeeds,
  getRecommendations,
};

async function getRecommendations(
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
    const data = await fetchSpotify<SpotifyRecommendationsResponse>(
      `/recommendations?${q.toString()}`
    );

    return rankTracksByAudioFeatures(data.tracks, params);
  } catch (error: any) {
    // Fallback 404 -> /search
    if (error?.status === 404) {
      console.warn("Fallback: /recommendations inaccessible -> /search");

      const moodTokens = buildMoodTokensFromParams(params);
      console.log("[Mood] tokens depuis sliders:", moodTokens);

      type SpotifySearchTracksResponse = {
        tracks: { items: SpotifyTrack[] };
      };

      const limit = params.limit ?? 30;
      const primaryGenre = params.seed_genres?.[0];

      // On récupère jusqu'à 2 artistes pour varier un peu plus
      const artistNames: string[] = [];
      if (params.seed_artists?.length) {
        for (const artistId of params.seed_artists.slice(0, 2)) {
          const artistName = await getArtistNameById(artistId);
          if (artistName) {
            artistNames.push(artistName);
          }
        }
      }

      const moodPhrase = moodTokens.join(" ");

      // Construction de plusieurs queries fallback
      const baseQueries: string[] = [];

      if (primaryGenre && artistNames.length) {
        baseQueries.push(
          `genre:${primaryGenre} artist:${artistNames[0]} ${moodPhrase}`.trim()
        );
        if (artistNames[1]) {
          baseQueries.push(
            `genre:${primaryGenre} artist:${artistNames[1]} ${moodPhrase}`.trim()
          );
        }
      }

      if (primaryGenre && !baseQueries.length) {
        baseQueries.push(`genre:${primaryGenre} ${moodPhrase}`.trim());
      }

      if (!primaryGenre && artistNames.length) {
        baseQueries.push(
          `artist:${artistNames[0]} ${moodPhrase}`.trim()
        );
        if (artistNames[1]) {
          baseQueries.push(
            `artist:${artistNames[1]} ${moodPhrase}`.trim()
          );
        }
      }

      if (!baseQueries.length) {
        baseQueries.push(moodPhrase || "mood");
      }

      console.log(
        "[Mood] fallback queries envoyées à /search:",
        baseQueries
      );

      const collected: SpotifyTrack[] = [];
      const seenTrackIds = new Set<string>();

      // Cap sur la limite Spotify (50 max pour /search)
      const limitPerQuery = Math.min(limit * 2, 50);

      // On enchaîne plusieurs recherches tant qu'on n'a pas assez de titres
      for (const query of baseQueries) {
        if (collected.length >= limit) break;

        const search = await fetchSpotify<SpotifySearchTracksResponse>(
          `/search?q=${encodeURIComponent(
            query
          )}&type=track&limit=${limitPerQuery}`
        );

        for (const track of search.tracks.items) {
          if (!track.id || seenTrackIds.has(track.id)) continue;
          seenTrackIds.add(track.id);
          collected.push(track);
          if (collected.length >= limit) break;
        }
      }

      // Fallback ultra générique si vraiment rien trouvé
      if (!collected.length) {
        console.warn(
          "[Mood] 0 titres pour les queries avancées, fallback sur une query très générique"
        );

        // Si l'utilisateur a choisi un artiste, on privilégie une query centrée sur cet artiste
        let genericQuery: string;
        if (artistNames.length) {
          // On relaxe totalement les tokens mood pour garantir des résultats de l'artiste
          genericQuery = `artist:${artistNames[0]}`;
        } else {
          genericQuery = moodPhrase || "mood";
        }

        const genericLimit = Math.min(limit, 50);
        const genericSearch = await fetchSpotify<SpotifySearchTracksResponse>(
          `/search?q=${encodeURIComponent(
            genericQuery
          )}&type=track&limit=${genericLimit}`
        );

        for (const track of genericSearch.tracks.items) {
          if (!track.id || seenTrackIds.has(track.id)) continue;
          seenTrackIds.add(track.id);
          collected.push(track);
          if (collected.length >= limit) break;
        }
      }

      console.log(
        "[Mood] nb de titres récupérés via fallback /search (toutes queries):",
        collected.length
      );

      return rankTracksByAudioFeatures(collected, params);
    }

    throw error;
  }
}

