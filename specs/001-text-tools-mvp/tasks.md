# Tasks: Text Tools MVP (site-003)

**Input**: Design documents from `/specs/001-text-tools-mvp/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/tool-page-contract.md

**Tests**: Unit tests are MANDATORY per Murphy's Law (Constitution Principle II). Every lib/text/ function must have ≥3 test cases: normal, boundary, edge.

**Organization**: Tasks are grouped by phase with explicit dependencies. Each tool's lib function, UI demo, and SSG page form a vertical slice; lib functions block UIs, UIs block SSG pages.

## Format: `[ID] [P?] [Phase] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Phase]**: A=Scaffolding, B=Lib, C=UI, D=SSG, E=Final
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/` for pages, `components/` for shared, `lib/text/` for pure functions
- **Co-located tests**: `lib/text/<name>.test.ts` next to `lib/text/<name>.ts`
- **Tool pages**: `app/tools/<slug>/page.tsx` (SSG) + `<slug>-demo.tsx` ('use client')

---

## Phase A: Project Scaffolding & Shared Infrastructure

**Purpose**: Project initialization, configuration, shared types, and reusable components. Everything else depends on this phase.

**⚠️ CRITICAL**: No tool work can begin until Phase A is complete.

- [ ] T001 Scaffold Next.js 15 project with TypeScript strict mode, Tailwind CSS 4.x, and pnpm in `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs`. Run `pnpm install` to verify. Acceptance: `pnpm dev` starts on localhost:3000 with no errors.

- [ ] T002 [P] [A] Configure `next.config.ts` for `output: 'export'` with no basePath, `trailingSlash: false`. Configure `vitest.config.ts` with `@vitejs/plugin-react` and `include: ['lib/**/*.test.ts']`. Install vitest dev dependency. Acceptance: `pnpm build` produces `out/` directory; `pnpm test --run` runs (0 tests, no errors).

- [ ] T003 [P] [A] Create `lib/text/types.ts` with `ToolMeta` interface, `ALL_TOOLS` const array (5 tools with slug, name, description, keyword, searchVolume, kd), `RELATED_TOOLS` Record<string, string[]>, `AlphabetizerOptions`, `LineBreakMode`, `SentenceCountResult`, `SentenceGeneratorOptions`, `NounGeneratorOptions`. Acceptance: TypeScript compiles with `pnpm tsc --noEmit`, all types exported.

- [ ] T004 [P] [A] Create `app/globals.css` with Tailwind directives (`@tailwind base/components/utilities`). Create `app/layout.tsx` root layout with `<html lang="en">`, viewport meta, favicon reference, and a minimal `<body>` that renders `{children}`. No header/nav — that lives in ToolLayout. Acceptance: `pnpm dev` renders a blank page with no console errors.

- [ ] T005 [P] [A] Create shared components in `components/`:
  - `ToolLayout.tsx`: page shell with `<header>` (site name link home), `<main>` slot for children, `<footer>` with copyright.
  - `EmptyState.tsx`: accepts `message: string` prop, renders centered text with an icon. Used when input is empty.
  - `TextInput.tsx`: `'use client'` textarea with `onChange` handler debounced at 300ms. Accepts `placeholder`, `value`, `onChange`. Handles paste events. Sets `dir="auto"` on textarea for RTL support.
  - `OutputPanel.tsx`: displays output text. Accepts `children` (or `text: string`). Has `dir="auto"` for RTL. Shows EmptyState when text is empty.
  Acceptance: Components compile, TypeScript strict passes, each has a basic render test or can be imported without error.

- [ ] T006 [P] [A] Create remaining shared components in `components/`:
  - `CountSelector.tsx`: `'use client'` with minus button, number display, plus button. Accepts `value: number`, `onChange: (n: number) => void`, `min: number`, `max: number`. Clamps at bounds.
  - `ToolCard.tsx`: renders a tool's name, description, and a `<Link>` to `/tools/<slug>`. Accepts `tool: ToolMeta`.
  - `WorkedExample.tsx`: Server Component. Renders static sample input and sample output side by side (or stacked on mobile). Accepts `input: string`, `output: string`, `inputLabel?: string`, `outputLabel?: string`.
  - `ToolSidebar.tsx`: Server Component. Accepts `currentSlug: string`, looks up `RELATED_TOOLS[currentSlug]`, renders 2–3 `ToolCard` links.
  Acceptance: Components compile and can be imported without error.

- [ ] T007 [P] [A] Create `public/_headers` (immutable cache for static assets: `/*.js`, `/*.css`) and `public/_redirects` (SPA fallback: `/* /index.html 200` for Cloudflare Pages, or `/404.html` custom 404). Add `vercel.json` with clean URLs config. Acceptance: Files exist with valid syntax; `pnpm build` includes them in `out/`.

**Checkpoint**: Project compiles, dev server runs, all shared components exist, types are defined. Ready for tool implementation.

---

## Phase B: Text Transformation Lib Functions + Unit Tests

**Purpose**: Every tool's core logic as pure, tested TypeScript functions. These ARE the product — correctness is non-negotiable.

**⚠️ Each function MUST have tests covering Murphy's Law inputs per Constitution Principle II.**

### B.0 — Word Lists (blocking for generators)

- [ ] T008 [P] [B] Create `lib/text/wordlists/nouns.ts` (150 common English nouns), `lib/text/wordlists/verbs.ts` (150 common English verbs in base form), `lib/text/wordlists/adjectives.ts` (75 common English adjectives), `lib/text/wordlists/adverbs.ts` (50 common English adverbs). Each file exports a `const` string array. Acceptance: Each file exports a non-empty string array; `pnpm tsc --noEmit` passes; each word is lowercase, ASCII-safe (no special chars).

- [ ] T009 [P] [B] Create `lib/text/wordlists/noun-list.ts` (400 common English nouns for Noun Generator) and `lib/text/wordlists/sentence-templates.ts` (12 sentence templates with `[noun]`, `[verb]`, `[adjective]`, `[adverb]` slots). Each file exports a `const` string array. Acceptance: Noun list has ≥400 unique lowercase entries; template file has exactly 12 strings, each containing at least one `[category]` placeholder.

### B.1 — Alphabetizer (Tool 1)

- [ ] T010 [P] [B] Create `lib/text/alphabetize.ts` with exported function:
  `function alphabetize(input: string, opts: AlphabetizerOptions): string`
  Behavior: split input by `\n`, trim whitespace per line (but preserve internal spaces), filter empty lines from output, sort with `Intl.Collator('en')` for case-insensitive default, handle Unicode/emoji/CJK by code point fallback, strip BOM (U+FEFF), normalize CRLF→LF.

  Create `lib/text/alphabetize.test.ts` with ≥8 test cases:
  1. Normal: `"Zebra\nApple\nMonkey"` → `"Apple\nMonkey\nZebra"` (case-insensitive default)
  2. Case Sensitive: `"apple\nApple\nAPPLE"` → `"APPLE\nApple\napple"` (code point order)
  3. Reverse: `"A\nB\nC"` + `reverse: true` → `"C\nB\nA"`
  4. Remove Duplicates: `"A\nB\nA\nC"` + `removeDuplicates: true` → `"A\nB\nC"`
  5. Empty input: `""` → `""`
  6. Large input: 100K chars (10K lines × 10 chars) → completes within 500ms
  7. Unicode/emoji: `"😀\n🍎\nA"` → stable, sorted output
  8. Mixed line endings: `"A\r\nB\nC\r"` → `"A\nB\nC"`
  9. BOM: `"﻿Apple\nBanana"` → `"Apple\nBanana"` (BOM stripped)
  10. Trailing whitespace: `"Apple  \n  Banana"` → `"Apple\nBanana"` (trimmed)

  Acceptance: All 10 tests pass with `pnpm test --run`. Function compiles in strict mode.

### B.2 — Line Break Remover (Tool 2)

- [ ] T011 [P] [B] Create `lib/text/remove-line-breaks.ts` with exported function:
  `function removeLineBreaks(input: string, mode: LineBreakMode): string`
  Behavior: normalize all line endings to `\n` first. In `'replace-with-space'`: single `\n` → space, 2+ consecutive `\n` → preserved as `\n` (paragraph break). In `'remove-entirely'`: all `\n` → `''`. Strip BOM.

  Create `lib/text/remove-line-breaks.test.ts` with ≥7 test cases:
  1. Normal CRLF: `"Hello\r\nWorld"` + replace-with-space → `"Hello World"`
  2. Normal LF: `"Hello\nWorld"` + replace-with-space → `"Hello World"`
  3. Paragraph break: `"Hello\n\nWorld"` + replace-with-space → `"Hello\nWorld"`
  4. Remove entirely: `"Hello\nWorld\nTest"` + remove-entirely → `"HelloWorldTest"`
  5. Empty input: `""` → `""`
  6. Large input: 100K chars (single long line with 10K line breaks) → completes within 500ms
  7. Mixed endings: `"A\r\nB\nC\r"` + replace-with-space → `"A B C"`
  8. Trailing newline: `"Text\n"` + replace-with-space → `"Text"`

  Acceptance: All 8 tests pass. Function compiles in strict mode.

### B.3 — Sentence Counter (Tool 3)

- [ ] T012 [P] [B] Create `lib/text/sentence-counter.ts` with exported function:
  `function countSentences(input: string): SentenceCountResult`
  Behavior: detect sentences by `.` (when followed by space+uppercase A-Z or end-of-input), `!`, `?`. Do NOT split on periods in: the 18 known abbreviations (see research.md), decimal/version numbers (`/\d+\.\d+/`, `/\b[a-z]+\d+\.\d+/`), ellipsis (`...` counts as ONE terminator). Return `{ count: number, sentences: string[] }`. Treat text with no terminators as 1 sentence.

  Create `lib/text/sentence-counter.test.ts` with ≥10 test cases:
  1. Basic: `"Hello. World!"` → `{ count: 2, sentences: ["Hello.", "World!"] }`
  2. Abbreviations: `"Mr. Smith went to Dr. Jones. He left."` → `{ count: 2, sentences: [...] }` (Mr., Dr. are NOT boundaries)
  3. All 18 abbreviations tested individually: each `{abbr} Test.` → count 1
  4. Decimal numbers: `"Version 3.14 is new. It rocks."` → `{ count: 2 }` (3.14 does NOT split)
  5. Ellipsis: `"Wait... What?"` → `{ count: 2 }` (ellipsis is ONE terminator)
  6. Multiple terminators: `"No!!! Really?! Yes."` → `{ count: 3 }`
  7. No terminator: `"Hello world"` → `{ count: 1 }`
  8. Empty input: `""` → `{ count: 0, sentences: [] }`
  9. Large input: 100K chars → completes within 500ms
  10. Mixed `!` and `?`: `"Go! Now! Please?"` → `{ count: 3 }`

  Acceptance: All 10 tests pass. Function compiles in strict mode.

### B.4 — Random Sentence Generator (Tool 4)

- [ ] T013 [B] Create `lib/text/generate-sentences.ts` with exported function:
  `function generateSentences(opts: SentenceGeneratorOptions): string[]`
  Behavior: for each of `count` sentences, pick a random template from `SENTENCE_TEMPLATES`, replace each `[category]` slot with a random word from the corresponding word list. If `seed` is provided, use a seeded PRNG (simple mulberry32 or similar) for deterministic output. Without seed, use `Math.random()`. Apply simple grammar fix: if template has `[verb]s` pattern, append 's' to verb for third-person singular. Capitalize first letter of each sentence.

  Create `lib/text/generate-sentences.test.ts` with ≥6 test cases:
  1. Default count (5): produces 5 non-empty strings, each starting with capital letter, ending with `.`
  2. Custom count (10): produces 10 sentences
  3. Count 1: produces exactly 1 sentence
  4. Count 0: returns `[]`
  5. Deterministic seed: `generateSentences({ count: 5, seed: 12345 })` called twice → identical results
  6. No seed randomness: two calls with no seed → different results (run 5 trials, at least 1 differs)
  7. Count 500: produces 500 sentences, completes within 500ms

  Acceptance: All 7 tests pass. Templates parse correctly (no leftover `[category]` markers in output).

### B.5 — Random Noun Generator (Tool 5)

- [ ] T014 [P] [B] Create `lib/text/generate-nouns.ts` with exported function:
  `function generateNouns(opts: NounGeneratorOptions): string[]`
  Behavior: shuffle the noun list using Fisher-Yates with optional seed. Return first `count` nouns. If `count` > list length, return all nouns (no duplicates). Seed parameter enables deterministic SSG output.

  Create `lib/text/generate-nouns.test.ts` with ≥6 test cases:
  1. Default count (10): produces 10 unique nouns
  2. Custom count (20): produces 20 unique nouns
  3. Count 1: produces exactly 1 noun
  4. Count 0: returns `[]`
  5. Deterministic seed: `generateNouns({ count: 10, seed: 12345 })` called twice → identical results
  6. No duplicates: `generateNouns({ count: 400 })` → all 400 entries, `new Set(result).size === 400`
  7. Exhaustion: count=500 (when list has 400) → returns all 400 nouns

  Acceptance: All 7 tests pass. Function compiles in strict mode.

**Checkpoint**: All 5 lib functions exist, all tests pass (≥50 test cases total across all tools). The product's core logic is verified correct.

---

## Phase C: Interactive UI (Client Components)

**Purpose**: Wire each lib function to a `'use client'` React component with real-time I/O.

**Dependency**: Each UI task depends on its corresponding Phase B lib function.

### C.1 — Alphabetizer Demo

- [ ] T015 [C] Create `app/tools/alphabetizer/alphabetizer-demo.tsx` ('use client'):
  Uses `TextInput`, `OutputPanel`. Three toggle switches: Case Sensitive, Reverse Order, Remove Duplicates. Calls `alphabetize(input, opts)` via `useMemo` on input/opts change. Debounce at 300ms via TextInput. Displays sorted output in OutputPanel. When input is empty, OutputPanel shows EmptyState with "Paste your list above to get started." Acceptance: Paste `"Zebra\nApple\nMonkey\nApple"` → output shows sorted lines in real-time; toggles change output immediately; empty input shows empty state message.

### C.2 — Line Break Remover Demo

- [ ] T016 [P] [C] Create `app/tools/line-break-remover/line-break-remover-demo.tsx` ('use client'):
  Uses `TextInput`, `OutputPanel`. Radio group or segmented control for mode: "Replace with space" (default) / "Remove entirely". Calls `removeLineBreaks(input, mode)` on input/mode change. Acceptance: Paste `"Hello\r\nWorld\n\nTest"` with default mode → output `"Hello World\nTest"`; switch to "Remove entirely" → output `"HelloWorldTest"`; empty input shows empty state.

### C.3 — Sentence Counter Demo

- [ ] T017 [P] [C] Create `app/tools/sentence-counter/sentence-counter-demo.tsx` ('use client'):
  Uses `TextInput`. Displays large count number prominently above the input. Calls `countSentences(input)` on input change (debounced). Shows both the count and optionally the list of extracted sentences below. Acceptance: Paste `"Mr. Smith went to Dr. Jones. He said hello! How are you?"` → displays "3 sentences"; empty input → "0 sentences" with prompt; paste 10K chars → count updates within 500ms.

### C.4 — Random Sentence Generator Demo

- [ ] T018 [P] [C] Create `app/tools/random-sentence-generator/sentence-generator-demo.tsx` ('use client'):
  Uses `CountSelector` (default 5, min 1, max 500). Uses `OutputPanel` to display generated sentences. "Generate" button triggers new generation. Calls `generateSentences({ count })` without seed (random). Displays sentences as a numbered or bulleted list in OutputPanel. Acceptance: Default load shows "Generate" button + CountSelector at 5; clicking Generate calls function and displays 5 sentences; changing count to 10 and generating shows 10; two clicks produce different outputs.

### C.5 — Random Noun Generator Demo

- [ ] T019 [P] [C] Create `app/tools/random-noun-generator/noun-generator-demo.tsx` ('use client'):
  Uses `CountSelector` (default 10, min 1, max 500). Uses `OutputPanel` to display generated nouns. "Generate" button triggers new generation. Calls `generateNouns({ count })` without seed (random). Displays nouns as a comma-separated or bulleted list. If count exceeds list size, shows informational note "Showing all N nouns in our list." Acceptance: Default load shows CountSelector at 10 + Generate button; clicking Generate displays 10 nouns; count=500 (when list has 400) shows all 400 with note.

**Checkpoint**: All 5 tool demos render and respond to user input. Interactive behavior works end-to-end (input → lib function → output).

---

## Phase D: SSG Pages (Static Generation + SEO)

**Purpose**: Each tool page as a statically generated route with full SEO metadata, JSON-LD, and a worked example in the static HTML.

**Dependency**: Each SSG page task depends on its corresponding Phase C UI component.

### D.1 — Alphabetizer SSG Page

- [ ] T020 [D] Create `app/tools/alphabetizer/sample-data.ts` with `SAMPLE_INPUT` = `"Zebra\napple\nMonkey\nApple\nzebra"`.

  Create `app/tools/alphabetizer/page.tsx` (Server Component):
  - Calls `alphabetize(SAMPLE_INPUT, defaultOpts)` at build time → `workedExampleOutput`.
  - Exports `generateMetadata()` returning: `<title>Alphabetizer - Free Online Alphabetize List Tool | TextTools</title>`, meta description (120–155 chars with keyword "alphabetize list"), canonical `/tools/alphabetizer`.
  - Exports a `WebApplication` JSON-LD with `name: "Alphabetizer"`, `description`, `url`, `applicationCategory: "UtilityApplication"`, `operatingSystem: "Any"`.
  - Renders: `<ToolLayout>` with H1 "Alphabetizer", H2 "Sort any list alphabetically — instantly", H3 "How It Works" + instructional text, H3 "Example" + `<WorkedExample input={SAMPLE_INPUT} output={workedExampleOutput}>`, `<AlphabetizerDemo>`, `<ToolSidebar currentSlug="alphabetizer">`.

  Acceptance: `pnpm build` succeeds; opening `out/tools/alphabetizer/index.html` without JS shows H1, description, worked example input/output, related tools links; JSON-LD block is present in `<head>`; title and meta description include keyword "alphabetize list".

### D.2 — Line Break Remover SSG Page

- [ ] T021 [P] [D] Create `app/tools/line-break-remover/sample-data.ts` with `SAMPLE_INPUT` = `"Hello\r\nWorld\n\nTest"`.

  Create `app/tools/line-break-remover/page.tsx` (Server Component):
  - Calls `removeLineBreaks(SAMPLE_INPUT, 'replace-with-space')` at build time.
  - Exports metadata targeting keyword "remove line breaks".
  - JSON-LD `WebApplication` for "Line Break Remover".
  - Renders: H1 "Line Break Remover", H2 "Remove line breaks from pasted text instantly", worked example with mode="Replace with space", demo component, ToolSidebar.

  Acceptance: Static HTML contains H1, description, worked example. Title/meta include "remove line breaks". JSON-LD present. JS-disabled view shows full static content.

### D.3 — Sentence Counter SSG Page

- [ ] T022 [P] [D] Create `app/tools/sentence-counter/sample-data.ts` with `SAMPLE_INPUT` = `"Mr. Smith went to Dr. Jones. He said hello! How are you?"`.

  Create `app/tools/sentence-counter/page.tsx` (Server Component):
  - Calls `countSentences(SAMPLE_INPUT)` at build time → `{ count: 3, sentences: [...] }`.
  - Exports metadata targeting keyword "sentence counter".
  - JSON-LD `WebApplication` for "Sentence Counter".
  - Worked example shows the sample text and "3 sentences" result.
  - H2 explains abbreviation handling (differentiator copy — this is why the tool beats naïve splitters).
  - Renders: H1 "Sentence Counter", H2, example, demo, ToolSidebar.

  Acceptance: Static HTML shows count=3 for the sample. JS-disabled view shows tool description mentioning abbreviation handling. Title includes "sentence counter".

### D.4 — Random Sentence Generator SSG Page

- [ ] T023 [P] [D] Create `app/tools/random-sentence-generator/sample-data.ts` exporting `DEFAULT_COUNT = 5` and `SSG_SEED = 12345`.

  Create `app/tools/random-sentence-generator/page.tsx` (Server Component):
  - Calls `generateSentences({ count: 5, seed: 12345 })` at build time → deterministic output.
  - Exports metadata targeting keyword "random sentence generator".
  - JSON-LD `WebApplication` for "Random Sentence Generator".
  - Worked example shows the 5 SSG-generated sentences.
  - Renders: H1 "Random Sentence Generator", H2 description, example, demo, ToolSidebar.

  Acceptance: Static HTML always shows the same 5 sentences (deterministic seed). JS-disabled view shows the example sentences. Title includes "random sentence generator".

### D.5 — Random Noun Generator SSG Page

- [ ] T024 [P] [D] Create `app/tools/random-noun-generator/sample-data.ts` exporting `DEFAULT_COUNT = 10` and `SSG_SEED = 12345`.

  Create `app/tools/random-noun-generator/page.tsx` (Server Component):
  - Calls `generateNouns({ count: 10, seed: 12345 })` at build time → deterministic output.
  - Exports metadata targeting keyword "random noun generator".
  - JSON-LD `WebApplication` for "Random Noun Generator".
  - Worked example shows the 10 SSG-generated nouns.
  - Renders: H1 "Random Noun Generator", H2, example, demo, ToolSidebar.

  Acceptance: Static HTML always shows the same 10 nouns. JS-disabled view shows the example nouns. Title includes "random noun generator".

**Checkpoint**: All 5 tool pages build as static HTML. Each page has unique metadata, JSON-LD, and a visible worked example without JS. `pnpm build` succeeds with zero errors.

---

## Phase E: Homepage + SEO Finalization

**Purpose**: The homepage (index), sitemap, robots.txt, and final build validation.

- [ ] T025 [E] Create `app/page.tsx` (Server Component, homepage):
  - Exports metadata: `<title>Free Online Text Tools - Alphabetize, Count Sentences, Generate Random Text | TextTools</title>`, meta description targeting a broad text-tools discovery keyword.
  - JSON-LD `WebSite` schema (not WebApplication — homepage describes the site).
  - Renders: H1 "Free Online Text Tools", a short intro paragraph, a grid of 5 `<ToolCard>` components (one per tool in `ALL_TOOLS`), footer with links.
  - Each ToolCard links to `/tools/<slug>`.
  - Mobile-first: single column on mobile, 2–3 columns on tablet/desktop.

  Acceptance: `pnpm build` produces `out/index.html`. JS-disabled view shows H1, all 5 tool cards with names/descriptions/links. Homepage has unique title and meta description. JSON-LD WebSite schema present.

- [ ] T026 [P] [E] Create `app/sitemap.ts` exporting a `sitemap()` function returning static URLs for `/`, `/tools/alphabetizer`, `/tools/line-break-remover`, `/tools/sentence-counter`, `/tools/random-sentence-generator`, `/tools/random-noun-generator` with `lastModified` and `changeFrequency`. Create `app/robots.ts` exporting a `robots()` function allowing all crawlers and pointing `Sitemap: <domain>/sitemap.xml`. Acceptance: `pnpm build` produces `out/sitemap.xml` and `out/robots.txt` with valid XML/plain-text format. Both files include all 6 pages.

- [ ] T027 [E] Final build validation & Lighthouse audit:
  - Run `pnpm build` → verify zero errors, `out/` contains all 6 HTML files + sitemap.xml + robots.txt + _headers + _redirects.
  - Manual check: open `out/index.html` in browser, verify all links work (relative paths).
  - Run Lighthouse mobile audit on each page (can be done manually or via Chrome DevTools). Verify Performance ≥ 90, Accessibility ≥ 90, SEO = 100 for homepage + all 5 tool pages.
  - Verify JS-disabled view: disable JS in browser, reload each tool page, confirm H1 + description + worked example visible.
  - Verify 360px mobile: resize to 360px width, confirm no horizontal scrollbar on any page.

  Acceptance: `pnpm build` succeeds. All 6 pages pass Lighthouse thresholds. JS-disabled view functional. 360px mobile renders correctly.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase A)**: No dependencies — can start immediately
- **Lib Functions (Phase B)**: Depends on Phase A completion. Word lists (T008, T009) block generators (T013, T014). T010–T012 can start immediately after Phase A.
- **Interactive UI (Phase C)**: Depends on Phase B completion for the corresponding tool.
- **SSG Pages (Phase D)**: Depends on Phase C completion for the corresponding tool.
- **Final (Phase E)**: Depends on Phase D completion (needs all tool pages built).

### Tool Dependency Chains

```
A (scaffolding)
├── T010 (alphabetize.ts) → T015 (alphabetizer demo) → T020 (alphabetizer SSG)
├── T011 (remove-line-breaks.ts) → T016 (LBR demo) → T021 (LBR SSG)
├── T012 (sentence-counter.ts) → T017 (SC demo) → T022 (SC SSG)
├── T008 (wordlists: nouns/verbs/adjs/advs) ─┐
│   T009 (wordlists: noun-list/templates) ───┤
│   └── T013 (generate-sentences.ts) → T018 (RSG demo) → T023 (RSG SSG)
└── T009 (noun-list) ─── T014 (generate-nouns.ts) → T019 (RNG demo) → T024 (RNG SSG)
                                                                          │
                                                                          └── T025 (homepage)
                                                                               T026 (sitemap/robots)
                                                                               T027 (final validation)
```

### Parallel Opportunities

- **Phase A**: T002, T003, T004, T005, T006, T007 can all run in parallel after T001
- **Phase B**: T008, T009, T010, T011, T012 all run in parallel. T013 after T008+T009. T014 after T009.
- **Phase C**: T015, T016, T017, T018, T019 all run in parallel (each depends only on its own lib function)
- **Phase D**: T020, T021, T022, T023, T024 all run in parallel (each depends only on its own UI component)
- **Phase E**: T025 and T026 run in parallel. T027 after all others.

---

## Implementation Strategy

### MVP First (All Tools)

1. Complete Phase A: Setup → Foundation ready
2. Complete Phase B: All lib functions + tests → Core logic verified
3. Complete Phase C: All interactive demos → UI functional
4. Complete Phase D: All SSG pages → SEO-complete static pages
5. Complete Phase E: Homepage + sitemap + validation → Ship-ready

### Incremental Delivery

Each tool can be demoed as soon as its vertical slice is complete:
- T010 → T015 → T020: Alphabetizer demoable
- T011 → T016 → T021: Line Break Remover demoable
- T012 → T017 → T022: Sentence Counter demoable
- T013 → T018 → T023: Random Sentence Generator demoable
- T014 → T019 → T024: Random Noun Generator demoable

---

## Notes

- [P] tasks = different files, no dependencies on other in-progress tasks
- [Phase] label = A/B/C/D/E for grouping
- Each lib function test must cover Murphy's Law per Constitution Principle II
- SEO (metadata, JSON-LD, worked example) is part of each tool's SSG task, not deferred
- Razor Law: no task may add features beyond the 1 homepage + 5 tool pages scope
- Commit after each task or logical group
- Stop at any checkpoint to validate tool independently
