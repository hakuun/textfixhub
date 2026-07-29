'use client';

import { useState, useMemo, useCallback } from 'react';
import { countSentences } from '@/lib/text/sentence-counter';
import TextInput from '@/components/TextInput';

/** Individual stat tile */
function StatTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | string;
  unit?: string;
}) {
  return (
    <div className="card-surface rounded-xl bg-white px-4 py-3 text-center">
      <div className="text-2xl font-bold text-emerald-700 tabular-nums">
        {value}
        {unit ? <span className="ml-0.5 text-sm font-normal text-emerald-500">{unit}</span> : null}
      </div>
      <div className="mt-0.5 text-xs text-stone-500">{label}</div>
    </div>
  );
}

export default function SentenceCounterDemo() {
  const [input, setInput] = useState('');

  const stats = useMemo(() => countSentences(input), [input]);

  const handleCopyStats = useCallback(() => {
    const lines = [
      `Sentences: ${stats.sentenceCount}`,
      `Words: ${stats.wordCount}`,
      `Characters (with spaces): ${stats.charCountWithSpaces}`,
      `Characters (no spaces): ${stats.charCountWithoutSpaces}`,
      `Paragraphs: ${stats.paragraphCount}`,
      `Lines: ${stats.lineCount}`,
      `Average Sentence Length: ${stats.avgSentenceLengthWords} words`,
      `Average Word Length: ${stats.avgWordLengthChars} characters`,
      `Reading Time: ${stats.readingTimeMinutes} min`,
      `Speaking Time: ${stats.speakingTimeMinutes} min`,
    ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  }, [stats]);

  const readingTimeLabel =
    stats.readingTimeMinutes === 0
      ? '0 min'
      : stats.readingTimeMinutes === 1
        ? '1 min'
        : `${stats.readingTimeMinutes} min`;

  const speakingTimeLabel =
    stats.speakingTimeMinutes === 0
      ? '0 min'
      : stats.speakingTimeMinutes === 1
        ? '1 min'
        : `${stats.speakingTimeMinutes} min`;

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Sentences" value={stats.sentenceCount} />
        <StatTile label="Words" value={stats.wordCount} />
        <StatTile label="Characters" value={stats.charCountWithSpaces} />
        <StatTile label="Chars (no spaces)" value={stats.charCountWithoutSpaces} />
        <StatTile label="Paragraphs" value={stats.paragraphCount} />
        <StatTile label="Lines" value={stats.lineCount} />
        <StatTile
          label="Avg Sentence Length"
          value={stats.avgSentenceLengthWords}
          unit="words"
        />
        <StatTile
          label="Avg Word Length"
          value={stats.avgWordLengthChars}
          unit="chars"
        />
        <StatTile label="Reading Time" value={readingTimeLabel} />
        <StatTile label="Speaking Time" value={speakingTimeLabel} />
      </div>

      {/* Copy button */}
      {stats.sentenceCount > 0 && (
        <div className="flex gap-2">
          <button
            onClick={handleCopyStats}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-500 transition-[color,background-color,border-color,scale] duration-150 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
          >
            Copy Statistics
          </button>
        </div>
      )}

      <TextInput
        label="Your Text"
        placeholder="Paste your text here to see complete statistics..."
        value={input}
        onChange={setInput}
      />

      {/* Extracted sentences (collapsed by default) */}
      {stats.sentences.length > 0 && (
        <details className="rounded-xl border border-stone-200 p-4">
          <summary className="cursor-pointer text-sm font-medium text-stone-700">
            Show extracted sentences ({stats.sentences.length})
          </summary>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-600">
            {stats.sentences.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
