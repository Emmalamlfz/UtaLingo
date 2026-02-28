import { Song } from "@/types";

interface SongCardProps {
  song: Song;
  onSelect: (song: Song) => void;
}

const levelColors: Record<string, string> = {
  N5: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  N4: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  N3: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  N2: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  N1: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};

const genreEmojis: Record<string, string> = {
  "J-Pop": "🎤",
  "J-Rock": "🎸",
  Anime: "🎬",
  Ballad: "🎹",
  "Hip-Hop": "🎧",
  Folk: "🪕",
  Enka: "🎶",
};

export default function SongCard({ song, onSelect }: SongCardProps) {
  return (
    <button
      onClick={() => onSelect(song)}
      data-testid={`song-card-${song.id}`}
      className="group flex w-full flex-col rounded-2xl border border-zinc-200/60 bg-white p-5 text-left transition-all hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/50 dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:hover:border-violet-600 dark:hover:shadow-violet-900/20"
    >
      <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 text-4xl dark:from-violet-900/30 dark:to-pink-900/30">
        {genreEmojis[song.genre] ?? "🎵"}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-zinc-900 group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-400">
            {song.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">
            {song.artist}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${levelColors[song.level]}`}
        >
          {song.level}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
        <span>{song.genre}</span>
        <span>·</span>
        <span>{song.duration}</span>
        <span>·</span>
        <span>{song.vocabulary.length} 単語</span>
      </div>
    </button>
  );
}
