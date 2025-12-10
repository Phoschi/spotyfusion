import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BarChart2, Music, ListMusic, LogOut } from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import { getUserProfile, clearAuthData } from "../services/spotifyAuthService";
import { globalBackgroundSecondary, globalFontPrimary, globalTextPrimary } from "../../style/globalStyles";

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
        `sf-nav-item ${isActive ? "active" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <div className="sf-active-indicator" />}
          <div className="sf-nav-icon">{icon}</div>
          <span className="sf-nav-label">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function NavBar(): JSX.Element {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (err) {
        console.error("Erreur récupération utilisateur :", err);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    clearAuthData();
    // Rediriger vers la page d'accueil (Login)
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        /* Scoped CSS for NavBar */
        .sf-navbar-container {
          width: 260px;
          min-width: 260px;
          background-color: #121212;
          color: white;
          min-height: 100vh; /* Allow it to grow, don't limit to viewport height */
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          box-sizing: border-box;
          z-index: 10;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .sf-logo-section {
          padding: 0 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sf-logo-icon-bg {
          width: 40px;
          height: 40px;
          background-color: #1DB954; /* Spotify Green */
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .sf-logo-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
          color: white;
        }

        .sf-user-card {
           background-color: #ffffff05;
           border-radius: 8px;
           padding: 12px;
           display: flex;
           align-items: center;
           gap: 12px;
           margin-bottom: 20px;
           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .sf-user-card.loading {
             opacity: 0.6;
        }

        .sf-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #333;
        }

        .sf-user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

       .sf-user-name {
          font-weight: 600;
          font-style: normal; /* Semi Bold = 600 */
          font-size: 14px;
          line-height: 20.02px;
          letter-spacing: -0.15px;
          
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 4px 0;
        }

        .sf-badge-premium {
          display: inline-block;
          background-color: #1DB954;
          color: black;
          font-size: 10px;
          font-weight: 400;
          padding: 2px 8px;
          border-radius: 12px;
          letter-spacing: 0.5px;
          align-self: flex-start;
        }

        .sf-nav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sf-nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-radius: 6px;
          color: #FFFFFFB2;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          font-size: 14px;
          font-weight: 500;
        }

        .sf-nav-item:hover {
          color: white;
        }

        .sf-nav-item.active {
          background-color: #2F2F2F;
          color: white;
          font-weight: 600;
        }

        .sf-active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background-color: #1DB954;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        .sf-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sf-nav-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
        }

        .sf-divider {
          height: 1px;
          background-color: #282828;
          margin: 8px 16px 16px 16px;
        }

        .sf-logout-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          background: none;
          border: none;
          color: #e91429; /* Spotify Red error color usually, or distinct warning */
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: opacity 0.2s;
          font-family: inherit;
        }

        .sf-logout-btn:hover {
          opacity: 0.8;
        }

        .sf-big-divider {
          width: 232px;
          height: 1px;
          opacity: 1;
          border-bottom: 1px solid #2E2E2E;
          margin: 0 auto 20px auto;
        }

      `}</style>

      <aside className="sf-navbar-container" style={{...globalBackgroundSecondary, ...globalFontPrimary, margin:" 10px 0 10px 10px"}}>
        {/* === Logo === */}
        <div className="sf-logo-section">
          <div className="sf-logo-icon-bg">
            <Music size={20} className="text-white" />
          </div>
          <h1 className="sf-logo-text" style={{...globalTextPrimary}}>SpotyFusion</h1>
        </div>

        <div className="sf-big-divider"></div>


        {/* === Profil connecté === */}
        {user ? (
          <div className="sf-user-card">
            <img
              src={user.images?.[0]?.url ?? "https://dummyimage.com/40x40/cccccc/000000&text=U"}
              alt="avatar"
              className="sf-avatar"
            />
            <div className="sf-user-info">
              <p className="sf-user-name" style={{...globalFontPrimary}} >
                {user.display_name ?? "Alex Martin"}
              </p>
              <span className="sf-badge-premium">
                {user.product === "premium" ? "Premium" : "Free"}
              </span>
            </div>
          </div>
        ) : (
          <div className="sf-user-card loading">
            <div className="sf-avatar" />
            <div className="sf-user-info">
              <div style={{ height: 14, width: 80, backgroundColor: '#333', borderRadius: 4, marginBottom: 4 }} />
              <div style={{ height: 12, width: 50, backgroundColor: '#333', borderRadius: 4 }} />
            </div>
          </div>
        )}

        <div className="sf-big-divider"></div>


        {/* === Navigation === */}
        <nav className="sf-nav-list">
          <NavItem
            to="/dashboard"
            icon={<BarChart2 size={24} />}
            label="Statistiques"
          />
          <NavItem
            to="/blind-test"
            icon={<Music size={24} />}
            label="Blind Test"
          />
          <NavItem
            to="/mood-playlist"
            icon={<ListMusic size={24} />}
            label="Générateur de Playlists"
          />
        </nav>


        {/* === Footer / Logout === */}
        <div className="sf-nav-footer">
        <div className="sf-big-divider"></div>
          <button onClick={handleLogout} className="sf-logout-btn">
            <div className="sf-nav-icon">
              <LogOut size={24} />
            </div>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
