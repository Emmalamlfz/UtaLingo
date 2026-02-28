"use client";

import { useRef, useCallback } from "react";
import type { WordToken } from "@/types";
import { lookupWord } from "@/data/dictionary";

interface InteractiveLyricLineProps {
  tokens: WordToken[];
  isActive: boolean;
  onWordClick: (token: WordToken, rect: DOMRect) => void;
}

const INTERACTIVE_POS = new Set([
  "名詞",
  "動詞",
  "形容詞",
  "形容動詞",
  "副詞",
  "連体詞",
  "接続詞",
  "感動詞",
  "代名詞",
]);

function isContentWord(token: WordToken): boolean {
  if (INTERACTIVE_POS.has(token.pos)) return true;
  const entry = lookupWord(token.surface_form, token.basic_form);
  return entry !== null;
}

export default function InteractiveLyricLine({
  tokens,
  isActive,
  onWordClick,
}: InteractiveLyricLineProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const handleClick = useCallback(
    (token: WordToken, e: React.MouseEvent<HTMLSpanElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      onWordClick(token, rect);
    },
    [onWordClick]
  );

  return (
    <p
      ref={containerRef}
      className={`text-lg font-bold leading-relaxed ${
        isActive ? "text-lemon" : "text-white"
      }`}
    >
      {tokens.map((token, i) => {
        const clickable = isContentWord(token);

        if (!clickable) {
          return (
            <span key={i} className="inline">
              {token.surface_form}
            </span>
          );
        }

        return (
          <span
            key={i}
            onClick={(e) => handleClick(token, e)}
            data-testid={`word-${token.surface_form}-${i}`}
            className={`inline cursor-pointer rounded-lg px-0.5 transition-all duration-150 ${
              isActive
                ? "hover:bg-lemon/20 hover:text-white"
                : "hover:bg-lemon/10 hover:text-lemon"
            } decoration-lemon/40 decoration-dotted underline-offset-4 hover:underline`}
          >
            {token.surface_form}
          </span>
        );
      })}
    </p>
  );
}

export { isContentWord };
export type { InteractiveLyricLineProps };
