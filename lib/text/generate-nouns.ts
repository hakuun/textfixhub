import type { NounGeneratorOptions } from './types';
import { NOUN_LIST } from './wordlists/noun-list';

/**
 * Simple seeded PRNG (mulberry32).
 */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle with optional seeded PRNG.
 */
function shuffle<T>(arr: T[], rand: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate N unique random nouns from the built-in noun list.
 *
 * @param opts.count — number of nouns (default 10, clamped 0–500)
 * @param opts.seed — optional fixed seed for deterministic output (SSG)
 *
 * If count exceeds the available noun list, all nouns are returned
 * without duplicates.
 */
export function generateNouns(opts: NounGeneratorOptions): string[] {
  const count = Math.max(0, Math.min(500, opts.count));
  if (count === 0) return [];

  const rand = opts.seed !== undefined
    ? mulberry32(opts.seed)
    : Math.random;

  const shuffled = shuffle(NOUN_LIST, rand);

  // If requesting more than available, return all
  if (count >= NOUN_LIST.length) {
    return shuffled;
  }

  return shuffled.slice(0, count);
}

/** Total number of nouns available (used by UI to check exhaustion) */
export function getNounListSize(): number {
  return NOUN_LIST.length;
}
