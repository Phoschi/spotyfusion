// features/blind-test/blindTest.mock.ts
import type { Playlist } from "../../shared/types/PlaylistTypes";

export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Mellow Morning",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    selected: true
  },
  {
    id: "2",
    name: "Dance All Night",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  },
  {
    id: "3",
    name: "Indie Vibes",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
  }
];
