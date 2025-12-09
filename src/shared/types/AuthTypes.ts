// src/shared/types/AuthTypes.ts

/**
 * Interface pour les données de l'utilisateur Spotify que nous allons stocker.
 */
export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  product: string; // Ex: 'premium', 'free', 'open'
}

/**
 * Interface pour le token d'accès Spotify.
 * Nous utilisons le flux implicite, nous n'avons donc pas de refresh token.
 */
export interface AuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number; // Durée de validité en secondes
  expirationTime: number; // Timestamp (ms) de quand le token expire
}

/**
 * État global de l'authentification.
 */
export interface AuthState {
  isAuthenticated: boolean;
  token: AuthToken | null;
  user: UserProfile | null;
  isLoading: boolean;
}

/**
 * Fonctions fournies par le contexte d'authentification.
 */
export interface AuthContextType extends AuthState {
  login: () => void; // Lance le processus de redirection vers Spotify
  logout: () => void; // Déconnecte l'utilisateur (nettoyage des tokens)
  handleAuthCallback: () => Promise<void>; // Gère le retour de Spotify
}
