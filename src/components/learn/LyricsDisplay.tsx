"use client";

import { useState, useCallback } from "react";
import type { LyricLine, WordToken, VocabularyItem } from "@/types";
import { useTokenizer } from "@/hooks/useTokenizer";
import InteractiveLyricLine from "./InteractiveLyricLine";
import WordPopover from "./WordPopover";

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  onAddToVocabulary?: (item: Omit<VocabularyItem, "id" | "mastered">) => void;
  savedWords?: Set<string>;
}

export default function LyricsDisplay({
  lyrics,
  currentTime,
  onAddToVocabulary,
  savedWords,
}: LyricsDisplayProps) {
  const [showFurigana, setShowFurigana] = useState(false);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedToken, setSelectedToken] = useState<WordToken | null>(null);
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null);

  const { tokenMap, loading } = useTokenizer(lyrics);

  const activeLine = lyrics.find(
    (line) => currentTime >= line.timeStart && currentTime < line.timeEnd
  );

  const handleWordClick = useCallback((token: WordToken, rect: DOMRect) => {
    setSelectedToken(token);
    setPopoverRect(rect);
  }, []);

  const handleClosePopover = useCallback(() => {
    setSelectedToken(null);
    setPopoverRect(null);
  }, []);

  const handleAddToVocabulary = useCallback(
    (item: Omit<VocabularyItem, "id" | "mastered">) => {
      onAddToVocabulary?.(item);
    },
    [onAddToVocabulary]
  );

  return (
    <div
      data-testid="lyrics-display"
      className="relative rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-3 dark:border-zinc-700/60">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            歌詞
          </h3>
          {loading && (
            <span className="flex items-center gap-1 text-[11px] text-violet-500">
              <svg
                className="h-3 w-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              分词中...
            </span>
          )}
          {!loading && Object.keys(tokenMap).length > 0 && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              点击单词查看释义
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {(
            [
              {
                key: "furigana",
                label: "振り仮名",
                state: showFurigana,
                toggle: setShowFurigana,
              },
              {
                key: "romaji",
                label: "ローマ字",
                state: showRomaji,
                toggle: setShowRomaji,
              },
              {
                key: "translation",
                label: "翻訳",
                state: showTranslation,
                toggle: setShowTranslation,
              },
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

      <div className="max-h-96 space-y-1 overflow-y-auto px-6 py-4">
        {lyrics.map((line) => {
          const isActive = activeLine?.id === line.id;
          const tokens = tokenMap[line.id];

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
              {/* Japanese text - interactive when tokenized, plain otherwise */}
              {showFurigana ? (
                <p
                  className={`text-lg font-medium ${
                    isActive
                      ? "text-violet-700 dark:text-violet-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {line.furigana}
                </p>
              ) : tokens && tokens.length > 0 ? (
                <InteractiveLyricLine
                  tokens={tokens}
                  isActive={isActive}
                  onWordClick={handleWordClick}
                />
              ) : (
                <p
                  className={`text-lg font-medium ${
                    isActive
                      ? "text-violet-700 dark:text-violet-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {line.japanese}
                </p>
              )}

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

      {/* Word Popover */}
      {selectedToken && popoverRect && (
        <WordPopover
          token={selectedToken}
          anchorRect={popoverRect}
          onClose={handleClosePopover}
          onAddToVocabulary={handleAddToVocabulary}
          isInVocabulary={
            savedWords?.has(selectedToken.basic_form) ?? false
          }
        />
      )}
    </div>
  );
}
