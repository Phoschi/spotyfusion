import React, { useEffect, useState } from "react";
import { getRecentlyPlayed } from "../../../shared/services/dashboardService";

export const RecentlyPlayed: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecentlyPlayed();
      setItems(data.items); // <- correction
    };
    void fetchData();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>5 derniers titres écoutés</h2>

      {items.map((item, i) => {
        const track = item.track;
        const artists = track.artists.map((a: any) => a.name).join(", ");
        const date = new Date(item.played_at).toLocaleString("fr-FR");

        return (
          <div key={i} style={{ marginBottom: "12px" }}>
            <strong>{track.name}</strong><br />
            {artists}<br />
            <small>Écouté le : {date}</small>
          </div>
        );
      })}
    </div>
  );
};
