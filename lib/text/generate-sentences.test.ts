import { describe, it, expect } from 'vitest';
import { generateSentences } from './generate-sentences';

describe('generateSentences', () => {
  it('generates 5 sentences by default', () => {
    const result = generateSentences({ count: 5 });
    expect(result).toHaveLength(5);
    for (const s of result) {
      expect(s.length).toBeGreaterThan(10);
      expect(s[0]).toBe(s[0].toUpperCase()); // starts with capital
      expect(s.endsWith('.')).toBe(true); // ends with period
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
    // Run 5 trials, at least 1 should differ
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

  it('clamps count above 500 to 500', () => {
    const result = generateSentences({ count: 1000 });
    expect(result).toHaveLength(500);
  });

  it('clamps negative count to 0', () => {
    const result = generateSentences({ count: -5 });
    expect(result).toEqual([]);
  });

  it('sentences contain no leftover placeholders', () => {
    const result = generateSentences({ count: 20, seed: 42 });
    for (const s of result) {
      expect(s).not.toMatch(/\[noun\]|\[verb\]|\[adjective\]|\[adverb\]/);
    }
  });
});
