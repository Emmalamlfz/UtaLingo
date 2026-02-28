"use client";

import { useState } from "react";
import type { Song } from "@/types";
import type { useVocabularyStore } from "@/hooks/useVocabularyStore";
import SearchBar from "./SearchBar";
import MusicPlayer from "./MusicPlayer";
import LyricsDisplay from "./LyricsDisplay";
import NotebookPreview from "./NotebookPreview";
import SmartWordbook from "./SmartWordbook";
import { BlobWink } from "@/components/shared/Blobs";

interface LearnSectionProps {
  song: Song | null;
  vocabStore: ReturnType<typeof useVocabularyStore>;
}

export default function LearnSection({ song, vocabStore }: LearnSectionProps) {
  const [currentTime, setCurrentTime] = useState(0);

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

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

        {/* Show wordbook even when no song is selected */}
        {vocabStore.words.length > 0 && (
          <SmartWordbook
            words={vocabStore.words}
            masteredCount={vocabStore.masteredCount}
            onToggleMastered={vocabStore.toggleMastered}
            onRemove={vocabStore.removeWord}
            onClearAll={vocabStore.clearAll}
          />
        )}
      </div>
    );
  }

  return (
    <div data-testid="learn-section" className="space-y-5">
      <SearchBar onSearch={handleSearch} />
      <MusicPlayer
        song={song}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
      />
      <LyricsDisplay
        lyrics={song.lyrics}
        currentTime={currentTime}
        onAddToVocabulary={vocabStore.addWord}
        savedWords={vocabStore.savedWordSet}
      />
      <NotebookPreview
        vocabulary={song.vocabulary}
        grammar={song.grammar}
        sentences={song.sentences}
      />
      <SmartWordbook
        words={vocabStore.words}
        masteredCount={vocabStore.masteredCount}
        onToggleMastered={vocabStore.toggleMastered}
        onRemove={vocabStore.removeWord}
        onClearAll={vocabStore.clearAll}
      />
    </div>
  );
}
