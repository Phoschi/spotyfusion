// src/features/stats/components/TopTracks.tsx
import React, { useEffect, useState } from "react";
import { getTopTracks } from "../../../shared/services/dashboardService";

interface Props {
  timeRange: string;
}

export const TopTracks: React.FC<Props> = ({ timeRange }) => {
  const [tracks, setTracks] = useState<any[]>([]);

useEffect(() => {
  const fetchTracks = async () => {
    const data = await getTopTracks(timeRange);
    setTracks(data.items); 
  };
  void fetchTracks();
}, [timeRange]);


  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Top 10 Titres</h2>
      {tracks.map((track, i) => (
        <p key={track.id}>
          {i + 1}. {track.name} — {track.artists[0].name}
        </p>
      ))}
    </div>
  );
};
