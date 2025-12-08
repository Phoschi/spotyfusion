// src/features/auth/pages/AuthCallbackPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "../../../shared/services/spotifyAuthService";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");
      const code = params.get("code");

      console.log("[AuthCallback] URL:", window.location.href);
      console.log("[AuthCallback] error:", error);
      console.log("[AuthCallback] code:", code);

      if (error) {
        console.error("Erreur retournée par Spotify:", error);
        navigate("/", { replace: true }); // "/" = Login
        return;
      }

      if (!code) {
        console.error("Paramètre 'code' manquant dans l'URL de callback");
        navigate("/", { replace: true });
        return;
      }

      try {
        await exchangeCodeForToken(code);
        console.log("[AuthCallback] Token OK, redirection vers /dashboard");
        navigate("/dashboard", { replace: true }); // 👈 IMPORTANT
      } catch (err) {
        console.error("[AuthCallback] Erreur pendant l'échange code/token:", err);
        navigate("/", { replace: true }); // retour login
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
