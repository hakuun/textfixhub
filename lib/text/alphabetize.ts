import type { AlphabetizerOptions, SeparatorPreset } from './types';

/** Hoisted regex for HTML tag stripping (js-hoist-regexp) */
const HTML_TAG_RE = /<[^>]*>/g;

/** Map separator preset to actual delimiter */
function getSeparator(preset: SeparatorPreset, custom: string): string {
  switch (preset) {
    case 'newline': return '\n';
    case 'comma': return ',';
    case 'semicolon': return ';';
    case 'space': return ' ';
    case 'custom': return custom || ' ';
    default: return '\n';
  }
}

/** Strip HTML tags from a string */
function stripHTML(text: string): string {
  return text.replace(HTML_TAG_RE, '');
}

/**
 * Alphabetize items. Input is split by the configured separator, sorted,
 * and joined with the output separator.
 *
 * Handles: empty input, Unicode/emoji/CJK, mixed line endings, BOM,
 * trailing whitespace, zero-width characters, HTML removal.
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

  // Strip HTML if requested
  if (opts.removeHTML) {
    text = stripHTML(text);
  }

  const inputSep = getSeparator(opts.inputSeparator, opts.customInputSeparator);

  // Split by input separator and trim each item
  const items = text.split(inputSep).map((item) => item.trim());

  // Filter out empty items
  const nonEmpty = items.filter((item) => item.length > 0);

  // If no items, return empty string
  if (nonEmpty.length === 0) return '';

  // Sort
  let sorted: string[];
  if (opts.caseSensitive) {
    sorted = [...nonEmpty].sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  } else {
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

  const outputSep = getSeparator(opts.outputSeparator, opts.customOutputSeparator);
  return sorted.join(outputSep);
}
