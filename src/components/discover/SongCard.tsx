import { Song } from "@/types";

interface SongCardProps {
  song: Song;
  onSelect: (song: Song) => void;
}

const levelColors: Record<string, string> = {
  N5: "bg-mint text-dark",
  N4: "bg-sky text-dark",
  N3: "bg-lavender text-dark",
  N2: "bg-peach text-dark",
  N1: "bg-coral text-dark",
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

const circleColors = [
  "from-lemon to-mint",
  "from-sky to-lavender",
  "from-coral to-peach",
  "from-mint to-sky",
  "from-lavender to-coral",
  "from-peach to-lemon",
];

export default function SongCard({ song, onSelect }: SongCardProps) {
  const colorIdx = parseInt(song.id, 10) % circleColors.length;

  return (
    <button
      onClick={() => onSelect(song)}
      data-testid={`song-card-${song.id}`}
      className="group flex w-full flex-col items-center rounded-[2.5rem] bg-white/10 p-6 text-center transition-all duration-200 hover-lift hover:bg-white/15"
    >
      {/* Circle spotlight */}
      <div
        className={`mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${circleColors[colorIdx]} shadow-lg shadow-dark/20 transition-transform duration-300 group-hover:scale-105`}
      >
        <span className="text-5xl drop-shadow-sm">
          {genreEmojis[song.genre] ?? "🎵"}
        </span>
      </div>

      <h3 className="truncate text-lg font-extrabold text-white group-hover:text-lemon">
        {song.title}
      </h3>
      <p className="mt-0.5 truncate text-sm font-semibold text-white/60">
        {song.artist}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${levelColors[song.level]}`}
        >
          {song.level}
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60">
          {song.genre}
        </span>
      </div>
    </button>
  );
}
