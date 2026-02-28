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
      className="rounded-[2.5rem] bg-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center gap-1 border-b border-white/10 px-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`notebook-tab-${tab.id}`}
            className={`relative px-4 py-3.5 text-sm font-extrabold transition-colors ${
              activeTab === tab.id
                ? "text-lemon"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab.label}
            <span className="ml-1 text-[11px] text-white/30">{tab.count}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-lemon" />
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
                className="flex items-center gap-3 rounded-[1.5rem] bg-white/5 px-4 py-3"
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-white">{v.word}</span>
                    <span className="text-sm font-bold text-white/40">{v.reading}</span>
                  </div>
                  <p className="text-sm font-semibold text-white/50">{v.meaning}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-black text-white/40">
                  {v.level}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "grammar" && (
          <div className="space-y-2">
            {grammar.map((g) => (
              <div key={g.id} className="rounded-[1.5rem] bg-white/5 px-4 py-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-lemon">{g.pattern}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black text-white/40">
                    {g.level}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-white/70">{g.meaning}</p>
                <p className="mt-1 text-xs font-semibold text-white/40">{g.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sentences" && (
          <div className="space-y-2">
            {sentences.map((s) => (
              <div key={s.id} className="rounded-[1.5rem] bg-white/5 px-4 py-3">
                <p className="text-base font-bold text-white">{s.japanese}</p>
                <p className="mt-0.5 text-sm font-semibold italic text-sky">{s.romaji}</p>
                <p className="text-sm font-semibold text-white/50">{s.english}</p>
                <span className="mt-2 inline-block rounded-full bg-lemon/15 px-3 py-0.5 text-[10px] font-black text-lemon">
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
