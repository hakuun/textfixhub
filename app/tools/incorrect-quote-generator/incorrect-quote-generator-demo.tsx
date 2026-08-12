'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Check,
  Copy,
  DiscordLogo,
  FileHtml,
  Plus,
  Trash,
} from '@phosphor-icons/react/dist/ssr';
import {
  generateIncorrectQuote,
  getMoodLabel,
  MOODS,
  type QuoteMood,
  type IncorrectQuote,
} from '@/lib/text/incorrect-quotes';

const DEFAULT_NAMES = ['Alex', 'Sam', 'Jordan'];
const MAX_NAMES = 6;
const MIN_NAMES = 2;

type CopyFormat = 'text' | 'discord' | 'html';

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

/** Render an auto-growing textarea for an editable quote line. */
function EditableLine({
  value,
  onChange,
  onKeyDown,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const autoResize = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);
  // Re-measure whenever the value changes externally (e.g. a new quote is
  // generated), not just while typing.
  useEffect(() => {
    autoResize();
  }, [value, autoResize]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      rows={1}
      className="min-w-0 flex-1 resize-none rounded-lg border border-transparent bg-transparent py-1 pl-1 text-sm leading-relaxed text-stone-700 outline-none transition-colors hover:border-stone-200 focus:border-emerald-300 focus:bg-white"
    />
  );
}

export default function IncorrectQuoteGeneratorDemo() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [mood, setMood] = useState<QuoteMood | 'any'>('any');
  const [quote, setQuote] = useState<IncorrectQuote | null>(null);
  const [scene, setScene] = useState<string | undefined>(undefined);
  const [lines, setLines] = useState<{ speaker: string; text: string }[]>([]);
  const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);

  const updateName = useCallback((index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const addName = useCallback(() => {
    setNames((prev) =>
      prev.length >= MAX_NAMES ? prev : [...prev, `Character ${prev.length + 1}`],
    );
  }, []);

  const removeName = useCallback((index: number) => {
    setNames((prev) => (prev.length <= MIN_NAMES ? prev : prev.filter((_, i) => i !== index)));
  }, []);

  const handleGenerate = useCallback(() => {
    const q = generateIncorrectQuote({ names, mood });
    setQuote(q);
    setScene(q.scene);
    setLines(q.lines.map((l) => ({ speaker: l.speaker, text: l.text })));
    setCopiedFormat(null);
  }, [names, mood]);

  const updateLineText = useCallback((index: number, text: string) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index]!, text };
      return next;
    });
  }, []);

  const formatFor = useCallback((format: CopyFormat): string => {
    if (format === 'text') return lines.map((l) => `${l.speaker}: ${l.text}`).join('\n');
    if (format === 'discord')
      return lines.map((l) => `**${l.speaker}:** ${l.text}`).join('\n');
    return lines
      .map((l) => `<p><strong>${l.speaker}:</strong> ${l.text}</p>`)
      .join('\n');
  }, [lines]);

  const handleCopy = useCallback(
    async (format: CopyFormat) => {
      try {
        await navigator.clipboard.writeText(formatFor(format));
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2000);
      } catch {
        // Clipboard unavailable; ignore silently.
      }
    },
    [formatFor],
  );

  const copyLabel = (format: CopyFormat, label: React.ReactNode) => (
    <button
      onClick={() => handleCopy(format)}
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
    >
      {copiedFormat === format ? (
        <>
          <Check className="h-3.5 w-3.5" weight="bold" />
          Copied
        </>
      ) : (
        label
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Characters
          </span>
          {names.length < MAX_NAMES && (
            <button
              onClick={addName}
              className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Plus className="h-3 w-3" weight="bold" />
              Add
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {names.map((name, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                maxLength={20}
                aria-label={`Character ${i + 1} name`}
                className="w-36 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              {names.length > MIN_NAMES && (
                <button
                  onClick={() => removeName(i)}
                  aria-label={`Remove character ${i + 1}`}
                  className="rounded-full p-1 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Mood
        </span>
        <Segmented
          options={[
            { id: 'any', label: 'Any' },
            ...MOODS.map((m) => ({ id: m, label: getMoodLabel(m) })),
          ]}
          value={mood}
          onChange={setMood}
        />
      </div>

      <button
        onClick={handleGenerate}
        className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-emerald-700 active:scale-[0.96]"
      >
        Generate Quote
      </button>

      {quote === null ? (
        <div className="card-surface flex items-center justify-center px-6 py-10">
          <p className="text-center text-sm text-stone-500">
            Add your character names, pick a mood, then hit “Generate Quote”
            for a fake conversation. Lines are editable after generating.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-stone-700">
              {getMoodLabel(quote.mood)} incorrect quote
              <span className="ml-2 text-xs font-normal text-stone-400">
                click any line to edit
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {copyLabel('text', (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              ))}
              {copyLabel('discord', (
                <>
                  <DiscordLogo className="h-3.5 w-3.5" />
                  Discord
                </>
              ))}
              {copyLabel('html', (
                <>
                  <FileHtml className="h-3.5 w-3.5" />
                  HTML
                </>
              ))}
            </div>
          </div>
          <div className="card-surface px-5 py-4">
            {scene && (
              <p className="mb-2 text-xs italic text-stone-400">{scene}</p>
            )}
            <div className="space-y-1">
              {lines.map((line, i) => (
                <div key={i} className="flex items-baseline gap-1.5">
                  <span className="shrink-0 text-sm font-semibold text-stone-900">
                    {line.speaker}:
                  </span>
                  <EditableLine
                    value={line.text}
                    onChange={(v) => updateLineText(i, v)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            Generate another
          </button>
        </div>
      )}
    </div>
  );
}
