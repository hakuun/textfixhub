import type { SentenceCountResult } from './types';

/**
 * Known English abbreviations that should NOT trigger sentence boundaries.
 * 18 entries per the spec/research decisions.
 */
const ABBREVIATIONS = new Set([
  'Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Jr', 'Sr', 'St',
  'vs', 'e.g', 'i.e', 'etc', 'a.m', 'p.m', 'U.S',
  'Inc', 'Ltd', 'Ph.D',
]);

/**
 * Check if a period at the given position is part of an abbreviation.
 * Handles multi-period abbreviations like "U.S.A." and "Ph.D."
 */
function isAbbreviation(text: string, periodIndex: number): boolean {
  // Scan backwards to find start of abbreviation sequence (letters + periods)
  let start = periodIndex;
  while (start > 0 && /[A-Za-z.]/.test(text[start - 1])) {
    start--;
  }

  // Scan forward to find end of abbreviation sequence
  let end = periodIndex;
  while (end < text.length - 1 && /[A-Za-z.]/.test(text[end + 1])) {
    end++;
  }

  // If there are more periods/letters AFTER this one in the abbreviation chain,
  // this is an internal period — definitely not a sentence boundary.
  // E.g., the first two dots in "U.S.A." or first dot in "Ph.D."
  if (end > periodIndex) return true;

  // This is the last period in the chain. For single-dot abbreviations
  // (Mr., Dr., etc.), always block. For multi-dot abbreviations (U.S.A.,
  // Ph.D.), let normal boundary rules apply — the last period may be a
  // sentence boundary if followed by uppercase.
  const candidate = text.slice(start, end + 1);
  const withoutTrailing = candidate.replace(/\.$/, '');

  // Multi-dot abbreviation: allow normal boundary check for this last period
  if (withoutTrailing.includes('.')) {
    // Still check if the full sequence is a known abbreviation at all
    const parts = withoutTrailing.split('.');
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j <= parts.length; j++) {
        const combo = parts.slice(i, j).join('.');
        if (combo.length > 0 && ABBREVIATIONS.has(combo)) {
          return false; // Known abbreviation, let normal rules decide
        }
      }
    }
    // Not a recognized abbreviation — but let normal rules decide anyway
    return false;
  }

  // Single-dot abbreviation: check if it's a known abbreviation
  return ABBREVIATIONS.has(withoutTrailing);
}

/**
 * Check if a period at the given position is part of a decimal/version number.
 * Examples: "3.14", "v2.0", "version 1.5"
 */
function isDecimalNumber(text: string, periodIndex: number): boolean {
  // Check for digit.digit pattern: "3.14"
  if (
    periodIndex > 0 &&
    periodIndex < text.length - 1 &&
    /\d/.test(text[periodIndex - 1]) &&
    /\d/.test(text[periodIndex + 1])
  ) {
    return true;
  }
  // Check for alpha-digit.digit pattern: "v2.0", "version 1.5"
  const prefix = text.slice(Math.max(0, periodIndex - 10), periodIndex);
  if (/(?:[a-z]|\b)[\w]*\d\.\d/i.test(prefix + text.slice(periodIndex, periodIndex + 2))) {
    // More precise: check that we have a word char + digit before period, digit after
    const before = text.slice(Math.max(0, periodIndex - 5), periodIndex);
    const after = text.slice(periodIndex + 1, periodIndex + 3);
    if (/\d\.\d/.test(before.slice(-2) + '.' + after.charAt(0))) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a period is a NON-BOUNDARY part of an ellipsis.
 * The FIRST two dots of "..." are non-boundaries; the LAST dot IS a boundary.
 * Returns true if this period should be skipped (not a boundary).
 */
function isEllipsisNonBoundary(text: string, periodIndex: number): boolean {
  // If this period is followed by another period (i.e., it's not the last in a sequence),
  // it's a non-boundary. The last dot in "..." or "...." IS a boundary.
  if (periodIndex < text.length - 1 && text[periodIndex + 1] === '.') {
    return true;
  }
  return false;
}

/**
 * Determine if a period at the given index is a sentence boundary.
 * A period ends a sentence when:
 * 1. It is NOT part of an abbreviation
 * 2. It is NOT part of a decimal/version number
 * 3. It is NOT part of an ellipsis
 * 4. It is followed by whitespace + uppercase letter, OR it is at end of input
 */
function isSentenceBoundary(text: string, periodIndex: number): boolean {
  if (isAbbreviation(text, periodIndex)) return false;
  if (isDecimalNumber(text, periodIndex)) return false;
  if (isEllipsisNonBoundary(text, periodIndex)) return false;

  // Check what follows the period
  let i = periodIndex + 1;

  // Skip whitespace
  while (i < text.length && /\s/.test(text[i]) && text[i] !== '\n') {
    i++;
  }

  // End of input → sentence boundary
  if (i >= text.length) return true;

  const nextChar = text[i];
  // Uppercase letter (A-Z) → sentence boundary
  if (/[A-Z]/.test(nextChar)) return true;
  // Non-Latin character (CJK, Cyrillic, Arabic, etc.) → sentence boundary
  // This handles cases like "Hello. 你好. World." where the CJK character
  // isn't uppercase but still starts a new sentence.
  if (nextChar && !/[a-zA-Z]/.test(nextChar)) return true;

  return false;
}

/**
 * Count sentences in text. Handles abbreviations, decimal numbers,
 * ellipsis, and multiple terminators per the spec.
 *
 * Terminators: . (when not in abbreviation/decimal), !, ?
 * Ellipsis (...) counts as ONE terminator.
 * Text without terminators is treated as 1 sentence.
 */
export function countSentences(input: string): SentenceCountResult {
  // Strip BOM if present
  let text = input;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // Trim trailing whitespace
  text = text.trimEnd();

  if (text.length === 0) {
    return { count: 0, sentences: [] };
  }

  const sentences: string[] = [];
  let sentenceStart = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '.') {
      if (isSentenceBoundary(text, i)) {
        const sentence = text.slice(sentenceStart, i + 1).trim();
        if (sentence.length > 0) {
          sentences.push(sentence);
        }
        sentenceStart = i + 1;
      }
      // else: abbreviation, decimal, or ellipsis period — continue
    } else if (ch === '!' || ch === '?') {
      // Consume consecutive ! and ? at the same boundary
      let j = i;
      while (j < text.length && (text[j] === '!' || text[j] === '?')) {
        j++;
      }
      const sentence = text.slice(sentenceStart, j).trim();
      if (sentence.length > 0) {
        sentences.push(sentence);
      }
      sentenceStart = j;
      i = j - 1; // advance past the group
    }
  }

  // Remaining text after last terminator
  const remainder = text.slice(sentenceStart).trim();
  if (remainder.length > 0) {
    sentences.push(remainder);
  }

  // If no sentences were found, whole text is 1 sentence
  if (sentences.length === 0) {
    return { count: 1, sentences: [text] };
  }

  return { count: sentences.length, sentences };
}
