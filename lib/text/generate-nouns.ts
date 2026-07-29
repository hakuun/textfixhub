import type { NounGeneratorOptions } from './types';
import { NOUN_LIST } from './wordlists/noun-list';
import { mulberry32, shuffle } from './random';

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
