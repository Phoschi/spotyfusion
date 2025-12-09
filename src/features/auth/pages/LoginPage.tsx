import React, { useCallback } from "react";
import LoginCard from "../components/LoginCard";
import { buildSpotifyLoginUrlWithPkce } from "../../../shared/services/spotifyAuthService";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const handleLoginClick = useCallback(async () => {
    try {
      const url = await buildSpotifyLoginUrlWithPkce();
      console.log("Spotify login URL:", url);
      window.location.assign(url);
    } catch (error) {
      console.error("Erreur lors de la génération de l'URL de login Spotify", error);
    }
  }, []);

  return (
    <div className="login-page">
      <LoginCard onLoginClick={handleLoginClick} />
    </div>
  );
};

export default LoginPage;
