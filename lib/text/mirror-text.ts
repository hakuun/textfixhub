/**
 * Mirror Text Generator — three flip modes on one page:
 *  - Reverse: string order reversed
 *  - Upside Down: each char turned 180° + order reversed (true 180° rotation)
 *  - Mirror: horizontal mirror of each char, order kept
 *
 * Maps cover ASCII letters/digits/common punctuation; unmapped characters
 * (CJK, emoji) pass through unchanged. Iteration is code-point safe.
 */

// Upside-down (180°-turned) characters, used by the Upside Down mode.
const UPSIDE_DOWN: Record<string, string> = {
  A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H',
  I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ',
  Q: 'Ό', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X',
  Y: '⅄', Z: 'Z',
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ',
  i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'ʃ', m: 'ɯ', n: 'u', o: 'o', p: 'd',
  q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x',
  y: 'ʎ', z: 'z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ',
  '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '!': '¡', '?': '¿', '.': '˙', ',': "'", "'": ',', '"': '„',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '&': '⅋', '_': '‾', ';': '؛', ':': ':',
};

// Horizontal-mirror characters for the Mirror mode (order kept).
const MIRROR: Record<string, string> = {
  A: 'A', B: 'Ǝ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'ᖵ', G: '⅁', H: 'H',
  I: 'I', J: 'ᒐ', K: 'ʞ', L: '⅂', M: 'W', N: 'И', O: 'O', P: 'Ԁ',
  Q: 'Ọ', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X',
  Y: '⅄', Z: 'Z',
  a: 'ɒ', b: 'd', c: 'ɔ', d: 'b', e: 'ɘ', f: 'ᖷ', g: 'ᵷ', h: 'ʜ',
  i: 'i', j: 'ᒐ', k: 'ʞ', l: 'l', m: 'm', n: 'n', o: 'o', p: 'q',
  q: 'p', r: 'ɿ', s: 's', t: 'ʇ', u: 'u', v: 'v', w: 'w', x: 'x',
  y: 'y', z: 'z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ',
  '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '!': '¡', '?': '¿', '.': '˙', ',': "'", "'": ',', '"': '„',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '&': '⅋', '_': '‾', ';': '؛', ':': ':',
};

/** Reverse the character order of a string (code-point safe). */
export function reverseText(text: string): string {
  return [...text].reverse().join('');
}

/** 180° rotation: turn each char upside-down, then reverse order. */
export function upsideDownText(text: string): string {
  const flipped = [...text].map((c) => UPSIDE_DOWN[c] ?? c).join('');
  return reverseText(flipped);
}

/** Horizontal mirror of each character, order kept. */
export function mirrorText(text: string): string {
  return [...text].map((c) => MIRROR[c] ?? c).join('');
}
