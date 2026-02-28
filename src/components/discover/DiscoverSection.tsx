"use client";

import { useState, useMemo } from "react";
import { Song, JLPTLevel, Genre } from "@/types";
import { songs } from "@/data/songs";
import CategoryFilter from "./CategoryFilter";
import SongCard from "./SongCard";

interface DiscoverSectionProps {
  onSongSelect: (song: Song) => void;
}

export default function DiscoverSection({ onSongSelect }: DiscoverSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | "all">("all");
  const [selectedGenre, setSelectedGenre] = useState<Genre | "all">("all");
  const [selectedArtist, setSelectedArtist] = useState("all");

  const artists = useMemo(
    () => [...new Set(songs.map((s) => s.artist))],
    []
  );

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      if (selectedLevel !== "all" && song.level !== selectedLevel) return false;
      if (selectedGenre !== "all" && song.genre !== selectedGenre) return false;
      if (selectedArtist !== "all" && song.artist !== selectedArtist)
        return false;
      return true;
    });
  }, [selectedLevel, selectedGenre, selectedArtist]);

  return (
    <div data-testid="discover-section" className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          曲単推薦
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          レベル・ジャンル・アーティストで曲を探そう
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 dark:border-zinc-700/60 dark:bg-zinc-800/50">
        <CategoryFilter
          selectedLevel={selectedLevel}
          selectedGenre={selectedGenre}
          selectedArtist={selectedArtist}
          artists={artists}
          onLevelChange={setSelectedLevel}
          onGenreChange={setSelectedGenre}
          onArtistChange={setSelectedArtist}
        />
      </div>

      {filteredSongs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-lg text-zinc-400">条件に合う曲が見つかりません</p>
          <p className="mt-1 text-sm text-zinc-400">フィルターを変更してみてください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} onSelect={onSongSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
