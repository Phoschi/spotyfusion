import { getAuthData } from "./spotifyAuthService";

/**
 * Fonction utilitaire pour faire un fetch Spotify avec token inclus
 */
async function spotifyFetch(url: string) {
  const auth = getAuthData();
  if (!auth) {
    throw new Error("Token Spotify expiré ou absent");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Erreur Spotify :", await response.text());
    throw new Error(`Erreur Spotify: ${response.status}`);
  }

  return response.json();
}

/**
 * Récupère le Top 10 artistes selon le time_range
 * @param timeRange short_term | medium_term | long_term
 */
export async function getTopArtists(timeRange: string = "short_term") {
  const url = `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`;
  return spotifyFetch(url);
}

/**
 * Récupère le Top 10 titres selon le time_range
 * @param timeRange short_term | medium_term | long_term
 */
export async function getTopTracks(timeRange: string = "short_term") {
  const url = `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`;
  return spotifyFetch(url);
}

/**
 * Récupère les 5 derniers titres écoutés (US B3)
 */
export async function getRecentlyPlayed() {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=5";
  return spotifyFetch(url);
}
