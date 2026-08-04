/**
 * Wedding Hashtag Generator — combines two partner names into wedding
 * hashtag suggestions, grouped by style:
 *  - Shared Last Name: MrAndMrsSmith, SmithWedding, HappilyEverSmith…
 *  - Names & Mashups: EmmaLiam, EmmaAndLiam, EmmaWedsLiam…
 *  - Classic & Date: JustSaidIDo2026, TyingTheKnot2026…
 *
 * Full names are parsed into first/last; non-letter characters are stripped;
 * hashtags are deduped case-insensitively.
 */

export interface HashtagGroup {
  category: string;
  hashtags: string[];
}

export interface WeddingHashtagOptions {
  partner1: string;
  partner2: string;
  year?: string;
}

interface NameParts {
  first: string;
  last: string;
}

/** Parse "Emma Smith" into { first: 'Emma', last: 'Smith' }. */
function parseName(name: string): NameParts {
  const parts = name.trim().replace(/\s+/g, ' ').split(' ');
  const first = (parts[0] ?? '').replace(/[^a-zA-Z]/g, '');
  const last =
    parts.length > 1
      ? (parts[parts.length - 1] ?? '').replace(/[^a-zA-Z]/g, '')
      : '';
  return { first, last };
}

/** Strip non-alphanumerics so the result is a clean hashtag body. */
function tagify(s: string): string {
  return s.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Generate wedding hashtags from two partner names.
 * Returns grouped results; empty array when no usable name is provided.
 */
export function generateWeddingHashtags(
  options: WeddingHashtagOptions,
): HashtagGroup[] {
  const p1 = parseName(options.partner1);
  const p2 = parseName(options.partner2);
  const year = tagify(options.year ?? '').slice(0, 4);

  const first1 = p1.first;
  const first2 = p2.first;

  // Unique last names; if both partners share one, use it alone, otherwise
  // join distinct last names for a combined-household hashtag.
  const lastSet = [...new Set([p1.last, p2.last].filter(Boolean))];
  const sharedLast =
    lastSet.length === 1 ? lastSet[0] : lastSet.length > 1 ? lastSet.join('') : '';

  // Nothing usable to build on.
  if (!first1 && !first2 && !sharedLast) return [];

  const groups: HashtagGroup[] = [];
  const seen = new Set<string>();

  const add = (body: string, list: string[]) => {
    const clean = tagify(body);
    if (!clean || seen.has(clean.toLowerCase())) return;
    seen.add(clean.toLowerCase());
    list.push(`#${clean}`);
  };

  // 1. Shared last name templates.
  if (sharedLast) {
    const list: string[] = [];
    const L = sharedLast;
    add(`${L}Wedding`, list);
    add(`The${L}Wedding`, list);
    add(`${L}Forever`, list);
    add(`HappilyEver${L}`, list);
    add(`JustMarried${L}`, list);
    add(`MrAndMrs${L}`, list);
    add(`The${L}Life`, list);
    add(`Eternally${L}`, list);
    add(`${L}ForLife`, list);
    add(`Love${L}`, list);
    add(`Blessed${L}`, list);
    add(`Finally${L}`, list);
    add(`TyingTheKnot${L}`, list);
    add(`Newlyweds${L}`, list);
    add(`SweetestDay${L}`, list);
    add(`StoryOf${L}`, list);
    add(`HomeIsWith${L}`, list);
    add(`FromMissToMrs${L}`, list);
    if (year) add(`${L}${year}`, list);
    if (list.length) {
      groups.push({ category: 'Shared Last Name', hashtags: list });
    }
  }

  // 2. First-name pairs and mashups.
  if (first1 && first2) {
    const list: string[] = [];
    const a = first1;
    const b = first2;
    add(`${a}${b}`, list);
    add(`${a}And${b}`, list);
    add(`${a}Weds${b}`, list);
    add(`${a.slice(0, 3)}And${b.slice(0, 3)}`, list);
    add(`${a.slice(0, 2)}And${b.slice(0, 2)}`, list);
    add(`The${a}${b}`, list);
    if (year) add(`${a}And${b}${year}`, list);
    if (year) add(`${a}Weds${b}${year}`, list);
    if (year) add(`${a}${b}${year}`, list);
    if (list.length) {
      groups.push({ category: 'Names & Mashups', hashtags: list });
    }
  }

  // 3. Classic wedding phrases (always available; date appended when given).
  const classic: string[] = [];
  add(`JustSaidIDo${year}`, classic);
  add(`TyingTheKnot${year}`, classic);
  add(`HappilyEverAfter${year}`, classic);
  add(`NewlywedLife`, classic);
  add(`ForeverStartsWithToday`, classic);
  add(`BestDayEver`, classic);
  add(`EternallyYours`, classic);
  add(`WeddingBells${year}`, classic);
  add(`IWroteMyVows`, classic);
  if (classic.length) {
    groups.push({ category: 'Classic & Date', hashtags: classic });
  }

  return groups;
}
