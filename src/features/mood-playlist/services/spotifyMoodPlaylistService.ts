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

      const fallbackQueryParts: string[] = [];

      if (params.seed_genres?.length) {
        fallbackQueryParts.push(`genre:${params.seed_genres[0]}`);
      }

      if (params.seed_artists?.length) {
        const artistId = params.seed_artists[0];
        const artistName = await getArtistNameById(artistId);
        if (artistName) {
          fallbackQueryParts.push(`artist:${artistName}`);
        }
      }

      const moodTokens = buildMoodTokensFromParams(params);
      console.log("[Mood] tokens depuis sliders:", moodTokens);

      if (moodTokens.length) {
        fallbackQueryParts.push(moodTokens.join(" "));
      }

      const searchQuery =
        fallbackQueryParts.length > 0 ? fallbackQueryParts.join(" ") : "mood";

      console.log("[Mood] search query envoyée à /search:", searchQuery);

      type SpotifySearchTracksResponse = {
        tracks: { items: SpotifyTrack[] };
      };

      // 1) Query complète (genre + artiste + mood tokens)
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

      // 2) Si rien, query simplifiée (sans tokens mood)
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
          if (artistName) {
            simpleQueryParts.push(`artist:${artistName}`);
          }
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

      return rankTracksByAudioFeatures(tracks, params);
    }

    throw error;
  }
}
