# Feature Specification: Text Tools MVP (site-003)

**Feature Branch**: `001-text-tools-mvp`
**Created**: 2026-07-26
**Status**: Draft
**Input**: User description: "Define the product spec for site-003, a multi-tool text utilities site with 5 tools: Alphabetizer, Line Break Remover, Sentence Counter, Random Sentence Generator, Random Noun Generator"

## Clarifications

### Session 2026-07-26

- Q: How should the Random Sentence Generator construct sentences? → A: Template-based generation using pre-defined sentence templates (e.g., "The [adjective] [noun] [verb] the [adjective] [noun].") with word lists organized by part-of-speech category (nouns, verbs, adjectives, adverbs).
- Q: What internal linking structure should connect the tool pages? → A: A "Related Tools" section at the bottom of each tool page with 2–3 related tool link cards. No global nav bar, no tabs. The natural clusters are: Alphabetizer → Line Break Remover, Random Noun Generator; Line Break Remover → Alphabetizer, Sentence Counter; Sentence Counter → Line Break Remover, Random Sentence Generator; Random Sentence Generator → Random Noun Generator, Sentence Counter; Random Noun Generator → Random Sentence Generator, Alphabetizer.
- Q: Which elements on each tool page are static (SSG, visible without JS) vs. interactive (client-side JS)? → A: SSG elements: tool name, description, H1/H2/H3, sample input text, sample output text, JSON-LD, related tools links. Client elements: input textarea, live output area, alphabetizer sort toggles (case-sensitive, reverse, remove-duplicates), line break mode selector, count selector (+/-), generate button. The boundary: a worked example (static input→output pair) is SSG-rendered for crawlers; the live interactive demo is client-hydrated for users.
- Q: What is the positive rule for when a period (`.`) ends a sentence vs. being part of an abbreviation or number? → A: A period is a sentence boundary when followed by whitespace + an uppercase letter (A–Z) or end-of-input. The abbreviation list (Mr., Dr., etc.) and decimal number pattern override this rule — a period that matches an abbreviation or decimal is NOT a boundary regardless of what follows. Example: "I saw Dr. Smith. He left." → period after "Dr" is not a boundary (abbreviation override); period after "Smith" IS a boundary (followed by space + capital "H").
- Q: What are the approximate word list sizes for the generators? → A: Medium scale: Sentence Generator — nouns 100–200, verbs 100–200, adjectives 50–100, adverbs 40–60, templates 10–15. Noun Generator — 300–500 common English nouns. This provides hundreds of thousands of possible sentence combinations while keeping static data files compact.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Alphabetize a List (Priority: P1)

As a student, writer, or office worker, I paste a list of names, items, or
keywords and see them sorted alphabetically instantly — no submit button, no
page reload. I can optionally remove duplicates, toggle case-sensitive sorting,
or reverse the order.

**Why this priority**: Targets the highest-volume keyword in the tool set
("alphabetize list", 5.4K/mo, KD 19). Delivers immediate, visible value with
zero friction — paste → see result. Sets the UX pattern for all other tool
pages.

**Independent Test**: Open the Alphabetizer page, paste a list of 10 names,
verify they appear sorted A→Z within 500ms. Toggle reverse and verify Z→A.
Check "Remove Duplicates" and verify duplicates are stripped.

**Acceptance Scenarios**:

1. **Given** the Alphabetizer page is open with an empty input, **When** the
   user pastes "Zebra\nApple\nMonkey\nApple", **Then** the output shows
   "Apple\nApple\nMonkey\nZebra" (default: case-insensitive ascending, dupes
   kept).
2. **Given** the same input, **When** the user enables "Remove Duplicates",
   **Then** the output shows "Apple\nMonkey\nZebra".
3. **Given** the same input, **When** the user toggles "Reverse Order", **Then**
   the output shows "Zebra\nMonkey\nApple\nApple".
4. **Given** the same input, **When** the user enables "Case Sensitive", **Then**
   lowercase and uppercase entries sort separately (e.g., "Apple" before
   "apple" per Unicode code point order).
5. **Given** empty input, **When** the page loads, **Then** a friendly empty
   state message is shown ("Paste your list above to get started") — no crash,
   no blank output area.

---

### User Story 2 - Remove Line Breaks (Priority: P1)

