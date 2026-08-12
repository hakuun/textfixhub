import { describe, it, expect } from 'vitest';
import {
  generateIncorrectQuote,
  MOODS,
  TEMPLATE_COUNT,
} from './incorrect-quotes';

describe('generateIncorrectQuote', () => {
  it('returns a quote with the requested mood', () => {
    const q = generateIncorrectQuote({ names: ['Alex', 'Sam'], mood: 'romantic', seed: 1 });
    expect(q.mood).toBe('romantic');
    expect(q.lines.length).toBeGreaterThanOrEqual(1);
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

  it('handles 3+ speaker templates with fewer names (cycling)', () => {
    const q = generateIncorrectQuote({ names: ['Rin', 'Mako'], mood: 'any', seed: 7 });
    for (const line of q.lines) {
      expect(['Rin', 'Mako']).toContain(line.speaker);
    }
  });

  it('supports 3+ distinct speakers when enough names are provided', () => {
    // Force a broad sweep so a 3-speaker template is hit with 4 names.
    let sawThreeSpeakers = false;
    for (let seed = 0; seed < 400; seed += 1) {
      const q = generateIncorrectQuote({ names: ['A', 'B', 'C', 'D'], mood: 'any', seed });
      const speakers = new Set(q.lines.map((l) => l.speaker));
      if (speakers.size >= 3) {
        sawThreeSpeakers = true;
        break;
      }
    }
    expect(sawThreeSpeakers).toBe(true);
  });

  it('sometimes includes a scene header', () => {
    let sawScene = false;
    for (let seed = 0; seed < 400; seed += 1) {
      const q = generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed });
      if (q.scene) {
        sawScene = true;
        break;
      }
    }
    expect(sawScene).toBe(true);
  });
});

describe('template bank integrity', () => {
  it('has at least 70 hand-written templates', () => {
    expect(TEMPLATE_COUNT).toBeGreaterThanOrEqual(70);
  });

  it('has every mood represented', () => {
    const reached = new Set<ReturnType<typeof generateIncorrectQuote>['mood']>();
    for (let seed = 0; seed < 200; seed += 1) {
      reached.add(generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed }).mood);
    }
    expect([...reached].sort()).toEqual([...MOODS].sort());
  });

  it('never produces an empty dialogue', () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const q = generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed });
      expect(q.lines.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('produces some longer (multi-sentence) lines for richness', () => {
    let sawLongLine = false;
    for (let seed = 0; seed < 400; seed += 1) {
      const q = generateIncorrectQuote({ names: ['A', 'B'], mood: 'any', seed });
      if (q.lines.some((l) => l.text.length > 120)) {
        sawLongLine = true;
        break;
      }
    }
    expect(sawLongLine).toBe(true);
  });
});
