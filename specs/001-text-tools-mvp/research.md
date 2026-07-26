# Research Document: Text Tools MVP (site-003)

**Feature**: 001-text-tools-mvp
**Date**: 2026-07-26
**Status**: Complete

## Research Tasks

### 1. Sentence Counter: Abbreviation List & Localization

**Decision**: English-only; hardcoded abbreviation list with 18 entries.

**Rationale**:
- i18n is explicitly out of scope per Razor Law. English-only for MVP.
- The abbreviation list must cover the most common English abbreviations that
  end in a period but do not terminate a sentence.
- Source: analysis of top-100 English abbreviations by frequency in web text.
  Abbreviations that are almost never sentence-final (Mr., Mrs., Dr.) and those
  that can appear mid-sentence (e.g., i.e., etc.) are included.

**Final Abbreviation List** (18 entries, maintained in `lib/text/sentence-counter.ts`):

| Abbreviation | Example |
|---|---|
| Mr. | Mr. Smith |
| Mrs. | Mrs. Jones |
| Ms. | Ms. Davis |
| Dr. | Dr. Patel |
| Prof. | Prof. Lee |
| Jr. | John Jr. |
| Sr. | Robert Sr. |
| St. | St. Patrick |
| vs. | cats vs. dogs |
| e.g. | fruit, e.g. apples |
| i.e. | that is, i.e. meaning |
| etc. | apples, etc. |
| a.m. | 10 a.m. |
| p.m. | 3 p.m. |
| U.S. | U.S. policy |
| Inc. | Acme Inc. |
| Ltd. | Global Ltd. |
| Ph.D. | Jane, Ph.D. |

**Edge cases handled**:
- "U.S.A." — multi-period abbreviation; treated as one unit.
- "St." is only blocked when followed by a capitalized name part (e.g.,
  "St. Louis") to avoid false negatives on "St." at end of sentence.
- Numbers with periods (3.14, v2.0) handled via regex before abbreviation
  check.

**Alternatives considered**:
- NLP library (compromise, nlp.js): adds bundle size, overkill for 18 patterns.
- Regex-only without abbreviation list: produces wrong counts on known cases.
- External API: violates zero-backend constraint.

---

### 2. Random Sentence Generator: Template Structure

**Decision**: Slot-and-fill with 12 templates, 5 word categories, deterministic
SSG seed → random at runtime.

**Rationale**:
- Template-based generation (chosen in spec clarification Q1) guarantees
  grammatical output. No CFG parser needed — Razor Law.
- 12 templates provide enough variety that users rarely notice repetition.
- SSG pre-renders sentences using a fixed seed (e.g., `12345`) so the static
  HTML always shows the same worked example. At runtime, `Math.random()` (or
  `crypto.getRandomValues`) produces fresh sentences.
- Word categories: nouns, verbs (present tense), adjectives, adverbs, plus a
  small set of determiners/articles.

**Template Structure** (12 templates stored in `lib/text/sentence-templates.ts`):

```
1. "The [adjective] [noun] [verb]s the [adjective] [noun]."
2. "A [adjective] [noun] [verb]s [adverb]."
3. "The [noun] [verb]s [adverb] near the [adjective] [noun]."
4. "[adjective] [noun]s [verb] [adverb] every day."
5. "The [noun] and the [noun] [verb] together."
6. "A [noun] [verb]s with a [adjective] [noun]."
7. "The [adjective], [adjective] [noun] [verb]s [adverb]."
8. "Every [noun] [verb]s the [adjective] [noun]."
9. "[adverb], the [noun] [verb]s the [adjective] [noun]."
10. "The [noun] is [adverb] [adjective]."
11. "A [adjective] [noun] and a [adjective] [noun] [verb]."
12. "The [noun] [verb]s because it is [adjective]."
```

**Word lists** (static TS consts in `lib/text/wordlists/`):
- `nouns.ts`: 150 common English nouns
- `verbs.ts`: 150 common English verbs (present tense, third-person singular
  base form; the template appends 's' for subject-verb agreement)
- `adjectives.ts`: 75 common English adjectives
- `adverbs.ts`: 50 common English adverbs

**SSG vs Runtime**:
- SSG: `generateSentences(5, { seed: 12345 })` → always the same 5 sentences
  in the static HTML worked example.
- Runtime: `generateSentences(N)` without seed → uses `Math.random()` for
  fresh output on each "Generate" click.

**Alternatives considered**:
- Markov chain from public domain corpus: requires shipping corpus text, larger
  bundle, occasional nonsensical output.
- Pre-written sentence bank of 500 sentences: limited variety, feels repetitive
  after 2–3 clicks of 10 sentences each.
