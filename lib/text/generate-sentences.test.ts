import { describe, it, expect } from 'vitest';
import { generateSentences, getSentenceLibrarySize } from './generate-sentences';

describe('generateSentences', () => {
  it('generates 5 non-empty grammatically correct sentences by default', () => {
    const result = generateSentences({ count: 5 });
    expect(result).toHaveLength(5);
    for (const s of result) {
      expect(s.length).toBeGreaterThan(10);
      expect(s).toMatch(/^[A-Z"'0-9]/); // starts with capital, quote, or digit
      expect(s).toMatch(/[.!?']$/); // ends with punctuation
    }
  });

  it('generates custom count of sentences', () => {
    const result = generateSentences({ count: 10 });
    expect(result).toHaveLength(10);
  });

  it('generates exactly 1 sentence', () => {
    const result = generateSentences({ count: 1 });
    expect(result).toHaveLength(1);
  });

  it('returns empty array for count 0', () => {
    const result = generateSentences({ count: 0 });
    expect(result).toEqual([]);
  });

  it('produces deterministic output with seed', () => {
    const a = generateSentences({ count: 5, seed: 12345 });
    const b = generateSentences({ count: 5, seed: 12345 });
    expect(a).toEqual(b);
  });

  it('produces different output with different seeds', () => {
    const a = generateSentences({ count: 5, seed: 12345 });
    const b = generateSentences({ count: 5, seed: 67890 });
    expect(a).not.toEqual(b);
  });

  it('produces different output without seed (randomness)', () => {
    let hasDiff = false;
    for (let i = 0; i < 5; i++) {
      const a = generateSentences({ count: 10 });
      const b = generateSentences({ count: 10 });
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        hasDiff = true;
        break;
      }
    }
    expect(hasDiff).toBe(true);
  });

  it('generates 500 sentences within 500ms', () => {
    const start = performance.now();
    const result = generateSentences({ count: 500 });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(result).toHaveLength(500);
  });

  it('returns all available when count exceeds library size', () => {
    const librarySize = getSentenceLibrarySize();
    const result = generateSentences({ count: librarySize + 100 });
    expect(result.length).toBe(librarySize);
  });

  it('clamps count above 500 to 500', () => {
    const result = generateSentences({ count: 1000 });
    expect(result.length).toBeLessThanOrEqual(500);
  });

  it('clamps negative count to 0', () => {
    const result = generateSentences({ count: -5 });
    expect(result).toEqual([]);
  });

  it('all sentences are unique for reasonable count', () => {
    const result = generateSentences({ count: 50 });
    const unique = new Set(result);
    expect(unique.size).toBe(50);
  });

  it('sentences end with proper punctuation', () => {
    const result = generateSentences({ count: 50 });
    for (const s of result) {
      const lastChar = s[s.length - 1];
      expect(['.', '!', '?', "'", '"']).toContain(lastChar);
    }
  });

  it('no template placeholders remain', () => {
    const result = generateSentences({ count: 20, seed: 42 });
    for (const s of result) {
      expect(s).not.toMatch(/\[noun\]|\[verb\]|\[adjective\]|\[adverb\]/);
    }
  });
});

describe('getSentenceLibrarySize', () => {
  it('returns a positive number', () => {
    expect(getSentenceLibrarySize()).toBeGreaterThan(0);
  });

  it('returns at least 500', () => {
    expect(getSentenceLibrarySize()).toBeGreaterThanOrEqual(500);
  });
});
