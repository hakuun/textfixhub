/**
 * Generates the Markdown twins of every page (plus llms.txt) into public/,
 * where they are served as static files. Runs before `next build` via the
 * build script; output is deterministic so committed files only change when
 * content changes.
 *
 * Usage: pnpm generate:markdown
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  aboutMarkdown,
  homeMarkdown,
  llmsTxt,
  privacyMarkdown,
  termsMarkdown,
  toolMarkdown,
} from '../lib/markdown';
import { ALL_TOOLS } from '../lib/text/types';

const PUBLIC_DIR = join(__dirname, '..', 'public');
const TOOLS_DIR = join(PUBLIC_DIR, 'tools');

mkdirSync(TOOLS_DIR, { recursive: true });

const files: Array<[string, string]> = [
  ['index.md', homeMarkdown()],
  ['about.md', aboutMarkdown()],
  ['privacy.md', privacyMarkdown()],
  ['terms.md', termsMarkdown()],
  ['llms.txt', llmsTxt()],
  ...ALL_TOOLS.map(
    (tool): [string, string] => [
      join('tools', `${tool.slug}.md`),
      toolMarkdown(tool.slug) ?? '',
    ],
  ),
];

for (const [relativePath, content] of files) {
  writeFileSync(join(PUBLIC_DIR, relativePath), content, 'utf8');
  console.log(`generated public/${relativePath.replace(/\\/g, '/')}`);
}
