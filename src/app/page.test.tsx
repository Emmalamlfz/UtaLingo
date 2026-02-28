import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";
import type { WordToken } from "@/types";

const mockTokens: Record<string, WordToken[]> = {
  "夢ならばどれほどよかったでしょう": [
    { surface_form: "夢", pos: "名詞", pos_detail: "一般", basic_form: "夢", reading: "ユメ", pronunciation: "ユメ" },
    { surface_form: "なら", pos: "助詞", pos_detail: "接続助詞", basic_form: "なら", reading: "ナラ", pronunciation: "ナラ" },
    { surface_form: "ば", pos: "助詞", pos_detail: "接続助詞", basic_form: "ば", reading: "バ", pronunciation: "バ" },
    { surface_form: "どれほど", pos: "副詞", pos_detail: "一般", basic_form: "どれほど", reading: "ドレホド", pronunciation: "ドレホド" },
    { surface_form: "よかっ", pos: "形容詞", pos_detail: "自立", basic_form: "よい", reading: "ヨカッ", pronunciation: "ヨカッ" },
    { surface_form: "た", pos: "助動詞", pos_detail: "", basic_form: "た", reading: "タ", pronunciation: "タ" },
    { surface_form: "でしょ", pos: "助動詞", pos_detail: "", basic_form: "でしょう", reading: "デショ", pronunciation: "デショ" },
    { surface_form: "う", pos: "助動詞", pos_detail: "", basic_form: "う", reading: "ウ", pronunciation: "ウ" },
  ],
};

function createFallbackTokens(text: string): WordToken[] {
  return [{ surface_form: text, pos: "", pos_detail: "", basic_form: text, reading: "", pronunciation: "" }];
}

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();

  globalThis.fetch = vi.fn(
    (input: string | URL | Request, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      if (url.includes("/api/tokenize")) {
        return Promise.resolve({
          ok: true,
          json: async () => {
            const rawBody =
              init?.body ?? (input instanceof Request ? await input.text() : "{}");
            const bodyStr = typeof rawBody === "string" ? rawBody : "{}";
            const { text } = JSON.parse(bodyStr);
            return { tokens: mockTokens[text] ?? createFallbackTokens(text) };
          },
        } as Response);
      }
      return Promise.reject(new Error("Not mocked"));
    }
  );
});

describe("Home Page", () => {
  it("renders the UtaLingo navigation", () => {
    render(<Home />);
    expect(screen.getByText("UtaLingo")).toBeInTheDocument();
  });

  it("shows the Discover section by default", () => {
    render(<Home />);
    const section = screen.getByTestId("discover-section");
    expect(section).toBeInTheDocument();
    expect(within(section).getByText("曲単推薦")).toBeInTheDocument();
  });

  it("displays song cards in the Discover section", () => {
    render(<Home />);
    expect(screen.getByTestId("song-card-1")).toBeInTheDocument();
    expect(screen.getByText("Lemon")).toBeInTheDocument();
  });

  it("filters songs by JLPT level", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("filter-level-N5"));
    expect(screen.getByText("世界に一つだけの花")).toBeInTheDocument();
    expect(screen.queryByText("Lemon")).not.toBeInTheDocument();
  });

  it("navigates to Learn tab when a song is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));
    expect(screen.getByTestId("learn-section")).toBeInTheDocument();
    expect(screen.getByTestId("music-player")).toBeInTheDocument();
    expect(screen.getByTestId("lyrics-display")).toBeInTheDocument();
    expect(screen.getByTestId("notebook-preview")).toBeInTheDocument();
  });

  it("switches tabs via navigation", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("tab-review"));
    expect(screen.getByTestId("review-section")).toBeInTheDocument();

    await user.click(screen.getByTestId("tab-discover"));
    expect(screen.getByTestId("discover-section")).toBeInTheDocument();
  });

  it("shows the Review section with vocabulary cards", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("tab-review"));
    const reviewSection = screen.getByTestId("review-section");
    expect(within(reviewSection).getByText("復習")).toBeInTheDocument();
    expect(within(reviewSection).getByTestId("review-tab-vocabulary")).toBeInTheDocument();
  });

  it("flips a vocabulary card in Review to show details", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("tab-review"));
    const card = screen.getByTestId("vocab-card-v1");
    expect(screen.getByText("夢")).toBeInTheDocument();

    await user.click(card);
    expect(screen.getByText("dream")).toBeInTheDocument();
  });

  it("shows lyrics toggle switches in Learn section", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));
    expect(screen.getByTestId("toggle-furigana")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-romaji")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-translation")).toBeInTheDocument();

    const furiganaBtn = screen.getByTestId("toggle-furigana-btn");
    expect(furiganaBtn).toHaveAttribute("aria-checked", "false");

    await user.click(furiganaBtn);
    expect(furiganaBtn).toHaveAttribute("aria-checked", "true");
  });

  it("switches notebook tabs between vocabulary, grammar, sentences", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));
    const notebook = screen.getByTestId("notebook-preview");

    await user.click(within(notebook).getByTestId("notebook-tab-grammar"));
    expect(within(notebook).getByText("〜ならば")).toBeInTheDocument();

    await user.click(within(notebook).getByTestId("notebook-tab-sentences"));
    expect(within(notebook).getByText("〜ならば (conditional)")).toBeInTheDocument();
  });

  it("tokenizes lyrics and renders clickable words after loading", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));

    await waitFor(() => {
      expect(screen.getByTestId("word-夢-0")).toBeInTheDocument();
    });
  });

  it("opens word popover when clicking a tokenized word", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));

    await waitFor(() => {
      expect(screen.getByTestId("word-夢-0")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("word-夢-0"));

    expect(screen.getByTestId("word-popover")).toBeInTheDocument();
    expect(screen.getByText("梦；梦想")).toBeInTheDocument();
    expect(screen.getByTestId("add-to-vocabulary")).toBeInTheDocument();
  });

  it("closes popover on Escape key", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));

    await waitFor(() => {
      expect(screen.getByTestId("word-夢-0")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("word-夢-0"));
    expect(screen.getByTestId("word-popover")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("word-popover")).not.toBeInTheDocument();
  });
});

