import React, { useEffect, useState } from "react";
import { getTopArtists } from "../../../shared/services/dashboardService";

interface Props {
  timeRange: string;
}

export const TopArtists: React.FC<Props> = ({ timeRange }) => {
  const [artists, setArtists] = useState<any[]>([]);

useEffect(() => {
  const fetchArtists = async () => {
    const data = await getTopArtists(timeRange);
    setArtists(data.items);
  };
  void fetchArtists();
}, [timeRange]);


  return (
    <div>
      <h2>Top 10 Artistes</h2>
      {artists.map((artist, i) => (
        <p key={artist.id}>
          {i + 1}. {artist.name}
        </p>
      ))}
    </div>
  );
};
