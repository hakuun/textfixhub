# Tool Page Contract

**Feature**: 001-text-tools-mvp
**Date**: 2026-07-26

## Overview

This document defines the contract for every tool page in site-003. Each tool
page must satisfy this contract for consistency, SEO, and behavior.

---

## 1. URL & Routing

| Property | Value |
|---|---|
| Pattern | `/tools/<slug>` |
| Slugs | `alphabetizer`, `line-break-remover`, `sentence-counter`, `random-sentence-generator`, `random-noun-generator` |
| Homepage | `/` (index listing all 5 tools) |

---

## 2. SSG Output Contract (Build Time)

The HTML delivered by the server (before JS hydration) MUST contain:

| Element | Requirement |
|---|---|
| `<title>` | Unique, includes primary keyword. Format: `[Tool Name] - Free Online [Keyword] | TextTools` |
| `<meta name="description">` | Unique, 120–155 chars. Describes what the tool does + value prop. |
| `<link rel="canonical">` | `https://<domain>/tools/<slug>` |
| `<h1>` | Exactly one. Tool name or primary keyword phrase. |
| `<h2>` | At least one. Describes what the tool does. |
| `<h3>` | At least two: "How It Works" and "Example". |
| Worked Example | Static HTML showing sample input and corresponding sample output. Rendered via pure function call at build time. |
| JSON-LD | `<script type="application/ld+json">` containing a `WebApplication` schema with `name`, `description`, `url`, `applicationCategory`, `operatingSystem`. |
| Related Tools | 2–3 link cards with tool name + one-line description, per `RELATED_TOOLS` map. |

---

## 3. Client-Side Interactive Demo Contract (Runtime)

After JS hydration, the tool page MUST provide:

| Element | Requirement |
|---|---|
| Input area | `<textarea>` with placeholder text. Accepts paste. Debounced (process on pause, not every keystroke). |
| Output area | Displays transformed result. Updates within 500ms of input change. |
| Controls | Tool-specific toggles/selectors (see per-tool contracts below). |
| Empty state | Friendly message when input is empty. Never blank, never "undefined". |

---

## 4. Per-Tool Contracts

### 4.1 Alphabetizer

| Aspect | Spec |
|---|---|
| Input | Multi-line text (one item per line) |
| Output | Sorted lines, one per line |
| Toggle: Case Sensitive | Off by default. When on, sorts by Unicode code point (A-Z before a-z). |
| Toggle: Reverse Order | Off by default. When on, output is Z→A. |
| Toggle: Remove Duplicates | Off by default. When on, duplicate lines are stripped (first occurrence kept). |
| Debounce | 300ms after last input event |
| Sample Input | `"Zebra\napple\nMonkey\nApple\nzebra"` |
| Sample Output (default) | `"apple\nApple\nMonkey\nZebra\nzebra"` |

### 4.2 Line Break Remover

| Aspect | Spec |
|---|---|
| Input | Multi-line text with any line ending (CRLF, LF, CR, mixed) |
| Output | Flowing text with single spaces between joined lines |
| Mode: Replace with space | Default. Single line breaks → space; double+ breaks → preserved paragraph break. |
| Mode: Remove entirely | All line breaks → removed; text is concatenated. |
| Sample Input | `"Hello\r\nWorld\n\nTest"` |
| Sample Output | `"Hello World\nTest"` |

### 4.3 Sentence Counter

| Aspect | Spec |
|---|---|
| Input | Any text (single word to multiple paragraphs) |
| Output | Integer count of sentences |
| Terminators | `.` (when followed by space+uppercase or end-of-input), `!`, `?` |
| Abbreviations | 18 entries: Mr., Mrs., Ms., Dr., Prof., Jr., Sr., St., vs., e.g., i.e., etc., a.m., p.m., U.S., Inc., Ltd., Ph.D. |
| Decimal numbers | Pattern `/\d+\.\d+/` does not split. Also `/\b[a-z]+\d+\.\d+/` for version strings. |
| Ellipsis | `...` counts as ONE terminator |
| Sample Input | `"Mr. Smith went to Dr. Jones. He said hello! How are you?"` |
| Sample Output | `3 sentences` |

### 4.4 Random Sentence Generator

| Aspect | Spec |
|---|---|
| Input | Count selector (default: 5, range: 1–500) |
| Output | N grammatically-plausible sentences, one per line |
| Generation | Template-based slot-and-fill: 12 templates, 4 word categories |
| SSG | Pre-renders 5 sentences with fixed seed `12345` |
| Regenerate | Click "Generate" button or change count → new random output |
| Sample Input | Count: 5 |
| Sample Output (SSG) | Always the same 5 sentences (deterministic seed) |

### 4.5 Random Noun Generator

| Aspect | Spec |
|---|---|
| Input | Count selector (default: 10, range: 1–500) |
| Output | N unique common English nouns, one per line |
| List size | 400 nouns |
| Exhaustion | If count > 400, output all 400 with note: "Showing all 400 nouns in our list." |
| SSG | Pre-renders 10 nouns with fixed seed `12345` |
| Regenerate | Click "Generate" button or change count → new random output |
| Sample Input | Count: 10 |
| Sample Output (SSG) | Always the same 10 nouns (deterministic seed) |

---

## 5. Error & Edge Case Contract

| Condition | Expected Behavior |
|---|---|
| Empty input | Show EmptyState component with tool-specific message |
| >100K chars | Process in chunks or debounce; page stays responsive |
| Unicode/emoji | Handle normally; sort by code point; count as 1 character |
| CJK text | Sort by Unicode code point; sentence counting treats 。！？ as terminators (bonus) |
| RTL text | Display with correct direction (CSS `dir="auto"` on output) |
| BOM (U+FEFF) | Strip from input before processing |
| Zero-width chars | Strip U+200B, U+200C, U+200D from input where semantically safe |
| Negative count (generators) | Clamp to 0 |
| Count = 0 (generators) | Return empty array; show "Set a count above 0 to generate." |
| Count > 500 (generators) | Clamp to 500 |
