import type { SentenceGeneratorOptions } from './types';
import { PREWRITTEN_SENTENCES } from './wordlists/prewritten-sentences';
import { mulberry32, shuffle } from './random';

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
