import { useState } from "react";
import { BlindTestHeader } from "../components/BlindTestHeader";
import { PlaylistSection } from "../components/PlaylistSection";
import { StartBlindTestButton } from "../components/StartBlindTestButton";
import "../blind-test.css";
import { useSpotifyPlaylists } from "../hooks/useSpotifyPlaylists";
import { useBlindTestGame } from "../hooks/useBlindTestGame";
import { BlindTestGame } from "../components/BlindTestGame";
import { getAccessToken } from "../../../shared/services/spotifyAuthService";


export default function BlindTestPage() {
    const token = getAccessToken();

    // Hooks
    const { playlists, loading: playlistsLoading, error: playlistsError } = useSpotifyPlaylists(token);
    const {
        status: gameStatus,
        questions,
        currentQuestionIndex,
        score,
        error: gameError,
        startGame,
        submitAnswer,
        restartGame
    } = useBlindTestGame(token);

    // Local state for UI
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    const handleSelect = (playlistId: string) => {
        setSelectedPlaylistId(playlistId);
    };

    const handleStart = () => {
        if (!selectedPlaylistId) return alert("Choisis une playlist !");
        startGame(selectedPlaylistId);
    };

    const handleQuit = () => {
        restartGame(); // Reset game state
        // status becomes idle
    };

    const handleRestartSame = () => {
        // Technically we might want to reshuffle. 
        // startGame re-fetches or we need to pass tracks? 
        // Our startGame fetches again. That's fine for now.
        if (selectedPlaylistId) {
            startGame(selectedPlaylistId);
        }
    };

    return (
        <div className="blind-test-page">
            <BlindTestHeader />

            {/* ERROR HANDLING */}
            {(playlistsError || gameError) && (
                <div style={{ color: 'red', marginTop: 20 }}>
                    {playlistsError || gameError}
                </div>
            )}

            {/* LOADING */}
            {(playlistsLoading || gameStatus === 'loading') && (
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <p>Chargement en cours...</p>
                </div>
            )}

            {/* IDLE: PLAYLIST SELECTION */}
            {gameStatus === 'idle' && !playlistsLoading && (
                <>
                    <PlaylistSection
                        playlists={playlists.map(p => ({
                            ...p,
                            selected: p.id === selectedPlaylistId,
                        }))}
                        onSelect={handleSelect}
                    />
                    <StartBlindTestButton onClick={handleStart} />
                </>
            )}

            {/* PLAYING / FINISHED */}
            {(gameStatus === 'playing' || gameStatus === 'finished') && (
                <BlindTestGame
                    question={questions[currentQuestionIndex]}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    score={score}
                    gameStatus={gameStatus}
                    onSubmitAnswer={submitAnswer}
                    onRestart={handleRestartSame}
                    onQuit={handleQuit}
                />
            )}
        </div>
    );
}
