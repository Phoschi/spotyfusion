import { useState } from 'react';
import { fetchPlaylistTracks } from '../../../shared/services/spotifyPlaylistService';
import type { Track } from '../../../shared/types/SpotifyTypes';

export type Question = {
    track: Track;
    options: Track[];
};

export type GameStatus = 'idle' | 'loading' | 'playing' | 'finished' | 'error';

export function useBlindTestGame(token: string | null) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<GameStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const startGame = async (playlistId: string) => {
        if (!token) return;

        setStatus('loading');
        setError(null);
        setScore(0);
        setCurrentQuestionIndex(0);

        try {
            const tracks = await fetchPlaylistTracks(token, playlistId);
            console.log(tracks);
            if (tracks.length < 4) {
                throw new Error("Cette playlist ne contient pas assez de titres avec extraits (min 4).");
            }

            // Select 10 random tracks (or less if not enough)
            const gameTracks = shuffleArray(tracks).slice(0, 10);

            const newQuestions: Question[] = gameTracks.map((correctTrack) => {
                // Distractors: tracks that are NOT the correct one
                const distractors = tracks.filter(t => t.id !== correctTrack.id);
                const selectedDistractors = shuffleArray(distractors).slice(0, 3);

                const options = shuffleArray([correctTrack, ...selectedDistractors]);

                return {
                    track: correctTrack,
                    options,
                };
            });

            setQuestions(newQuestions);
            setStatus('playing');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erreur lors du chargement du jeu.");
            setStatus('error');
        }
    };

    const submitAnswer = (selectedTrackId: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        if (selectedTrackId === currentQuestion.track.id) {
            setScore(s => s + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else {
            setStatus('finished');
        }
    };

    const restartGame = () => {
        setStatus('idle');
        setQuestions([]);
        setScore(0);
        setCurrentQuestionIndex(0);
    };

    return {
        status,
        questions,
        currentQuestionIndex,
        score,
        error,
        startGame,
        submitAnswer,
        restartGame
    };
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
