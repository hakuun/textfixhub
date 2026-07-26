# Quickstart: Text Tools MVP (site-003)

**Feature**: 001-text-tools-mvp
**Date**: 2026-07-26

## Prerequisites

- Node.js 20+
- pnpm 9+
- Git

## Setup

```bash
# Clone the repo
git clone <repo-url> texttools
cd texttools

# Install dependencies
pnpm install

# Run dev server
pnpm dev
# → http://localhost:3000
```

## Project Layout

```
texttools/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (/)
│   └── tools/              # Tool pages (/tools/<slug>)
│       ├── alphabetizer/
│       ├── line-break-remover/
│       ├── sentence-counter/
│       ├── random-sentence-generator/
│       └── random-noun-generator/
├── components/             # Shared React components
│   ├── ToolLayout.tsx      # Page shell (H1, description, footer)
│   ├── TextInput.tsx       # Textarea with debounce
│   ├── OutputPanel.tsx     # Output display area
│   ├── ToolSidebar.tsx     # Related tools cross-links
│   ├── WorkedExample.tsx   # Static sample I/O display (SSG)
│   ├── EmptyState.tsx      # Friendly empty state
│   ├── CountSelector.tsx   # Generator count control
│   └── ToolCard.tsx        # Homepage card
├── lib/text/               # Pure transformation functions
│   ├── alphabetize.ts
│   ├── remove-line-breaks.ts
│   ├── sentence-counter.ts
│   ├── generate-sentences.ts
│   ├── generate-nouns.ts
│   └── wordlists/          # Static vocabulary data
└── public/                 # Static assets
```

## Key Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Static export → out/
pnpm test         # Run Vitest unit tests
pnpm test --run   # Run tests once (no watch mode)
pnpm lint         # Run ESLint
```

## How to Add a New Tool (Post-MVP)

Per Razor Law, this is out of MVP scope. For future reference:

1. Create `lib/text/<tool-name>.ts` — pure function + tests
2. Create `app/tools/<slug>/page.tsx` — SSG page
3. Create `app/tools/<slug>/<tool>-demo.tsx` — client interactive demo
4. Create `app/tools/<slug>/sample-data.ts` — SSG sample input
5. Add tool metadata to `ALL_TOOLS` in `lib/text/types.ts`
6. Add cross-links to `RELATED_TOOLS` in `lib/text/types.ts`

## Deployment

```bash
pnpm build       # → out/ directory
# Deploy out/ to Vercel or Cloudflare Pages
```

### Vercel

Framework auto-detected from `next.config.ts`. Build command: `pnpm build`.
Output directory: `out`.

### Cloudflare Pages

Build command: `pnpm build`. Output directory: `out`.

## Testing Checklist (per tool)

Before marking a tool "done":

- [ ] Pure function unit tests pass (Vitest)
- [ ] Happy path: correct output for typical input
- [ ] Empty input: shows empty state, no crash
- [ ] Large input (100K+ chars): no freeze
- [ ] Unicode/emoji/CJK/RTL: correct output
- [ ] Mixed line endings: normalized correctly
- [ ] BOM/zero-width characters: stripped or handled
- [ ] Trailing whitespace: does not affect output
- [ ] `pnpm build` succeeds with zero errors
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 90, SEO = 100
- [ ] With JS disabled: tool description + worked example visible
- [ ] Mobile (360px): no horizontal scroll
