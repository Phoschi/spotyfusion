// src/features/mood-playlist/services/moodSearchService.ts
import { fetchSpotify } from "../../../shared/services/spotifyHttp";
import type {
  SpotifyArtist,
  SpotifyTrack,
} from "../../../shared/types/spotifyMoodTypes"
import type { SearchResultItem } from "../types/moodTypes";

export async function searchSeeds(
  query: string
): Promise<SearchResultItem[]> {
  if (!query.trim()) {
    return [];
  }

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
}
