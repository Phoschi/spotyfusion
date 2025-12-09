// src/shared/components/NavBar.tsx

import React from "react";
import { NavLink } from "react-router-dom";

import {
  LogOut,
  BarChart2,
  Music,
  ListMusic,
  Volume2,
  Maximize2,
} from "lucide-react";
import { useAuth } from "../../features/auth/context/AuthContext";

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
        `group relative flex items-center gap-3 p-3 transition-colors ${
          isActive
            ? "font-bold text-white"
            : "text-neutral-400 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`${
              isActive
                ? "text-white"
                : "text-neutral-400 group-hover:text-white"
            }`}
          >
            {icon}
          </div>

          <span
            className={`text-base ${
              isActive
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
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#111111] text-white min-h-screen flex flex-col justify-between p-4 relative z-10">
      <div className="flex flex-col flex-1">
        <div className="p-2 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/vite.svg" alt="logo" className="w-6 h-6" />
            <h1 className="text-xl font-bold text-[#1DB954]">SpotyFusion</h1>
          </div>

          {/* === Profil connecté === */}
          <div className="flex items-center gap-3">
            <img
              src={user?.image ?? "https://via.placeholder.com/40"}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-sm">
                {user?.name ?? "Utilisateur"}
              </p>
              <span className="text-xs text-[#1DB954] font-semibold">
                premium
              </span>
            </div>
          </div>
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

      <div className="p-2">
        {/* Player Preview */}
        <div className="bg-[#282828] p-3 rounded-lg flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/50"
              alt="Album Cover"
              className="w-10 h-10 object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold truncate">
                The Less I Know The Better
              </p>
              <p className="text-xs text-neutral-400 truncate">Tame Impala</p>
            </div>
            <Maximize2
              size={16}
              className="text-neutral-400 hover:text-white cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-neutral-400" />
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-500 hover:text-red-400 p-3 w-full justify-start"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