As someone who copies text from PDFs, emails, or chat messages, I paste text
with broken/hard line breaks and get clean, flowing paragraphs back. I can
choose to replace line breaks with a space or remove them entirely.

**Why this priority**: Targets "remove line breaks" (2.4K/mo, KD 10). Solves a
real, frequent annoyance — PDF copy-paste is a universal pain point. Simple
tool with immediate, visible utility.

**Independent Test**: Open the Line Break Remover page, paste multi-line text
with CRLF line endings, verify output is a single flowing paragraph with spaces
between words.

**Acceptance Scenarios**:

1. **Given** text "Hello\r\nWorld\r\nTest" pasted (CRLF from Windows), **When**
   "Replace with space" is selected (default), **Then** output is "Hello World
   Test".
2. **Given** text "Hello\nWorld\n\nTest" pasted (LF with blank line), **When**
   "Replace with space" is selected, **Then** output is "Hello World\nTest"
   (blank line preserved as paragraph break).
3. **Given** the same input, **When** "Remove entirely" is selected, **Then**
   output is "HelloWorldTest".
4. **Given** empty input, **When** the page loads, **Then** an empty state
   message is shown — no crash.

---

### User Story 3 - Count Sentences (Priority: P1)

As a writer, editor, or student, I paste a paragraph and instantly see exactly
how many sentences it contains. The counter correctly handles common
abbreviations (Mr., Dr., e.g., i.e.) without splitting them into fake
sentences.

**Why this priority**: Targets the highest-volume keyword in the cluster
("sentence counter", 18.1K/mo, KD 18). Sentence counting with abbreviation
awareness is the key differentiator — naïve implementations that split on every
period produce wrong counts and lose user trust.

**Independent Test**: Open the Sentence Counter page, paste "Mr. Smith went to
Dr. Jones. He said hello! How are you?" and verify count = 3.

**Acceptance Scenarios**:

1. **Given** text "Mr. Smith went to Dr. Jones. He said hello! How are you?",
   **When** the page processes the input, **Then** the count is 3 (not 5 —
   "Mr." and "Dr." do not end sentences).
2. **Given** text "I went to the store, e.g. for milk. It was fun.", **When**
   the page processes, **Then** the count is 2 (not 3 — "e.g." does not end a
   sentence).
3. **Given** text "Hello world" (no sentence terminator), **When** processed,
   **Then** the count is 1 (text without `.`, `!`, or `?` is treated as one
   sentence).
4. **Given** text with multiple terminators "Wait... what?! No way!!!", **When**
   processed, **Then** the count is 3 (ellipsis counts as one terminator,
   repeated `?` and `!` each terminate a sentence).
5. **Given** empty input, **When** the page loads, **Then** "0 sentences" is
   shown with a prompt to paste text.

---

### User Story 4 - Generate Random Sentences (Priority: P1)

As a creative writer, teacher, or brainstorming facilitator, I pick how many
random sentences I want (default 5) and get grammatically-plausible, varied
sentences generated instantly from a built-in word list.

**Why this priority**: Targets "random sentence generator" (4.4K/mo, KD 20).
Zero-configuration tool — user lands, sees sentences, can adjust count. The
built-in word list means no API dependency and instant results.

**Independent Test**: Open the Random Sentence Generator page, verify 5
sentences are displayed on load. Change count to 3, verify 3 sentences appear.
Each sentence should be a complete, grammatically-plausible string. Click
"Generate" twice and verify the outputs differ.

**Acceptance Scenarios**:

1. **Given** the page loads with default count 5, **When** no user action is
   taken, **Then** 5 unique random sentences are displayed (SSG pre-rendered).
2. **Given** the user changes count to 10, **When** they click "Generate" (or
   the output updates automatically), **Then** 10 sentences are displayed.
3. **Given** the user sets count to 1, **When** output updates, **Then** 1
   sentence is displayed.
4. **Given** the user sets count to 100, **When** output updates, **Then** 100
   sentences are displayed without page freeze (debounced or chunked rendering).
5. **Given** the user clicks "Generate" twice, **When** outputs are compared,
   **Then** the two sets of sentences are not identical (randomness verified).

---

### User Story 5 - Generate Random Nouns (Priority: P1)

As a teacher, game designer, or brainstormer, I pick how many random nouns I
want (default 10) and get a list of varied, common English nouns generated
instantly from a built-in noun list.

