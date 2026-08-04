import { describe, it, expect } from 'vitest';
import {
  smallCapsText,
  superscriptText,
  subscriptText,
} from './small-text';

describe('smallCapsText', () => {
  it('maps uppercase letters to small caps', () => {
    expect(smallCapsText('ABC')).toBe('ᴀʙᴄ');
  });

  it('maps lowercase letters to the same small caps', () => {
    expect(smallCapsText('abc')).toBe('ᴀʙᴄ');
  });

  it('covers the full alphabet', () => {
    expect(smallCapsText('abcdefghijklmnopqrstuvwxyz')).toBe(
      'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',
    );
  });

  it('keeps digits unchanged (no small-cap digit form)', () => {
    expect(smallCapsText('A1 B2')).toBe('ᴀ1 ʙ2');
  });

  it('passes CJK and emoji through unchanged', () => {
    expect(smallCapsText('你好 👍')).toBe('你好 👍');
  });

  it('handles empty input', () => {
    expect(smallCapsText('')).toBe('');
  });
});

describe('superscriptText', () => {
  it('maps digits and uppercase letters to superscript', () => {
    expect(superscriptText('H2O')).toBe('ᴴ²ᴼ');
  });

  it('maps x and digits together', () => {
    expect(superscriptText('x2')).toBe('ˣ²');
  });

  it('maps lowercase letters to superscript', () => {
    expect(superscriptText('pm2.5')).toBe('ᵖᵐ².⁵');
  });

  it('keeps letters without a superscript form', () => {
    expect(superscriptText('Cq')).toBe('Cq');
  });

  it('keeps spaces and punctuation', () => {
    expect(superscriptText('a b!')).toBe('ᵃ ᵇ!');
  });
});

describe('subscriptText', () => {
  it('maps digits to subscript', () => {
    expect(subscriptText('H2O')).toBe('H₂O');
  });

  it('maps the letters that have subscript forms', () => {
    expect(subscriptText('aen')).toBe('ₐₑₙ');
  });

  it('keeps letters without a subscript form', () => {
    expect(subscriptText('bcd')).toBe('bcd');
  });

  it('maps minus and parentheses', () => {
    expect(subscriptText('C6H12O6')).toBe('C₆H₁₂O₆');
  });
});
