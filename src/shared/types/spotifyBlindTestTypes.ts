// src/shared/types/spotifyBlindTestTypes.ts

export type SpotifyImage = {
  url: string;
  height?: number | null;
  width?: number | null;
};

export type SpotifyArtist = {
  id: string;
  name: string;
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  images: SpotifyImage[];
  tracks: {
    total: number;
  };
};

export type SpotifyTrack = {
  id: string;
  name: string;
  preview_url: string | null;
  artists: SpotifyArtist[];
  album: {
    images: SpotifyImage[];
  };
  external_urls: {
    spotify: string;
  };
};
