import { BrowserRouter, Routes, Route } from "react-router-dom";

// Shell
import AppShell from "../features/shell/components/AppShell";

// Pages
import LoginPage from "../features/auth/pages/LoginPage";
import AuthCallbackPage from "../features/auth/pages/AuthCallbackPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import BlindTestPage from "../features/blind-test/pages/BlindTestPage";
import MoodPage from "../features/mood-playlist/pages/MoodPlaylistPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page par défaut : login */}
        <Route path="/" element={<LoginPage />} />

        {/* Spotify Auth callback */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Pages avec shell = accès authentifié */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/blind-test" element={<BlindTestPage />} />
          <Route path="/mood-playlist" element={<MoodPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Page introuvable</div>} />

      </Routes>
    </BrowserRouter>
  );
}
