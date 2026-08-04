import { describe, it, expect } from 'vitest';
import {
  LINKEDIN_STYLES,
  LINKEDIN_LISTS,
  formatLinkedinText,
  listAsBullets,
  listAsNumbered,
  listAsChecklist,
} from './linkedin-text-formatter';

describe('bold block', () => {
  const style = LINKEDIN_STYLES.find((s) => s.id === 'bold')!;

  it('maps A-Z to mathematical bold capitals', () => {
    expect(style.transform('ABC')).toBe('\u{1D400}\u{1D401}\u{1D402}');
  });

  it('maps a-z to mathematical bold lowercase', () => {
    expect(style.transform('xyz')).toBe('\u{1D431}\u{1D432}\u{1D433}');
  });

  it('maps 0-9 to mathematical bold digits', () => {
    expect(style.transform('0129')).toBe(
      '\u{1D7CE}\u{1D7CF}\u{1D7D0}\u{1D7D7}',
    );
  });

  it('leaves spaces, punctuation, CJK and emoji unchanged', () => {
    expect(style.transform('A B,你好😀')).toBe(
      '\u{1D400} \u{1D401},你好😀',
    );
  });

  it('returns empty string for empty input', () => {
    expect(style.transform('')).toBe('');
  });

  it('handles surrogate pairs (emoji) without breaking', () => {
    const out = style.transform('a😀b');
    expect(out).toBe('\u{1D41A}😀\u{1D41B}');
  });
});

describe('other character blocks', () => {
  it('bold-sans maps A and 0', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'bold-sans')!;
    expect(s.transform('A0')).toBe('\u{1D5D4}\u{1D7EC}');
  });

  it('italic has no digit block (digits pass through)', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'italic')!;
    expect(s.transform('A1')).toBe('\u{1D434}1');
  });

  it('italic maps lowercase h to PLANCK CONSTANT (U+210E), not the reserved U+1D455', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'italic')!;
    expect(s.transform('h')).toBe('ℎ');
    expect(s.transform('hi')).toBe('ℎ\u{1D456}');
  });

  it('bold-italic maps letters', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'bold-italic')!;
    expect(s.transform('Ab')).toBe('\u{1D468}\u{1D483}');
  });

  it('monospace maps letters and digits', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'monospace')!;
    expect(s.transform('a7')).toBe('\u{1D68A}\u{1D7FD}');
  });

  it('fullwidth maps A, a and 0', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'fullwidth')!;
    expect(s.transform('Aa0')).toBe('\u{FF21}\u{FF41}\u{FF10}');
  });
});

describe('combining styles', () => {
  it('underline appends combining low line to each non-space char', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'underline')!;
    expect(s.transform('A b')).toBe('A̲ b̲');
  });

  it('strikethrough appends combining long stroke', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'strikethrough')!;
    expect(s.transform('AB')).toBe('A̶B̶');
  });

  it('bold-underline combines bold mapping with underline mark', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'bold-underline')!;
    expect(s.transform('A')).toBe('\u{1D400}̲');
  });

  it('keeps newlines unmarked', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'strikethrough')!;
    expect(s.transform('A\nB')).toBe('A̶\nB̶');
  });
});

describe('case styles', () => {
  it('uppercase transforms case', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'uppercase')!;
    expect(s.transform('hello WORLD')).toBe('HELLO WORLD');
  });

  it('lowercase transforms case', () => {
    const s = LINKEDIN_STYLES.find((x) => x.id === 'lowercase')!;
    expect(s.transform('Hello World')).toBe('hello world');
  });
});

describe('list styles', () => {
  it('bullets each non-empty line', () => {
    expect(listAsBullets('one\ntwo')).toBe('• one\n• two');
  });

  it('bullet preserves empty lines as separators', () => {
    expect(listAsBullets('one\n\ntwo')).toBe('• one\n\n• two');
  });

  it('numbered counts only non-empty lines', () => {
    expect(listAsNumbered('alpha\n\nbeta')).toBe('1. alpha\n\n2. beta');
  });

  it('checklist prefixes each line', () => {
    expect(listAsChecklist('todo\ndone')).toBe('☐ todo\n☐ done');
  });

  it('returns empty string for empty input', () => {
    expect(listAsBullets('')).toBe('');
  });
});

describe('formatLinkedinText', () => {
  it('routes to the requested style', () => {
    expect(formatLinkedinText('Hi', 'bold')).toBe('\u{1D407}\u{1D422}');
  });

  it('routes to list styles', () => {
    expect(formatLinkedinText('a\nb', 'bullet')).toBe('• a\n• b');
  });

  it('falls back to input for unknown style ids', () => {
    expect(formatLinkedinText('keep', 'nope')).toBe('keep');
  });
});
