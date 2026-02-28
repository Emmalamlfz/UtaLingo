"use client";

import { JLPTLevel, Genre } from "@/types";

interface CategoryFilterProps {
  selectedLevel: JLPTLevel | "all";
  selectedGenre: Genre | "all";
  selectedArtist: string;
  artists: string[];
  onLevelChange: (level: JLPTLevel | "all") => void;
  onGenreChange: (genre: Genre | "all") => void;
  onArtistChange: (artist: string) => void;
}

const levels: (JLPTLevel | "all")[] = ["all", "N5", "N4", "N3", "N2", "N1"];
const genres: (Genre | "all")[] = [
  "all",
  "J-Pop",
  "J-Rock",
  "Anime",
  "Ballad",
  "Hip-Hop",
  "Folk",
  "Enka",
];

export default function CategoryFilter({
  selectedLevel,
  selectedGenre,
  selectedArtist,
  artists,
  onLevelChange,
  onGenreChange,
  onArtistChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-5">
      {/* Level */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-white/40">
          レベル
        </label>
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level)}
              data-testid={`filter-level-${level}`}
              className={`rounded-[2rem] px-4 py-2 text-xs font-black transition-all duration-200 ${
                selectedLevel === level
                  ? "bg-lemon text-dark shadow-md shadow-lemon/30 scale-105"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {level === "all" ? "ALL" : level}
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-white/40">
          ジャンル
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              data-testid={`filter-genre-${genre}`}
              className={`rounded-[2rem] px-4 py-2 text-xs font-black transition-all duration-200 ${
                selectedGenre === genre
                  ? "bg-lemon text-dark shadow-md shadow-lemon/30 scale-105"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {genre === "all" ? "ALL" : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Artist */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-white/40">
          アーティスト
        </label>
        <select
          value={selectedArtist}
          onChange={(e) => onArtistChange(e.target.value)}
          data-testid="filter-artist"
          className="w-full rounded-[2rem] border-2 border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white outline-none transition-all focus:border-lemon focus:ring-2 focus:ring-lemon/30"
        >
          <option value="all" className="bg-magenta-dark text-white">
            全てのアーティスト
          </option>
          {artists.map((artist) => (
            <option
              key={artist}
              value={artist}
              className="bg-magenta-dark text-white"
            >
              {artist}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
