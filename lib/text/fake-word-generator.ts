/**
 * Fake Word Generator — Markov 3-gram generator producing words that look
 * and feel like the chosen style. Trains a character-level model over the
 * style's seed words, then walks it to synthesize new words.
 *
 * English style reuses the shared NOUNS/ADJECTIVES/VERBS lists; Fantasy and
 * SciFi use dedicated genre seeds (wordlists/fake-word-seeds.ts).
 */

import { NOUNS } from './wordlists/nouns';
import { ADJECTIVES } from './wordlists/adjectives';
import { VERBS } from './wordlists/verbs';
import { FANTASY_SEEDS, SCIFI_SEEDS } from './wordlists/fake-word-seeds';
import { mulberry32 } from './random';

export type FakeWordStyle = 'english' | 'fantasy' | 'scifi';

export interface FakeWordOptions {
  count: number;
  minLength: number;
  maxLength: number;
  style: FakeWordStyle;
  seed?: number;
}

const STYLE_SEEDS: Record<FakeWordStyle, string[]> = {
  english: [...NOUNS, ...ADJECTIVES, ...VERBS],
  fantasy: FANTASY_SEEDS,
  scifi: SCIFI_SEEDS,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

/** Two-char prefix → possible next characters (Markov order 3). */
type MarkovModel = Map<string, string[]>;

function buildModel(seeds: string[]): MarkovModel {
  const model: MarkovModel = new Map();
  const add = (key: string, next: string) => {
    const list = model.get(key);
    if (list) list.push(next);
    else model.set(key, [next]);
  };
  for (const raw of seeds) {
    const word = raw.toLowerCase();
    if (word.length < 3) continue;
    for (let i = 0; i < word.length - 2; i++) {
      add(word.slice(i, i + 2), word[i + 2]);
    }
  }
  return model;
}

/** Legal two-char word openings, used to seed generation. */
function buildStarts(seeds: string[]): string[] {
  const starts = new Set<string>();
  for (const raw of seeds) {
    const word = raw.toLowerCase();
    if (word.length >= 2) starts.add(word.slice(0, 2));
  }
  return [...starts];
}

function hasVowel(word: string): boolean {
  return [...word].some((c) => VOWELS.has(c));
}

/** Try to synthesize one word within length bounds, containing a vowel, and not a seed word itself. */
function generateOne(
  model: MarkovModel,
  starts: string[],
  minLen: number,
  maxLen: number,
  rand: () => number,
  forbidden: Set<string>,
): string | null {
  for (let attempt = 0; attempt < 100; attempt++) {
    let word = starts[Math.floor(rand() * starts.length)];
    while (word.length < maxLen) {
      const nexts = model.get(word.slice(-2));
      if (!nexts || nexts.length === 0) break;
      word += nexts[Math.floor(rand() * nexts.length)];
    }
    if (
      word.length >= minLen &&
      word.length <= maxLen &&
      hasVowel(word) &&
      !forbidden.has(word)
    ) {
      return word;
    }
  }
  return null;
}

/**
 * Generate `count` unique fake words. Deterministic when `seed` is provided.
 * Falls back to Math.random for interactive use (pass a seed for tests).
 */
export function generateFakeWords(options: FakeWordOptions): string[] {
  const { count, minLength, maxLength, style } = options;
  const min = Math.max(2, Math.min(minLength, maxLength));
  const max = Math.max(min, maxLength);

  if (count <= 0) return [];

  const seeds = STYLE_SEEDS[style];
  const model = buildModel(seeds);
  const starts = buildStarts(seeds);
  if (starts.length === 0) return [];

  // A fake word must be novel — never echo a seed word back. English style
  // also avoids the shared real-word lists so outputs stay clearly invented.
  const forbidden = new Set(seeds.map((s) => s.toLowerCase()));
  if (style === 'english') {
    for (const list of [NOUNS, ADJECTIVES, VERBS]) {
      for (const s of list) forbidden.add(s.toLowerCase());
    }
  }

  const rand = mulberry32(options.seed ?? Math.floor(Math.random() * 2 ** 31));

  const seen = new Set<string>();
  const result: string[] = [];
  let guard = 0;
  while (result.length < count && guard < count * 100) {
    guard += 1;
    const word = generateOne(model, starts, min, max, rand, forbidden);
    if (word && !seen.has(word)) {
      seen.add(word);
      result.push(word);
    }
  }
  return result;
}
