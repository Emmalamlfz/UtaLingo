"use client";

import { useState } from "react";
import { VocabularyItem, GrammarPoint, SentencePattern } from "@/types";

interface NotebookPreviewProps {
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  sentences: SentencePattern[];
}

type NoteTab = "vocabulary" | "grammar" | "sentences";

export default function NotebookPreview({
  vocabulary,
  grammar,
  sentences,
}: NotebookPreviewProps) {
  const [activeTab, setActiveTab] = useState<NoteTab>("vocabulary");

  const tabs: { id: NoteTab; label: string; count: number }[] = [
    { id: "vocabulary", label: "単語", count: vocabulary.length },
    { id: "grammar", label: "文法", count: grammar.length },
    { id: "sentences", label: "句式", count: sentences.length },
  ];

  return (
    <div
      data-testid="notebook-preview"
      className="rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50"
    >
      <div className="flex items-center gap-1 border-b border-zinc-100 px-4 dark:border-zinc-700/60">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`notebook-tab-${tab.id}`}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-violet-700 dark:text-violet-400"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[11px] text-zinc-400">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-violet-600" />
            )}
          </button>
        ))}
      </div>

      <div className="max-h-64 overflow-y-auto p-4">
        {activeTab === "vocabulary" && (
          <div className="space-y-2">
            {vocabulary.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800"
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {v.word}
                    </span>
                    <span className="text-sm text-zinc-400">{v.reading}</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {v.meaning}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                  {v.level}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "grammar" && (
          <div className="space-y-2">
            {grammar.map((g) => (
              <div
                key={g.id}
                className="rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold text-violet-700 dark:text-violet-400">
                    {g.pattern}
                  </span>
                  <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                    {g.level}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {g.meaning}
                </p>
                <p className="mt-1 text-xs text-zinc-400">{g.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sentences" && (
          <div className="space-y-2">
            {sentences.map((s) => (
              <div
                key={s.id}
                className="rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800"
              >
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                  {s.japanese}
                </p>
                <p className="mt-0.5 text-sm italic text-pink-500">
                  {s.romaji}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {s.english}
                </p>
                <span className="mt-2 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                  {s.keyGrammar}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
