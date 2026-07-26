# Data Model: Text Tools MVP (site-003)

**Feature**: 001-text-tools-mvp
**Date**: 2026-07-26

## Overview

This is a static site with no database or persistent storage. The "data model"
describes TypeScript types, constants, and the shape of data flowing through
the system at build time and at runtime.

## Types

### Tool Options (shared)

```typescript
// lib/text/types.ts

/** Options common to all text tools */
export interface ToolMeta {
  /** URL slug, e.g. "alphabetizer" */
  slug: string;
  /** Display name, e.g. "Alphabetizer" */
  name: string;
  /** One-line description for cards, e.g. "Sort any list alphabetically" */
  description: string;
  /** Primary SEO keyword, e.g. "alphabetize list" */
  keyword: string;
  /** Google search volume (monthly, US), e.g. 5400 */
  searchVolume: number;
  /** Keyword difficulty, e.g. 19 */
  kd: number;
}

/** Constants: all 5 tools with metadata */
export const ALL_TOOLS: ToolMeta[] = [
  { slug: 'alphabetizer', name: 'Alphabetizer', description: '...', keyword: 'alphabetize list', searchVolume: 5400, kd: 19 },
  { slug: 'line-break-remover', name: 'Line Break Remover', description: '...', keyword: 'remove line breaks', searchVolume: 2400, kd: 10 },
  { slug: 'sentence-counter', name: 'Sentence Counter', description: '...', keyword: 'sentence counter', searchVolume: 18100, kd: 18 },
  { slug: 'random-sentence-generator', name: 'Random Sentence Generator', description: '...', keyword: 'random sentence generator', searchVolume: 4400, kd: 20 },
  { slug: 'random-noun-generator', name: 'Random Noun Generator', description: '...', keyword: 'random noun generator', searchVolume: 4400, kd: 16 },
];

/** Cross-link mapping: which tools are "related" to which */
export const RELATED_TOOLS: Record<string, string[]> = {
  alphabetizer: ['line-break-remover', 'random-noun-generator'],
  'line-break-remover': ['alphabetizer', 'sentence-counter'],
  'sentence-counter': ['line-break-remover', 'random-sentence-generator'],
  'random-sentence-generator': ['random-noun-generator', 'sentence-counter'],
  'random-noun-generator': ['random-sentence-generator', 'alphabetizer'],
};
```

### Alphabetizer

```typescript
export interface AlphabetizerOptions {
  caseSensitive: boolean;     // default: false
  reverse: boolean;           // default: false
  removeDuplicates: boolean;  // default: false
}

export function alphabetize(input: string, opts: AlphabetizerOptions): string;
// Input: "Zebra\nApple\nMonkey\nApple"
// Output (default): "Apple\nApple\nMonkey\nZebra"
```

### Line Break Remover

```typescript
export type LineBreakMode = 'replace-with-space' | 'remove-entirely';

export function removeLineBreaks(input: string, mode: LineBreakMode): string;
// Input: "Hello\r\nWorld\r\nTest"
// Output (replace-with-space): "Hello World Test"
// Output (remove-entirely): "HelloWorldTest"
```

### Sentence Counter

```typescript
export interface SentenceCountResult {
  count: number;
  sentences: string[];  // extracted sentences for potential future display
}

export function countSentences(input: string): SentenceCountResult;
// Input: "Mr. Smith went to Dr. Jones. He said hello!"
// Output: { count: 2, sentences: ["Mr. Smith went to Dr. Jones.", "He said hello!"] }

// Internal: abbreviation list (18 entries)
export const ABBREVIATIONS: Set<string>; // Mr., Mrs., Ms., Dr., Prof., Jr., Sr., St., vs., e.g., i.e., etc., a.m., p.m., U.S., Inc., Ltd., Ph.D.
```

### Random Sentence Generator

```typescript
export interface SentenceGeneratorOptions {
  count: number;   // 1–500, default: 5
  seed?: number;   // optional fixed seed for deterministic output (SSG)
}

export function generateSentences(opts: SentenceGeneratorOptions): string[];
// Output: ["The happy dog runs quickly.", "A big cat sleeps near the old tree.", ...]

// Word list types
export interface WordLists {
  nouns: string[];       // 150 entries
  verbs: string[];       // 150 entries (base form, third-person singular meaning)
  adjectives: string[];  // 75 entries
  adverbs: string[];     // 50 entries
}

// Template: string with [category] placeholders
export const SENTENCE_TEMPLATES: string[]; // 12 templates
```

### Random Noun Generator

```typescript
export interface NounGeneratorOptions {
  count: number;   // 1–500, default: 10
  seed?: number;   // optional fixed seed for deterministic output (SSG)
}

export function generateNouns(opts: NounGeneratorOptions): string[];
// Output: ["apple", "car", "mountain", ...]

export const NOUN_LIST: string[]; // 400 common English nouns
```

## Entity Summary

| Entity | Location | Type | Purpose |
|---|---|---|---|
| ToolMeta | `lib/text/types.ts` | `const ALL_TOOLS: ToolMeta[]` | Tool metadata for homepage cards + SEO |
| Related Tools Map | `lib/text/types.ts` | `Record<string, string[]>` | Cross-link structure |
| Word Lists | `lib/text/wordlists/*.ts` | `const` arrays | Static vocabulary for generators |
| Sentence Templates | `lib/text/wordlists/sentence-templates.ts` | `const string[]` | Template strings with `[category]` slots |
| Abbreviations | `lib/text/sentence-counter.ts` | `const Set<string>` | 18 abbreviations to exclude from sentence splitting |
| Sample Data | `app/tools/*/sample-data.ts` | `const SAMPLE_INPUT: string` | Hardcoded sample input for SSG worked example |

## State & Lifecycle

- **Build time**: Sample data flows through pure functions → static HTML (SSG).
  Word lists and templates are imported as constants, tree-shaken by bundler.
- **Runtime**: User input flows through the SAME pure functions → live output
  in the DOM. No state survives page navigation (no persistence, no accounts).
- **No state transitions**: Tools are stateless transforms. Input → function →
  output. The generators have a "regenerate" action that produces new output,
  but this is a pure function call, not a state transition.
