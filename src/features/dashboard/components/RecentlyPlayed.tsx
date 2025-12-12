import React, { useEffect, useState } from "react";
import { getRecentlyPlayed } from "../../../shared/services/dashboardService";
import { globalFontPrimary } from "../../../style/globalStyles";

type Artist = { name: string };
type AlbumImage = { url: string; width: number; height: number };
type Album = { images: AlbumImage[] };
type Track = { name: string; artists: Artist[]; album: Album };
type PlayedItem = { track: Track; played_at: string };

// Fonction "il y a X minutes/heures/jours"
function timeAgo(date: string): string {
  const now = new Date();
  const played = new Date(date);
  const diffMs = now.getTime() - played.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "à l’instant";
  if (minutes < 60) return `Il y a ${minutes} minutes`;
  if (hours < 24) return `Il y a ${hours} heures`;
  return `Il y a ${days} jours`;
}

// Petite icône horloge
const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#B3B3B3"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "4px" }}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export const RecentlyPlayed: React.FC = () => {
  const [items, setItems] = useState<PlayedItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecentlyPlayed();
      setItems(data.items);
    };
    void fetchData();
  }, []);

  if (items.length === 0) return null;

  const first = items[0];
  const others = items.slice(1, 5);

  const imgFirst = first.track.album.images?.[0]?.url;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: 700 }}>
        5 Derniers Titres Écoutés
      </h2>

      <div style={{ display: "flex", gap: "32px" }}>
        
        {/* Bloc principal à gauche */}
<div style={{ flex: "0 0 240px" }}>
  {imgFirst && (
    <img
      src={imgFirst}
      alt={first.track.name}
      style={{
        width: "100%",
        height: "240px",
        objectFit: "cover",
        borderRadius: "4px"
      }}
    />
  )}
  <div style={{ marginTop: "12px" }}>
<strong
  style={{
    ...globalFontPrimary,
    fontWeight: 600,
    fontSize: "28px",
    maxWidth: "240px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
  {first.track.name}
</strong>
    <br />
    <span
      style={{
        ...globalFontPrimary,
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "24px",
        color: "#B3B3B3",
        maxWidth: "240px",
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}
    >
      {first.track.artists.map(a => a.name).join(", ")}
    </span>

    {/* Horloge + texte aligné à droite */}
    <div
      style={{
        marginTop: "6px",
        display: "flex",
        alignItems: "center",
        fontSize:"14px", color:"#B3B3B3", ...globalFontPrimary, fontWeight:400
      }}
    >
      <ClockIcon />
      <small>{timeAgo(first.played_at)}</small>
    </div>
  </div>
</div>


        {/* Liste des 4 morceaux à droite */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", height:"84px" }}>
          {others.map((item, i) => {
            const img = item.track.album.images?.[0]?.url;
            const artists = item.track.artists.map(a => a.name).join(", ");

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px",
                  alignItems: "center",
                  background: "#242424",
                  border: "1px solid #3A3A3A",
                  borderRadius: "4px"
                }}
              >
                {img && (
                  <img
                    src={img}
                    alt={item.track.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "4px"
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <strong style={{fontSize:"16px", color:"white", ...globalFontPrimary, fontWeight:600}}>{item.track.name}</strong><br />
                  <span style={{ fontSize:"14px", color:"#B3B3B3", ...globalFontPrimary, fontWeight:400 }}>{artists}</span>
                </div>

                {/* Horloge + texte aligné à droite */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize:"14px", color:"#B3B3B3", ...globalFontPrimary, fontWeight:400
                  }}
                >
                  <ClockIcon />
                  <small>{timeAgo(item.played_at)}</small>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
