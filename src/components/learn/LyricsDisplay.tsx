"use client";

import { useState, useCallback } from "react";
import type { LyricLine, WordToken, VocabularyItem } from "@/types";
import { useTokenizer } from "@/hooks/useTokenizer";
import InteractiveLyricLine from "./InteractiveLyricLine";
import WordPopover from "./WordPopover";
import ToggleSwitch from "@/components/shared/ToggleSwitch";

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
      {/* Header with toggle switches */}
      <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-700/60">
        {/* Title row */}
        <div className="mb-3 flex items-center gap-2">
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

        {/* Toggle switch group */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <ToggleSwitch
            checked={showFurigana}
            onChange={setShowFurigana}
            label="振り仮名"
            sublabel="Furigana"
            testId="toggle-furigana"
          />
          <ToggleSwitch
            checked={showRomaji}
            onChange={setShowRomaji}
            label="ローマ字"
            sublabel="Romaji"
            testId="toggle-romaji"
          />
          <ToggleSwitch
            checked={showTranslation}
            onChange={setShowTranslation}
            label="翻訳"
            sublabel="Translation"
            testId="toggle-translation"
          />
        </div>
      </div>

      {/* Lyrics body */}
      <div className="max-h-96 space-y-1 overflow-y-auto px-6 py-4">
        {lyrics.map((line) => {
          const isActive = activeLine?.id === line.id;
          const tokens = tokenMap[line.id];

          return (
            <div
              key={line.id}
              data-testid={`lyric-${line.id}`}
              className={`rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-violet-50 ring-1 ring-violet-200 dark:bg-violet-900/20 dark:ring-violet-700"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {/* Main Japanese line – always rendered; content depends on furigana toggle */}
              {showFurigana ? (
                <p
                  className={`text-lg font-medium leading-relaxed transition-colors duration-200 ${
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
                  className={`text-lg font-medium leading-relaxed transition-colors duration-200 ${
                    isActive
                      ? "text-violet-700 dark:text-violet-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {line.japanese}
                </p>
              )}

              {/* Romaji – animated collapse */}
              <div
                className={`lyric-row-collapse ${showRomaji ? "open" : ""}`}
              >
                <p className="mt-0.5 text-sm italic text-pink-500 dark:text-pink-400">
                  {line.romaji}
                </p>
              </div>

              {/* Translation – animated collapse */}
              <div
                className={`lyric-row-collapse ${showTranslation ? "open" : ""}`}
              >
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {line.english}
                </p>
              </div>
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
