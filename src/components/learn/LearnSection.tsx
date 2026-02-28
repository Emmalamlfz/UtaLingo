"use client";

import { useState, useCallback } from "react";
import type { Song, VocabularyItem } from "@/types";
import SearchBar from "./SearchBar";
import MusicPlayer from "./MusicPlayer";
import LyricsDisplay from "./LyricsDisplay";
import NotebookPreview from "./NotebookPreview";
import { BlobWink } from "@/components/shared/Blobs";

interface LearnSectionProps {
  song: Song | null;
  onWordSaved?: (item: VocabularyItem) => void;
}

export default function LearnSection({ song, onWordSaved }: LearnSectionProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [addedWords, setAddedWords] = useState<VocabularyItem[]>([]);

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const handleAddToVocabulary = useCallback(
    (item: Omit<VocabularyItem, "id" | "mastered">) => {
      const newItem: VocabularyItem = {
        ...item,
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        mastered: false,
      };
      setSavedWords((prev) => new Set([...prev, item.word]));
      setAddedWords((prev) => [...prev, newItem]);
      onWordSaved?.(newItem);
    },
    [onWordSaved]
  );

  if (!song) {
    return (
      <div data-testid="learn-section" className="space-y-6">
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/20 py-24">
          <BlobWink className="blob-float mb-4 h-24 w-24 text-lemon/50" />
          <p className="text-xl font-black text-white/60">
            曲を選んで学習スタート！
          </p>
          <p className="mt-2 text-sm font-bold text-white/30">
            「発見」タブから曲を選ぼう 🎵
          </p>
        </div>
      </div>
    );
  }

  const allVocabulary = [...song.vocabulary, ...addedWords];

  return (
    <div data-testid="learn-section" className="space-y-5">
      <SearchBar onSearch={handleSearch} />
      <MusicPlayer song={song} currentTime={currentTime} onTimeChange={setCurrentTime} />
      <LyricsDisplay
        lyrics={song.lyrics}
        currentTime={currentTime}
        onAddToVocabulary={handleAddToVocabulary}
        savedWords={savedWords}
      />
      <NotebookPreview
        vocabulary={allVocabulary}
        grammar={song.grammar}
        sentences={song.sentences}
      />
    </div>
  );
}
