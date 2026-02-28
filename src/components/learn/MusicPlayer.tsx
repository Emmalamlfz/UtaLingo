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
      className="rounded-[2.5rem] bg-white/10 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-5">
        {/* Album art circle */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lemon to-mint text-3xl shadow-lg shadow-lemon/20">
          🎵
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black text-white">
            {song.title}
          </h3>
          <p className="truncate text-sm font-bold text-white/50">
            {song.artist}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-lemon px-3 py-1 text-xs font-black text-dark">
          {song.level}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div
          className="group relative h-2.5 cursor-pointer rounded-full bg-white/15"
          onClick={handleProgressClick}
          data-testid="player-progress"
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-lemon to-mint transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-3 border-white bg-lemon opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            style={{ left: `${progressPercent}%`, marginLeft: "-10px" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs font-bold text-white/40">
          <span>{formatTime(currentTime)}</span>
          <span>{song.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          className="text-white/40 transition-colors hover:text-white"
          onClick={() => onTimeChange(Math.max(0, currentTime - 10))}
          data-testid="player-rewind"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          data-testid="player-play"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-lemon text-dark shadow-lg shadow-lemon/30 transition-all hover:brightness-110 active:scale-95"
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>
        <button
          className="text-white/40 transition-colors hover:text-white"
          onClick={() => onTimeChange(Math.min(totalSeconds, currentTime + 10))}
          data-testid="player-forward"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
