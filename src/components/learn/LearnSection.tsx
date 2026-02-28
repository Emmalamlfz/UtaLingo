"use client";

import { useState } from "react";
import { Song } from "@/types";
import SearchBar from "./SearchBar";
import MusicPlayer from "./MusicPlayer";
import LyricsDisplay from "./LyricsDisplay";
import NotebookPreview from "./NotebookPreview";

interface LearnSectionProps {
  song: Song | null;
}

export default function LearnSection({ song }: LearnSectionProps) {
  const [currentTime, setCurrentTime] = useState(0);

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  if (!song) {
    return (
      <div data-testid="learn-section" className="space-y-6">
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-24 dark:border-zinc-700">
          <span className="text-5xl">🎧</span>
          <p className="mt-4 text-lg font-medium text-zinc-400">
            曲を選んで学習を始めましょう
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            「曲単推薦」タブから曲を選択するか、リンクを貼り付けてください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="learn-section" className="space-y-5">
      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Player */}
      <MusicPlayer
        song={song}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
      />

      {/* Lyrics */}
      <LyricsDisplay lyrics={song.lyrics} currentTime={currentTime} />

      {/* Notebook */}
      <NotebookPreview
        vocabulary={song.vocabulary}
        grammar={song.grammar}
        sentences={song.sentences}
      />
    </div>
  );
}