**Why this priority**: Targets "random noun generator" (4.4K/mo, KD 16).
Simplest tool in the set — a single word list and a shuffle. High utility for
classroom activities, writing prompts, and game design.

**Independent Test**: Open the Random Noun Generator page, verify 10 nouns are
displayed on load. Change count to 5, verify 5 nouns appear. Verify all outputs
are common English nouns. Click "Generate" twice and verify the outputs differ.

**Acceptance Scenarios**:

1. **Given** the page loads with default count 10, **When** no user action is
   taken, **Then** 10 unique random nouns are displayed (SSG pre-rendered).
2. **Given** the user changes count to 20, **When** output updates, **Then** 20
   nouns are displayed.
3. **Given** the user clicks "Generate" twice, **When** outputs are compared,
   **Then** the two lists are not identical.
4. **Given** the user sets count higher than the available noun list size,
   **When** output updates, **Then** all available nouns are shown (no
   duplicates) with a note that the list was exhausted.

---

### Edge Cases

- **Empty input** (Alphabetizer, Line Break Remover, Sentence Counter): Show a
  friendly empty state message; never crash, never show a blank output area,
  never display "undefined" or "NaN".
- **Very large paste (>100K characters)** (Alphabetizer, Line Break Remover,
  Sentence Counter): The page MUST NOT freeze. Debounce processing so
  computation happens on pause, not on every keystroke. If needed, chunk the
  work with `requestIdleCallback` or equivalent.
- **Unicode / emoji / CJK / RTL text** (all tools): Characters outside ASCII
  MUST be handled correctly. Emoji like "😀" sort consistently by code point.
  RTL text like Arabic displays with correct direction. CJK characters sort by
  Unicode code point in case-sensitive mode.
- **Mixed line endings** (all text-input tools): CRLF (`\r\n`), LF (`\n`), CR
  (`\r`), and mixed endings within a single paste MUST all be normalized and
  handled correctly.
- **Trailing whitespace, BOM, zero-width characters** (all tools): Leading/
  trailing whitespace in lines MUST NOT affect sorting or counting. BOM
  (U+FEFF) at the start of pasted text MUST be stripped. Zero-width characters
  (U+200B zero-width space, U+200C zero-width non-joiner, U+200D zero-width
  joiner) MUST be handled gracefully — stripped where appropriate, preserved
  where semantically meaningful.
- **Consecutive line breaks** (Line Break Remover): Multiple consecutive line
  breaks (paragraph breaks) MUST be treated as intentional separators, not
  collapsed into a single space.
- **Abbreviation edge cases** (Sentence Counter): Periods in "U.S.A.", "Ph.D.",
  "a.m.", "p.m.", and decimal numbers like "3.14" MUST NOT trigger sentence
  splits.
- **Count bounds** (Random generators): Count of 0 MUST produce empty output
  with a note. Negative count MUST be rejected (clamped to 0 or show inline
  validation). Extremely high count (e.g., 10,000) MUST be capped at a
  reasonable maximum (e.g., 500) to prevent rendering performance issues.

## Requirements *(mandatory)*

### Functional Requirements

**Homepage**:

- **FR-001**: Homepage MUST display all 5 tool cards with each tool's name,
  one-line description, and a link to its dedicated page.
- **FR-002**: Homepage MUST have a unique `<title>`, meta description, and H1
  that targets a broad text-tools discovery keyword.
- **FR-003**: Homepage MUST be statically generated (SSG) with all content
  visible without JavaScript.

**Shared Tool Page Requirements**:

- **FR-004**: Every tool page MUST be statically generated (SSG). The HTML
  delivered to the crawler MUST contain, without executing JavaScript: the
  tool's name and H1, a description of what the tool does, a worked example
  (static sample input text and corresponding sample output text), all heading
  hierarchy (H2/H3), the JSON-LD block, and the "Related Tools" link cards.
  The interactive demo area (input textarea, live output, toggles, selectors,
  buttons) is client-side JS only.
- **FR-005**: Every tool page MUST have exactly one H1, a clean H2/H3 heading
  hierarchy, a unique `<title>`, meta description, canonical URL, and a
  `WebApplication` JSON-LD structured data block.
