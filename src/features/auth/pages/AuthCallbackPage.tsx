// src/features/auth/pages/AuthCallbackPage.tsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  exchangeCodeForToken,
  getAccessToken,
} from "../../../shared/services/spotifyAuthService";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) {
      console.log("[AuthCallback] Effet déjà exécuté, on ne relance pas.");
      return;
    }
    hasRunRef.current = true;

    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");
      const code = params.get("code");

      console.log("[AuthCallback] URL:", window.location.href);
      console.log("[AuthCallback] error:", error);
      console.log("[AuthCallback] code:", code);

      // 1. Si Spotify renvoie une erreur dans l'URL
      if (error) {
        console.error("Erreur retournée par Spotify:", error);
        navigate("/", { replace: true });
        return;
      }

      // 2. Si aucun code dans l'URL -> retour login
      if (!code) {
        console.error("Paramètre 'code' manquant dans l'URL de callback");
        navigate("/", { replace: true });
        return;
      }

      // 3. Si on a déjà un token valide
      const existingToken = getAccessToken();
      if (existingToken) {
        console.log(
          "[AuthCallback] Token déjà présent, redirection directe vers /dashboard"
        );
        navigate("/dashboard", { replace: true });
        return;
      }

      // 4. Tentative d'échange code -> token
      try {
        await exchangeCodeForToken(code);
        console.log("[AuthCallback] Token OK, redirection vers /dashboard");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error(
          "[AuthCallback] Erreur pendant l'échange code/token:",
          err
        );
        navigate("/", { replace: true });
      }
    };

    void run();
  }, [navigate]);

  return (
    <div className="auth-callback-page">
      <p>Connexion à Spotify en cours...</p>
    </div>
  );
};

export default AuthCallbackPage;
