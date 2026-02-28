export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type Genre =
  | "J-Pop"
  | "J-Rock"
  | "Anime"
  | "Ballad"
  | "Hip-Hop"
  | "Folk"
  | "Enka";

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  level: JLPTLevel;
  genre: Genre;
  duration: string;
  lyrics: LyricLine[];
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  sentences: SentencePattern[];
}

export interface LyricLine {
  id: number;
  timeStart: number;
  timeEnd: number;
  japanese: string;
  romaji: string;
  english: string;
  furigana: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  level: JLPTLevel;
  partOfSpeech: string;
  example: string;
  mastered: boolean;
}

export interface GrammarPoint {
  id: string;
  pattern: string;
  meaning: string;
  level: JLPTLevel;
  explanation: string;
  example: string;
  mastered: boolean;
}

export interface SentencePattern {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  keyGrammar: string;
  mastered: boolean;
}

export type TabId = "discover" | "learn" | "review";
