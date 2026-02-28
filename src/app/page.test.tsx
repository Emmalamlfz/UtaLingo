import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home Page", () => {
  it("renders the UtaLingo heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /UtaLingo/i })
    ).toBeInTheDocument();
  });

  it("renders the song title", () => {
    render(<Home />);
    expect(screen.getByText("さくら (Sakura)")).toBeInTheDocument();
  });

  it("shows lyric lines in Japanese", () => {
    render(<Home />);
    expect(screen.getByText("さくら さくら")).toBeInTheDocument();
    expect(screen.getByText("野山も里も")).toBeInTheDocument();
  });

  it("reveals romaji and translation when a lyric line is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);

    expect(screen.queryByText("sakura sakura")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("lyric-line-0"));

    expect(screen.getByText("sakura sakura")).toBeInTheDocument();
    expect(
      screen.getByText("Cherry blossoms, cherry blossoms")
    ).toBeInTheDocument();
  });

  it("hides details when a revealed line is clicked again", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("lyric-line-0"));
    expect(screen.getByText("sakura sakura")).toBeInTheDocument();

    await user.click(screen.getByTestId("lyric-line-0"));
    expect(screen.queryByText("sakura sakura")).not.toBeInTheDocument();
  });

  it("starts the quiz when clicking Start Quiz", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByTestId("start-quiz"));
    expect(screen.getByTestId("quiz-section")).toBeInTheDocument();
    expect(screen.getByTestId("quiz-input")).toBeInTheDocument();
  });
});
