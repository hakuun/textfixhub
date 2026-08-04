import { describe, it, expect } from 'vitest';
import { reverseText, upsideDownText, mirrorText } from './mirror-text';

describe('reverseText', () => {
  it('reverses a string', () => {
    expect(reverseText('hello')).toBe('olleh');
  });

  it('reverses a sentence including spaces', () => {
    expect(reverseText('hi there')).toBe('ereht ih');
  });

  it('is code-point safe (emoji surrogate pairs intact)', () => {
    expect(reverseText('a😀b')).toBe('b😀a');
  });

  it('empty input → empty', () => {
    expect(reverseText('')).toBe('');
  });
});

describe('upsideDownText', () => {
  it('turns chars and reverses order (true 180° rotation)', () => {
    // h→ɥ e→ǝ l→ʃ l→ʃ o→o, then reversed → o ʃ ʃ ǝ ɥ
    expect(upsideDownText('hello')).toBe('oʃʃǝɥ');
  });

  it('maps uppercase letters', () => {
    expect(upsideDownText('AB')).toBe('𐐒∀');
  });

  it('passes unmapped characters (CJK) through unchanged', () => {
    const out = upsideDownText('hi你');
    expect(out).toContain('你');
  });

  it('empty input → empty', () => {
    expect(upsideDownText('')).toBe('');
  });
});

describe('mirrorText', () => {
  it('mirrors b→d and d→b', () => {
    expect(mirrorText('b')).toBe('d');
    expect(mirrorText('d')).toBe('b');
  });

  it('mirrors p→q and q→p', () => {
    expect(mirrorText('p')).toBe('q');
    expect(mirrorText('q')).toBe('p');
  });

  it('keeps character order (unlike upside down)', () => {
    // h→ʜ e→ɘ l→l l→l o→o
    expect(mirrorText('hello')).toBe('ʜɘllo');
  });

  it('passes unmapped characters through unchanged', () => {
    expect(mirrorText('中')).toBe('中');
  });

  it('empty input → empty', () => {
    expect(mirrorText('')).toBe('');
  });
});
