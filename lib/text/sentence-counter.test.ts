import { describe, it, expect } from 'vitest';
import { countSentences } from './sentence-counter';

describe('countSentences', () => {
  it('counts basic sentences with period', () => {
    const result = countSentences('Hello. World.');
    expect(result.count).toBe(2);
    expect(result.sentences).toEqual(['Hello.', 'World.']);
  });

  it('counts sentences with ! and ? terminators', () => {
    const result = countSentences('Hello! How are you? I am fine.');
    expect(result.count).toBe(3);
  });

  it('does NOT split on abbreviations (Mr., Dr.)', () => {
    const result = countSentences(
      'Mr. Smith went to Dr. Jones. He left.',
    );
    expect(result.count).toBe(2);
    expect(result.sentences[0]).toContain('Mr.');
    expect(result.sentences[0]).toContain('Dr.');
  });

  it('does NOT split on i.e. and e.g.', () => {
    const result = countSentences(
      'I went to the store, e.g. for milk. It was fun.',
    );
    expect(result.count).toBe(2);
  });

  it('does NOT split on U.S.A. abbreviation', () => {
    const result = countSentences(
      'I live in the U.S.A. It is a big country.',
    );
    expect(result.count).toBe(2);
  });

  it('does NOT split on decimal numbers', () => {
    const result = countSentences(
      'Version 3.14 is new. It rocks.',
    );
    expect(result.count).toBe(2);
  });

  it('does NOT split on version strings like v2.0', () => {
    const result = countSentences(
      'We use v2.0 now. It is faster.',
    );
    expect(result.count).toBe(2);
  });

  it('treats ellipsis as ONE terminator', () => {
    const result = countSentences('Wait... What?');
    expect(result.count).toBe(2);
  });

  it('handles multiple terminators (!!, ?!)', () => {
    const result = countSentences('No!!! Really?! Yes.');
    expect(result.count).toBe(3);
  });

  it('returns count=1 for text without terminators', () => {
    const result = countSentences('Hello world');
    expect(result.count).toBe(1);
    expect(result.sentences[0]).toBe('Hello world');
  });

  it('returns count=0 for empty input', () => {
    const result = countSentences('');
    expect(result.count).toBe(0);
    expect(result.sentences).toEqual([]);
  });

  it('returns count=0 for whitespace-only input', () => {
    const result = countSentences('   \n  ');
    expect(result.count).toBe(0);
  });

  it('handles large input (>100K chars) within 500ms', () => {
    const sentence = 'The quick brown fox jumps over the lazy dog. ';
    const input = sentence.repeat(2500); // ~110K chars
    expect(input.length).toBeGreaterThan(100000);

    const start = performance.now();
    const result = countSentences(input);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(result.count).toBeGreaterThan(1000);
  });

  it('handles all 18 abbreviations individually', () => {
    const abbreviations = [
      'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Jr.', 'Sr.', 'St.',
      'vs.', 'e.g.', 'i.e.', 'etc.', 'a.m.', 'p.m.', 'U.S.',
      'Inc.', 'Ltd.', 'Ph.D.',
    ];
    for (const abbr of abbreviations) {
      // Use lowercase after abbreviation (realistic: "e.g. something")
      // to avoid false sentence boundaries from the "space + uppercase" rule
      const result = countSentences(`${abbr} test. End.`);
      expect(result.count).toBe(2); // abbr does NOT split, only "test." and "End." do
    }
  });

  it('handles abbreviation at end of sentence correctly', () => {
    // "I saw Dr. Smith." — Dr is abbreviation, Smith. ends sentence
    const result = countSentences('I saw Dr. Smith.');
    expect(result.count).toBe(1);
  });

  it('strips BOM from input', () => {
    const result = countSentences('﻿Hello. World.');
    expect(result.count).toBe(2);
  });

  it('handles CJK text with English-style punctuation', () => {
    // "你好. World." — the period after 好 is followed by space + W (uppercase)
    // so it IS a boundary. "Hello. 你好" — period after Hello is followed by
    // space + 你 (non-Latin) → also a boundary. Count = 3.
    const result = countSentences('Hello. 你好. World.');
    expect(result.count).toBe(3);
  });
});
