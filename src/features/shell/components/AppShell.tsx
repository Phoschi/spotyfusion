// src/features/shell/components/AppShell.tsx

import { Outlet } from "react-router-dom";
// 1. Importez votre composant NavBar
import NavBar from "../../../shared/components/NavBar"; // Ajustez le chemin si nécessaire

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* 2. Remplacez la balise <nav> codée en dur par votre composant NavBar */}
      <NavBar />

      <main className="flex-1 p-10">
        {/* L'Outlet rendra les pages enfants (DashboardPage, BlindTestPage, MoodPage) */}
        <Outlet />
      </main>
    </div>
  );
}
