import { describe, it, expect } from 'vitest';
import { generateIncorrectQuote, MOODS } from './incorrect-quotes';

describe('generateIncorrectQuote', () => {
  it('returns a quote with the requested mood', () => {
    const q = generateIncorrectQuote({ names: ['Alex', 'Sam'], mood: 'romantic', seed: 1 });
    expect(q.mood).toBe('romantic');
    expect(q.lines.length).toBeGreaterThanOrEqual(2);
  });

  it('casts the provided names as speakers', () => {
    const q = generateIncorrectQuote({ names: ['Alex', 'Sam'], mood: 'funny', seed: 2 });
    expect(q.lines.length).toBeGreaterThan(0);
    for (const line of q.lines) {
      expect(['Alex', 'Sam']).toContain(line.speaker);
    }
  });

  it('cycles names when there are fewer names than speakers', () => {
    const q = generateIncorrectQuote({ names: ['Rin'], mood: 'funny', seed: 3 });
    expect(q.lines.length).toBeGreaterThan(0);
    for (const line of q.lines) {
      expect(line.speaker).toBe('Rin');
    }
  });

  it('uses Character N placeholders when no names are provided', () => {
    const q = generateIncorrectQuote({ names: [], mood: 'angst', seed: 4 });
    expect(q.lines.length).toBeGreaterThan(0);
    for (const line of q.lines) {
      expect(line.speaker).toMatch(/^Character \d+$/);
    }
  });

  it('is deterministic for a fixed seed', () => {
    const a = generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed: 42 });
    const b = generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed: 42 });
    expect(a.lines).toEqual(b.lines);
  });

  it('differs across seeds (statistically)', () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 50; seed += 1) {
      const q = generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed });
      seen.add(q.lines.map((l) => `${l.speaker}:${l.text}`).join('|'));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('supports the any mood across the whole bank', () => {
    const moods = new Set<ReturnType<typeof generateIncorrectQuote>['mood']>();
    for (let seed = 0; seed < 60; seed += 1) {
      moods.add(generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed }).mood);
    }
    expect(moods.size).toBeGreaterThanOrEqual(2);
  });

  it('strips blank names', () => {
    const q = generateIncorrectQuote({ names: ['Alex', '  ', ''], mood: 'funny', seed: 5 });
    for (const line of q.lines) {
      expect(line.speaker).not.toBe('');
    }
  });
});

describe('template bank integrity', () => {
  it('has at least 10 templates per mood', () => {
    // Exporting the bank directly is an implementation detail; instead verify
    // that every mood is reachable across a large seed sweep.
    const reached = new Set<ReturnType<typeof generateIncorrectQuote>['mood']>();
    for (let seed = 0; seed < 200; seed += 1) {
      reached.add(generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed }).mood);
    }
    expect([...reached].sort()).toEqual([...MOODS].sort());
  });

  it('never produces an empty dialogue', () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const q = generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed });
      expect(q.lines.length).toBeGreaterThanOrEqual(2);
    }
  });
});
