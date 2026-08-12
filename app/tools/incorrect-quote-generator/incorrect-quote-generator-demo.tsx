'use client';

import { useState, useCallback } from 'react';
import { Check, Copy, Plus, Trash } from '@phosphor-icons/react/dist/ssr';
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

export default function IncorrectQuoteGeneratorDemo() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [mood, setMood] = useState<QuoteMood | 'any'>('any');
  const [quote, setQuote] = useState<IncorrectQuote | null>(null);
  const [copied, setCopied] = useState(false);

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
    setQuote(generateIncorrectQuote({ names, mood }));
    setCopied(false);
  }, [names, mood]);

  const handleCopy = useCallback(async () => {
    if (!quote) return;
    const text = quote.lines.map((l) => `${l.speaker}: ${l.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; ignore silently.
    }
  }, [quote]);

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
            for a fake conversation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-700">
              {getMoodLabel(quote.mood)} incorrect quote
            </p>
            <button
              onClick={handleCopy}
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
                  Copy Quote
                </>
              )}
            </button>
          </div>
          <div className="card-surface space-y-2 px-5 py-4">
            {quote.lines.map((line, i) => (
              <p key={i} className="text-sm leading-relaxed text-stone-700">
                <span className="font-semibold text-stone-900">{line.speaker}:</span>{' '}
                {line.text}
              </p>
            ))}
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
