import { describe, it, expect } from 'vitest';
import {
  countSyllables,
  countSyllablesByRule,
  countTextSyllables,
} from './syllable-counter';

describe('countSyllables — dictionary path (authority values)', () => {
  // Benchmark set with values verified against HowManySyllables (human-reviewed).
  const benchmark: [string, number][] = [
    ['apple', 2], ['table', 2], ['happy', 2], ['family', 3],
    ['beautiful', 3], ['butterfly', 3], ['quiet', 2], ['science', 2],
    ['separate', 3], ['necessary', 4], ['information', 4],
    ['pronunciation', 5], ['special', 2], ['restaurant', 3],
    ['chocolate', 3], ['everyone', 3], ['every', 2], ['orange', 2],
    ['iron', 2], ['rhythm', 2], ['world', 1], ['squirrel', 2],
    ['poem', 2], ['mobile', 2], ['believe', 2], ['camera', 3],
    ['vegetable', 3], ['library', 3], ['fire', 1], ['hour', 1],
  ];
  it.each(benchmark)('%s → %i', (word, expected) => {
    expect(countSyllables(word)).toBe(expected);
  });

  it('handles capitalized input', () => {
    expect(countSyllables('Apple')).toBe(2);
    expect(countSyllables('EVERY')).toBe(2);
  });
});

describe('countSyllablesByRule — fallback for out-of-dictionary words', () => {
  it('silent-e words', () => {
    expect(countSyllablesByRule('wibble')).toBe(2); // wib-ble
    expect(countSyllablesByRule('zazzle')).toBe(2);
    expect(countSyllablesByRule('give')).toBe(1);
  });

  it('vowel groups split (runs of vowels count once)', () => {
    expect(countSyllablesByRule('aeiou')).toBe(1); // one continuous vowel run
    expect(countSyllablesByRule('github')).toBe(2); // git-hub
    expect(countSyllablesByRule('zyxwv')).toBe(1); // only 'y' is a vowel
  });

  it('words with no vowels default to 1', () => {
    expect(countSyllablesByRule('brrr')).toBe(1);
    expect(countSyllablesByRule('grzhc')).toBe(1);
  });

  it('returns 0 for empty input', () => {
    expect(countSyllablesByRule('')).toBe(0);
  });

  it('counts -le endings with a preceding consonant', () => {
    expect(countSyllablesByRule('syllable')).toBe(3); // syl-la-ble (not in dict)
  });
});

describe('countSyllables — punctuation, digits, empty', () => {
  it('ignores digits and punctuation in a word', () => {
    expect(countSyllables('hello!')).toBe(2);
    expect(countSyllables('12345')).toBe(0);
  });

  it('handles apostrophes (don’t = 1)', () => {
    expect(countSyllables("don't")).toBe(1);
  });

  it('empty / non-letter input → 0', () => {
    expect(countSyllables('')).toBe(0);
    expect(countSyllables('...')).toBe(0);
  });
});

describe('countTextSyllables — per-line, per-word, totals', () => {
  it('totals syllables across lines and words', () => {
    const stats = countTextSyllables('The happy cat\nran home.');
    // the(1) happy(2) cat(1) = 4 | ran(1) home(1) = 2 → total 6, 5 words
    expect(stats.total).toBe(6);
    expect(stats.wordCount).toBe(5);
  });

  it('provides per-line counts (haiku use case)', () => {
    const stats = countTextSyllables('The autumn wind blows\nLeaves fall softly to the ground\nCold winter is near');
    // Line syllables must sum to the total.
    const sum = stats.lines.reduce((s, l) => s + l.count, 0);
    expect(sum).toBe(stats.total);
    expect(stats.lines).toHaveLength(3);
  });

  it('provides per-word counts', () => {
    const stats = countTextSyllables('beautiful butterfly');
    expect(stats.words).toEqual([
      { word: 'beautiful', count: 3 },
      { word: 'butterfly', count: 3 },
    ]);
  });

  it('empty text → all zeros', () => {
    const stats = countTextSyllables('');
    expect(stats.total).toBe(0);
    expect(stats.wordCount).toBe(0);
    expect(stats.lines).toEqual([{ text: '', count: 0 }]);
  });
});
