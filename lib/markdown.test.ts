import { describe, expect, it } from 'vitest';
import {
  aboutMarkdown,
  homeMarkdown,
  llmsTxt,
  notFoundMarkdown,
  privacyMarkdown,
  termsMarkdown,
  toolMarkdown,
} from './markdown';
import { ALL_TOOLS, RELATED_TOOLS } from './text/types';
import { SITE_EMAIL, SITE_URL, PAGE_PATHS, markdownPathFor } from './site-routes';

const TOOL_URLS = ALL_TOOLS.map((tool) =>
  `${SITE_URL}${markdownPathFor(`/tools/${tool.slug}`)}`,
);

describe('homeMarkdown', () => {
  const md = homeMarkdown();

  it('starts with the H1 title and a blockquote summary', () => {
    expect(md.startsWith('# TextFixHub — Free Online Text Tools\n\n> ')).toBe(
      true,
    );
  });

  it('links the Markdown twin of every tool page', () => {
    for (const url of TOOL_URLS) {
      expect(md).toContain(url);
    }
  });

  it('states canonical URL and contact email', () => {
    expect(md).toContain(`Canonical URL: ${SITE_URL}/`);
    expect(md).toContain(SITE_EMAIL);
  });
});

describe('toolMarkdown', () => {
  it('renders each tool with canonical URL and related-tool links', () => {
    for (const tool of ALL_TOOLS) {
      const md = toolMarkdown(tool.slug);
      expect(md).not.toBeNull();
      expect((md as string).startsWith(`# ${tool.name}`)).toBe(true);
      expect(md).toContain(`Canonical URL: ${SITE_URL}/tools/${tool.slug}`);
      const relatedCount = (RELATED_TOOLS[tool.slug] ?? []).length;
      if (relatedCount > 0) {
        expect((md as string).match(/## Related tools/g)).toHaveLength(1);
        expect(
          (md as string).match(/\(https:\/\/www\.textfixhub\.com\/tools\//g),
        ).toHaveLength(relatedCount); // related bullets only; self links are bare URLs
      }
    }
  });

  it('returns null for unknown slugs', () => {
    expect(toolMarkdown('not-a-tool')).toBeNull();
  });
});

describe('legal/info pages', () => {
  it('about page names the builder and contact', () => {
    const md = aboutMarkdown();
    expect((md as string).startsWith('# About TextFixHub')).toBe(true);
    expect(md).toContain('Hakuun');
    expect(md).toContain(SITE_EMAIL);
  });

  it('privacy summary keeps the load-bearing claims', () => {
    const md = privacyMarkdown();
    expect(md).toContain('July 29, 2026');
    expect(md).toContain('do not collect any personal information');
    expect(md).toContain('Vercel');
  });

  it('terms summary keeps the liability cap and prohibited uses', () => {
    const md = termsMarkdown();
    expect(md).toContain('$100.00');
    expect(md).toContain('AS IS');
    expect(md).toContain('Prohibited');
  });
});

describe('llmsTxt', () => {
  const txt = llmsTxt();

  it('follows the llmstxt.org v2 section order: H1 → blockquote → prose → H2 lists', () => {
    const lines = txt.split('\n');
    expect(lines[0]).toBe('# TextFixHub');
    expect(lines[2].startsWith('> ')).toBe(true);
    const headings = lines.filter((l) => l.startsWith('#'));
    expect(headings[0].startsWith('# ')).toBe(true);
    expect(headings.slice(1).every((l) => l.startsWith('## '))).toBe(true);
  });

  it('contains the when-to-use guidance with best-fit jobs', () => {
    expect(txt).toContain('## When to use TextFixHub');
    expect(txt).toContain('Not a fit:');
  });

  it('links LLM-friendly .md versions of all tools and pages', () => {
    for (const url of TOOL_URLS) {
      expect(txt).toContain(url);
    }
    expect(txt).toContain(`${SITE_URL}/index.md`);
    expect(txt).toContain(`${SITE_URL}/about.md`);
    expect(txt).toContain(`${SITE_URL}/privacy.md`);
    expect(txt).toContain(`${SITE_URL}/terms.md`);
  });

  it('explains how to call the site (Accept header / .md suffix)', () => {
    expect(txt).toContain('Accept: text/markdown');
    expect(txt).toContain('.md');
  });
});

describe('notFoundMarkdown', () => {
  it('echoes the requested path and recovery links', () => {
    const md = notFoundMarkdown('/no-such-page');
    expect(md).toContain('`/no-such-page`');
    expect(md).toContain(`${SITE_URL}/sitemap.xml`);
    expect(md).toContain(`${SITE_URL}/llms.txt`);
    for (const url of TOOL_URLS) {
      expect(md).toContain(url);
    }
  });
});

describe('route manifest consistency', () => {
  it('every known page path has a deterministic markdown twin name', () => {
    expect(PAGE_PATHS).toHaveLength(4 + ALL_TOOLS.length);
    expect(markdownPathFor('/')).toBe('/index.md');
    for (const path of PAGE_PATHS) {
      expect(markdownPathFor(path)).toMatch(/^\/(.+)\.md$/);
    }
  });

  it('generators are deterministic (committed files must not churn per build)', () => {
    expect(homeMarkdown()).toBe(homeMarkdown());
    expect(llmsTxt()).toBe(llmsTxt());
    expect(notFoundMarkdown('/x')).toBe(notFoundMarkdown('/x'));
  });
});
