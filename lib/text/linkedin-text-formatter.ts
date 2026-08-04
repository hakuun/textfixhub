/**
 * LinkedIn Text Formatter — swaps ASCII alphanumerics for Unicode
 * Mathematical Alphanumeric Symbols so text renders as bold/italic/etc.
 * on platforms (like LinkedIn) that don't support rich text.
 *
 * Underline/strikethrough use combining marks (U+0332 / U+0336) appended
 * to each non-whitespace character.
 */

export interface LinkedinStyleDef {
  id: string;
  label: string;
  transform: (text: string) => string;
}

/**
 * Map ASCII letters/digits to a contiguous Unicode block.
 * Blocks used are the Mathematical Alphanumeric Symbols ranges, which are
 * complete and gapless for every style below. Characters outside A-Za-z0-9
 * (spaces, CJK, emoji, punctuation) pass through unchanged.
 *
 * @param upperStart code point of the block's CAPITAL A
 * @param lowerStart code point of the block's lowercase a
 * @param digitStart code point of the block's digit 0 (omit if the block has none)
 */
function mapAlpha(
  text: string,
  upperStart: number,
  lowerStart: number,
  digitStart?: number,
): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(upperStart + (code - 65));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(lowerStart + (code - 97));
    } else if (digitStart !== undefined && code >= 48 && code <= 57) {
      out += String.fromCodePoint(digitStart + (code - 48));
    } else {
      out += ch;
    }
  }
  return out;
}

const COMBINING_LOW_LINE = '̲'; // ̲ underline
const COMBINING_LONG_STROKE = '̶'; // ̶ strikethrough

/** Append a combining mark to every non-whitespace character. */
function applyCombining(text: string, combining: string): string {
  let out = '';
  for (const ch of text) {
    if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r') {
      out += ch;
      continue;
    }
    out += ch + combining;
  }
  return out;
}

const BOLD = (t: string) => mapAlpha(t, 0x1d400, 0x1d41a, 0x1d7ce);

/** Character styles — each transforms the whole input text. */
export const LINKEDIN_STYLES: LinkedinStyleDef[] = [
  {
    id: 'bold',
    label: 'Bold',
    transform: BOLD,
  },
  {
    id: 'bold-sans',
    label: 'Bold Sans',
    transform: (t) => mapAlpha(t, 0x1d5d4, 0x1d5ee, 0x1d7ec),
  },
  {
    id: 'italic',
    label: 'Italic',
    transform: (t) => mapAlpha(t, 0x1d434, 0x1d44e),
  },
  {
    id: 'italic-sans',
    label: 'Italic Sans',
    transform: (t) => mapAlpha(t, 0x1d608, 0x1d622),
  },
  {
    id: 'bold-italic',
    label: 'Bold Italic',
    transform: (t) => mapAlpha(t, 0x1d468, 0x1d482),
  },
  {
    id: 'bold-italic-sans',
    label: 'Bold Italic Sans',
    transform: (t) => mapAlpha(t, 0x1d63c, 0x1d656),
  },
  {
    id: 'monospace',
    label: 'Monospace',
    transform: (t) => mapAlpha(t, 0x1d670, 0x1d68a, 0x1d7f6),
  },
  {
    id: 'underline',
    label: 'Underline',
    transform: (t) => applyCombining(t, COMBINING_LOW_LINE),
  },
  {
    id: 'strikethrough',
    label: 'Strikethrough',
    transform: (t) => applyCombining(t, COMBINING_LONG_STROKE),
  },
  {
    id: 'bold-underline',
    label: 'Bold Underline',
    transform: (t) => applyCombining(BOLD(t), COMBINING_LOW_LINE),
  },
  {
    id: 'bold-strikethrough',
    label: 'Bold Strikethrough',
    transform: (t) => applyCombining(BOLD(t), COMBINING_LONG_STROKE),
  },
  {
    id: 'fullwidth',
    label: 'Fullwidth',
    transform: (t) => mapAlpha(t, 0xff21, 0xff41, 0xff10),
  },
  {
    id: 'uppercase',
    label: 'UPPERCASE',
    transform: (t) => t.toUpperCase(),
  },
  {
    id: 'lowercase',
    label: 'lowercase',
    transform: (t) => t.toLowerCase(),
  },
];

function lineMap(text: string, prefixFor: (line: string, index: number) => string): string {
  let n = 0;
  return text
    .split('\n')
    .map((line) => {
      if (line === '') return '';
      n += 1;
      return prefixFor(line, n) + line;
    })
    .join('\n');
}

export function listAsBullets(text: string): string {
  return lineMap(text, () => '• ');
}

export function listAsNumbered(text: string): string {
  return lineMap(text, (_line, n) => `${n}. `);
}

export function listAsChecklist(text: string): string {
  return lineMap(text, () => '☐ ');
}

/** Line/list styles — transform each non-empty input line. */
export const LINKEDIN_LISTS: LinkedinStyleDef[] = [
  { id: 'bullet', label: 'Bullet Points', transform: listAsBullets },
  { id: 'numbered', label: 'Numbered List', transform: listAsNumbered },
  { id: 'checklist', label: 'Checklist', transform: listAsChecklist },
];

/** Apply a style by id (character or list style). Unknown id → input unchanged. */
export function formatLinkedinText(text: string, styleId: string): string {
  const style =
    LINKEDIN_STYLES.find((s) => s.id === styleId) ??
    LINKEDIN_LISTS.find((s) => s.id === styleId);
  return style ? style.transform(text) : text;
}
