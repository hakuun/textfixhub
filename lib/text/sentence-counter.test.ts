import { describe, it, expect } from 'vitest';
import { countSentences } from './sentence-counter';

describe('countSentences — sentence counting', () => {
  it('counts basic sentences with period', () => {
    const result = countSentences('Hello. World.');
    expect(result.sentenceCount).toBe(2);
    expect(result.sentences).toEqual(['Hello.', 'World.']);
  });

  it('counts sentences with ! and ? terminators', () => {
    const result = countSentences('Hello! How are you? I am fine.');
    expect(result.sentenceCount).toBe(3);
  });

  it('does NOT split on abbreviations (Mr., Dr.)', () => {
    const result = countSentences(
      'Mr. Smith went to Dr. Jones. He left.',
    );
    expect(result.sentenceCount).toBe(2);
    expect(result.sentences[0]).toContain('Mr.');
    expect(result.sentences[0]).toContain('Dr.');
  });

  it('does NOT split on i.e. and e.g.', () => {
    const result = countSentences(
      'I went to the store, e.g. for milk. It was fun.',
    );
    expect(result.sentenceCount).toBe(2);
  });

  it('does NOT split on U.S.A. abbreviation', () => {
    const result = countSentences(
      'I live in the U.S.A. It is a big country.',
    );
    expect(result.sentenceCount).toBe(2);
  });

  it('does NOT split on decimal numbers', () => {
    const result = countSentences('Version 3.14 is new. It rocks.');
    expect(result.sentenceCount).toBe(2);
  });

  it('does NOT split on version strings like v2.0', () => {
    const result = countSentences('We use v2.0 now. It is faster.');
    expect(result.sentenceCount).toBe(2);
  });

  it('treats ellipsis as ONE terminator', () => {
    const result = countSentences('Wait... What?');
    expect(result.sentenceCount).toBe(2);
  });

  it('handles multiple terminators (!!, ?!)', () => {
    const result = countSentences('No!!! Really?! Yes.');
    expect(result.sentenceCount).toBe(3);
  });

  it('returns count=1 for text without terminators', () => {
    const result = countSentences('Hello world');
    expect(result.sentenceCount).toBe(1);
    expect(result.sentences[0]).toBe('Hello world');
  });

  it('returns count=0 for empty input', () => {
    const result = countSentences('');
    expect(result.sentenceCount).toBe(0);
    expect(result.sentences).toEqual([]);
  });

  it('handles CJK text with English-style punctuation', () => {
    const result = countSentences('Hello. 你好. World.');
    expect(result.sentenceCount).toBe(3);
  });

  it('strips BOM from input', () => {
    const result = countSentences('﻿Hello. World.');
    expect(result.sentenceCount).toBe(2);
  });
});

describe('countSentences — text statistics', () => {
  it('counts words correctly', () => {
    const result = countSentences('The quick brown fox jumps over the lazy dog.');
    expect(result.wordCount).toBe(9);
  });

  it('counts characters with spaces', () => {
    const result = countSentences('Hi there.');
    expect(result.charCountWithSpaces).toBe(9);
  });

  it('counts characters without spaces', () => {
    // "Hi there." = 8 chars (H,i,t,h,e,r,e,.) — 2 letters + period
    const result = countSentences('Hi there.');
    expect(result.charCountWithoutSpaces).toBe(8);
  });

  it('counts paragraphs', () => {
    const result = countSentences('Hello world.\n\nThis is a second paragraph.\n\nAnd a third.');
    expect(result.paragraphCount).toBe(3);
  });

  it('counts lines', () => {
    const result = countSentences('Line one.\nLine two.\nLine three.');
    expect(result.lineCount).toBe(3);
  });

  it('computes average sentence length in words', () => {
    // "Hello world. Goodbye." = 3 words / 2 sentences = 1.5
    const result = countSentences('Hello world. Goodbye.');
    expect(result.avgSentenceLengthWords).toBe(1.5);
  });

  it('computes average word length in characters', () => {
    // "Hi there." = 8 chars no spaces / 2 words = 4.0
    const result = countSentences('Hi there.');
    expect(result.avgWordLengthChars).toBe(4.0);
  });

  it('computes reading time', () => {
    // 200 words → 1 minute reading
    const words = Array(200).fill('word').join(' ');
    const result = countSentences(words + '.');
    expect(result.readingTimeMinutes).toBe(1);
  });

  it('computes speaking time', () => {
    // 130 words → 1 minute speaking
    const words = Array(130).fill('word').join(' ');
    const result = countSentences(words + '.');
    expect(result.speakingTimeMinutes).toBe(1);
  });

  it('returns zeros for empty input', () => {
    const result = countSentences('');
    expect(result.wordCount).toBe(0);
    expect(result.charCountWithSpaces).toBe(0);
    expect(result.charCountWithoutSpaces).toBe(0);
    expect(result.paragraphCount).toBe(0);
    expect(result.lineCount).toBe(0);
    expect(result.avgSentenceLengthWords).toBe(0);
    expect(result.avgWordLengthChars).toBe(0);
    expect(result.readingTimeMinutes).toBe(0);
    expect(result.speakingTimeMinutes).toBe(0);
  });

  it('handles large input within 500ms', () => {
    const sentence = 'The quick brown fox jumps over the lazy dog. ';
    const input = sentence.repeat(2500);
    const start = performance.now();
    const result = countSentences(input);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(result.sentenceCount).toBeGreaterThan(1000);
    expect(result.wordCount).toBeGreaterThan(0);
  });
});
