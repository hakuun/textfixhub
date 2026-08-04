'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from '@phosphor-icons/react/dist/ssr';
import {
  pickRandomNflTeams,
  getNflTeamsForFilter,
  teamFullName,
  type NflConference,
  type NflDivision,
  type NflTeam,
} from '@/lib/nfl-teams';
import CountSelector from '@/components/CountSelector';

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
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <span
        aria-hidden="true"
        className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white shadow"
        style={{ backgroundColor: team.color }}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-900">
          {teamFullName(team)}
        </p>
        <p className="text-xs text-stone-500">
          {team.conference} {team.division}
        </p>
      </div>
    </div>
  );
}

export default function NflTeamGeneratorDemo() {
  const [conference, setConference] = useState<NflConference | 'all'>('all');
  const [division, setDivision] = useState<NflDivision | 'all'>('all');
  const [count, setCount] = useState(5);
  const [teams, setTeams] = useState<NflTeam[]>([]);
  const [copied, setCopied] = useState(false);

  const poolSize = getNflTeamsForFilter(conference, division).length;

  const handleGenerate = useCallback(() => {
    setTeams(
      pickRandomNflTeams({
        count: Math.min(count, poolSize),
        conference,
        division,
      }),
    );
    setCopied(false);
  }, [count, poolSize, conference, division]);

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
    </div>
  );
}
