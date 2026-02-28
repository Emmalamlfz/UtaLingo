"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { VocabularyItem } from "@/types";

const STORAGE_KEY = "utalingo-wordbook";

function writeStorage(items: VocabularyItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded */
  }
}

let listeners: Array<() => void> = [];
let cachedJson = "";
let cachedValue: VocabularyItem[] = [];

function getSnapshot(): VocabularyItem[] {
  const raw = typeof window !== "undefined"
    ? localStorage.getItem(STORAGE_KEY) ?? "[]"
    : "[]";
  if (raw !== cachedJson) {
    cachedJson = raw;
    try {
      cachedValue = JSON.parse(raw);
    } catch {
      cachedValue = [];
    }
  }
  return cachedValue;
}

function getServerSnapshot(): VocabularyItem[] {
  return [];
}

function subscribe(listener: () => void): () => void {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange(next: VocabularyItem[]) {
  writeStorage(next);
  cachedJson = JSON.stringify(next);
  cachedValue = next;
  for (const l of listeners) l();
}

export function useVocabularyStore() {
  const words = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const savedWordSet = new Set(words.map((w) => w.word));

  const addWord = useCallback(
    (item: Omit<VocabularyItem, "id" | "mastered">) => {
      const prev = getSnapshot();
      if (prev.some((w) => w.word === item.word)) return;
      const newItem: VocabularyItem = {
        ...item,
        id: `wb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        mastered: false,
      };
      emitChange([newItem, ...prev]);
    },
    []
  );

  const toggleMastered = useCallback((id: string) => {
    const prev = getSnapshot();
    emitChange(
      prev.map((w) => (w.id === id ? { ...w, mastered: !w.mastered } : w))
    );
  }, []);

  const removeWord = useCallback((id: string) => {
    const prev = getSnapshot();
    emitChange(prev.filter((w) => w.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    emitChange([]);
  }, []);

  const masteredCount = words.filter((w) => w.mastered).length;

  return {
    words,
    savedWordSet,
    masteredCount,
    addWord,
    toggleMastered,
    removeWord,
    clearAll,
  };
}
