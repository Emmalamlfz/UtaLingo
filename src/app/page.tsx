"use client";

import { useState } from "react";

interface LyricLine {
  japanese: string;
  romaji: string;
  english: string;
}

const sampleSong: { title: string; artist: string; lyrics: LyricLine[] } = {
  title: "さくら (Sakura)",
  artist: "森山直太朗",
  lyrics: [
    {
      japanese: "さくら さくら",
      romaji: "sakura sakura",
      english: "Cherry blossoms, cherry blossoms",
    },
    {
      japanese: "野山も里も",
      romaji: "noyama mo sato mo",
      english: "In the mountains and villages",
    },
    {
      japanese: "見わたす限り",
      romaji: "miwatasu kagiri",
      english: "As far as the eye can see",
    },
    {
      japanese: "かすみか雲か",
      romaji: "kasumi ka kumo ka",
      english: "Like mist or clouds",
    },
    {
      japanese: "朝日ににおう",
      romaji: "asahi ni niou",
      english: "Fragrant in the morning sun",
    },
  ],
};

export default function Home() {
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const toggleLine = (index: number) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const startQuiz = () => {
    setQuizActive(true);
    setCurrentQuizIndex(0);
    setScore(0);
    setQuizAnswer("");
    setQuizFeedback(null);
  };

  const checkAnswer = () => {
    const correct =
      sampleSong.lyrics[currentQuizIndex].romaji.toLowerCase().trim();
    const userAnswer = quizAnswer.toLowerCase().trim();
    if (userAnswer === correct) {
      setScore((s) => s + 1);
      setQuizFeedback("Correct! 🎉");
    } else {
      setQuizFeedback(`Not quite. The answer was: ${correct}`);
    }
    setTimeout(() => {
      if (currentQuizIndex < sampleSong.lyrics.length - 1) {
        setCurrentQuizIndex((i) => i + 1);
        setQuizAnswer("");
        setQuizFeedback(null);
      } else {
        setQuizActive(false);
        setQuizFeedback(null);
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-pink-50 to-white px-4 py-12 font-sans dark:from-zinc-900 dark:to-black">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-pink-600 dark:text-pink-400">
          🎵 UtaLingo
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Learn Japanese through the beauty of songs
        </p>
      </header>

      <main className="w-full max-w-2xl">
        <section className="rounded-2xl border border-pink-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {sampleSong.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {sampleSong.artist}
              </p>
            </div>
            <button
              onClick={startQuiz}
              className="rounded-full bg-pink-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600"
              data-testid="start-quiz"
            >
              {quizActive ? "Restart Quiz" : "Start Quiz"}
            </button>
          </div>

          {!quizActive ? (
            <div className="space-y-3">
              <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                Click a line to reveal its romaji and English translation
              </p>
              {sampleSong.lyrics.map((line, i) => (
                <button
                  key={i}
                  onClick={() => toggleLine(i)}
                  className="w-full rounded-xl border border-zinc-100 p-4 text-left transition-all hover:border-pink-200 hover:shadow-sm dark:border-zinc-700 dark:hover:border-pink-600"
                  data-testid={`lyric-line-${i}`}
                >
                  <p className="text-xl text-zinc-900 dark:text-zinc-100">
                    {line.japanese}
                  </p>
                  {revealedLines.has(i) && (
                    <div
                      className="mt-2 space-y-1"
                      data-testid={`lyric-details-${i}`}
                    >
                      <p className="text-sm italic text-pink-600 dark:text-pink-400">
                        {line.romaji}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {line.english}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6" data-testid="quiz-section">
              <div className="text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Question {currentQuizIndex + 1} of{" "}
                  {sampleSong.lyrics.length}
                </p>
                <p className="mt-2 text-3xl font-medium text-zinc-900 dark:text-zinc-100">
                  {sampleSong.lyrics[currentQuizIndex].japanese}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Type the romaji reading
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={quizAnswer}
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                  placeholder="Type romaji here..."
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                  data-testid="quiz-input"
                  autoFocus
                />
                <button
                  onClick={checkAnswer}
                  className="rounded-xl bg-pink-500 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-600"
                  data-testid="check-answer"
                >
                  Check
                </button>
              </div>
              {quizFeedback && (
                <p
                  className="text-center text-lg font-medium"
                  data-testid="quiz-feedback"
                >
                  {quizFeedback}
                </p>
              )}
              <div className="text-center text-sm text-zinc-500">
                Score: {score} / {sampleSong.lyrics.length}
              </div>
            </div>
          )}
        </section>

        {!quizActive && score > 0 && (
          <div
            className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/20"
            data-testid="score-summary"
          >
            <p className="text-lg font-medium text-green-700 dark:text-green-400">
              Quiz Complete! Your score: {score} / {sampleSong.lyrics.length}
            </p>
          </div>
        )}
      </main>

      <footer className="mt-16 text-sm text-zinc-400">
        UtaLingo &mdash; Learn Japanese through songs
      </footer>
    </div>
  );
}
