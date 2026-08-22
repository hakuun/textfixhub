import { describe, expect, it } from 'vitest';
import { negotiate, parseAccept } from './negotiate';

describe('parseAccept', () => {
  it('returns empty for null or empty headers', () => {
    expect(parseAccept(null)).toEqual([]);
    expect(parseAccept('')).toEqual([]);
  });

  it('parses types, wildcards, and q-values case-insensitively', () => {
    expect(parseAccept('Text/Markdown;q=0.7, */*;q=0.1')).toEqual([
      { type: 'text', subtype: 'markdown', q: 0.7 },
      { type: '*', subtype: '*', q: 0.1 },
    ]);
  });

  it('defaults missing q to 1 and clamps out-of-range values', () => {
    expect(parseAccept('text/markdown')[0].q).toBe(1);
    expect(parseAccept('text/markdown;q=2')[0].q).toBe(1);
    expect(parseAccept('text/markdown;q=-3')[0].q).toBe(0);
  });

  it('drops malformed entries but keeps valid ones', () => {
    expect(parseAccept('garbage, text/html;q=0.5')).toEqual([
      { type: 'text', subtype: 'html', q: 0.5 },
    ]);
  });
});

describe('negotiate', () => {
  it('serves markdown when text/markdown is explicitly requested', () => {
    expect(negotiate('text/markdown')).toBe('markdown');
    expect(negotiate('text/markdown;q=0.8')).toBe('markdown');
    expect(negotiate('TEXT/MARKDOWN')).toBe('markdown');
  });

  it('serves markdown when it outranks html by q-value', () => {
    expect(negotiate('text/markdown, text/html;q=0.5')).toBe('markdown');
    expect(negotiate('text/markdown;q=0.6, text/html;q=0.5')).toBe('markdown');
  });

  it('serves html for browsers and generic clients', () => {
    const browser =
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
    expect(negotiate(browser)).toBe('html');
    expect(negotiate('*/*')).toBe('html');
    expect(negotiate('text/*')).toBe('html');
    expect(negotiate(null)).toBe('html');
    expect(negotiate('')).toBe('html');
  });

  it('never serves markdown with q=0 even if listed first', () => {
    expect(negotiate('text/markdown;q=0, text/html;q=0.1')).toBe('html');
  });

  it('prefers html on ties (safe default)', () => {
    expect(negotiate('text/markdown, text/html')).toBe('html');
    expect(negotiate('text/markdown;q=0.5, text/html;q=0.5')).toBe('html');
  });

  it('treats application/xhtml+xml as html', () => {
    expect(negotiate('application/xhtml+xml, text/markdown;q=0.4')).toBe(
      'html',
    );
    expect(negotiate('text/markdown;q=0.6, application/xhtml+xml;q=0.4')).toBe(
      'markdown',
    );
  });
});
