/**
 * Single source of truth for the site's extensionless page routes and URLs.
 *
 * Consumed by the middleware (route manifest for negotiation + agent 404s),
 * the markdown generators, and the JSON-LD modules.
 */
import { ALL_TOOLS } from './text/types';

export const SITE_URL = 'https://www.textfixhub.com';
export const SITE_EMAIL = 'kuangxiu0702@gmail.com';

/** Extensionless HTML routes, each with a Markdown twin at `<path>.md`. */
export const STATIC_PAGE_PATHS = ['/', '/about', '/privacy', '/terms'];
export const TOOL_PAGE_PATHS = ALL_TOOLS.map((tool) => `/tools/${tool.slug}`);
export const PAGE_PATHS = [...STATIC_PAGE_PATHS, ...TOOL_PAGE_PATHS];

/** Markdown twin of a page path: '/' → '/index.md', '/about' → '/about.md'. */
export function markdownPathFor(pagePath: string): string {
  return pagePath === '/' ? '/index.md' : `${pagePath}.md`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
