"use client";

import { useState } from "react";
import { LyricLine } from "@/types";

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
}

export default function LyricsDisplay({
  lyrics,
  currentTime,
}: LyricsDisplayProps) {
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);

  const activeLine = lyrics.find(
    (line) => currentTime >= line.timeStart && currentTime < line.timeEnd
  );

  return (
    <div
      data-testid="lyrics-display"
      className="rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-3 dark:border-zinc-700/60">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          歌詞
        </h3>
        <div className="flex gap-2">
          {(
            [
              { key: "furigana", label: "振り仮名", state: showFurigana, toggle: setShowFurigana },
              { key: "romaji", label: "ローマ字", state: showRomaji, toggle: setShowRomaji },
              { key: "translation", label: "翻訳", state: showTranslation, toggle: setShowTranslation },
            ] as const
          ).map(({ key, label, state, toggle }) => (
            <button
              key={key}
              onClick={() => toggle(!state)}
              data-testid={`toggle-${key}`}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                state
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400"
                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-80 space-y-1 overflow-y-auto px-6 py-4">
        {lyrics.map((line) => {
          const isActive = activeLine?.id === line.id;
          return (
            <div
              key={line.id}
              data-testid={`lyric-${line.id}`}
              className={`rounded-xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-violet-50 ring-1 ring-violet-200 dark:bg-violet-900/20 dark:ring-violet-700"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              <p
                className={`text-lg font-medium ${
                  isActive
                    ? "text-violet-700 dark:text-violet-400"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {showFurigana ? line.furigana : line.japanese}
              </p>
              {showRomaji && (
                <p className="mt-0.5 text-sm italic text-pink-500 dark:text-pink-400">
                  {line.romaji}
                </p>
              )}
              {showTranslation && (
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {line.english}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
