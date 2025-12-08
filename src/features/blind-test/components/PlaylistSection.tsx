// components/PlaylistSection.tsx
import type { Playlist } from "../../../shared/types/PlaylistTypes";
import { PlaylistGrid } from "./PlaylistGrid";

type Props = {
    playlists: Playlist[];
    onSelect?: (playlistId: string) => void;
};

export function PlaylistSection({ playlists, onSelect }: Props) {
  return (
    <section>
      <h2>Mes playlists</h2>
      <PlaylistGrid playlists={playlists} onSelect={onSelect} />
    </section>
  );
}
