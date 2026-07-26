# Implementation Plan: Text Tools MVP (site-003)

**Branch**: `001-text-tools-mvp` | **Date**: 2026-07-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-text-tools-mvp/spec.md`

## Summary

Build a static multi-tool text utilities site (site-003) with 1 homepage and 5
tool pages: Alphabetizer, Line Break Remover, Sentence Counter, Random Sentence
Generator, Random Noun Generator. Pure SSG (Next.js 15 App Router, `output:
export`), zero backend, zero runtime dependencies. Each tool page is a
statically rendered HTML page with a client-side interactive demo. All
transformation logic lives in pure TypeScript functions under `lib/text/` —
fully unit-tested — and powers both the SSG worked example and the live
interactive demo.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode
**Primary Dependencies**: Next.js 15+ (App Router), Tailwind CSS 4.x, React 19
**Storage**: N/A — static files only, no database
**Testing**: Vitest (unit tests for `lib/text/` pure functions)
**Target Platform**: Vercel or Cloudflare Pages (static CDN)
**Project Type**: Web application (static SSG, no backend)
**Performance Goals**: LCP < 2.5s, CLS < 0.1, INP < 200ms; 500ms tool response
**Constraints**: Zero paid dependencies, zero runtime backend, `output: export`
**Scale/Scope**: 6 pages (1 homepage + 5 tools), ~50K monthly US search volume

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| **I. Razor Law — YAGNI & MVP Scope** | ✅ PASS | Exactly 1 homepage + 5 tool pages. No Pro tier, accounts, file upload, API, blog, i18n, theme toggle, analytics beyond GSC. |
| **II. Murphy's Law — Adversarial Input Testing** | ✅ PASS | Every `lib/text/` function has unit tests for empty input, >100K chars, Unicode/emoji/CJK/RTL, mixed line endings, trailing whitespace/BOM/zero-width chars. |
| **III. SEO-First Architecture** | ✅ PASS | All 6 pages statically generated. One H1 per page. Unique `<title>`, meta description, canonical, WebApplication JSON-LD per tool page. Worked example in SSG HTML. |
| **IV. Core Web Vitals & Mobile-First** | ✅ PASS | LCP < 2.5s, CLS < 0.1, INP < 200ms targets. Mobile-first design, 360px minimum width. |
| **V. Simplest Working Implementation** | ✅ PASS | No plugin system, no extensible registry. New tool = new page file. No shared component library beyond what 2+ pages actually use. No CSS-in-JS. Pure functions in `lib/text/`. |
| **Technical Standards** | ✅ PASS | Next.js 15+ App Router, TypeScript strict, Tailwind CSS, `output: 'export'`, zero paid deps. |

**GATE RESULT**: All principles pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-text-tools-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── tool-page-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
texttools/
├── app/
│   ├── layout.tsx                   # Root layout (metadata, JSON-LD)
│   ├── page.tsx                     # Homepage (5 tool cards)
│   ├── not-found.tsx               # (not supported in static export; use _redirects)
│   └── tools/
│       ├── alphabetizer/
│       │   ├── page.tsx             # SSG: ToolLayout + WorkedExample + AlphabetizerDemo
│       │   ├── alphabetizer-demo.tsx # 'use client' — interactive textarea + toggles
│       │   └── sample-data.ts       # SAMPLE_INPUT constant for SSG worked example
│       ├── line-break-remover/
│       │   ├── page.tsx
│       │   ├── line-break-remover-demo.tsx
│       │   └── sample-data.ts
│       ├── sentence-counter/
│       │   ├── page.tsx
│       │   ├── sentence-counter-demo.tsx
│       │   └── sample-data.ts
│       ├── random-sentence-generator/
│       │   ├── page.tsx
│       │   ├── sentence-generator-demo.tsx
│       │   └── sample-data.ts
│       └── random-noun-generator/
│           ├── page.tsx
│           ├── noun-generator-demo.tsx
│           └── sample-data.ts
├── components/
│   ├── ToolLayout.tsx               # Shared page shell (header, H1, description, footer)
│   ├── TextInput.tsx                # Shared textarea with debounce, paste handling
│   ├── OutputPanel.tsx              # Shared output display area
│   ├── ToolSidebar.tsx              # "Related Tools" cross-links at page bottom
│   ├── WorkedExample.tsx            # SSG-rendered sample I/O display
│   ├── EmptyState.tsx               # Friendly empty state message
│   ├── CountSelector.tsx            # +/- buttons + numeric input for generators
│   └── ToolCard.tsx                 # Card component for homepage
├── lib/
│   └── text/
│       ├── alphabetize.ts           # Pure function: sort + dedupe + reverse
│       ├── alphabetize.test.ts
│       ├── remove-line-breaks.ts    # Pure function: CRLF/LF/CR → flowing text
│       ├── remove-line-breaks.test.ts
│       ├── sentence-counter.ts      # Pure function: count with abbreviation awareness
│       ├── sentence-counter.test.ts
│       ├── generate-sentences.ts    # Pure function: template-based sentence generation
│       ├── generate-sentences.test.ts
│       ├── generate-nouns.ts        # Pure function: random noun selection
│       ├── generate-nouns.test.ts
│       ├── wordlists/
│       │   ├── nouns.ts             # 150 common English nouns
│       │   ├── verbs.ts             # 150 common English verbs
│       │   ├── adjectives.ts        # 75 common English adjectives
│       │   ├── adverbs.ts           # 50 common English adverbs
│       │   ├── noun-list.ts         # 400 common English nouns (for Noun Generator)
│       │   └── sentence-templates.ts # 12 sentence templates
│       └── types.ts                 # Shared types (ToolOptions, GeneratorOptions, etc.)
├── public/
│   ├── _headers                     # Cache headers (Cloudflare Pages)
│   └── _redirects                   # Custom 404 redirect
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts                   # output: 'export'
├── vitest.config.ts
└── vercel.json                      # (if deploying to Vercel)
```

**Structure Decision**: Single Next.js App Router project with `output:
'export'`. No monorepo, no backend directory. Pure functions in `lib/text/`
with co-located tests. Components shared only when used by 2+ pages.

## Complexity Tracking

> No constitution violations. Table intentionally empty.

