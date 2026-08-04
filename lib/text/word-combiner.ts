/**
 * Word Combiner — blends two words into portmanteau-style variants using
 * syllable-aware boundaries, not naive concatenation. Finds natural break
 * points (vowel↔consonant transitions), shared-overlap merges, and
 * vowel-collision handling so results read like real coined words.
 */

const VOWELS = 'aeiouy';

function isVowel(c: string): boolean {
  return VOWELS.includes(c);
}

/** Indexes where a natural syllable break occurs in a word (V↔C transitions). */
function boundaryPositions(word: string): number[] {
  const positions: number[] = [];
  for (let i = 1; i < word.length; i++) {
    if (isVowel(word[i - 1]) !== isVowel(word[i])) {
      positions.push(i);
    }
  }
  return positions;
}

/** Length of the longest suffix of a that equals a prefix of b. */
function maxOverlap(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  for (let len = max; len > 0; len--) {
    if (a.slice(-len) === b.slice(0, len)) return len;
  }
  return 0;
}

/**
 * Combine two words into a set of unique portmanteau variants.
 * Non-letter characters are stripped; input is lowercased.
 */
export function combineWords(a: string, b: string): string[] {
  const A = a.toLowerCase().replace(/[^a-z]/g, '');
  const B = b.toLowerCase().replace(/[^a-z]/g, '');
  if (!A || !B) return [];

  const out = new Set<string>();
  out.add(A + B); // direct join

  // Split A at a syllable boundary, keep all of B: A[0:i] + B
  for (const i of boundaryPositions(A)) {
    if (i >= 2) out.add(A.slice(0, i) + B);
  }

  // Keep all of A, start B at a syllable boundary: A + B[j:]
  for (const j of boundaryPositions(B)) {
    if (B.length - j >= 2) out.add(A + B.slice(j));
  }

  // Shared overlap: drop the duplicated middle (e.g. sun + ny → sunny)
  const ov = maxOverlap(A, B);
  if (ov > 0) out.add(A + B.slice(ov));

  // Vowel collision: A ends and B starts with a vowel → drop one of them
  if (isVowel(A[A.length - 1]) && isVowel(B[0])) {
    out.add(A.slice(0, -1) + B);
    out.add(A + B.slice(1));
  }

  return [...out];
}
