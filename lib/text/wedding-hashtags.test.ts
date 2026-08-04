import { describe, it, expect } from 'vitest';
import { generateWeddingHashtags } from './wedding-hashtags';

function flat(opts: Parameters<typeof generateWeddingHashtags>[0]): string[] {
  return generateWeddingHashtags(opts).flatMap((g) => g.hashtags);
}

describe('generateWeddingHashtags', () => {
  it('returns all three groups for two full names', () => {
    const groups = generateWeddingHashtags({
      partner1: 'Emma Smith',
      partner2: 'Liam Jones',
    });
    const categories = groups.map((g) => g.category);
    expect(categories).toContain('Shared Last Name');
    expect(categories).toContain('Names & Mashups');
    expect(categories).toContain('Classic & Date');
  });

  it('builds last-name hashtags from a shared surname', () => {
    const tags = flat({ partner1: 'Emma Smith', partner2: 'Liam Smith' });
    expect(tags).toContain('#SmithWedding');
    expect(tags).toContain('#MrAndMrsSmith');
    expect(tags).toContain('#HappilyEverSmith');
  });

  it('joins distinct last names into a combined household', () => {
    const tags = flat({ partner1: 'Emma Smith', partner2: 'Liam Jones' });
    expect(tags).toContain('#SmithJonesWedding');
  });

  it('builds name mashups from first names', () => {
    const tags = flat({ partner1: 'Emma', partner2: 'Liam' });
    expect(tags).toContain('#EmmaLiam');
    expect(tags).toContain('#EmmaAndLiam');
    expect(tags).toContain('#EmmaWedsLiam');
  });

  it('appends the year when provided', () => {
    const tags = flat({ partner1: 'Emma', partner2: 'Liam', year: '2026' });
    expect(tags).toContain('#EmmaAndLiam2026');
    expect(tags).toContain('#JustSaidIDo2026');
    expect(tags).toContain('#TyingTheKnot2026');
  });

  it('dedupes case-insensitively', () => {
    const tags = flat({ partner1: 'emma', partner2: 'LIAM' });
    const lower = tags.map((t) => t.toLowerCase());
    expect(new Set(lower).size).toBe(lower.length);
  });

  it('strips non-letter characters from names', () => {
    const tags = flat({ partner1: 'Emma!', partner2: 'Liam@2026' });
    expect(tags).toContain('#EmmaLiam');
    expect(tags).toContain('#EmmaAndLiam');
  });

  it('returns classic phrases even with only first names', () => {
    const tags = flat({ partner1: 'Emma', partner2: 'Liam' });
    expect(tags).toContain('#HappilyEverAfter');
    expect(tags).toContain('#NewlywedLife');
  });

  it('returns an empty array when no usable name is given', () => {
    expect(generateWeddingHashtags({ partner1: '', partner2: '' })).toEqual([]);
    expect(generateWeddingHashtags({ partner1: '   ', partner2: '   ' })).toEqual(
      [],
    );
  });

  it('every hashtag starts with a hash and has no spaces', () => {
    const tags = flat({ partner1: 'Emma Smith', partner2: 'Liam Jones' });
    for (const t of tags) {
      expect(t).toMatch(/^#[A-Za-z0-9]+$/);
    }
  });
});
