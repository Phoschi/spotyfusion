import { useState } from "react";
import { BlindTestHeader } from "../components/BlindTestHeader";
import { PlaylistSection } from "../components/PlaylistSection";
import { StartBlindTestButton } from "../components/StartBlindTestButton";
import "../blind-test.css";
import { useSpotifyPlaylists } from "../hooks/useSpotifyPlaylists";
import { getAccessToken } from "../../../shared/services/spotifyAuthService"; 

export default function BlindTestPage() {
    const token = getAccessToken(); 
    console.log("Spotify token:", token);

    const { playlists, loading, error } = useSpotifyPlaylists(token);

    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    const handleSelect = (playlistId: string) => {
        setSelectedPlaylistId(playlistId);
    };

    const handleStart = () => {
        if (!selectedPlaylistId) return alert("Choisis une playlist !");
        // Ici tu pourras lancer le blind test avec la playlist sélectionnée
        console.log("Démarrer le Blind Test avec la playlist :", selectedPlaylistId);
    };

    return (
        <div className="blind-test-page">
        <BlindTestHeader />
        {loading && <p>Chargement des playlists...</p>}
        {error && <p>{error}</p>}
        {!loading && (
            <PlaylistSection
            playlists={playlists.map(p => ({
                ...p,
                selected: p.id === selectedPlaylistId,
            }))}
            onSelect={handleSelect}
            />
        )}
        <StartBlindTestButton onClick={handleStart} />
        </div>
    );
}