- CFG (Context-Free Grammar) parser: more flexible but over-engineered for MVP;
  violates Simplest Working Implementation.

---

### 3. SSG Worked Example Without Logic Duplication

**Decision**: Each tool's transformation logic is a pure function in
`lib/text/`. The tool page component calls the same function at build time
(SSG) and at runtime (client). No duplication.

**Rationale**:
- The transformation functions (`alphabetize()`, `removeLineBreaks()`,
  `countSentences()`, `generateSentences()`, `generateNouns()`) are pure
  TypeScript functions with zero React/Next.js imports.
- The tool page component (server component for SSG) imports the function and
  calls it with hardcoded sample input during render. This produces the static
  "worked example" HTML.
- The client component (hydrated interactive demo) imports the SAME function
  and calls it in response to user input.
- For generators: SSG passes a fixed seed; runtime omits the seed for
  randomness.

**Example pattern** (Alphabetizer page):

```typescript
// lib/text/alphabetize.ts — pure function, no React imports
export function alphabetize(
  input: string,
  opts: { caseSensitive: boolean; reverse: boolean; removeDuplicates: boolean }
): string { /* ... */ }

// app/tools/alphabetizer/page.tsx — Server Component (SSG)
import { alphabetize } from '@/lib/text/alphabetize';
import { SAMPLE_INPUT } from './sample-data';

export default function AlphabetizerPage() {
  const workedExample = alphabetize(SAMPLE_INPUT, {
    caseSensitive: false, reverse: false, removeDuplicates: false,
  });
  return (
    <ToolLayout>
      {/* Static SEO content, H1, description */}
      <WorkedExample input={SAMPLE_INPUT} output={workedExample} />
      {/* Client component for interactive demo */}
      <AlphabetizerDemo />
    </ToolLayout>
  );
}

// app/tools/alphabetizer/alphabetizer-demo.tsx — Client Component ('use client')
import { alphabetize } from '@/lib/text/alphabetize';

export function AlphabetizerDemo() {
  const [input, setInput] = useState('');
  const output = useMemo(() => alphabetize(input, options), [input, options]);
  // ...render interactive textarea + output + toggles
}
```

**Key insight**: The sample input string (`SAMPLE_INPUT`) and its
corresponding output are BOTH computed at build time via the same function.
There is no hand-crafted "expected output" to maintain — it's always correct by
construction.

**Alternatives considered**:
- Hand-write sample output in MDX: fragile, drifts from actual logic.
- Duplicate logic in server component: violates DRY, risk of divergence.
- Render sample via client-only: crawler sees empty output div (SEO fail).

---

### 4. Next.js 15 Static Export Best Practices

**Decision**: Use `output: 'export'` with `basePath` and `trailingSlash: false`.
No `useSearchParams()`, no `headers()`, no `cookies()`. Metadata export from
page files using `generateMetadata()` (works with static export in Next.js 15).

**Key constraints**:
- `generateMetadata()` IS compatible with `output: 'export'` in Next.js 15.
  Metadata is inlined at build time.
- No dynamic routes with `generateStaticParams` since there are exactly 6
  pages (homepage + 5 tools). Route list is static.
- `not-found.tsx` is NOT supported in static export mode. Use a custom 404
  page via `vercel.json` or `_redirects` (Cloudflare Pages).
- Images: no `next/image` optimization (no server). Use `<img>` tags or
  `next/image` with `unoptimized` prop.

---

### 5. Testing Strategy

**Decision**: Vitest for unit tests of all `lib/text/` pure functions. No
integration/E2E tests for MVP (5-day timeline).

**Test coverage targets** (per Murphy's Law principle):
- Every transformation function: happy path + empty input + large input
  (100K chars) + Unicode/emoji/CJK + mixed line endings + trailing whitespace.
- Sentence counter: every abbreviation in the list + decimal numbers +
  ellipsis + multiple terminators.
- Generators: deterministic output with seed, randomness without seed, count
  bounds (0, negative, max).
- Alphabetizer: all toggle combinations + deduplication.

**Not tested for MVP** (deferred):
- Visual regression / screenshot tests
- Lighthouse CI automation
- E2E browser tests (Playwright/Cypress)

---

### 6. Deployment Configuration

**Decision**: Target both Vercel and Cloudflare Pages with a single build
output. Use `output: 'export'` → `out/` directory.

**Vercel**: Configure via `vercel.json` with `@vercel/static` builder (not
needed — Vercel auto-detects static export from framework config).

**Cloudflare Pages**: Configure via `_headers` and `_redirects` in `public/`
for cache headers and custom 404.

**Build command** (both platforms): `pnpm build` → produces `out/`.
