import { BrowserRouter, Routes, Route } from "react-router-dom";

// Shell
import AppShell from "../features/shell/components/AppShell";

// Pages
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import BlindTestPage from "../features/blind-test/pages/BlindTestPage";
import MoodPage from "../features/mood-playlist/pages/MoodPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pages sans shell (auth, landing, etc.) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Pages avec shell */}
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/blind-test" element={<BlindTestPage />} />
          <Route path="/mood-playlist" element={<MoodPage />} />
        </Route>

        {/* Fallback 404 minimaliste */}
        <Route path="*" element={<div>Page introuvable</div>} />

      </Routes>
    </BrowserRouter>
  );
}
