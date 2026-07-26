import { describe, it, expect } from 'vitest';
import { generateNouns, getNounListSize } from './generate-nouns';

describe('generateNouns', () => {
  it('generates 10 nouns by default', () => {
    const result = generateNouns({ count: 10 });
    expect(result).toHaveLength(10);
    for (const noun of result) {
      expect(typeof noun).toBe('string');
      expect(noun.length).toBeGreaterThan(0);
    }
  });

  it('generates custom count of nouns', () => {
    const result = generateNouns({ count: 20 });
    expect(result).toHaveLength(20);
  });

  it('generates exactly 1 noun', () => {
    const result = generateNouns({ count: 1 });
    expect(result).toHaveLength(1);
  });

  it('returns empty array for count 0', () => {
    const result = generateNouns({ count: 0 });
    expect(result).toEqual([]);
  });

  it('produces deterministic output with seed', () => {
    const a = generateNouns({ count: 10, seed: 12345 });
    const b = generateNouns({ count: 10, seed: 12345 });
    expect(a).toEqual(b);
  });

  it('produces different output with different seeds', () => {
    const a = generateNouns({ count: 10, seed: 12345 });
    const b = generateNouns({ count: 10, seed: 67890 });
    expect(a).not.toEqual(b);
  });

  it('produces different output without seed (randomness)', () => {
    let hasDiff = false;
    for (let i = 0; i < 5; i++) {
      const a = generateNouns({ count: 50 });
      const b = generateNouns({ count: 50 });
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        hasDiff = true;
        break;
      }
    }
    expect(hasDiff).toBe(true);
  });

  it('has no duplicates in output', () => {
    const size = getNounListSize();
    expect(size).toBeGreaterThan(0);
    // Request 500 (max clamp) — the function caps at 500
    const requested = Math.min(500, size);
    const result = generateNouns({ count: requested, seed: 42 });
    expect(new Set(result).size).toBe(result.length); // all unique
    expect(result.length).toBe(requested);
  });

  it('returns all nouns when count exceeds list size', () => {
    const size = getNounListSize();
    // count clamped to 500 max, so if list > 500, only 500 returned
    const expected = Math.min(500, size);
    const result = generateNouns({ count: size + 100 });
    expect(result.length).toBe(expected);
  });

  it('clamps count above 500 to 500', () => {
    const result = generateNouns({ count: 1000 });
    // If noun list is > 500, returns 500; else returns list size
    expect(result.length).toBeLessThanOrEqual(500);
  });

  it('clamps negative count to 0', () => {
    const result = generateNouns({ count: -5 });
    expect(result).toEqual([]);
  });

  it('generates 500 nouns within 500ms', () => {
    const start = performance.now();
    const result = generateNouns({ count: 500 });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(result).toHaveLength(500);
  });
});
