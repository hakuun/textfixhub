import { describe, it, expect } from 'vitest';
import {
  NFL_TEAMS,
  pickRandomNflTeams,
  getNflTeamsForFilter,
  getContrastForeground,
  teamFullName,
} from './nfl-teams';

describe('NFL_TEAMS data', () => {
  it('contains exactly 32 teams', () => {
    expect(NFL_TEAMS).toHaveLength(32);
  });

  it('has 16 teams per conference', () => {
    expect(NFL_TEAMS.filter((t) => t.conference === 'AFC')).toHaveLength(16);
    expect(NFL_TEAMS.filter((t) => t.conference === 'NFC')).toHaveLength(16);
  });

  it('has 4 teams in each of the 8 divisions', () => {
    for (const conf of ['AFC', 'NFC'] as const) {
      for (const div of ['East', 'North', 'South', 'West'] as const) {
        expect(
          NFL_TEAMS.filter((t) => t.conference === conf && t.division === div),
        ).toHaveLength(4);
      }
    }
  });

  it('has no duplicate full names', () => {
    const names = NFL_TEAMS.map(teamFullName);
    expect(new Set(names).size).toBe(32);
  });

  it('every team has a color', () => {
    for (const t of NFL_TEAMS) {
      expect(t.color).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});

describe('pickRandomNflTeams', () => {
  it('returns the requested count', () => {
    const teams = pickRandomNflTeams({ count: 5, seed: 1 });
    expect(teams).toHaveLength(5);
  });

  it('returns unique teams', () => {
    const teams = pickRandomNflTeams({ count: 32, seed: 2 });
    expect(new Set(teams.map(teamFullName)).size).toBe(32);
  });

  it('is deterministic for a given seed', () => {
    const a = pickRandomNflTeams({ count: 4, seed: 42 });
    const b = pickRandomNflTeams({ count: 4, seed: 42 });
    expect(a.map(teamFullName)).toEqual(b.map(teamFullName));
  });

  it('filters by conference', () => {
    const teams = pickRandomNflTeams({ count: 8, conference: 'AFC', seed: 3 });
    expect(teams).toHaveLength(8);
    for (const t of teams) expect(t.conference).toBe('AFC');
  });

  it('filters by division', () => {
    const teams = pickRandomNflTeams({
      count: 4,
      division: 'North',
      seed: 4,
    });
    expect(teams).toHaveLength(4);
    for (const t of teams) expect(t.division).toBe('North');
  });

  it('filters by conference + division', () => {
    const teams = pickRandomNflTeams({
      count: 4,
      conference: 'NFC',
      division: 'West',
      seed: 5,
    });
    expect(teams).toHaveLength(4);
    for (const t of teams) {
      expect(t.conference).toBe('NFC');
      expect(t.division).toBe('West');
    }
  });

  it('caps count at pool size', () => {
    const teams = pickRandomNflTeams({ count: 100, seed: 6 });
    expect(teams).toHaveLength(32);
  });

  it('count 0 returns []', () => {
    expect(pickRandomNflTeams({ count: 0, seed: 7 })).toEqual([]);
  });
});

describe('getNflTeamsForFilter', () => {
  it('returns the matching subset', () => {
    expect(getNflTeamsForFilter('AFC', 'all')).toHaveLength(16);
    expect(getNflTeamsForFilter('all', 'West')).toHaveLength(8);
    expect(getNflTeamsForFilter('all', 'all')).toHaveLength(32);
  });
});

describe('getContrastForeground', () => {
  it('returns white text for dark backgrounds', () => {
    expect(getContrastForeground('#002244')).toBe('#FFFFFF'); // Patriots navy
    expect(getContrastForeground('#000000')).toBe('#FFFFFF'); // Raiders black
    expect(getContrastForeground('#00338D')).toBe('#FFFFFF'); // Bills blue
  });

  it('returns dark text for light backgrounds', () => {
    expect(getContrastForeground('#FFB612')).toBe('#0F172A'); // Steelers gold
    expect(getContrastForeground('#D3BC8D')).toBe('#0F172A'); // Saints gold
    expect(getContrastForeground('#FFFFFF')).toBe('#0F172A');
  });

  it('handles the classic red team colors', () => {
    expect(getContrastForeground('#E31837')).toBe('#FFFFFF'); // Chiefs red
    expect(getContrastForeground('#A71930')).toBe('#FFFFFF'); // Falcons red
    expect(getContrastForeground('#D50A0A')).toBe('#FFFFFF'); // Buccaneers red
  });

  it('every team gets a readable foreground', () => {
    for (const t of NFL_TEAMS) {
      const fg = getContrastForeground(t.color);
      expect(['#FFFFFF', '#0F172A']).toContain(fg);
    }
  });
});
