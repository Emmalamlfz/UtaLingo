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
      className="relative rounded-[2.5rem] bg-white/10 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-base font-black text-white">歌詞</h3>
          {loading && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-lemon">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              分词中...
            </span>
          )}
          {!loading && Object.keys(tokenMap).length > 0 && (
            <span className="rounded-full bg-lemon/20 px-3 py-0.5 text-[10px] font-black text-lemon">
              タップで辞書 ✨
            </span>
          )}
        </div>

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
              className={`rounded-[1.5rem] px-5 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-lemon/15 ring-2 ring-lemon/30"
                  : "hover:bg-white/5"
              }`}
            >
              {showFurigana ? (
                <p
                  className={`text-lg font-bold leading-relaxed transition-colors duration-200 ${
                    isActive ? "text-lemon" : "text-white"
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
                  className={`text-lg font-bold leading-relaxed transition-colors duration-200 ${
                    isActive ? "text-lemon" : "text-white"
                  }`}
                >
                  {line.japanese}
                </p>
              )}

              <div className={`lyric-row-collapse ${showRomaji ? "open" : ""}`}>
                <p className="mt-0.5 text-sm font-semibold italic text-sky">
                  {line.romaji}
                </p>
              </div>

              <div className={`lyric-row-collapse ${showTranslation ? "open" : ""}`}>
                <p className="mt-0.5 text-sm font-semibold text-white/40">
                  {line.english}
                </p>
              </div>
            </div>
          );
        })}
      </div>

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
