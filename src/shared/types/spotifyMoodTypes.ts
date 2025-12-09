// src/shared/spotify/spotifyTypes.ts

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
