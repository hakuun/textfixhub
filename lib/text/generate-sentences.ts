import type { SentenceGeneratorOptions } from './types';
import { NOUNS } from './wordlists/nouns';
import { VERBS } from './wordlists/verbs';
import { ADJECTIVES } from './wordlists/adjectives';
import { ADVERBS } from './wordlists/adverbs';
import { SENTENCE_TEMPLATES } from './wordlists/sentence-templates';

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

/** Pick a random element from an array */
function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

/** Capitalize the first letter of a string */
function capitalize(s: string): string {
  if (s.length === 0) return s;
  return s[0].toUpperCase() + s.slice(1);
}

/**
 * Fill a single template with random words. Handles subject-verb agreement:
 * if the template contains "[verb]s", the 's' is appended to the verb.
 */
function fillTemplate(template: string, rand: () => number): string {
  let result = template;

  // Handle [verb]s pattern (third-person singular) — extract the verb, add 's', replace
  result = result.replace(/\[verb\]s/g, () => {
    const verb = pick(VERBS, rand);
    return verb + 's';
  });

  // Handle remaining [verb] (plural / base form)
  result = result.replace(/\[verb\]/g, () => pick(VERBS, rand));

  // Replace other categories
  result = result.replace(/\[noun\]/g, () => pick(NOUNS, rand));
  result = result.replace(/\[adjective\]/g, () => pick(ADJECTIVES, rand));
  result = result.replace(/\[adverb\]/g, () => pick(ADVERBS, rand));

  // Capitalize first letter, ensure ends with period
  result = capitalize(result);
  if (!result.endsWith('.')) {
    result += '.';
  }

  return result;
}

/**
 * Generate N grammatically-plausible random sentences using template-based
 * slot-and-fill generation.
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

  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const template = pick(SENTENCE_TEMPLATES, rand);
    sentences.push(fillTemplate(template, rand));
  }

  return sentences;
}
