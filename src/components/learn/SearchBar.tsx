"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative" data-testid="search-bar">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="YouTube / Spotify リンクまたは曲名..."
            data-testid="search-input"
            className="w-full rounded-[2rem] border-2 border-white/15 bg-white/10 py-3.5 pl-12 pr-5 text-sm font-bold text-white outline-none transition-all placeholder:text-white/30 focus:border-lemon focus:ring-2 focus:ring-lemon/30"
          />
        </div>
        <button
          type="submit"
          data-testid="search-submit"
          className="shrink-0 rounded-[2rem] bg-lemon px-7 py-3.5 text-sm font-black text-dark shadow-lg shadow-lemon/30 transition-all hover:brightness-110 active:scale-95"
        >
          検索
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/20 px-3 py-1 text-[11px] font-bold text-coral">
          ▶ YouTube
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-3 py-1 text-[11px] font-bold text-mint">
          ♫ Spotify
        </span>
      </div>
    </form>
  );
}
