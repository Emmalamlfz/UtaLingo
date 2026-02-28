"use client";

import { useState, useMemo } from "react";
import { songs } from "@/data/songs";
import { VocabularyItem, GrammarPoint, SentencePattern } from "@/types";
import { BlobStar } from "@/components/shared/Blobs";

type ReviewTab = "vocabulary" | "grammar" | "sentences";

export default function ReviewSection() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("vocabulary");
  const [showMastered, setShowMastered] = useState(false);

  const allVocabulary = useMemo(() => songs.flatMap((s) => s.vocabulary), []);
  const allGrammar = useMemo(() => songs.flatMap((s) => s.grammar), []);
  const allSentences = useMemo(() => songs.flatMap((s) => s.sentences), []);

  const [vocabState, setVocabState] = useState<Record<string, boolean>>({});
  const [grammarState, setGrammarState] = useState<Record<string, boolean>>({});
  const [sentenceState, setSentenceState] = useState<Record<string, boolean>>({});
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

  const tabs: { id: ReviewTab; label: string; count: number; total: number }[] = [
    { id: "vocabulary", label: "単語", count: filteredVocab.length, total: allVocabulary.length },
    { id: "grammar", label: "文法", count: filteredGrammar.length, total: allGrammar.length },
    { id: "sentences", label: "句式", count: filteredSentences.length, total: allSentences.length },
  ];

  const masteredVocabCount = Object.values(vocabState).filter(Boolean).length;
  const masteredGrammarCount = Object.values(grammarState).filter(Boolean).length;
  const masteredSentenceCount = Object.values(sentenceState).filter(Boolean).length;
  const totalMastered = masteredVocabCount + masteredGrammarCount + masteredSentenceCount;
  const totalItems = allVocabulary.length + allGrammar.length + allSentences.length;

  return (
    <div data-testid="review-section" className="space-y-6">
      {/* Header */}
      <div className="relative flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white">復習</h2>
          <p className="mt-1 text-sm font-bold text-white/40">
            カードをタップして学ぼう！ 💪
          </p>
        </div>
        <BlobStar className="blob-float absolute -right-4 -top-6 h-16 w-16 text-lemon/20" />
        <div className="text-right">
          <p className="text-4xl font-black text-lemon">
            {totalMastered}
            <span className="text-lg font-bold text-white/30">/{totalItems}</span>
          </p>
          <p className="text-xs font-black text-white/30">マスター</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-3 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lemon to-mint transition-all duration-500"
          style={{ width: `${totalItems > 0 ? (totalMastered / totalItems) * 100 : 0}%` }}
        />
      </div>

      {/* Tabs + filter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 rounded-[2rem] bg-white/8 p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`review-tab-${tab.id}`}
              className={`rounded-[1.5rem] px-5 py-2.5 text-sm font-extrabold transition-all ${
                activeTab === tab.id
                  ? "bg-lemon text-dark shadow-md shadow-lemon/30"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              <span className="ml-1 text-[11px] opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-white/40">
          <input
            type="checkbox"
            checked={showMastered}
            onChange={(e) => setShowMastered(e.target.checked)}
            data-testid="toggle-show-mastered"
            className="h-4 w-4 rounded-lg border-white/30 bg-white/10 text-lemon focus:ring-lemon/30"
          />
          全表示
        </label>
      </div>

      {/* Cards grid */}
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
  item, flipped, mastered, onFlip, onToggleMastered,
}: { item: VocabularyItem; flipped: boolean; mastered: boolean; onFlip: () => void; onToggleMastered: () => void; }) {
  return (
    <div className={`relative rounded-[2rem] p-5 transition-all hover-lift ${
      mastered ? "bg-mint/15 ring-2 ring-mint/30" : "bg-white/10 hover:bg-white/15"
    }`}>
      <div onClick={onFlip} className="cursor-pointer" data-testid={`vocab-card-${item.id}`}>
        {!flipped ? (
          <div className="text-center py-4">
            <p className="text-3xl font-black text-white">{item.word}</p>
            <p className="mt-3 text-xs font-bold text-white/30">タップ 👆</p>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">{item.word}</span>
              <span className="text-base font-bold text-white/40">{item.reading}</span>
            </div>
            <p className="mt-2 text-lg font-extrabold text-lemon">{item.meaning}</p>
            <p className="mt-1 text-xs font-bold text-white/30">{item.partOfSpeech} · {item.level}</p>
            <p className="mt-3 rounded-[1rem] bg-white/5 px-4 py-2 text-sm font-semibold text-white/50">
              {item.example}
            </p>
          </div>
        )}
      </div>
      <button
        onClick={onToggleMastered}
        data-testid={`master-vocab-${item.id}`}
        className={`absolute right-4 top-4 rounded-full p-2 transition-all ${
          mastered
            ? "bg-mint text-dark shadow-md shadow-mint/30"
            : "bg-white/10 text-white/30 hover:bg-mint/20 hover:text-mint"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}

function GrammarCard({
  item, flipped, mastered, onFlip, onToggleMastered,
}: { item: GrammarPoint; flipped: boolean; mastered: boolean; onFlip: () => void; onToggleMastered: () => void; }) {
  return (
    <div className={`relative rounded-[2rem] p-5 transition-all hover-lift ${
      mastered ? "bg-mint/15 ring-2 ring-mint/30" : "bg-white/10 hover:bg-white/15"
    }`}>
      <div onClick={onFlip} className="cursor-pointer" data-testid={`grammar-card-${item.id}`}>
        {!flipped ? (
          <div className="text-center py-4">
            <p className="text-2xl font-black text-lavender">{item.pattern}</p>
            <p className="mt-3 text-xs font-bold text-white/30">タップ 👆</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-black text-lavender">{item.pattern}</p>
            <p className="mt-1 text-base font-extrabold text-white">{item.meaning}</p>
            <p className="mt-2 text-sm font-semibold text-white/40">{item.explanation}</p>
            <p className="mt-3 rounded-[1rem] bg-white/5 px-4 py-2 text-sm font-semibold text-white/50">
              {item.example}
            </p>
            <span className="mt-2 inline-block text-xs font-black text-white/30">{item.level}</span>
          </div>
        )}
      </div>
      <button
        onClick={onToggleMastered}
        data-testid={`master-grammar-${item.id}`}
        className={`absolute right-4 top-4 rounded-full p-2 transition-all ${
          mastered
            ? "bg-mint text-dark shadow-md shadow-mint/30"
            : "bg-white/10 text-white/30 hover:bg-mint/20 hover:text-mint"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}

function SentenceCard({
  item, flipped, mastered, onFlip, onToggleMastered,
}: { item: SentencePattern; flipped: boolean; mastered: boolean; onFlip: () => void; onToggleMastered: () => void; }) {
  return (
    <div className={`relative rounded-[2rem] p-5 transition-all hover-lift ${
      mastered ? "bg-mint/15 ring-2 ring-mint/30" : "bg-white/10 hover:bg-white/15"
    }`}>
      <div onClick={onFlip} className="cursor-pointer" data-testid={`sentence-card-${item.id}`}>
        {!flipped ? (
          <div className="text-center py-4">
            <p className="text-lg font-black text-white">{item.japanese}</p>
            <p className="mt-3 text-xs font-bold text-white/30">タップ 👆</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-black text-white">{item.japanese}</p>
            <p className="mt-1 text-sm font-semibold italic text-sky">{item.romaji}</p>
            <p className="mt-1 text-base font-bold text-white/60">{item.english}</p>
            <span className="mt-3 inline-block rounded-full bg-lemon/15 px-3 py-0.5 text-[11px] font-black text-lemon">
              {item.keyGrammar}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={onToggleMastered}
        data-testid={`master-sentence-${item.id}`}
        className={`absolute right-4 top-4 rounded-full p-2 transition-all ${
          mastered
            ? "bg-mint text-dark shadow-md shadow-mint/30"
            : "bg-white/10 text-white/30 hover:bg-mint/20 hover:text-mint"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}
