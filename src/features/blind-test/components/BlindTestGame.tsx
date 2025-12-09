import { useState, useEffect, useRef } from 'react';
import type { Question } from '../hooks/useBlindTestGame';

type BlindTestGameProps = {
    question: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    score: number;
    onSubmitAnswer: (trackId: string) => void;
    gameStatus: 'playing' | 'finished';
    onRestart: () => void;
    onQuit: () => void;
};

export function BlindTestGame({
    question,
    currentQuestionIndex,
    totalQuestions,
    score,
    onSubmitAnswer,
    gameStatus,
    onRestart,
    onQuit
}: BlindTestGameProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Reset selection when question changes
    useEffect(() => {
        setSelectedId(null);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.load();
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(e => {
                        console.error("Autoplay failed", e);
                        setIsPlaying(false);
                    });
            }
        }
    }, [question]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleOptionClick = (trackId: string) => {
        if (selectedId) return; // Prevent double click
        setSelectedId(trackId);

        // Slight delay to show result before moving
        setTimeout(() => {
            onSubmitAnswer(trackId);
        }, 1000); // 1 second delay
    };

    if (gameStatus === 'finished') {
        return (
            <div className="blind-test-result">
                <h2>Partie Terminée !</h2>
                <p className="final-score">Score final: {score} / {totalQuestions}</p>
                <div className="result-actions">
                    <button className="btn-primary" onClick={onRestart}>Rejouer</button>
                    <button className="btn-secondary" onClick={onQuit}>Choisir une autre playlist</button>
                </div>
            </div>
        );
    }

    return (
        <div className="blind-test-game">
            <div className="game-header">
                <span className="score">Score: {score}</span>
                <span className="progress">Question {currentQuestionIndex + 1} / {totalQuestions}</span>
            </div>

            <div className="question-container">
                <div className="audio-visualizer">
                    {/* Simple animation or icon */}
                    <div className="music-icon" onClick={togglePlay} style={{ cursor: 'pointer' }}>
                        {isPlaying ? '🔊' : '▶️'}
                    </div>
                    <p>Quelle est cette musique ?</p>
                    {!isPlaying && <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>(Cliquez pour écouter)</p>}
                </div>

                {question?.track.previewUrl && (
                    <audio
                        ref={audioRef}
                        src={question.track.previewUrl}
                        onEnded={() => setIsPlaying(false)}
                        controlsList="nodownload noplaybackrate"
                        style={{ display: 'none' }}
                    />
                )}

                <div className="options-grid">
                    {question?.options.map((option) => {
                        let className = "option-card";
                        if (selectedId) {
                            if (option.id === question.track.id) className += " correct";
                            else if (option.id === selectedId) className += " wrong";
                            else className += " disabled";
                        }

                        return (
                            <button
                                key={option.id}
                                className={className}
                                onClick={() => handleOptionClick(option.id)}
                                disabled={!!selectedId}
                            >
                                <div className="option-info">
                                    <div className="option-title">{option.name}</div>
                                    <div className="option-artist">{option.artist}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
