// components/PlaylistCard.tsx
import type { Playlist } from "../../../shared/types/PlaylistTypes";

type Props = {
  playlist: Playlist;
  onSelect?: (playlistId: string) => void;
};

export function PlaylistCard({ playlist, onSelect }: Props) {
  return (
    <div 
        className={`playlist-card ${playlist.selected ? "selected" : ""}`}
        onClick={() => onSelect?.(playlist.id)}
    >
      <img src={playlist.image} alt="" />

      {playlist.selected && <span className="playlist-check">✓</span>}

      <span>{playlist.name}</span>
    </div>
  );
}
