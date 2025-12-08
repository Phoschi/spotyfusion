import React, { useCallback } from "react";
import LoginHero from "../components/LoginHero";
import LoginCard from "../components/LoginCard";
import { buildSpotifyLoginUrlWithPkce } from "../../../shared/services/spotifyAuthService";

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
      <LoginHero />
      <div className="login-page__center">
        <LoginCard onLoginClick={handleLoginClick} />
      </div>
    </div>
  );
};

export default LoginPage;
