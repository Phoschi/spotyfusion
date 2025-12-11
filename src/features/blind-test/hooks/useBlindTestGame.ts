// src/features/blind-test/hooks/useBlindTestGame.ts

import { useEffect, useMemo, useState } from "react";
import type { SpotifyTrack } from "../../../shared/types/spotifyBlindTestTypes";
import { spotifyBlindTestService } from "../services/spotifyBlindTestService";
import {
  computeScore,
  generateBlindTestQuestions,
} from "../services/blindTestEngine";
import type {
  BlindTestAnswerFeedback,
  BlindTestGameConfig,
  BlindTestGamePhase,
  BlindTestQuestion,
  BlindTestResult,
} from "../types/blindTestTypes";

type UseBlindTestGameState = {
  phase: BlindTestGamePhase;
  isLoading: boolean;
  error: string | null;
  currentQuestion: BlindTestQuestion | null;
  currentIndex: number;
  totalQuestions: number;
  feedback: BlindTestAnswerFeedback | null;
  result: BlindTestResult | null;
  playedTracks: SpotifyTrack[];
  score: number; // score courant (nombre de bonnes réponses)
  selectAnswer: (answerId: string) => void;
  goToNextQuestion: () => void;
};

export const useBlindTestGame = (
  config: BlindTestGameConfig | null
): UseBlindTestGameState => {
  const [phase, setPhase] = useState<BlindTestGamePhase>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<BlindTestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<BlindTestAnswerFeedback | null>(null);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<
    Record<string, string>
  >({});
  const [result, setResult] = useState<BlindTestResult | null>(null);
  const [score, setScore] = useState(0); // score courant

  useEffect(() => {
    const load = async () => {
      if (!config) return;
      setIsLoading(true);
      setPhase("loading");
      setError(null);
      setFeedback(null);
      setResult(null);
      setAnswersByQuestionId({});
      setCurrentIndex(0);
      setScore(0);

      try {
        const tracks = await spotifyBlindTestService.fetchPlaylistTracks(
          config.playlist.id
        );

        const generated = generateBlindTestQuestions(
          tracks,
          config.questionCount
        );
        setQuestions(generated);
        setPhase("playing");
      } catch (err) {
        console.error(err);
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de générer le blind test.";
        setError(message);
        setPhase("idle");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [config]);

  const totalQuestions = questions.length;
  const currentQuestion = useMemo(
    () => (totalQuestions > 0 ? questions[currentIndex] ?? null : null),
    [questions, currentIndex, totalQuestions]
  );

  const selectAnswer = (answerId: string) => {
    if (!currentQuestion || phase !== "playing") return;
    // On ne permet qu'une seule réponse par question
    if (feedback) return;

    const selected = currentQuestion.choices.find(
      (choice) => choice.id === answerId
    );
    if (!selected) return;

    const isCorrect = selected.isCorrect;

    setFeedback({
      selectedAnswerId: answerId,
      isCorrect,
    });

    setAnswersByQuestionId((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const goToNextQuestion = () => {
    if (!currentQuestion) return;

    setFeedback(null);

    const isLast = currentIndex >= questions.length - 1;
    if (isLast) {
      const finalResult = computeScore(questions, answersByQuestionId);
      setResult(finalResult);
      setPhase("finished");
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const playedTracks: SpotifyTrack[] = useMemo(
    () => questions.map((q) => q.track),
    [questions]
  );

  return {
    phase,
    isLoading,
    error,
    currentQuestion,
    currentIndex,
    totalQuestions,
    feedback,
    result,
    playedTracks,
    score,
    selectAnswer,
    goToNextQuestion,
  };
};
