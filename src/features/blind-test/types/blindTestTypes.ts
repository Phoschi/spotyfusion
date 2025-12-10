// src/features/blind-test/types/blindTestTypes.ts

import type {
  SpotifyPlaylist,
  SpotifyTrack,
} from "../../../shared/types/spotifyBlindTestTypes";

export type BlindTestGamePhase = "idle" | "loading" | "playing" | "finished";

export type AnswerChoice = {
  id: string;
  label: string; // track title
  trackId: string;
  isCorrect: boolean;
};

export type BlindTestQuestion = {
  id: string;
  track: SpotifyTrack;
  choices: AnswerChoice[];
};

export type BlindTestGameConfig = {
  playlist: SpotifyPlaylist;
  questionCount: number;
};

export type BlindTestAnswerFeedback = {
  selectedAnswerId: string;
  isCorrect: boolean;
};

export type BlindTestResult = {
  score: number;
  totalQuestions: number;
  questions: BlindTestQuestion[];
};
