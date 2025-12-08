📘 Spotyfusion — Guide d’installation

Spotyfusion est une application React / TypeScript utilisant l’API Spotify.
Ce document explique comment initialiser et lancer le projet en local.

🚀 1. Prérequis

Avant de commencer, assurez-vous d’avoir installé :

Node.js (version recommandée : 18+)

npm (installé automatiquement avec Node)

Un terminal type PowerShell, Git Bash ou CMD

Vérifier votre installation :

node -v
npm -v

📦 2. Installation du projet

Clonez le projet (si vous utilisez Git) ou téléchargez-le, puis dans le dossier du projet :

npm install


Cela installe toutes les dépendances nécessaires (React, Vite, TypeScript, etc.).

▶️ 3. Lancer l’application en mode développement

Toujours dans le dossier du projet :

npm run dev


Vite démarre alors un serveur local, généralement accessible ici :

http://localhost:5173


Cliquez dessus ou copiez-collez-le dans votre navigateur.

🛠 4. Structure du projet

Le projet suit une architecture modulaire par fonctionnalités.

src/
 ├─ app/                 → Configuration globale (router, providers)
 ├─ features/            → Modules par fonctionnalité
 ├─ shared/              → Composants réutilisables, services, hooks
 ├─ styles/              → Styles globaux
 └─ tests/               → Tests unitaires

🔧 5. Scripts utiles
Commande	Description
npm run dev	Lance l’application en mode dev (Vite)
npm run build	Génère une version de production
npm run preview	Prévisualisation après build
✔️ 6. Support

Si vous rencontrez un problème :

Vérifiez votre version de Node : certains bugs viennent d’une version trop ancienne.

Assurez-vous d’avoir lancé la commande dans le bon dossier.

Redémarrez le serveur après une installation de dépendance.