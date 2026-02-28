"use client";

import { TabId } from "@/types";

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "discover", label: "発見", icon: "🎵" },
  { id: "learn", label: "学習", icon: "📖" },
  { id: "review", label: "復習", icon: "🔄" },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-magenta-dark/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎤</span>
          <h1 className="text-2xl font-black tracking-tight text-lemon">
            UtaLingo
          </h1>
        </div>
        <div className="flex gap-2 rounded-[2rem] bg-dark/30 p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              data-testid={`tab-${tab.id}`}
              className={`flex items-center gap-1.5 rounded-[1.5rem] px-5 py-2.5 text-sm font-extrabold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-lemon text-dark shadow-lg shadow-lemon/30 pop-in"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
