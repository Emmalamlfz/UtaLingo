"use client";

import { useState, useMemo } from "react";
import { Song, JLPTLevel, Genre } from "@/types";
import { songs } from "@/data/songs";
import CategoryFilter from "./CategoryFilter";
import SongCard from "./SongCard";
import { BlobHappy, BlobNote } from "@/components/shared/Blobs";

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
      {/* Hero heading */}
      <div className="relative text-center">
        <BlobNote className="blob-float absolute -left-8 -top-4 h-16 w-16 text-lemon/30" />
        <BlobHappy className="blob-float-delay absolute -right-4 top-0 h-14 w-14 text-sky/30" />
        <h2 className="text-4xl font-black text-white">
          曲単推薦
        </h2>
        <p className="mt-2 text-base font-bold text-white/50">
          お気に入りの曲を見つけて学ぼう！ 🎶
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-[2.5rem] bg-white/8 p-6 backdrop-blur-sm">
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

      {/* Songs grid */}
      {filteredSongs.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-white/20 py-20 text-center">
          <span className="text-5xl">🤔</span>
          <p className="mt-4 text-lg font-bold text-white/50">
            条件に合う曲が見つかりません
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} onSelect={onSongSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
