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
    <div className="space-y-4">
      {/* Level Filter */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          日本語レベル
        </label>
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level)}
              data-testid={`filter-level-${level}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedLevel === level
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {level === "all" ? "全て" : level}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Filter */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          ジャンル
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              data-testid={`filter-genre-${genre}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedGenre === genre
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {genre === "all" ? "全て" : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Artist Filter */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          アーティスト
        </label>
        <select
          value={selectedArtist}
          onChange={(e) => onArtistChange(e.target.value)}
          data-testid="filter-artist"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">全てのアーティスト</option>
          {artists.map((artist) => (
            <option key={artist} value={artist}>
              {artist}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