describe("Smart Wordbook with LocalStorage", () => {
  it("adds a word to the smart wordbook via popover and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));

    await waitFor(() => {
      expect(screen.getByTestId("word-夢-0")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("word-夢-0"));
    await user.click(screen.getByTestId("add-to-vocabulary"));

    expect(screen.getByText("已在生词本中")).toBeInTheDocument();

    const wordbook = screen.getByTestId("smart-wordbook");
    expect(wordbook).toBeInTheDocument();
    expect(within(wordbook).getByText("夢")).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem("utalingo-wordbook") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].word).toBe("夢");
    expect(stored[0].mastered).toBe(false);
  });

  it("marks a word as mastered with strikethrough and persists state", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));

    await waitFor(() => {
      expect(screen.getByTestId("word-夢-0")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("word-夢-0"));
    await user.click(screen.getByTestId("add-to-vocabulary"));
    await user.keyboard("{Escape}");

    const wordbook = screen.getByTestId("smart-wordbook");
    const rows = within(wordbook).getAllByTestId(/^wordbook-row-/);
    const checkBtn = within(rows[0]).getByTestId(/^wordbook-check-/);

    await user.click(checkBtn);

    const stored = JSON.parse(localStorage.getItem("utalingo-wordbook") ?? "[]");
    expect(stored[0].mastered).toBe(true);
  });

  it("removes a word from the wordbook", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));

    await waitFor(() => {
      expect(screen.getByTestId("word-夢-0")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("word-夢-0"));
    await user.click(screen.getByTestId("add-to-vocabulary"));
    await user.keyboard("{Escape}");

    const wordbook = screen.getByTestId("smart-wordbook");
    const rows = within(wordbook).getAllByTestId(/^wordbook-row-/);
    const removeBtn = within(rows[0]).getByTestId(/^wordbook-remove-/);

    await user.click(removeBtn);

    const stored = JSON.parse(localStorage.getItem("utalingo-wordbook") ?? "[]");
    expect(stored).toHaveLength(0);
  });

  it("loads words from localStorage on page mount", async () => {
    localStorage.setItem(
      "utalingo-wordbook",
      JSON.stringify([
        { id: "persist-1", word: "猫", reading: "ねこ", meaning: "猫", level: "N5", partOfSpeech: "名詞", example: "猫", mastered: true },
        { id: "persist-2", word: "犬", reading: "いぬ", meaning: "狗", level: "N5", partOfSpeech: "名詞", example: "犬", mastered: false },
      ])
    );

    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));

    const wordbook = screen.getByTestId("smart-wordbook");
    expect(within(wordbook).getByTestId("wordbook-row-persist-1")).toBeInTheDocument();
    expect(within(wordbook).getByTestId("wordbook-row-persist-2")).toBeInTheDocument();
    expect(within(wordbook).getByText("犬")).toBeInTheDocument();
    expect(within(wordbook).getByText("ねこ")).toBeInTheDocument();
  });
});
