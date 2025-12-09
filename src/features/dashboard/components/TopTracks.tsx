import { useEffect, useState } from "react";
import ScrollableRow from "../../../shared/components/ScrollableRow";
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
    <div style={{ width: "80vw", marginTop: "30px" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: 600 }}>
        Top 10 Titres
      </h2>

      <ScrollableRow height="200px">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            style={{
              textAlign: "center",
              minWidth: "120px",
              flexShrink: 0,
            }}
          >
            <img
              src={track.album.images[0].url}
              alt={track.name}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
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
              #{i + 1} — {track.name}
            </p>

            <p
              style={{
                color: "gray",
                fontSize: "14px",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              {track.artists.map((a: any) => a.name).join(", ")}
            </p>
          </div>
        ))}
      </ScrollableRow>
    </div>
  );
};