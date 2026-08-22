/**
 * RFC 9110 Accept-header negotiation between text/markdown and text/html.
 *
 * Pure functions only (no Next.js imports) so the same logic runs in the edge
 * middleware and in vitest. See https://acceptmarkdown.com/start — parse the
 * header by q-value instead of substring matching.
 */

export type Representation = 'markdown' | 'html';

interface MediaRange {
  type: string;
  subtype: string;
  q: number;
}

/**
 * Parse an Accept header into media ranges. Entries without a "/" separator
 * are dropped; a missing or malformed q defaults to 1 per RFC 9110 §12.5.1.
 */
export function parseAccept(header: string | null): MediaRange[] {
  if (!header) return [];
  return header
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [range, ...params] = part.split(';');
      const [type = '', subtype = ''] = range.trim().toLowerCase().split('/');
      let q = 1;
      for (const param of params) {
        const [key, value] = param.split('=').map((s) => s.trim());
        if (key === 'q') {
          const parsed = Number.parseFloat(value);
          if (!Number.isNaN(parsed)) {
            q = Math.min(1, Math.max(0, parsed));
          }
        }
      }
      return { type, subtype, q };
    })
    .filter((range) => range.type !== '' && range.subtype !== '');
}

/** Highest q-value assigned to type/subtype across exact and wildcard ranges. */
function effectiveQ(ranges: MediaRange[], type: string, subtype: string): number {
  let best = 0;
  for (const range of ranges) {
    const matches =
      (range.type === type && range.subtype === subtype) ||
      (range.type === type && range.subtype === '*') ||
      (range.type === '*' && range.subtype === '*');
    if (matches && range.q > best) {
      best = range.q;
    }
  }
  return best;
}

/**
 * Decide which representation to serve.
 *
 * Markdown wins only when the client lists text/markdown with q > 0 strictly
 * above its quality for HTML (text/html or application/xhtml+xml). Ties,
 * wildcard-only clients, browsers, and absent Accept headers all get
 * HTML.
 */
export function negotiate(acceptHeader: string | null): Representation {
  const ranges = parseAccept(acceptHeader);
  if (ranges.length === 0) {
    return 'html';
  }
  const qMarkdown = effectiveQ(ranges, 'text', 'markdown');
  if (qMarkdown === 0) {
    return 'html';
  }
  const qHtml = Math.max(
    effectiveQ(ranges, 'text', 'html'),
    effectiveQ(ranges, 'application', 'xhtml+xml'),
  );
  return qMarkdown > qHtml ? 'markdown' : 'html';
}
