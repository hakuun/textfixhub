<!--
  Sync Impact Report
  ==================
  Version change: [TEMPLATE] → 1.0.0 (initial constitution)
  Modified principles: N/A (first real constitution; template placeholders replaced)
  Added sections:
    - Core Principles (5 principles): Razor Law, Murphy's Law, SEO-First,
      Core Web Vitals & Mobile-First, Simplest Working Implementation
    - Technical Standards (locked tech constraints)
    - Development Workflow (quality gates, review process)
    - Governance (amendment procedure, versioning, compliance)
  Removed sections: None (template placeholders replaced, not removed)
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (Constitution Check
      section is generic and will be filled per-feature)
    - .specify/templates/spec-template.md ✅ no changes needed
      (requirements/edge-case sections align with Murphy's Law)
    - .specify/templates/tasks-template.md ✅ no changes needed
    - .specify/templates/commands/*.md N/A (directory does not exist)
    - CLAUDE.md ⚠ pending (currently a stub; should be updated with
      project-specific guidance referencing this constitution)
  Follow-up TODOs: None
-->

# site-003 (Text Tools) Constitution

A static multi-tool text utilities site. Pure SSG, no backend, no runtime server.

## Core Principles

### I. Razor Law — YAGNI & MVP Scope

Every implementation decision MUST pass this gate:

- **No features "for later"**. No Pro tier, no user accounts, no file
  upload, no API, no blog, no i18n, no theme toggle, no analytics beyond
  Google Search Console.
- **MVP scope is exactly**: 1 homepage + 5 tool pages. Anything beyond
  these six pages is out of scope.
- If a proposed addition is not required to ship the six pages, it is
  rejected. No exceptions.

**Rationale**: Scope creep is the #1 threat to a 5-day MVP timeline.
Every "quick addition" costs implementation + testing + SEO validation +
maintenance burden. The constitution enforces discipline by making the
default answer "no."

### II. Murphy's Law — Adversarial Input Testing

Text tool inputs are adversarial by default. Every tool MUST handle:

- **Empty input**: Show empty state, never crash or render blank.
- **Very large paste** (>100K characters): MUST NOT freeze the page.
  Use virtualization, debouncing, or chunked processing as needed.
- **Unicode / emoji / CJK / RTL text**: Correct handling regardless of
  character set or text direction.
- **Mixed line endings**: CRLF (Windows paste), LF (Unix), and mixed
  within a single input.
- **Trailing whitespace, BOM, zero-width characters**: Must not produce
  silently wrong output.

**Testing mandate**: If a transformation CAN produce wrong output on
some input, a test MUST exist proving it doesn't. Edge-case tests are
not optional — they are the definition of done.

**Rationale**: Text tools appear simple but fail catastrophically on
real-world input. Users paste from Word, Excel, WhatsApp, terminals —
each with different encoding quirks. A tool that works only on ASCII
test strings is broken.

### III. SEO-First Architecture

This site exists to be found by search engines. Every page MUST:

- Be statically generated (SSG). Google's crawler MUST see the tool's
  purpose, sample input/output, and key copy without executing JavaScript.
- Have exactly **one H1**. Clean H2/H3 hierarchy underneath.
- Include a unique `<title>`, meta description, canonical URL, and a
  `WebApplication` JSON-LD structured data block.
- Render the tool description and a worked example in the server-
  delivered HTML. Client-side JavaScript powers ONLY the live
  interactive demo — never the core educational content.

**Rationale**: JS-heavy tool sites rank poorly because crawlers see
empty `<div id="root">` shells. SSG ensures every page is a complete,
indexable document. JSON-LD enables rich results in SERPs.

### IV. Core Web Vitals & Mobile-First

Performance is a ranking factor and a user expectation:

- **LCP** (Largest Contentful Paint): < 2.5 seconds
- **CLS** (Cumulative Layout Shift): < 0.1
- **INP** (Interaction to Next Paint): < 200ms
- **Mobile-first**: No horizontal scroll at 360px viewport width.
  All tool interactions MUST be usable on touch devices.

**Rationale**: Google uses Core Web Vitals as a ranking signal. A text
tools site has no excuse for poor performance — no images, no video, no
API calls. If it's slow, it's because of unnecessary JavaScript.

### V. Simplest Working Implementation

No premature abstraction. Specifically prohibited:

- **No plugin systems**, no "extensible tool registry", no dynamic tool
  loading. A new tool = a new page file. That's it.
- **No shared component library** beyond what is actually shared between
  at least two pages. One-off abstractions are worse than duplication.
- **No state management library** unless the alternative is prop-drilling
  through 4+ levels. React's built-in `useState` + `useReducer` is the
  default.
- **No CSS-in-JS runtime**. Tailwind CSS only.

**Rationale**: Abstractions built for two things break on the third.
With only six pages, patterns emerge naturally. Build the concrete thing
first; extract only when the pattern is proven across ≥3 use sites.

## Technical Standards

These constraints are LOCKED — they are not re-debated in plans:

| Constraint | Requirement |
|---|---|
| **Framework** | Next.js 15+ with App Router |
| **Language** | TypeScript, strict mode |
| **Styling** | Tailwind CSS |
| **Build output** | Pure static export (`output: "export"`) |
| **Runtime** | None — no API routes, no server, no middleware |
| **Deployment** | Vercel or Cloudflare Pages from a private GitHub repo |
| **Dependencies** | Zero paid dependencies, zero runtime backend services |
| **Timeline** | MVP functional in 5 implementation days |

Any deviation from these constraints requires a constitutional amendment.

## Development Workflow

### Quality Gates (per task)

1. **TypeScript compiles** with zero errors in strict mode.
2. **ESLint** passes with no warnings.
3. **Tests pass**: at minimum, tests covering Murphy's Law edge cases
   for the tool being built or modified.
4. **Build succeeds**: `next build` produces a complete static export.
5. **Lighthouse check**: run a Lighthouse audit for the affected page;
   must not regress below the Core Web Vitals targets.

### Review Requirements

- Every PR MUST reference the constitution principle it satisfies.
- PRs that introduce abstractions not backed by ≥3 use sites require
  explicit justification in the Complexity Tracking table.
- SEO-impacting changes (title, meta, heading structure, JSON-LD) MUST
  be called out in the PR description.

## Governance

This constitution supersedes all other project practices. When a plan,
spec, or task conflicts with a principle here, the constitution wins.

### Amendment Procedure

1. Propose the change with rationale in a PR that updates this file.
2. The amendment MUST include a Sync Impact Report (HTML comment at top
   of this file) documenting version change, modified principles, and
   affected templates.
3. All dependent templates (plan, spec, tasks) MUST be checked for
   consistency and updated in the same PR if needed.

### Versioning Policy

- **MAJOR** (X.0.0): Removal or redefinition of a core principle.
- **MINOR** (0.X.0): New principle or section added; materially
  expanded guidance.
- **PATCH** (0.0.X): Clarifications, wording fixes, typo corrections.

### Compliance Review

- Every `speckit-plan` invocation MUST include a Constitution Check
  section listing each principle and whether the plan complies.
- Violations that are justified and documented in Complexity Tracking
  are permissible. Unjustified violations block the plan.

**Version**: 1.0.0 | **Ratified**: 2026-07-26 | **Last Amended**: 2026-07-26
