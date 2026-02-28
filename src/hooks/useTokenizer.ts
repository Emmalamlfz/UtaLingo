"use client";

import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import type { WordToken, LyricLine } from "@/types";

type TokenMap = Record<number, WordToken[]>;

export function useTokenizer(lyrics: LyricLine[]) {
  const [tokenMap, setTokenMap] = useState<TokenMap>({});
  const [isPending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  const tokenizeLine = useCallback(
    async (text: string, signal?: AbortSignal): Promise<WordToken[]> => {
      const res = await fetch("/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal,
      });
      if (!res.ok) throw new Error("Tokenization failed");
      const data = await res.json();
      return data.tokens;
    },
    []
  );

  useEffect(() => {
    if (lyrics.length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const newMap: TokenMap = {};

    Promise.all(
      lyrics.map(async (line) => {
        try {
          const tokens = await tokenizeLine(line.japanese, controller.signal);
          newMap[line.id] = tokens;
        } catch {
          if (!controller.signal.aborted) {
            newMap[line.id] = [
              {
                surface_form: line.japanese,
                pos: "",
                pos_detail: "",
                basic_form: line.japanese,
                reading: "",
                pronunciation: "",
              },
            ];
          }
        }
      })
    ).then(() => {
      if (!controller.signal.aborted) {
        startTransition(() => {
          setTokenMap(newMap);
        });
      }
    });

    return () => controller.abort();
  }, [lyrics, tokenizeLine]);

  return { tokenMap, loading: isPending };
}
