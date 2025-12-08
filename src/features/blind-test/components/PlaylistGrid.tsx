// components/PlaylistGrid.tsx
import type { Playlist } from "../../../shared/types/PlaylistTypes";
import { PlaylistCard } from "./PlaylistCard";

type Props = {
  playlists: Playlist[];
  onSelect?: (playlistId: string) => void;
};

export function PlaylistGrid({ playlists, onSelect }: Props) {
  return (
    <div className="playlist-grid">
      {playlists.map((playlist) => (
        <PlaylistCard
            key={playlist.id}
            {...({ playlist, onSelect } as any)}
        />
      ))}
    </div>
  );
}
