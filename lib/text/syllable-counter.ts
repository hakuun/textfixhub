/**
 * Syllable Counter — dictionary-first (CMU Pronouncing Dictionary filtered to
 * common words, with human-reviewed corrections) + rule fallback. Matches how
 * top competitors work, but beats syllablecounter.net's accuracy on disputed
 * common words (fire, hour, every, chocolate) via the authority overrides.
 */

import { SYLLABLE_DICT } from './wordlists/syllable-dict';

const WORD_RE = /[a-zA-Z']+/g;

/** Rule-based fallback for words not in the dictionary. */
export function countSyllablesByRule(word: string): number {
  const w = word.toLowerCase();
  if (!w) return 0;

  // Drop a silent final 'e' (covers '-le' too; that check adds it back below).
  const core = w.endsWith('e') ? w.slice(0, -1) : w;

  // Count vowel groups (runs of a/e/i/o/u/y) as syllables.
  const groups = core.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 0;
  if (count === 0 && /[aeiouy]/.test(w)) count = 1;

  // '-le' endings add a syllable when a consonant precedes the 'le' (table,
  // wibble) — but not when a vowel does (ale, aisle).
  if (w.endsWith('le') && w.length > 2 && !/[aeiouy]/.test(w[w.length - 3])) {
    count += 1;
  }

  return Math.max(1, count);
}

/** Count syllables in a single word (dictionary first, then rules). */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z']/g, '');
  if (!w) return 0;
  const dictCount = SYLLABLE_DICT[w];
  if (dictCount !== undefined) return dictCount;
  return countSyllablesByRule(w);
}

export interface WordSyllables {
  word: string;
  count: number;
}

export interface LineSyllables {
  text: string;
  count: number;
}

export interface TextSyllableStats {
  total: number;
  wordCount: number;
  words: WordSyllables[];
  lines: LineSyllables[];
}

/** Count syllables across whole text, with per-line and per-word breakdowns. */
export function countTextSyllables(text: string): TextSyllableStats {
  const lines = text.split('\n');

  const lineStats: LineSyllables[] = lines.map((line) => {
    const words = line.match(WORD_RE) ?? [];
    const count = words.reduce((sum, w) => sum + countSyllables(w), 0);
    return { text: line, count };
  });

  const words: WordSyllables[] = [];
  for (const line of lines) {
    for (const w of line.match(WORD_RE) ?? []) {
      words.push({ word: w, count: countSyllables(w) });
    }
  }

  const total = lineStats.reduce((sum, l) => sum + l.count, 0);
  return { total, wordCount: words.length, words, lines: lineStats };
}
