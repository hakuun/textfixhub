'use client';

import { useState, useCallback, useEffect } from 'react';
import { Check, Copy, Trash } from '@phosphor-icons/react/dist/ssr';
import {
  pickRandomNflTeams,
  getNflTeamsForFilter,
  getContrastForeground,
  teamFullName,
  type NflConference,
  type NflDivision,
  type NflTeam,
} from '@/lib/nfl-teams';
import CountSelector from '@/components/CountSelector';

const HISTORY_KEY = 'textfixhub:nfl-history';
const HISTORY_LIMIT = 10;

interface NflPickHistoryEntry {
  teams: string[];
  timestamp: number;
}

function readHistory(): NflPickHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NflPickHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => Array.isArray(e.teams) && e.teams.every((t) => typeof t === 'string'))
      .slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

function writeHistory(entries: NflPickHistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)));
  } catch {
    // localStorage can throw in private mode / storage-full; ignore silently.
  }
}

const CONFERENCES: { id: NflConference | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'AFC', label: 'AFC' },
  { id: 'NFC', label: 'NFC' },
];

const DIVISIONS: { id: NflDivision | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'East', label: 'East' },
  { id: 'North', label: 'North' },
  { id: 'South', label: 'South' },
  { id: 'West', label: 'West' },
];

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.96] ${
            value === opt.id
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function TeamCard({ team }: { team: NflTeam }) {
  const fg = getContrastForeground(team.color);
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-sm ring-1 ring-black/5"
      style={{ backgroundColor: team.color, color: fg }}
    >
      <p className="truncate text-sm font-semibold">{teamFullName(team)}</p>
      <p
        className="text-xs opacity-80"
        style={{ color: fg }}
      >
        {team.conference} {team.division}
      </p>
    </div>
  );
}

export default function NflTeamGeneratorDemo() {
  const [conference, setConference] = useState<NflConference | 'all'>('all');
  const [division, setDivision] = useState<NflDivision | 'all'>('all');
  const [count, setCount] = useState(5);
  const [teams, setTeams] = useState<NflTeam[]>([]);
  const [copied, setCopied] = useState(false);
  // Recent-picks history persisted to localStorage. Read lazily after mount
  // so SSR and client HTML match (window is unavailable during SSR).
  const [history, setHistory] = useState<NflPickHistoryEntry[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    setHistory(readHistory());
    setHistoryLoaded(true);
  }, []);

  const poolSize = getNflTeamsForFilter(conference, division).length;

  const handleGenerate = useCallback(() => {
    const picked = pickRandomNflTeams({
      count: Math.min(count, poolSize),
      conference,
      division,
    });
    setTeams(picked);
    setCopied(false);
    setHistory((prev) => {
      const entry: NflPickHistoryEntry = {
        teams: picked.map(teamFullName),
        timestamp: Date.now(),
      };
      const next = [entry, ...prev].slice(0, HISTORY_LIMIT);
      writeHistory(next);
      return next;
    });
  }, [count, poolSize, conference, division]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    writeHistory([]);
  }, []);

  const handleCopyAll = useCallback(() => {
    if (teams.length === 0) return;
    navigator.clipboard
      .writeText(teams.map(teamFullName).join('\n'))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }, [teams]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Conference
          </span>
          <Segmented
            options={CONFERENCES}
            value={conference}
            onChange={setConference}
          />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Division
          </span>
          <Segmented options={DIVISIONS} value={division} onChange={setDivision} />
        </div>
        <CountSelector
          value={Math.min(count, poolSize)}
          onChange={setCount}
          min={1}
          max={poolSize}
          label="Teams"
        />
        <button
          onClick={handleGenerate}
          className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-emerald-700 active:scale-[0.96]"
        >
          Generate
        </button>
      </div>

      <p className="text-xs text-stone-500">
        Picking from {poolSize} {poolSize === 1 ? 'team' : 'teams'} — no
        duplicates, and logo-free color swatches.
      </p>

      {teams.length === 0 ? (
        <div className="card-surface flex items-center justify-center px-6 py-10">
          <p className="text-center text-sm text-stone-500">
            Click “Generate” to pick random NFL teams.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-700">
              Your {teams.length} {teams.length === 1 ? 'team' : 'teams'}
            </p>
            <button
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" weight="bold" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy List
                </>
              )}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard key={teamFullName(team)} team={team} />
            ))}
          </div>
        </div>
      )}

      {historyLoaded && history.length > 0 && (
        <div className="space-y-3 border-t border-stone-100 pt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-700">
              Recent picks ({history.length}/{HISTORY_LIMIT})
            </p>
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-200 ease-out hover:border-red-200 hover:bg-red-50 hover:text-red-700 active:scale-[0.96]"
            >
              <Trash className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {history.map((entry, i) => (
              <div
                key={`${entry.timestamp}-${i}`}
                className="flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-700"
              >
                <span className="mr-1 text-xs font-medium tabular-nums text-stone-400">
                  #{history.length - i}
                </span>
                {entry.teams.map((name, j) => (
                  <span key={`${name}-${j}`} className="flex items-center">
                    {j > 0 && (
                      <span aria-hidden="true" className="mx-1 text-stone-300">
                        ·
                      </span>
                    )}
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
