import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BarChart2, Music, ListMusic, Maximize2 } from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import { getUserProfile } from "../services/spotifyAuthService";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 p-3 transition-colors ${isActive
          ? "font-bold text-white"
          : "text-neutral-400 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`${isActive
                ? "text-white"
                : "text-neutral-400 group-hover:text-white"
              }`}
          >
            {icon}
          </div>

          <span
            className={`text-base ${isActive
                ? "text-white"
                : "text-neutral-400 group-hover:text-white"
              }`}
          >
            {label}
          </span>

          {isActive && (
            <div className="absolute inset-y-0 right-0 w-full bg-black rounded-l-lg z-0">
              <div className="absolute top-0 right-0 w-full h-full">
                <div className="absolute -top-3 left-0 w-3 h-3 bg-transparent shadow-[1px_1px_0_0_black] rounded-br-lg" />
                <div className="absolute -bottom-3 left-0 w-3 h-3 bg-transparent shadow-[1px_-1px_0_0_black] rounded-tr-lg" />
              </div>
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function NavBar(): JSX.Element {
  // const { logout } = useAuth();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await getUserProfile(); // récupère /me
        setUser(profile);
        console.log("Profil utilisateur récupéré :", profile);
      } catch (err) {
        console.error("Erreur récupération utilisateur :", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <aside className="w-64 bg-[#111111] text-white min-h-screen flex flex-col justify-between p-4 relative z-10">
      <div className="flex flex-col flex-1">
        {/* === Logo === */}
        <div className="p-2 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/vite.svg" alt="logo" className="w-6 h-6" />
            <h1 className="text-xl font-bold text-[#1DB954]">SpotyFusion</h1>
          </div>

          {/* === Profil connecté === */}
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={
                  user.images?.[0]?.url ??
                  "https://dummyimage.com/40x40/cccccc/000000&text=U"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />

              <div className="flex flex-col">
                <p className="font-medium text-sm">
                  {user.display_name ?? "Utilisateur"}
                </p>
                <span className="text-xs text-[#1DB954] font-semibold">
                  {user.product ?? "Free"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">Chargement...</p>
          )}
        </div>

        {/* === Navigation === */}
        <nav className="flex flex-col">
          <NavItem
            to="/dashboard"
            icon={<BarChart2 size={20} />}
            label="Statistiques"
          />
          <NavItem
            to="/blind-test"
            icon={<Music size={20} />}
            label="Blind Test"
          />
          <NavItem
            to="/mood-playlist"
            icon={<ListMusic size={20} />}
            label="Générateur de Playlists"
          />
        </nav>
      </div>

      {/* === Player Preview / Footer === */}
      <div className="p-2">
        <div className="bg-[#282828] p-3 rounded-lg flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-3">
            <Maximize2
              size={16}
              className="text-neutral-400 hover:text-white cursor-pointer"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
