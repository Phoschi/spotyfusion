// src/features/blind-test/hooks/useAudioPreview.ts

import { useEffect, useRef, useState } from "react";
import {
  AUDIO_PREVIEW_DURATION_MS,
  AUDIO_PREVIEW_FADE_OUT_MS,
} from "../types/blindTestConstants";

type UseAudioPreviewParams = {
  previewUrl: string | null;
  autoplay?: boolean;
};

type UseAudioPreviewReturn = {
  isPlaying: boolean;
  progress: number; // 0 - 1
  play: () => void;
  pause: () => void;
  stop: () => void;
};

export const useAudioPreview = ({
  previewUrl,
  autoplay = true,
}: UseAudioPreviewParams): UseAudioPreviewReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Crée / remplace l'Audio à chaque nouvelle URL
  useEffect(() => {
    if (!previewUrl) {
      setIsPlaying(false);
      setProgress(0);
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }

    const audio = new Audio(previewUrl);
    audioRef.current = audio;
    setIsPlaying(false);
    setProgress(0);

    const onTimeUpdate = () => {
      const current = audio.currentTime * 1000;
      setProgress(Math.min(current / AUDIO_PREVIEW_DURATION_MS, 1));
    };

    audio.addEventListener("timeupdate", onTimeUpdate);

    if (autoplay) {
      void audio.play().then(() => setIsPlaying(true));
    }

    const stopTimeout = window.setTimeout(() => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      setIsPlaying(false);
    }, AUDIO_PREVIEW_DURATION_MS + AUDIO_PREVIEW_FADE_OUT_MS);

    return () => {
      window.clearTimeout(stopTimeout);
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [previewUrl, autoplay]);

  const play = () => {
    if (!audioRef.current) return;
    void audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  return {
    isPlaying,
    progress,
    play,
    pause,
    stop,
  };
};
