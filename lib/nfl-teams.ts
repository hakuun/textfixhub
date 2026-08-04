/**
 * Random NFL Team Generator — all 32 NFL teams with conference, division,
 * and approximate brand colors. Official logos are trademarked, so we render
 * a color swatch instead. Colors are close approximations of each team's
 * primary brand color.
 */

import { mulberry32, shuffle } from './text/random';

export type NflConference = 'AFC' | 'NFC';
export type NflDivision = 'East' | 'North' | 'South' | 'West';

export interface NflTeam {
  city: string;
  name: string;
  conference: NflConference;
  division: NflDivision;
  color: string;
}

export interface NflPickOptions {
  count: number;
  conference?: NflConference | 'all';
  division?: NflDivision | 'all';
  seed?: number;
}

export const NFL_TEAMS: NflTeam[] = [
  // AFC East
  { city: 'Buffalo', name: 'Bills', conference: 'AFC', division: 'East', color: '#00338D' },
  { city: 'Miami', name: 'Dolphins', conference: 'AFC', division: 'East', color: '#008E97' },
  { city: 'New England', name: 'Patriots', conference: 'AFC', division: 'East', color: '#002244' },
  { city: 'New York', name: 'Jets', conference: 'AFC', division: 'East', color: '#125740' },
  // AFC North
  { city: 'Baltimore', name: 'Ravens', conference: 'AFC', division: 'North', color: '#241773' },
  { city: 'Cincinnati', name: 'Bengals', conference: 'AFC', division: 'North', color: '#FB4F14' },
  { city: 'Cleveland', name: 'Browns', conference: 'AFC', division: 'North', color: '#311D00' },
  { city: 'Pittsburgh', name: 'Steelers', conference: 'AFC', division: 'North', color: '#FFB612' },
  // AFC South
  { city: 'Houston', name: 'Texans', conference: 'AFC', division: 'South', color: '#03202F' },
  { city: 'Indianapolis', name: 'Colts', conference: 'AFC', division: 'South', color: '#002C5F' },
  { city: 'Jacksonville', name: 'Jaguars', conference: 'AFC', division: 'South', color: '#006778' },
  { city: 'Tennessee', name: 'Titans', conference: 'AFC', division: 'South', color: '#0C2340' },
  // AFC West
  { city: 'Denver', name: 'Broncos', conference: 'AFC', division: 'West', color: '#FB4F14' },
  { city: 'Kansas City', name: 'Chiefs', conference: 'AFC', division: 'West', color: '#E31837' },
  { city: 'Las Vegas', name: 'Raiders', conference: 'AFC', division: 'West', color: '#000000' },
  { city: 'Los Angeles', name: 'Chargers', conference: 'AFC', division: 'West', color: '#0080C6' },
  // NFC East
  { city: 'Dallas', name: 'Cowboys', conference: 'NFC', division: 'East', color: '#041E42' },
  { city: 'New York', name: 'Giants', conference: 'NFC', division: 'East', color: '#0B2265' },
  { city: 'Philadelphia', name: 'Eagles', conference: 'NFC', division: 'East', color: '#004C54' },
  { city: 'Washington', name: 'Commanders', conference: 'NFC', division: 'East', color: '#5A1414' },
  // NFC North
  { city: 'Chicago', name: 'Bears', conference: 'NFC', division: 'North', color: '#0B162A' },
  { city: 'Detroit', name: 'Lions', conference: 'NFC', division: 'North', color: '#0076B6' },
  { city: 'Green Bay', name: 'Packers', conference: 'NFC', division: 'North', color: '#203731' },
  { city: 'Minnesota', name: 'Vikings', conference: 'NFC', division: 'North', color: '#4F2683' },
  // NFC South
  { city: 'Atlanta', name: 'Falcons', conference: 'NFC', division: 'South', color: '#A71930' },
  { city: 'Carolina', name: 'Panthers', conference: 'NFC', division: 'South', color: '#0085CA' },
  { city: 'New Orleans', name: 'Saints', conference: 'NFC', division: 'South', color: '#D3BC8D' },
  { city: 'Tampa Bay', name: 'Buccaneers', conference: 'NFC', division: 'South', color: '#D50A0A' },
  // NFC West
  { city: 'Arizona', name: 'Cardinals', conference: 'NFC', division: 'West', color: '#97233F' },
  { city: 'Los Angeles', name: 'Rams', conference: 'NFC', division: 'West', color: '#003594' },
  { city: 'San Francisco', name: '49ers', conference: 'NFC', division: 'West', color: '#AA0000' },
  { city: 'Seattle', name: 'Seahawks', conference: 'NFC', division: 'West', color: '#002244' },
];

/** Full display name, e.g. "Buffalo Bills". */
export function teamFullName(team: NflTeam): string {
  return `${team.city} ${team.name}`;
}

/**
 * Pick `count` random teams from the (optionally filtered) pool.
 * Returns teams in random order, no duplicates, capped at pool size.
 * Deterministic when `seed` is provided.
 */
export function pickRandomNflTeams(options: NflPickOptions): NflTeam[] {
  const { count, conference = 'all', division = 'all', seed } = options;

  const pool = NFL_TEAMS.filter(
    (t) =>
      (conference === 'all' || t.conference === conference) &&
      (division === 'all' || t.division === division),
  );

  const rand = mulberry32(seed ?? Math.floor(Math.random() * 2 ** 31));
  const shuffled = shuffle(pool, rand);
  return shuffled.slice(0, Math.max(0, Math.min(count, shuffled.length)));
}

export function getNflTeamsForFilter(
  conference: NflConference | 'all',
  division: NflDivision | 'all',
): NflTeam[] {
  return NFL_TEAMS.filter(
    (t) =>
      (conference === 'all' || t.conference === conference) &&
      (division === 'all' || t.division === division),
  );
}