- **FR-006**: All tool interactions MUST update output in real-time on input
  change (no submit button required). The live interactive demo is powered by
  client-side JS; the descriptive content and worked example are
  server-rendered in the static HTML.
- **FR-007**: Every tool page MUST meet Core Web Vitals targets: LCP < 2.5s,
  CLS < 0.1, INP < 200ms on a mid-range mobile device.
- **FR-008**: Every tool page MUST be usable and fully legible at 360px
  viewport width with no horizontal scrollbar.
- **FR-009**: Every tool MUST handle Murphy's Law inputs (empty, large paste,
  Unicode/emoji/CJK/RTL, mixed line endings, trailing whitespace/BOM/
  zero-width chars) without crashing, freezing, or producing incorrect output.
- **FR-009a**: Every tool page MUST include a "Related Tools" section at the
  bottom (below the interactive demo) with 2–3 link cards to related tools,
  forming these clusters: Alphabetizer ↔ Line Break Remover; Line Break
  Remover ↔ Sentence Counter; Sentence Counter ↔ Random Sentence Generator;
  Random Sentence Generator ↔ Random Noun Generator; Random Noun Generator →
  Alphabetizer. Each link card MUST include the tool name and one-line
  description.

**Alphabetizer (Tool 1)**:

- **FR-010**: MUST accept pasted multi-line text and output lines sorted
  alphabetically (A→Z, case-insensitive by default).
- **FR-011**: MUST offer a "Remove Duplicates" toggle that, when enabled,
  strips duplicate lines from the output.
- **FR-012**: MUST offer a "Case Sensitive" toggle that, when enabled, sorts
  uppercase and lowercase characters separately by Unicode code point.
- **FR-013**: MUST offer a "Reverse Order" toggle that outputs Z→A.
- **FR-014**: Sorting MUST update within 500ms of the user pausing input
  (real-time, debounced).

**Line Break Remover (Tool 2)**:

- **FR-015**: MUST accept pasted multi-line text and join lines into flowing
  text by removing single line breaks.
- **FR-016**: MUST offer two modes: "Replace with space" (default) and "Remove
  entirely".
- **FR-017**: MUST correctly handle CRLF (`\r\n`), LF (`\n`), and CR (`\r`)
  line endings.
- **FR-018**: MUST preserve intentional paragraph breaks (two or more
  consecutive line breaks) when in "Replace with space" mode.

**Sentence Counter (Tool 3)**:

- **FR-019**: MUST count sentences by detecting `.`, `!`, and `?` as sentence
  terminators. A period (`.`) is a sentence boundary when followed by
  whitespace + an uppercase letter (A–Z) or end-of-input.
- **FR-020**: MUST NOT treat a period as a sentence boundary when it belongs
  to a known abbreviation (Mr., Mrs., Ms., Dr., Prof., e.g., i.e., etc., vs.,
  a.m., p.m., U.S., U.S.A., Ph.D., Inc., Ltd., Jr., Sr., St.) or a number
  pattern containing a period (e.g., "3.14", "v2.0", "version 1.5"). The
  abbreviation/number check takes precedence over the positive boundary rule
  in FR-019.
- **FR-021**: MUST treat ellipsis (`...`) as a single sentence terminator, not
  three separate ones.
- **FR-022**: MUST display the sentence count prominently as a number and
  update within 500ms of the user pausing input.

**Random Sentence Generator (Tool 4)**:

