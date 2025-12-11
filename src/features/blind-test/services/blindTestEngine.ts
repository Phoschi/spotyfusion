// src/features/blind-test/services/blindTestEngine.ts

import type { SpotifyTrack } from "../../../shared/types/spotifyBlindTestTypes";
import type {
  AnswerChoice,
  BlindTestQuestion,
  BlindTestResult,
} from "../types/blindTestTypes";

import { BLIND_TEST_QUESTION_COUNT } from "../types/blindTestConstants";

// Utilitaire de shuffle (Fisher-Yates)
export const shuffleArray = <T>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickRandom = <T>(items: T[], count: number): T[] => {
  return shuffleArray(items).slice(0, count);
};

const createChoicesForTrack = (
  correctTrack: SpotifyTrack,
  pool: SpotifyTrack[]
): AnswerChoice[] => {
  const wrongTracksPool = pool.filter((t) => t.id !== correctTrack.id);
  const wrongTracks = pickRandom(wrongTracksPool, 3);

  const choices: AnswerChoice[] = [
    {
      id: `answer-${correctTrack.id}`,
      label: correctTrack.name,
      trackId: correctTrack.id,
      isCorrect: true,
    },
    ...wrongTracks.map((track) => ({
      id: `answer-${correctTrack.id}-${track.id}`,
      label: track.name,
      trackId: track.id,
      isCorrect: false,
    })),
  ];

  return shuffleArray(choices);
};

export const generateBlindTestQuestions = (
  tracks: SpotifyTrack[],
  questionCount: number = BLIND_TEST_QUESTION_COUNT
): BlindTestQuestion[] => {
  if (tracks.length < 4) {
    throw new Error(
      "Not enough tracks to generate a blind test."
    );
  }

  const questionsTracks = pickRandom(
    tracks,
    Math.min(questionCount, tracks.length)
  );

  return questionsTracks.map((track, index) => {
    const choices = createChoicesForTrack(track, tracks);
    return {
      id: `question-${index + 1}`,
      track,
      choices,
    };
  });
};

export const computeScore = (
  questions: BlindTestQuestion[],
  answersByQuestionId: Record<string, string>
): BlindTestResult => {
  let score = 0;

  questions.forEach((question) => {
    const selectedAnswerId = answersByQuestionId[question.id];
    const selectedAnswer = question.choices.find(
      (choice) => choice.id === selectedAnswerId
    );
    if (selectedAnswer?.isCorrect) {
      score += 1;
    }
  });

  return {
    score,
    totalQuestions: questions.length,
    questions,
  };
};
