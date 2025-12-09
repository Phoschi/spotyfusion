// src/features/auth/pages/AuthCallbackPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "../../../shared/services/spotifyAuthService";
import { useAuth } from "../context/AuthContext";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

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
        navigate("/", { replace: true });
        return;
      }

      if (!code) {
        console.error("Paramètre 'code' manquant dans l'URL de callback");
        navigate("/", { replace: true });
        return;
      }

      try {
        const token = await exchangeCodeForToken(code);
        setAccessToken(token.access_token);

        console.log("[AuthCallback] Token OK → redirection /dashboard");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("[AuthCallback] Erreur échange code/token:", err);
        navigate("/", { replace: true });
      }
    };

    void run();
  }, [navigate, setAccessToken]);

  return (
    <div className="auth-callback-page">
      <p>Connexion à Spotify en cours...</p>
    </div>
  );
};

export default AuthCallbackPage;
