import type { SentenceGeneratorOptions } from './types';
import { PREWRITTEN_SENTENCES } from './wordlists/prewritten-sentences';

/**
 * Simple seeded PRNG (mulberry32). Produces deterministic output for a given seed.
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
 * Generate N random sentences from a library of 500 human-written sentences.
 *
 * Unlike template-based generation (which produced "crosss" and other grammar
 * errors), this approach guarantees 100% grammatically correct output. Each
 * sentence is hand-crafted — following the validated approach of
 * randomwordgenerator.com (SERP #2), which explicitly abandoned computer
 * generation because "results were disappointing."
 *
 * Sentences are drawn from 4 categories:
 * - Story starters (40%) — novel/story opening lines
 * - Absurd situations (25%) — funny, quirky, surreal
 * - Dialogue openers (20%) — conversation starters
 * - Mystery hooks (15%) — intriguing, strange, compelling
 *
 * @param opts.count — number of sentences (default 5, clamped 0–500)
 * @param opts.seed — optional fixed seed for deterministic output (SSG)
 */
export function generateSentences(opts: SentenceGeneratorOptions): string[] {
  const count = Math.max(0, Math.min(500, opts.count));
  if (count === 0) return [];

  const rand = opts.seed !== undefined
    ? mulberry32(opts.seed)
    : Math.random;

  // Shuffle the entire library and take the first `count`
  const shuffled = shuffle(PREWRITTEN_SENTENCES, rand);

  // If requesting more than available, return all
  if (count >= shuffled.length) {
    return shuffled;
  }

  return shuffled.slice(0, count);
}

/** Total number of sentences available */
export function getSentenceLibrarySize(): number {
  return PREWRITTEN_SENTENCES.length;
}
