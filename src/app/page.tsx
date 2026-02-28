"use client";

import { useState } from "react";
import { Song, TabId } from "@/types";
import Navigation from "@/components/shared/Navigation";
import DiscoverSection from "@/components/discover/DiscoverSection";
import LearnSection from "@/components/learn/LearnSection";
import ReviewSection from "@/components/review/ReviewSection";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("discover");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setActiveTab("learn");
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {activeTab === "discover" && (
          <DiscoverSection onSongSelect={handleSongSelect} />
        )}
        {activeTab === "learn" && <LearnSection song={selectedSong} />}
        {activeTab === "review" && <ReviewSection />}
      </main>
    </div>
  );
}
