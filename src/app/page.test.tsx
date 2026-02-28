import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Home from "./page";

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

  it("shows lyrics toggles in Learn section", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));
    expect(screen.getByTestId("toggle-furigana")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-romaji")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-translation")).toBeInTheDocument();
  });

  it("switches notebook tabs between vocabulary, grammar, sentences", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("song-card-1"));
    const notebook = screen.getByTestId("notebook-preview");

    await user.click(within(notebook).getByTestId("notebook-tab-grammar"));
    expect(within(notebook).getByText("〜ならば")).toBeInTheDocument();

    await user.click(within(notebook).getByTestId("notebook-tab-sentences"));
    expect(
      within(notebook).getByText("〜ならば (conditional)")
    ).toBeInTheDocument();
  });
});
