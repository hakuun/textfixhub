import type { TextStatistics } from './types';

/**
 * Known English abbreviations that should NOT trigger sentence boundaries.
 */
const ABBREVIATIONS = new Set([
  'Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Jr', 'Sr', 'St',
  'vs', 'e.g', 'i.e', 'etc', 'a.m', 'p.m', 'U.S',
  'Inc', 'Ltd', 'Ph.D',
]);

/**
 * Check if a period at the given position is part of an abbreviation.
 */
function isAbbreviation(text: string, periodIndex: number): boolean {
  let start = periodIndex;
  while (start > 0 && /[A-Za-z.]/.test(text[start - 1])) {
    start--;
  }

  let end = periodIndex;
  while (end < text.length - 1 && /[A-Za-z.]/.test(text[end + 1])) {
    end++;
  }

  // Internal period in multi-dot abbreviation (first two dots in "U.S.A.")
  if (end > periodIndex) return true;

  const candidate = text.slice(start, end + 1);
  const withoutTrailing = candidate.replace(/\.$/, '');

  // Multi-dot abbreviation: let normal boundary rules decide
  if (withoutTrailing.includes('.')) {
    const parts = withoutTrailing.split('.');
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j <= parts.length; j++) {
        const combo = parts.slice(i, j).join('.');
        if (combo.length > 0 && ABBREVIATIONS.has(combo)) {
          return false;
        }
      }
    }
    return false;
  }

  return ABBREVIATIONS.has(withoutTrailing);
}

/**
 * Check if a period is part of a decimal/version number.
 */
function isDecimalNumber(text: string, periodIndex: number): boolean {
  if (
    periodIndex > 0 &&
    periodIndex < text.length - 1 &&
    /\d/.test(text[periodIndex - 1]) &&
    /\d/.test(text[periodIndex + 1])
  ) {
    return true;
  }
  const before = text.slice(Math.max(0, periodIndex - 5), periodIndex);
  const after = text.slice(periodIndex + 1, periodIndex + 3);
  if (/\d\.\d/.test(before.slice(-2) + '.' + after.charAt(0))) {
    return true;
  }
  return false;
}

/**
 * Check if a period is a non-boundary part of an ellipsis.
 */
function isEllipsisNonBoundary(text: string, periodIndex: number): boolean {
  if (periodIndex < text.length - 1 && text[periodIndex + 1] === '.') {
    return true;
  }
  return false;
}

/**
 * Determine if a period at the given index is a sentence boundary.
 */
function isSentenceBoundary(text: string, periodIndex: number): boolean {
  if (isAbbreviation(text, periodIndex)) return false;
  if (isDecimalNumber(text, periodIndex)) return false;
  if (isEllipsisNonBoundary(text, periodIndex)) return false;

  let i = periodIndex + 1;
  while (i < text.length && /\s/.test(text[i]) && text[i] !== '\n') {
    i++;
  }

  if (i >= text.length) return true;

  const nextChar = text[i];
  if (/[A-Z]/.test(nextChar)) return true;
  if (nextChar && !/[a-zA-Z]/.test(nextChar)) return true;

  return false;
}

/**
 * Split text into sentences (internal helper).
 */
function splitSentences(text: string): string[] {
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
    } else if (ch === '!' || ch === '?') {
      let j = i;
      while (j < text.length && (text[j] === '!' || text[j] === '?')) {
        j++;
      }
      const sentence = text.slice(sentenceStart, j).trim();
      if (sentence.length > 0) {
        sentences.push(sentence);
      }
      sentenceStart = j;
      i = j - 1;
    }
  }

  const remainder = text.slice(sentenceStart).trim();
  if (remainder.length > 0) {
    sentences.push(remainder);
  }

  if (sentences.length === 0) {
    return [text];
  }

  return sentences;
}

/**
 * Count words in text (splits on whitespace, filters empty).
 */
function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Analyze text and return complete statistics.
 *
 * Metrics:
 * - sentenceCount: number of sentences (handles abbreviations, decimals, ellipsis)
 * - wordCount: total words (split on whitespace)
 * - charCountWithSpaces / charCountWithoutSpaces
 * - paragraphCount: blocks separated by blank lines
 * - lineCount: total lines
 * - avgSentenceLengthWords: words per sentence
 * - avgWordLengthChars: characters per word
 * - readingTimeMinutes: based on 200 wpm
 * - speakingTimeMinutes: based on 130 wpm
 */
export function countSentences(input: string): TextStatistics {
  // Strip BOM if present
  let text = input;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  text = text.trimEnd();

  if (text.length === 0) {
    return {
      sentenceCount: 0,
      wordCount: 0,
      charCountWithSpaces: 0,
      charCountWithoutSpaces: 0,
      paragraphCount: 0,
      lineCount: 0,
      avgSentenceLengthWords: 0,
      avgWordLengthChars: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      sentences: [],
    };
  }

  // Split into sentences
  const sentences = splitSentences(text);

  // Word count
  const wordCount = countWords(text);

  // Character counts
  const charCountWithSpaces = text.length;
  const charCountWithoutSpaces = text.replace(/\s/g, '').length;

  // Paragraphs: blocks separated by 2+ newlines (normalize first)
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const paragraphCount = paragraphs.length;

  // Lines: non-empty lines
  const lines = normalized.split('\n').filter(l => l.trim().length > 0);
  const lineCount = lines.length;

  // Averages
  const avgSentenceLengthWords = sentences.length > 0
    ? Math.round((wordCount / sentences.length) * 10) / 10
    : 0;

  const avgWordLengthChars = wordCount > 0
    ? Math.round((charCountWithoutSpaces / wordCount) * 10) / 10
    : 0;

  // Reading/speaking time
  const readingTimeMinutes = wordCount > 0
    ? Math.max(1, Math.round(wordCount / 200))
    : 0;

  const speakingTimeMinutes = wordCount > 0
    ? Math.max(1, Math.round(wordCount / 130))
    : 0;

  return {
    sentenceCount: sentences.length,
    wordCount,
    charCountWithSpaces,
    charCountWithoutSpaces,
    paragraphCount,
    lineCount,
    avgSentenceLengthWords,
    avgWordLengthChars,
    readingTimeMinutes,
    speakingTimeMinutes,
    sentences,
  };
}
