import React, { useEffect, useState } from "react";
import ScrollableRow from "../../../shared/components/ScrollableRow";
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
    <div style={{marginTop: "30px" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: 600 }}>
        Top 10 Artistes
      </h2>

      <ScrollableRow height="200px">
        {artists.map((artist, i) => (
          <div
            key={artist.id}
            style={{
              textAlign: "center",
              minWidth: "120px",
              flexShrink: 0,
            }}
          >
            <img
              src={artist.images?.[0]?.url}
              alt={artist.name}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "8px",
              }}
            />
            <p
              style={{
                fontWeight: "bold",
                margin: "4px 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              #{i + 1}
            </p>
            <p
              style={{
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              {artist.name}
            </p>
          </div>
        ))}
      </ScrollableRow>
    </div>
  );
};