- **FR-024**: MUST generate N grammatically-plausible random sentences using
  pre-defined sentence templates (e.g., "The [adjective] [noun] [verb] the
  [adjective] [noun].") with slots filled by random selection from categorized
  word lists (nouns, verbs, adjectives, adverbs). N defaults to 5.
- **FR-025**: MUST provide a count selector (numeric input or increment/
  decrement buttons) allowing the user to choose how many sentences to
  generate, from 1 to 500.
- **FR-026**: MUST display generated sentences on initial page load (SSG
  pre-renders the default batch) and regenerate when the user changes the count
  or clicks "Generate".
- **FR-027**: The built-in word list MUST be a static data file with no
  external API calls or runtime dependencies.

**Random Noun Generator (Tool 5)**:

- **FR-028**: MUST generate N unique random nouns from a built-in English noun
  list, where N defaults to 10.
- **FR-029**: MUST provide a count selector allowing the user to choose how
  many nouns to generate, from 1 to 500.
- **FR-030**: MUST display generated nouns on initial page load (SSG
  pre-renders the default batch) and regenerate when the user changes the count
  or clicks "Generate".
- **FR-031**: When the requested count exceeds the available noun list size,
  all nouns MUST be returned (no duplicates) with an informational note that
  the full list was exhausted.
- **FR-032**: The built-in noun list MUST be a static data file with no
  external API calls or runtime dependencies.

**SEO & Performance**:

- **FR-033**: Every page (homepage + 5 tool pages) MUST pass a Lighthouse
  mobile audit with scores: Performance ≥ 90, Accessibility ≥ 90, SEO = 100.
- **FR-034**: With JavaScript disabled, every tool page MUST still display: the
  tool's name and description, a worked example with sample input and output,
  and all static instructional copy.
- **FR-035**: Each tool page MUST include its primary target keyword in the
  `<title>`, H1, meta description, and JSON-LD `description` field.

### Key Entities

- **Tool Page**: A statically-generated page representing one text tool. Has a
  unique URL slug, page title, meta description, H1 heading, JSON-LD block,
  static descriptive content (what the tool does + worked example with sample
  I/O), and a client-side interactive demo area.
- **Homepage**: The index page listing all 5 tools as cards. Each card displays
  the tool name, a one-line description, and a hyperlink to the tool page.
- **Word List** (for generators): Static data files compiled at build time:
  - Sentence Generator: word lists organized by part-of-speech (nouns: 100–200,
    verbs: 100–200, adjectives: 50–100, adverbs: 40–60) plus 10–15 sentence
    templates with slots for each category.
  - Noun Generator: a flat list of 300–500 common English nouns.
  - Neither list is fetched at runtime; both are imported at build time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each of the 5 tool pages ranks in the top 10 Google search
  results for its primary target keyword within 90 days of launch.
- **SC-002**: Lighthouse mobile audit scores meet or exceed Performance ≥ 90,
  Accessibility ≥ 90, SEO = 100 for every page (homepage + 5 tools).
- **SC-003**: With JavaScript disabled in the browser, every tool page visibly
  shows: the tool's name, a description of what it does, a worked example with
  sample input and corresponding output, and any instructional text.
- **SC-004**: A user pasting text on any tool page sees the result within 500ms
  of the paste event (no perceptible lag).
- **SC-005**: Pasting 100,000+ characters of text into any text-input tool does
  not freeze the browser tab — the page remains responsive and accepts further
  input within 2 seconds.
- **SC-006**: Every tool page renders fully legible content at 360px viewport
  width (CSS pixels) with no horizontal scrollbar.
- **SC-007**: All 5 tools produce correct, verified output for the full Murphy's
  Law input suite (empty input, Unicode/emoji/CJK/RTL text, mixed line endings,
  trailing whitespace/BOM/zero-width characters) as confirmed by automated
  tests.

## Assumptions

- **Target audience is US, English-language**: All tool UI text, word lists, and
  SEO targeting are English-only. Internationalization and localization are
  explicitly out of scope per the Razor Law principle.
- **Users have JavaScript enabled**: The live interactive demo on each tool
  page requires JS. However, the static content (tool description and worked
  example) is fully visible without JS, satisfying SC-003.
- **Word lists are manually curated**: The random sentence and noun generators
  use hand-picked word lists embedded at build time, not dictionary APIs or NLP
  libraries. List quality is "good enough for practical utility" — linguists
  may find imperfections, but users get functional value.
- **Abbreviation list for Sentence Counter is finite and maintained in source**:
  The list of abbreviations that must not trigger sentence splits (Mr., Dr.,
  e.g., etc.) is explicitly enumerated. Unknown or rare abbreviations may
  produce false sentence splits, which is acceptable for v1.
- **Single AdSense slot may be added later**: Advertising placement is deferred
  until traffic volume is verified. The page layout accommodates one responsive
  ad unit per page without introducing layout shift (CLS < 0.1).
- **No authentication, no persistence, no accounts**: Users cannot save, share,
  or export results beyond copying and pasting. This is an intentional scope
  boundary per the Razor Law, not a missing feature.
- **Deployment to Vercel or Cloudflare Pages**: The site is a pure static
  export (`output: "export"`) deployed to a CDN with automatic HTTPS. No server
  runtime, no API routes.
