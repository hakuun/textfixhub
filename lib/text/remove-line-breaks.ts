import type { LineBreakMode } from './types';

// Hoisted regex patterns (js-hoist-regexp)
const CRLF_RE = /\r\n/g;
const CR_RE = /\r/g;
const NEWLINE_RE = /\n/g;
const DOUBLE_NEWLINE_RE = /\n{2,}/;
const TRAILING_NEWLINE_RE = /\n$/;
const TRAILING_SPACE_RE = / $/;

/**
 * Remove line breaks from text, with three modes:
 * - 'replace-with-space': Single line breaks → space, 2+ consecutive breaks → paragraph break preserved.
 * - 'remove-entirely': All line breaks removed — words may run together.
 * - 'remove-with-space': All line breaks removed, but a space is added at the end
 *   of each line to prevent words from running together.
 *
 * Handles: CRLF, LF, CR, mixed line endings, BOM.
 */
export function removeLineBreaks(
  input: string,
  mode: LineBreakMode,
): string {
  // Strip BOM if present
  let text = input;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // Normalize all line endings to LF
  text = text.replace(CRLF_RE, '\n').replace(CR_RE, '\n');

  if (mode === 'remove-entirely') {
    return text.replace(NEWLINE_RE, '');
  }

  if (mode === 'remove-with-space') {
    // Add a space at the end of each line before removing the line break
    return text.replace(NEWLINE_RE, ' ');
  }

  // mode === 'replace-with-space'
  // Two or more consecutive \n → preserve as paragraph break
  // Single \n → replace with space
  const withParaBreaks = text.replace(DOUBLE_NEWLINE_RE, '\0');
  const withSpaces = withParaBreaks.replace(NEWLINE_RE, ' ');
  const result = withSpaces.replace(/\0/g, '\n');

  return result.replace(TRAILING_NEWLINE_RE, '').replace(TRAILING_SPACE_RE, '');
}
