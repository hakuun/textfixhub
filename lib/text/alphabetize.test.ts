import { describe, it, expect } from 'vitest';
import { alphabetize } from './alphabetize';
import { DEFAULT_ALPHABETIZER_OPTIONS } from './types';

describe('alphabetize', () => {
  it('sorts lines case-insensitively by default', () => {
    const result = alphabetize('Zebra\nApple\nMonkey\nApple', DEFAULT_ALPHABETIZER_OPTIONS);
    expect(result).toBe('Apple\nApple\nMonkey\nZebra');
  });

  it('sorts case-sensitive when enabled', () => {
    const result = alphabetize('apple\nApple\nAPPLE', {
      ...DEFAULT_ALPHABETIZER_OPTIONS,
      caseSensitive: true,
    });
    // In code point order: uppercase letters come before lowercase
    // 'A'(65) < 'a'(97), so 'APPLE' < 'Apple' < 'apple'
    expect(result).toBe('APPLE\nApple\napple');
  });

  it('reverses order when enabled', () => {
    const result = alphabetize('A\nB\nC', {
      ...DEFAULT_ALPHABETIZER_OPTIONS,
      reverse: true,
    });
    expect(result).toBe('C\nB\nA');
  });

  it('removes duplicates when enabled (case-insensitive)', () => {
    const result = alphabetize('Apple\napple\nBanana\nbanana', {
      ...DEFAULT_ALPHABETIZER_OPTIONS,
      removeDuplicates: true,
    });
    // Case-insensitive dedupe keeps first occurrence
    expect(result).toBe('Apple\nBanana');
  });

  it('removes duplicates when enabled (case-sensitive)', () => {
    const result = alphabetize('Apple\napple\nApple', {
      caseSensitive: true,
      reverse: false,
      removeDuplicates: true,
    });
    expect(result).toBe('Apple\napple');
  });

  it('returns empty string for empty input', () => {
    expect(alphabetize('', DEFAULT_ALPHABETIZER_OPTIONS)).toBe('');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(alphabetize('  \n  \n  ', DEFAULT_ALPHABETIZER_OPTIONS)).toBe('');
  });

  it('handles large input (>100K chars) within 500ms', () => {
    const lines = Array.from({ length: 10000 }, (_, i) => `line ${String(i).padStart(5, '0')}`);
    const input = lines.join('\n');
    const start = performance.now();
    const result = alphabetize(input, DEFAULT_ALPHABETIZER_OPTIONS);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(result.split('\n').length).toBe(10000);
  });

  it('handles Unicode/emoji characters', () => {
    const result = alphabetize('😀\n🍎\nA', DEFAULT_ALPHABETIZER_OPTIONS);
    // Should not crash; output is stable
    const lines = result.split('\n');
    expect(lines.length).toBe(3);
    expect(lines).toContain('A');
    expect(lines).toContain('😀');
    expect(lines).toContain('🍎');
  });

  it('handles CJK characters', () => {
    const result = alphabetize('你\n好\n世界', {
      ...DEFAULT_ALPHABETIZER_OPTIONS,
      caseSensitive: true,
    });
    const lines = result.split('\n');
    expect(lines.length).toBe(3);
  });

  it('handles mixed line endings (CRLF, LF, CR)', () => {
    const result = alphabetize(
      'C\r\nA\nB\r',
      DEFAULT_ALPHABETIZER_OPTIONS,
    );
    expect(result).toBe('A\nB\nC');
  });

  it('strips BOM (U+FEFF) from input', () => {
    const result = alphabetize(
      '﻿Apple\nBanana',
      DEFAULT_ALPHABETIZER_OPTIONS,
    );
    expect(result).toBe('Apple\nBanana');
  });

  it('trims trailing whitespace from lines', () => {
    const result = alphabetize(
      'Apple  \n  Banana',
      DEFAULT_ALPHABETIZER_OPTIONS,
    );
    expect(result).toBe('Apple\nBanana');
  });

  it('preserves internal spaces within lines', () => {
    const result = alphabetize(
      'hello world\napple pie',
      DEFAULT_ALPHABETIZER_OPTIONS,
    );
    expect(result).toBe('apple pie\nhello world');
  });

  it('handles single line input', () => {
    const result = alphabetize('Hello', DEFAULT_ALPHABETIZER_OPTIONS);
    expect(result).toBe('Hello');
  });
});
