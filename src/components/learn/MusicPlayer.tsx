"use client";

import { useState } from "react";
import { Song } from "@/types";

interface MusicPlayerProps {
  song: Song;
  currentTime: number;
  onTimeChange: (time: number) => void;
}

export default function MusicPlayer({
  song,
  currentTime,
  onTimeChange,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSeconds = parseDuration(song.duration);
  const progressPercent = totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0;

  function parseDuration(dur: string): number {
    const parts = dur.split(":").map(Number);
    return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onTimeChange(Math.floor(pct * totalSeconds));
  };

  return (
    <div
      data-testid="music-player"
      className="rounded-2xl border border-zinc-200/60 bg-white p-6 dark:border-zinc-700/60 dark:bg-zinc-800/50"
    >
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-2xl text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
          🎵
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {song.title}
          </h3>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            {song.artist}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
          {song.level}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div
          className="group relative h-2 cursor-pointer rounded-full bg-zinc-100 dark:bg-zinc-700"
          onClick={handleProgressClick}
          data-testid="player-progress"
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            style={{ left: `${progressPercent}%`, marginLeft: "-8px" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <span>{song.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          className="text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => onTimeChange(Math.max(0, currentTime - 10))}
          data-testid="player-rewind"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          data-testid="player-play"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-xl dark:shadow-violet-900/30"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        <button
          className="text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => onTimeChange(Math.min(totalSeconds, currentTime + 10))}
          data-testid="player-forward"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
