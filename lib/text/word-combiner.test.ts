import { describe, it, expect } from 'vitest';
import { combineWords } from './word-combiner';

describe('combineWords', () => {
  it('always includes the direct concatenation', () => {
    const out = combineWords('sun', 'flower');
    expect(out).toContain('sunflower');
  });

  it('merges shared overlap (sun + ny → sunny)', () => {
    const out = combineWords('sun', 'ny');
    expect(out).toContain('sunny');
  });

  it('generates syllable-aware splits (break + fast → breakfast)', () => {
    const out = combineWords('break', 'fast');
    expect(out).toContain('breakfast');
  });

  it('handles vowel collisions (spice + ice → drop one vowel)', () => {
    const out = combineWords('spice', 'ice');
    expect(out).toContain('spiceice'); // direct join
    expect(out).toContain('spicice'); // A drops trailing vowel
    expect(out).toContain('spicece'); // B drops leading vowel (ice → ce is odd, but consistent)
  });

  it('returns unique variants', () => {
    const out = combineWords('magic', 'wand');
    expect(new Set(out).size).toBe(out.length);
  });

  it('produces several variants for real words', () => {
    const out = combineWords('light', 'house');
    expect(out.length).toBeGreaterThan(1);
    expect(out).toContain('lighthouse');
  });

  it('returns [] when either input is empty', () => {
    expect(combineWords('', 'word')).toEqual([]);
    expect(combineWords('word', '')).toEqual([]);
  });

  it('strips non-letter characters', () => {
    const out = combineWords('sun!', 'flow-er');
    expect(out[0]).toBe('sunflower');
  });

  it('lowercases input', () => {
    const out = combineWords('Sun', 'FLOWER');
    expect(out[0]).toBe('sunflower');
  });
});
