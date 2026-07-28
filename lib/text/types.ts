/** Tool metadata for homepage cards and SEO */
export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  keyword: string;
  searchVolume: number;
  kd: number;
}

/** Alphabetizer options */
export type SeparatorPreset = 'newline' | 'comma' | 'semicolon' | 'space' | 'custom';

export interface AlphabetizerOptions {
  caseSensitive: boolean;
  reverse: boolean;
  removeDuplicates: boolean;
  inputSeparator: SeparatorPreset;
  customInputSeparator: string;
  outputSeparator: SeparatorPreset;
  customOutputSeparator: string;
  removeHTML: boolean;
}

export const DEFAULT_ALPHABETIZER_OPTIONS: AlphabetizerOptions = {
  caseSensitive: false,
  reverse: false,
  removeDuplicates: false,
  inputSeparator: 'newline',
  customInputSeparator: '',
  outputSeparator: 'newline',
  customOutputSeparator: '',
  removeHTML: false,
};

/** Line Break Remover mode */
export type LineBreakMode = 'replace-with-space' | 'remove-entirely' | 'remove-with-space';

/** Sentence Counter — full text statistics */
export interface TextStatistics {
  sentenceCount: number;
  wordCount: number;
  charCountWithSpaces: number;
  charCountWithoutSpaces: number;
  paragraphCount: number;
  lineCount: number;
  avgSentenceLengthWords: number;
  avgWordLengthChars: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  sentences: string[];
}

/** Random Sentence Generator options */
export interface SentenceGeneratorOptions {
  count: number;
  seed?: number;
}

/** Random Noun Generator options */
export interface NounGeneratorOptions {
  count: number;
  seed?: number;
}

/** All 5 tools with metadata */
export const ALL_TOOLS: ToolMeta[] = [
  {
    slug: 'alphabetizer',
    name: 'Alphabetizer',
    description: 'Sort any list alphabetically — instantly, with options to remove duplicates and reverse order.',
    keyword: 'alphabetize list',
    searchVolume: 5400,
    kd: 19,
  },
  {
    slug: 'line-break-remover',
    name: 'Line Break Remover',
    description: 'Remove broken line breaks from pasted text — clean up PDF and email copy-paste.',
    keyword: 'remove line breaks',
    searchVolume: 2400,
    kd: 10,
  },
  {
    slug: 'sentence-counter',
    name: 'Sentence Counter',
    description: 'Count sentences in your text — with smart abbreviation handling for accurate results.',
    keyword: 'sentence counter',
    searchVolume: 18100,
    kd: 18,
  },
  {
    slug: 'random-sentence-generator',
    name: 'Random Sentence Generator',
    description: 'Generate grammatically-plausible random sentences for writing prompts and brainstorming.',
    keyword: 'random sentence generator',
    searchVolume: 4400,
    kd: 20,
  },
  {
    slug: 'random-noun-generator',
    name: 'Random Noun Generator',
    description: 'Generate random English nouns — perfect for classroom activities and word games.',
    keyword: 'random noun generator',
    searchVolume: 4400,
    kd: 16,
  },
];

/** Cross-link mapping: which tools are "related" to which */
export const RELATED_TOOLS: Record<string, string[]> = {
  alphabetizer: ['line-break-remover', 'random-noun-generator'],
  'line-break-remover': ['alphabetizer', 'sentence-counter'],
  'sentence-counter': ['line-break-remover', 'random-sentence-generator'],
  'random-sentence-generator': ['random-noun-generator', 'sentence-counter'],
  'random-noun-generator': ['random-sentence-generator', 'alphabetizer'],
};

/** Look up a tool by slug */
export function getToolBySlug(slug: string): ToolMeta | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}
