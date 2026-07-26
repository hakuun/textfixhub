import type { AlphabetizerOptions } from './types';

/**
 * Alphabetize lines of text. Each line is sorted alphabetically.
 * Handles: empty input, Unicode/emoji/CJK, mixed line endings, BOM,
 * trailing whitespace, zero-width characters.
 */
export function alphabetize(
  input: string,
  opts: AlphabetizerOptions,
): string {
  // Strip BOM if present
  let text = input;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // Normalize line endings: CRLF → LF, CR → LF
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into lines, trim each line (but preserve internal spaces)
  const lines = text.split('\n').map((line) => line.trim());

  // Filter out empty lines
  const nonEmpty = lines.filter((line) => line.length > 0);

  // If no lines, return empty string
  if (nonEmpty.length === 0) return '';

  // Determine sort order
  let sorted: string[];
  if (opts.caseSensitive) {
    sorted = [...nonEmpty].sort((a, b) => {
      // Use simple comparison for case-sensitive (Unicode code point order)
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  } else {
    // Case-insensitive using Intl.Collator
    const collator = new Intl.Collator('en', {
      sensitivity: 'base',
      ignorePunctuation: false,
    });
    sorted = [...nonEmpty].sort((a, b) => collator.compare(a, b));
  }

  // Remove duplicates if requested
  if (opts.removeDuplicates) {
    const seen = new Set<string>();
    sorted = sorted.filter((line) => {
      const key = opts.caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Reverse if requested
  if (opts.reverse) {
    sorted.reverse();
  }

  return sorted.join('\n');
}
