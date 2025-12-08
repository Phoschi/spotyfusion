📘 Spotyfusion — Guide d’installation & Setup Spotify

Spotyfusion est une application React + TypeScript construite avec Vite, utilisant la Spotify Web API (OAuth PKCE) pour proposer un dashboard utilisateur, un blind-test et un générateur de playlists mood.

Ce guide explique comment installer, configurer Spotify et lancer le projet en local.

🚀 1. Prérequis

Assurez-vous d’avoir installé :

Node.js 18+

npm (fourni avec Node)

Un terminal (PowerShell, Git Bash, CMD…)

Vérification rapide :

node -v
npm -v


Installation des dépendances :

npm install

🔐 2. Configuration Spotify (OBLIGATOIRE)

Le projet utilise OAuth 2.0 PKCE, la méthode sécurisée recommandée par Spotify pour les apps web.

2.1 Créer une application Spotify

Aller sur le Spotify Developer Dashboard

Se connecter avec votre compte Spotify

Cliquer Create App

Ajouter la Redirect URI suivante :

http://127.0.0.1:5173/auth/callback


⚠️ Important : Spotify n’accepte plus localhost → utilisez 127.0.0.1.

2.2 Créer votre fichier .env

À la racine du projet, créer un fichier :

.env


Y coller :

VITE_SPOTIFY_CLIENT_ID=VOTRE_CLIENT_ID
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/auth/callback
VITE_SPOTIFY_SCOPES=user-read-email user-read-private user-top-read user-read-recently-played playlist-read-private playlist-modify-public playlist-modify-private


Redémarrez le serveur après modification du .env.

2.3 Lancer Vite sur le bon host

Spotify redirige vers 127.0.0.1, donc Vite doit tourner dessus :

npm run dev -- --host 127.0.0.1 --port 5173


Puis aller sur :

http://127.0.0.1:5173/

▶️ 3. Lancer l’application

Mode développement classique :

npm run dev


Mode recommandé avec host Spotify-compatible :

npm run dev -- --host 127.0.0.1 --port 5173


L’application se lance ici :

http://127.0.0.1:5173/

🔑 Flow d’authentification Spotify (PKCE)

L’utilisateur arrive sur / = LoginPage

Clique Se connecter avec Spotify

Spotify affiche la page d’autorisation

Redirection vers :

/auth/callback?code=xxxx


Le projet échange le code → access_token

L’utilisateur est redirigé vers :

/dashboard


Le token est ensuite utilisé pour appeler l’API Spotify.

🛠 4. Structure du projet

Architecture Feature-Based, propre et scalable :

src/
 ├─ app/                 → Routing global (React Router), providers
 ├─ features/
 │    ├─ auth/           → Login, callback, logique OAuth PKCE
 │    ├─ dashboard/      → Dashboard utilisateur
 │    ├─ blind-test/     → Module Blind Test
 │    ├─ mood-playlist/  → Générateur Mood Playlist
 │    └─ shell/          → AppShell (layout + navigation)
 ├─ shared/
 │    ├─ components/     → UI réutilisable
 │    ├─ services/       → spotifyAuthService, spotifyService
 │    ├─ hooks/          → Hooks transversaux
 │    └─ utils/          → Fonctions utilitaires
 ├─ styles/              → Styles globaux
 └─ tests/               → Tests unitaires

🔧 5. Scripts utiles
Commande	Description
npm run dev	Lance l’application en mode développement
npm run dev -- --host 127.0.0.1 --port 5173	Mode compatible Spotify
npm run build	Génère une version de production
npm run preview	Prévisualise le build
npm test	(si configuré) lance les tests unitaires