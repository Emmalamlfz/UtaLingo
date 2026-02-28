"use client";

import type { VocabularyItem } from "@/types";

interface SmartWordbookProps {
  words: VocabularyItem[];
  masteredCount: number;
  onToggleMastered: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function SmartWordbook({
  words,
  masteredCount,
  onToggleMastered,
  onRemove,
  onClearAll,
}: SmartWordbookProps) {
  if (words.length === 0) {
    return (
      <div
        data-testid="smart-wordbook"
        className="rounded-[2.5rem] bg-white/10 backdrop-blur-sm"
      >
        <div className="border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📒</span>
            <h3 className="text-base font-black text-white">智能生词本</h3>
          </div>
        </div>
        <div className="py-12 text-center">
          <span className="text-4xl">📝</span>
          <p className="mt-3 text-sm font-bold text-white/30">
            还没有生词哦，点击歌词中的单词添加吧！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="smart-wordbook"
      className="rounded-[2.5rem] bg-white/10 backdrop-blur-sm"
    >
      {/* Header with stats */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📒</span>
            <h3 className="text-base font-black text-white">智能生词本</h3>
            <span className="rounded-full bg-lemon/20 px-2.5 py-0.5 text-[11px] font-black text-lemon">
              {words.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white/30">
              已学会{" "}
              <span className="font-black text-mint">{masteredCount}</span>/
              {words.length}
            </span>
            {words.length > 0 && (
              <button
                onClick={onClearAll}
                data-testid="wordbook-clear"
                className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-white/30 transition-colors hover:bg-coral/20 hover:text-coral"
              >
                清空
              </button>
            )}
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lemon to-mint transition-all duration-500"
            style={{
              width: `${words.length > 0 ? (masteredCount / words.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Word list */}
      <div className="max-h-80 overflow-y-auto px-4 py-3">
        <div className="space-y-1">
          {words.map((word) => (
            <div
              key={word.id}
              data-testid={`wordbook-row-${word.id}`}
              className={`group flex items-center gap-3 rounded-[1.2rem] px-4 py-3 transition-all duration-300 ${
                word.mastered ? "bg-white/3" : "bg-white/5 hover:bg-white/8"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => onToggleMastered(word.id)}
                data-testid={`wordbook-check-${word.id}`}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                  word.mastered
                    ? "border-mint bg-mint text-dark"
                    : "border-white/20 bg-transparent hover:border-lemon/50"
                }`}
              >
                {word.mastered && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              {/* Word info */}
              <div
                className={`min-w-0 flex-1 transition-all duration-300 ${
                  word.mastered ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-base font-black text-white transition-all duration-300 ${
                      word.mastered ? "line-through decoration-white/40" : ""
                    }`}
                  >
                    {word.word}
                  </span>
                  <span
                    className={`text-sm font-bold text-white/40 transition-all duration-300 ${
                      word.mastered ? "line-through decoration-white/20" : ""
                    }`}
                  >
                    {word.reading}
                  </span>
                  <span className="ml-auto shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-black text-white/30">
                    {word.level}
                  </span>
                </div>
                <p
                  className={`mt-0.5 text-sm font-semibold text-white/50 transition-all duration-300 ${
                    word.mastered ? "line-through decoration-white/20" : ""
                  }`}
                >
                  {word.meaning}
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={() => onRemove(word.id)}
                data-testid={`wordbook-remove-${word.id}`}
                className="shrink-0 rounded-full p-1.5 text-white/0 transition-all group-hover:text-white/30 hover:!bg-coral/20 hover:!text-coral"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
