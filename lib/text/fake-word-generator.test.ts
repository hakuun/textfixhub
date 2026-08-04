import { describe, it, expect } from 'vitest';
import { generateFakeWords } from './fake-word-generator';

const OPTS = {
  count: 10,
  minLength: 4,
  maxLength: 8,
  style: 'fantasy' as const,
};

describe('generateFakeWords', () => {
  it('returns the requested number of unique words', () => {
    const words = generateFakeWords({ ...OPTS, seed: 42 });
    expect(words).toHaveLength(10);
    expect(new Set(words).size).toBe(10);
  });

  it('is deterministic for a given seed', () => {
    const a = generateFakeWords({ ...OPTS, seed: 7 });
    const b = generateFakeWords({ ...OPTS, seed: 7 });
    expect(a).toEqual(b);
  });

  it('differs across seeds', () => {
    const a = generateFakeWords({ ...OPTS, seed: 1 });
    const b = generateFakeWords({ ...OPTS, seed: 2 });
    expect(a).not.toEqual(b);
  });

  it('keeps every word within the length bounds', () => {
    const words = generateFakeWords({ ...OPTS, seed: 99 });
    for (const w of words) {
      expect(w.length).toBeGreaterThanOrEqual(OPTS.minLength);
      expect(w.length).toBeLessThanOrEqual(OPTS.maxLength);
    }
  });

  it('every word contains a vowel', () => {
    const words = generateFakeWords({ ...OPTS, seed: 123 });
    for (const w of words) {
      expect(w).toMatch(/[aeiouy]/);
    }
  });

  it('every word is lowercase letters only', () => {
    const words = generateFakeWords({ ...OPTS, seed: 5 });
    for (const w of words) {
      expect(w).toMatch(/^[a-z]+$/);
    }
  });

  it('never returns a seed word itself', () => {
    const words = generateFakeWords({ ...OPTS, seed: 42 });
    for (const w of words) {
      expect(['mystic', 'rune', 'ember', 'dragon']).not.toContain(w);
    }
  });

  it('english style avoids real English words', () => {
    const words = generateFakeWords({
      count: 20,
      minLength: 5,
      maxLength: 8,
      style: 'english',
      seed: 9,
    });
    for (const w of words) {
      expect(['apple', 'house', 'happy', 'river']).not.toContain(w);
    }
  });

  it('returns [] for count 0', () => {
    expect(generateFakeWords({ ...OPTS, count: 0, seed: 1 })).toEqual([]);
  });

  it('clamps minLength > maxLength', () => {
    const words = generateFakeWords({
      ...OPTS,
      minLength: 8,
      maxLength: 4,
      seed: 8,
    });
    expect(words).toHaveLength(10);
    for (const w of words) {
      expect(w.length).toBeLessThanOrEqual(8);
      expect(w.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('style changes the output set', () => {
    const english = generateFakeWords({
      count: 30,
      minLength: 4,
      maxLength: 8,
      style: 'english',
      seed: 3,
    });
    const fantasy = generateFakeWords({
      count: 30,
      minLength: 4,
      maxLength: 8,
      style: 'fantasy',
      seed: 3,
    });
    expect(english).not.toEqual(fantasy);
  });

  it('handles large counts without duplicates', () => {
    const words = generateFakeWords({
      count: 50,
      minLength: 5,
      maxLength: 8,
      style: 'scifi',
      seed: 11,
    });
    expect(words.length).toBeLessThanOrEqual(50);
    expect(new Set(words).size).toBe(words.length);
  });
});
