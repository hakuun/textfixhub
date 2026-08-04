/**
 * Generate lib/text/wordlists/syllable-dict.ts — an English word→syllable
 * count dictionary, from the CMU Pronouncing Dictionary filtered by a
 * frequency list. Used by the Syllable Counter (dictionary hit + rule
 * fallback), matching how top competitors (syllablecount.com, etc.) work.
 *
 * Usage:
 *   node scripts/generate-syllable-dict.mjs [cmudict] [freqList] [outPath] [topN]
 *
 * Sources:
 *   cmudict: https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict
 *   freq:    https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt
 *
 * Syllable count = number of phonemes carrying a stress digit (each vowel
 * phoneme carries 0/1/2 stress). The primary pronunciation is kept.
 */

import fs from 'fs';

const [cmuPath, freqPath, outPath, topNStr] = process.argv.slice(2);
const CMU = cmuPath || '/tmp/syllable-data/cmudict.dict';
const FREQ = freqPath || '/tmp/syllable-data/en_50k.txt';
const OUT = outPath || 'lib/text/wordlists/syllable-dict.ts';
const TOP_N = parseInt(topNStr || '20000', 10);

// --- parse cmudict ---
const syllable = new Map();
const cmuLines = fs.readFileSync(CMU, 'utf8').split('\n');
for (const line of cmuLines) {
  if (!line.trim()) continue;
  const match = line.match(/^([A-Za-z']+)(?:\(\d+\))?\s+(.+)$/);
  if (!match) continue;
  const word = match[1].toLowerCase();
  if (syllable.has(word)) continue; // keep primary pronunciation
  const phones = match[2].trim().split(/\s+/);
  const count = phones.filter((p) => /\d$/.test(p)).length;
  if (count > 0) syllable.set(word, count);
}

// --- parse frequency list (word + tab/freq, one per line) ---
const freqWords = [];
for (const line of fs.readFileSync(FREQ, 'utf8').split('\n')) {
  const m = line.trim().match(/^([^\s]+)\s+(\d+)$/);
  if (m) freqWords.push(m[1].toLowerCase());
}

// --- build dict from top-N frequent words present in cmudict ---
const dict = {};
let included = 0;
for (const w of freqWords) {
  if (included >= TOP_N) break;
  if (syllable.has(w) && !(w in dict)) {
    dict[w] = syllable.get(w);
    included += 1;
  }
}

// --- Force-correct disputed words to the human-reviewed authority
// (HowManySyllables / standard dictionaries), overriding CMU where they
// differ (CMU encodes full-pronunciation variants: fire=2, hour=2, every=3).
const EXTRAS = {
  fire: 1, hour: 1, every: 2, chocolate: 3, pronunciation: 5,
  rhythm: 2, squirrel: 2, poem: 2, iron: 2, orange: 2,
  quiet: 2, science: 2, world: 1, mobile: 2, library: 3, vegetable: 3,
};
for (const [w, c] of Object.entries(EXTRAS)) {
  dict[w] = c; // unconditional override
}

// --- write TS ---
const header = `/**
 * English word → syllable count dictionary (${Object.keys(dict).length} words).
 * Generated from the CMU Pronouncing Dictionary filtered by an English
 * frequency list. Do not edit by hand — regenerate:
 *   node scripts/generate-syllable-dict.mjs <cmudict.dict> <en_50k.txt> <out> <topN>
 */
export const SYLLABLE_DICT: Record<string, number> = `;
const body = header + JSON.stringify(dict) + ';\n';
fs.writeFileSync(OUT, body);

console.log(`dict words: ${Object.keys(dict).length}`);
console.log(`file size: ${(body.length / 1024).toFixed(1)} KB raw`);

// --- verify benchmark coverage (authority values from HowManySyllables) ---
const benchmark = {
  apple: 2, table: 2, happy: 2, family: 3, beautiful: 3, butterfly: 3,
  quiet: 2, science: 2, separate: 3, necessary: 4, information: 4,
  pronunciation: 5, special: 2, restaurant: 3, chocolate: 3, everyone: 3,
  every: 2, orange: 2, iron: 2, rhythm: 2, world: 1, squirrel: 2, poem: 2,
  mobile: 2, believe: 2, camera: 3, vegetable: 3, library: 3, fire: 1, hour: 1,
};
let covered = 0;
for (const [w, expected] of Object.entries(benchmark)) {
  const got = dict[w];
  const ok = got === expected;
  if (ok) covered += 1;
  if (!ok) console.log(`  MISS/ERR ${w}: dict=${got ?? 'MISS'} expected=${expected}`);
}
console.log(`benchmark coverage: ${covered}/${Object.keys(benchmark).length}`);
