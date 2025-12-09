// src/features/stats/pages/StatsPage.tsx
import React, { useState } from "react";
import { TopArtists } from "../components/TopArtists";
import { TopTracks } from "../components/TopTracks";
import { RecentlyPlayed } from "../components/RecentlyPlayed";
import { globalBackgroundSecondary, globalFontPrimary, globalTextPrimary, globalTextSecondary } from "../../../style/globalStyles";
import { TimeRangeSelector } from "../components/TimeRangeSelector";

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("short_term");

  return (
    <div style={{...globalBackgroundSecondary, width:"77vw",padding:'20px'}}>
      <h2 style={{...globalTextPrimary, ...globalFontPrimary, fontSize:"34px", margin:"0 0"}}>Vos statistiques</h2>
      <h4 style={{...globalTextSecondary, ...globalFontPrimary, fontSize:"16px", marginTop:"0"}}>Découvrez vos artistes et morceaux préférés</h4>
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

      <TopArtists timeRange={timeRange} />
      <TopTracks timeRange={timeRange} />

      <RecentlyPlayed />
    </div>
  );
};

export default DashboardPage;
