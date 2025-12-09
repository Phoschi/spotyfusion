// src/features/stats/pages/StatsPage.tsx
import React, { useState } from "react";
import { TopArtists } from "../components/TopArtists";
import { TopTracks } from "../components/TopTracks";
import { RecentlyPlayed } from "../components/RecentlyPlayed";
import { TimeRangeSelector } from "../components/TimerangeSelector";

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("short_term");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Statistiques Spotify</h1>

      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

      <TopArtists timeRange={timeRange} />
      <TopTracks timeRange={timeRange} />

      <RecentlyPlayed />
    </div>
  );
};

export default DashboardPage;
