// src/app/router.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Shell
import AppShell from "../features/shell/components/AppShell";

// Pages Auth
import LoginPage from "../features/auth/pages/LoginPage";
import AuthCallbackPage from "../features/auth/pages/AuthCallbackPage";

// Pages App
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import MoodPage from "../features/mood-playlist/pages/MoodPlaylistPage";
import { BlindTestSetupPage } from "../features/blind-test/pages/BlindTestSetupPage";
import { BlindTestGamePage } from "../features/blind-test/pages/BlindTestGamePage";
import { BlindTestResultsPage } from "../features/blind-test/pages/BlindTestResultsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page par défaut : Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Page callback Spotify */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Pages après connexion (avec Shell + NavBar) */}
        <Route element={<AppShell />}>
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Blind Test : 3 pages */}
          <Route path="blind-test" element={<BlindTestSetupPage />} />
          <Route path="blind-test/game" element={<BlindTestGamePage />} />
          <Route
            path="blind-test/results"
            element={<BlindTestResultsPage />}
          />

          <Route path="mood-playlist" element={<MoodPage />} />
        </Route>

        {/* Page 404 */}
        <Route path="*" element={<div>Page introuvable</div>} />
      </Routes>
    </BrowserRouter>
  );
}
