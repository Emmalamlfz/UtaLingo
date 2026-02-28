"use client";

import { useState, useMemo } from "react";
import { songs } from "@/data/songs";
import { VocabularyItem, GrammarPoint, SentencePattern } from "@/types";

type ReviewTab = "vocabulary" | "grammar" | "sentences";

export default function ReviewSection() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("vocabulary");
  const [showMastered, setShowMastered] = useState(false);

  const allVocabulary = useMemo(
    () => songs.flatMap((s) => s.vocabulary),
    []
  );
  const allGrammar = useMemo(() => songs.flatMap((s) => s.grammar), []);
  const allSentences = useMemo(
    () => songs.flatMap((s) => s.sentences),
    []
  );

  const [vocabState, setVocabState] = useState<Record<string, boolean>>({});
  const [grammarState, setGrammarState] = useState<Record<string, boolean>>({});
  const [sentenceState, setSentenceState] = useState<Record<string, boolean>>(
    {}
  );
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMastered = (
    id: string,
    setState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVocab = showMastered
    ? allVocabulary
    : allVocabulary.filter((v) => !vocabState[v.id]);
  const filteredGrammar = showMastered
    ? allGrammar
    : allGrammar.filter((g) => !grammarState[g.id]);
  const filteredSentences = showMastered
    ? allSentences
    : allSentences.filter((s) => !sentenceState[s.id]);

  const tabs: { id: ReviewTab; label: string; count: number; total: number }[] =
    [
      {
        id: "vocabulary",
        label: "単語",
        count: filteredVocab.length,
        total: allVocabulary.length,
      },
      {
        id: "grammar",
        label: "文法",
        count: filteredGrammar.length,
        total: allGrammar.length,
      },
      {
        id: "sentences",
        label: "句式",
        count: filteredSentences.length,
        total: allSentences.length,
      },
    ];

  const masteredVocabCount = Object.values(vocabState).filter(Boolean).length;
  const masteredGrammarCount = Object.values(grammarState).filter(Boolean).length;
  const masteredSentenceCount = Object.values(sentenceState).filter(Boolean).length;
  const totalMastered = masteredVocabCount + masteredGrammarCount + masteredSentenceCount;
  const totalItems = allVocabulary.length + allGrammar.length + allSentences.length;

  return (
    <div data-testid="review-section" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            復習
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            単語・文法・句式をカードで復習しよう
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
            {totalMastered}
            <span className="text-base font-normal text-zinc-400">
              /{totalItems}
            </span>
          </p>
          <p className="text-xs text-zinc-400">マスター済み</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
          style={{
            width: `${totalItems > 0 ? (totalMastered / totalItems) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Tabs + filter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`review-tab-${tab.id}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[11px] text-zinc-400">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-500">
          <input
            type="checkbox"
            checked={showMastered}
            onChange={(e) => setShowMastered(e.target.checked)}
            data-testid="toggle-show-mastered"
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          マスター済みを表示
        </label>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activeTab === "vocabulary" &&
          filteredVocab.map((v) => (
            <VocabularyCard
              key={v.id}
              item={v}
              flipped={flippedCards.has(v.id)}
              mastered={!!vocabState[v.id]}
              onFlip={() => toggleFlip(v.id)}
              onToggleMastered={() => toggleMastered(v.id, setVocabState)}
            />
          ))}

        {activeTab === "grammar" &&
          filteredGrammar.map((g) => (
            <GrammarCard
              key={g.id}
              item={g}
              flipped={flippedCards.has(g.id)}
              mastered={!!grammarState[g.id]}
              onFlip={() => toggleFlip(g.id)}
              onToggleMastered={() => toggleMastered(g.id, setGrammarState)}
            />
          ))}

        {activeTab === "sentences" &&
          filteredSentences.map((s) => (
            <SentenceCard
              key={s.id}
              item={s}
              flipped={flippedCards.has(s.id)}
              mastered={!!sentenceState[s.id]}
              onFlip={() => toggleFlip(s.id)}
              onToggleMastered={() => toggleMastered(s.id, setSentenceState)}
            />
          ))}
      </div>
    </div>
  );
}

function VocabularyCard({
  item,
  flipped,
  mastered,
  onFlip,
  onToggleMastered,
}: {
  item: VocabularyItem;
  flipped: boolean;
  mastered: boolean;
  onFlip: () => void;
  onToggleMastered: () => void;
}) {
  return (
    <div
      className={`relative cursor-pointer rounded-2xl border p-5 transition-all ${
        mastered
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-900/10"
          : "border-zinc-200/60 bg-white hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50"
      }`}
    >
      <div onClick={onFlip} data-testid={`vocab-card-${item.id}`}>
        {!flipped ? (
          <div className="text-center">
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {item.word}
            </p>
            <p className="mt-2 text-sm text-zinc-400">タップして答えを見る</p>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {item.word}
              </span>
              <span className="text-base text-zinc-400">{item.reading}</span>
            </div>
            <p className="mt-2 text-lg text-violet-600 dark:text-violet-400">
              {item.meaning}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {item.partOfSpeech} · {item.level}
            </p>
            <p className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {item.example}
            </p>
          </div>
        )}
      </div>
      <button
        onClick={onToggleMastered}
        data-testid={`master-vocab-${item.id}`}
        className={`absolute right-3 top-3 rounded-full p-1.5 transition-colors ${
          mastered
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            : "bg-zinc-100 text-zinc-400 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-zinc-700"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}

function GrammarCard({
  item,
  flipped,
  mastered,
  onFlip,
  onToggleMastered,
}: {
  item: GrammarPoint;
  flipped: boolean;
  mastered: boolean;
  onFlip: () => void;
  onToggleMastered: () => void;
}) {
  return (
    <div
      className={`relative cursor-pointer rounded-2xl border p-5 transition-all ${
        mastered
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-900/10"
          : "border-zinc-200/60 bg-white hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50"
      }`}
    >
      <div onClick={onFlip} data-testid={`grammar-card-${item.id}`}>
        {!flipped ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">
              {item.pattern}
            </p>
            <p className="mt-2 text-sm text-zinc-400">タップして答えを見る</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold text-violet-700 dark:text-violet-400">
              {item.pattern}
            </p>
            <p className="mt-1 text-base font-medium text-zinc-900 dark:text-zinc-100">
              {item.meaning}
            </p>
            <p className="mt-2 text-sm text-zinc-500">{item.explanation}</p>
            <p className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {item.example}
            </p>
            <span className="mt-2 inline-block text-xs text-zinc-400">
              {item.level}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={onToggleMastered}
        data-testid={`master-grammar-${item.id}`}
        className={`absolute right-3 top-3 rounded-full p-1.5 transition-colors ${
          mastered
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            : "bg-zinc-100 text-zinc-400 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-zinc-700"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}

function SentenceCard({
  item,
  flipped,
  mastered,
  onFlip,
  onToggleMastered,
}: {
  item: SentencePattern;
  flipped: boolean;
  mastered: boolean;
  onFlip: () => void;
  onToggleMastered: () => void;
}) {
  return (
    <div
      className={`relative cursor-pointer rounded-2xl border p-5 transition-all ${
        mastered
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-900/10"
          : "border-zinc-200/60 bg-white hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50"
      }`}
    >
      <div onClick={onFlip} data-testid={`sentence-card-${item.id}`}>
        {!flipped ? (
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {item.japanese}
            </p>
            <p className="mt-2 text-sm text-zinc-400">タップして答えを見る</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {item.japanese}
            </p>
            <p className="mt-1 text-sm italic text-pink-500">{item.romaji}</p>
            <p className="mt-1 text-base text-zinc-600 dark:text-zinc-300">
              {item.english}
            </p>
            <span className="mt-3 inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-medium text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
              {item.keyGrammar}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={onToggleMastered}
        data-testid={`master-sentence-${item.id}`}
        className={`absolute right-3 top-3 rounded-full p-1.5 transition-colors ${
          mastered
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            : "bg-zinc-100 text-zinc-400 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-zinc-700"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}
