'use client';

import { useState, useMemo, useEffect } from 'react';
import type { TextSyllableStats } from '@/lib/text/syllable-counter';
import TextInput from '@/components/TextInput';

function StatTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div className="card-surface rounded-xl bg-white px-4 py-3 text-center">
      <div
        className={`text-2xl font-bold tabular-nums ${
          highlight ? 'text-emerald-700' : 'text-stone-900'
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-stone-500">{label}</div>
    </div>
  );
}

export default function SyllableCounterDemo() {
  const [input, setInput] = useState('');
  // The 20K-word dictionary is ~80KB gzipped. We lazy-load it on first real
  // input so it never blocks the page's initial render (FCP).
  const [counter, setCounter] = useState<
    null | ((t: string) => TextSyllableStats)
  >(null);

  useEffect(() => {
    if (counter) return; // dictionary already loaded
    if (!input.trim()) return; // wait until the user actually types
    let cancelled = false;
    import('@/lib/text/syllable-counter')
      .then((mod) => {
        if (!cancelled) setCounter(() => mod.countTextSyllables);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [input, counter]);

  const stats = useMemo(
    () => (counter ? counter(input) : null),
    [input, counter],
  );

  const hasText = input.trim().length > 0;

  return (
    <div className="space-y-4">
      <TextInput
        label="Your Poem or Text"
        placeholder="Paste a poem or any text here — syllable counts update as you type…"
        value={input}
        onChange={setInput}
      />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        <StatTile
          label="Total Syllables"
          value={stats ? stats.total : '—'}
          highlight
        />
        <StatTile label="Words" value={stats ? stats.wordCount : '—'} />
        <StatTile label="Lines" value={stats ? stats.lines.length : '—'} />
      </div>

      {hasText && stats && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700">
            Syllables Per Line
          </h3>
          <div className="space-y-1.5">
            {stats.lines.map((line, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-4 py-2.5"
              >
                <span className="whitespace-pre-wrap break-words font-mono text-sm text-stone-700">
                  {line.text || (
                    <span className="text-stone-400">(blank line)</span>
                  )}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
                    line.count === 0
                      ? 'bg-stone-100 text-stone-400'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {line.count}
                </span>
              </div>
            ))}
          </div>

          <details className="card-surface rounded-xl p-4">
            <summary className="cursor-pointer text-sm font-semibold text-stone-700">
              Show syllables per word
            </summary>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stats.words.map((w, i) => (
                <span
                  key={`${w.word}-${i}`}
                  className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
                >
                  {w.word}
                  <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                    {w.count}
                  </span>
                </span>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
