import kuromoji from "kuromoji";
import path from "path";

import type { WordToken } from "@/types";

type KuromojiTokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

let tokenizerInstance: KuromojiTokenizer | null = null;
let tokenizerPromise: Promise<KuromojiTokenizer> | null = null;

function getTokenizer(): Promise<KuromojiTokenizer> {
  if (tokenizerInstance) return Promise.resolve(tokenizerInstance);

  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      const dictPath = path.join(
        process.cwd(),
        "node_modules",
        "kuromoji",
        "dict"
      );
      kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
        if (err) {
          tokenizerPromise = null;
          reject(err);
          return;
        }
        tokenizerInstance = tokenizer;
        resolve(tokenizer);
      });
    });
  }

  return tokenizerPromise;
}

export async function tokenize(text: string): Promise<WordToken[]> {
  const tokenizer = await getTokenizer();
  const tokens = tokenizer.tokenize(text);

  return tokens.map((t) => ({
    surface_form: t.surface_form,
    pos: t.pos,
    pos_detail: [t.pos_detail_1, t.pos_detail_2, t.pos_detail_3]
      .filter((d) => d !== "*")
      .join("・"),
    basic_form: t.basic_form === "*" ? t.surface_form : t.basic_form,
    reading: t.reading ?? "",
    pronunciation: t.pronunciation ?? "",
  }));
}
