// src/features/mood-playlist/hooks/useMoodPlaylist.ts
import { useCallback, useState } from "react";
import { spotifyMoodPlaylistService } from "../services/spotifyMoodPlaylistService";
import type {
  RecommendationTrack,
  RecommendationsParams,
  SearchResultItem,
} from "../types/moodTypes";

export type AudioFeaturesState = {
  danceability: number;
  energy: number;
  valence: number;
};

export type SeedType = "artist" | "track" | "genre";

export type Seed = {
  id: string;
  label: string;
  type: SeedType;
};

type MoodPlaylistState = {
  audioFeatures: AudioFeaturesState;
  seeds: Seed[];
  recommendations: RecommendationTrack[];
  isGenerating: boolean;
  isSaving: boolean;
  error?: string;
  successMessage?: string;
};

const MAX_SEEDS = 5;

const initialState: MoodPlaylistState = {
  audioFeatures: {
    danceability: 0.5,
    energy: 0.5,
    valence: 0.5,
  },
  seeds: [],
  recommendations: [],
  isGenerating: false,
  isSaving: false,
  error: undefined,
  successMessage: undefined,
};

export function useMoodPlaylist() {
  const [state, setState] = useState<MoodPlaylistState>(initialState);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const updateAudioFeature = useCallback(
    (key: keyof AudioFeaturesState, value: number) => {
      setState((prev) => ({
        ...prev,
        audioFeatures: { ...prev.audioFeatures, [key]: value },
      }));
    },
    []
  );

  const removeSeed = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      seeds: prev.seeds.filter((s) => s.id !== id),
    }));
  }, []);

  const addSeed = useCallback((item: SearchResultItem) => {
    setState((prev) => {
      if (prev.seeds.length >= MAX_SEEDS) return prev;
      if (prev.seeds.some((s) => s.id === item.id)) return prev;

      return {
        ...prev,
        seeds: [
          ...prev.seeds,
          {
            id: item.id,
            label:
              item.type === "track"
                ? `${item.name} • ${item.subtitle}`
                : item.name,
            type: item.type as SeedType,
          },
        ],
      };
    });
  }, []);

  const searchSeeds = useCallback(async (query: string) => {
    try {
      setIsSearching(true);
      const results = await spotifyMoodPlaylistService.searchSeeds(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Erreur searchSeeds", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const generateRecommendations = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        isGenerating: true,
        error: undefined,
        successMessage: undefined,
      }));

      const seedArtists = state.seeds
        .filter((s) => s.type === "artist")
        .map((s) => s.id);
      const seedTracks = state.seeds
        .filter((s) => s.type === "track")
        .map((s) => s.id);
      const seedGenres = state.seeds
        .filter((s) => s.type === "genre")
        .map((s) => s.id);

      if (!seedArtists.length && !seedTracks.length && !seedGenres.length) {
        setState((prev) => ({
          ...prev,
          error:
            "Ajoutez au moins une semence (artiste, piste ou genre) avant de générer des recommandations.",
        }));
        return;
      }

      const params: RecommendationsParams = {
        seed_artists: seedArtists.length ? seedArtists : undefined,
        seed_tracks: seedTracks.length ? seedTracks : undefined,
        seed_genres: seedGenres.length ? seedGenres : undefined,
        target_danceability: state.audioFeatures.danceability,
        target_energy: state.audioFeatures.energy,
        target_valence: state.audioFeatures.valence,
        limit: 30,
      };

      const tracks = await spotifyMoodPlaylistService.getRecommendations(params);

      setState((prev) => ({
        ...prev,
        recommendations: tracks,
      }));
    } catch (error: any) {
      console.error(
        "Erreur lors de generateRecommendations",
        error?.status,
        error?.message,
        error?.spotifyError ?? error
      );

      setState((prev) => ({
        ...prev,
        error:
          "Une erreur est survenue lors de la génération des recommandations.",
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
      }));
    }
  }, [state.audioFeatures, state.seeds]);

  const savePlaylist = useCallback(
    async (playlistName: string) => {
      if (!state.recommendations.length) return;

      try {
        setState((prev) => ({
          ...prev,
          isSaving: true,
          error: undefined,
          successMessage: undefined,
        }));

        const user = await spotifyMoodPlaylistService.getCurrentUserProfile();
        const playlist = await spotifyMoodPlaylistService.createPlaylist(
          user.id,
          playlistName
        );

        await spotifyMoodPlaylistService.addTracksToPlaylist(
          playlist.id,
          state.recommendations.map((t) => t.uri)
        );

        setState((prev) => ({
          ...prev,
          successMessage:
            "Playlist créée et sauvegardée dans votre compte Spotify 🎉",
        }));
      } catch (error) {
        console.error("Erreur savePlaylist", error);
        setState((prev) => ({
          ...prev,
          error:
            "Impossible de sauvegarder la playlist. Réessayez plus tard.",
        }));
      } finally {
        setState((prev) => ({
          ...prev,
          isSaving: false,
        }));
      }
    },
    [state.recommendations]
  );

  return {
    state,
    searchResults,
    isSearching,
    updateAudioFeature,
    addSeed,
    removeSeed,
    searchSeeds,
    generateRecommendations,
    savePlaylist,
    maxSeeds: MAX_SEEDS,
  };
}
