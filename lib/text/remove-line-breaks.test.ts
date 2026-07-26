import { describe, it, expect } from 'vitest';
import { removeLineBreaks } from './remove-line-breaks';

describe('removeLineBreaks', () => {
  describe('replace-with-space mode', () => {
    it('replaces CRLF with space', () => {
      const result = removeLineBreaks('Hello\r\nWorld', 'replace-with-space');
      expect(result).toBe('Hello World');
    });

    it('replaces LF with space', () => {
      const result = removeLineBreaks('Hello\nWorld', 'replace-with-space');
      expect(result).toBe('Hello World');
    });

    it('preserves paragraph breaks (2+ newlines)', () => {
      const result = removeLineBreaks('Hello\n\nWorld', 'replace-with-space');
      expect(result).toBe('Hello\nWorld');
    });

    it('preserves paragraph breaks with 3+ newlines', () => {
      const result = removeLineBreaks('Hello\n\n\nWorld', 'replace-with-space');
      expect(result).toBe('Hello\nWorld');
    });

    it('handles complex mixed breaks', () => {
      const result = removeLineBreaks(
        'Line1\nLine2\n\nLine3\nLine4',
        'replace-with-space',
      );
      expect(result).toBe('Line1 Line2\nLine3 Line4');
    });
  });

  describe('remove-entirely mode', () => {
    it('removes all line breaks', () => {
      const result = removeLineBreaks('Hello\nWorld\nTest', 'remove-entirely');
      expect(result).toBe('HelloWorldTest');
    });

    it('removes CRLF breaks entirely', () => {
      const result = removeLineBreaks('Hello\r\nWorld', 'remove-entirely');
      expect(result).toBe('HelloWorld');
    });
  });

  it('returns empty string for empty input', () => {
    expect(removeLineBreaks('', 'replace-with-space')).toBe('');
    expect(removeLineBreaks('', 'remove-entirely')).toBe('');
  });

  it('handles mixed line endings (CRLF, LF, CR)', () => {
    const result = removeLineBreaks('A\r\nB\nC\r', 'replace-with-space');
    expect(result).toBe('A B C');
  });

  it('handles large input (>100K chars) within 500ms', () => {
    // Create 100K+ chars with many line breaks
    const line = 'The quick brown fox jumps over the lazy dog.';
    const lines = Array.from({ length: 2400 }, () => line);
    const input = lines.join('\n');
    expect(input.length).toBeGreaterThan(100000);

    const start = performance.now();
    const result = removeLineBreaks(input, 'replace-with-space');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(result.length).toBeGreaterThan(0);
  });

  it('removes trailing newline', () => {
    const result = removeLineBreaks('Text\n', 'replace-with-space');
    expect(result).toBe('Text');
  });

  it('strips BOM from input', () => {
    const result = removeLineBreaks('﻿Hello\nWorld', 'replace-with-space');
    expect(result).toBe('Hello World');
  });

  it('handles single word input', () => {
    expect(removeLineBreaks('Hello', 'replace-with-space')).toBe('Hello');
    expect(removeLineBreaks('Hello', 'remove-entirely')).toBe('Hello');
  });
});
