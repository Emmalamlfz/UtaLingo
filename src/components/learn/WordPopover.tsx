"use client";

import { useEffect, useRef } from "react";
import type { WordToken, DictionaryEntry, VocabularyItem } from "@/types";
import { lookupWord, getPosChinese } from "@/data/dictionary";

interface WordPopoverProps {
  token: WordToken;
  anchorRect: DOMRect;
  onClose: () => void;
  onAddToVocabulary: (item: Omit<VocabularyItem, "id" | "mastered">) => void;
  isInVocabulary: boolean;
}

export default function WordPopover({
  token,
  anchorRect,
  onClose,
  onAddToVocabulary,
  isInVocabulary,
}: WordPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  const entry: DictionaryEntry | null = lookupWord(
    token.surface_form,
    token.basic_form
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (!popoverRef.current) return;
    const el = popoverRef.current;
    const rect = el.getBoundingClientRect();

    if (rect.right > window.innerWidth - 16) {
      el.style.left = `${window.innerWidth - rect.width - 16}px`;
    }
    if (rect.bottom > window.innerHeight - 16) {
      el.style.top = `${anchorRect.top + window.scrollY - rect.height - 8}px`;
    }
  }, [anchorRect]);

  const posLabel = entry?.pos ?? getPosChinese(token.pos);
  const reading = entry?.reading ?? token.reading;
  const baseForm = entry?.baseForm ?? token.basic_form;
  const meaning = entry?.meaning;
  const detail = entry?.detail;
  const examples = entry?.examples;
  const level = entry?.level;

  const handleAdd = () => {
    onAddToVocabulary({
      word: baseForm,
      reading: reading,
      meaning: meaning ?? posLabel,
      level: level ?? "N3",
      partOfSpeech: posLabel,
      example: token.surface_form,
    });
  };

  return (
    <div
      ref={popoverRef}
      data-testid="word-popover"
      className="fixed z-[100] w-80 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        top: anchorRect.bottom + window.scrollY + 8,
        left: Math.max(16, anchorRect.left + anchorRect.width / 2 - 160),
      }}
    >
      {/* Arrow */}
      <div
        className="absolute -top-1.5 h-3 w-3 rotate-45 rounded-sm border-l border-t border-violet-200 bg-white dark:border-zinc-600 dark:bg-zinc-800"
        style={{
          left: Math.min(
            280,
            Math.max(
              20,
              anchorRect.left +
                anchorRect.width / 2 -
                Math.max(16, anchorRect.left + anchorRect.width / 2 - 160)
            )
          ),
        }}
      />

      <div className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-xl shadow-violet-100/50 dark:border-zinc-600 dark:bg-zinc-800 dark:shadow-black/30">
        {/* Header */}
        <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-pink-50 px-5 py-4 dark:border-zinc-700 dark:from-violet-900/20 dark:to-pink-900/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {token.surface_form}
                </span>
                {reading && (
                  <span className="text-sm text-violet-500 dark:text-violet-400">
                    {reading}
                  </span>
                )}
              </div>
              {baseForm !== token.surface_form && (
                <p className="mt-0.5 text-xs text-zinc-400">
                  原形：
                  <span className="font-medium text-zinc-600 dark:text-zinc-300">
                    {baseForm}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700"
              aria-label="Close"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
              {posLabel}
            </span>
            {token.pos_detail && (
              <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[11px] font-medium text-pink-600 dark:bg-pink-900/40 dark:text-pink-400">
                {token.pos_detail}
              </span>
            )}
            {level && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                {level}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {meaning ? (
            <>
              <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                {meaning}
              </p>
              {detail && (
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {detail}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-400 italic">
              暂无详细释义
            </p>
          )}

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                例句
              </p>
              {examples.map((ex, i) => (
                <p
                  key={i}
                  className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-300"
                >
                  {ex}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Add to vocabulary */}
        <div className="border-t border-zinc-100 px-5 py-3 dark:border-zinc-700">
          <button
            onClick={handleAdd}
            disabled={isInVocabulary}
            data-testid="add-to-vocabulary"
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
              isInVocabulary
                ? "cursor-default bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "bg-violet-600 text-white shadow-sm shadow-violet-200 hover:bg-violet-700 active:scale-[0.98] dark:shadow-violet-900/30"
            }`}
          >
            {isInVocabulary ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                已在生词本中
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                加入生词本
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
