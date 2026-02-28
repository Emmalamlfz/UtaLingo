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
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
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
      reading,
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
      className="fixed z-[100] w-80 animate-bounce-in"
      style={{
        top: anchorRect.bottom + window.scrollY + 10,
        left: Math.max(16, anchorRect.left + anchorRect.width / 2 - 160),
      }}
    >
      <div className="overflow-hidden rounded-[2rem] border-2 border-lemon/20 bg-magenta-dark shadow-2xl shadow-dark/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-lemon/15 to-mint/15 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {token.surface_form}
                </span>
                {reading && (
                  <span className="text-sm font-bold text-lemon">
                    {reading}
                  </span>
                )}
              </div>
              {baseForm !== token.surface_form && (
                <p className="mt-0.5 text-xs font-bold text-white/40">
                  原形：
                  <span className="text-white/70">{baseForm}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-lemon/20 px-3 py-0.5 text-[11px] font-black text-lemon">
              {posLabel}
            </span>
            {token.pos_detail && (
              <span className="rounded-full bg-sky/20 px-3 py-0.5 text-[11px] font-black text-sky">
                {token.pos_detail}
              </span>
            )}
            {level && (
              <span className="rounded-full bg-peach/20 px-3 py-0.5 text-[11px] font-black text-peach">
                {level}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {meaning ? (
            <>
              <p className="text-base font-extrabold text-white">{meaning}</p>
              {detail && (
                <p className="mt-1.5 text-sm font-semibold leading-relaxed text-white/50">
                  {detail}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm font-bold italic text-white/30">暂无详细释义</p>
          )}

          {examples && examples.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] font-black uppercase tracking-widest text-white/30">
                例句
              </p>
              {examples.map((ex, i) => (
                <p
                  key={i}
                  className="rounded-[1rem] bg-white/5 px-4 py-2 text-sm font-semibold text-white/60"
                >
                  {ex}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-3">
          <button
            onClick={handleAdd}
            disabled={isInVocabulary}
            data-testid="add-to-vocabulary"
            className={`flex w-full items-center justify-center gap-2 rounded-[1.5rem] py-3 text-sm font-black transition-all ${
              isInVocabulary
                ? "bg-mint/20 text-mint"
                : "bg-lemon text-dark shadow-md shadow-lemon/30 hover:brightness-110 active:scale-95"
            }`}
          >
            {isInVocabulary ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                已在生词本中
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
