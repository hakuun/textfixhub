'use client';

import { useState, useCallback } from 'react';
import { Check, Copy, Download } from '@phosphor-icons/react/dist/ssr';
import {
  generateFakeWords,
  type FakeWordStyle,
} from '@/lib/text/fake-word-generator';
import CountSelector from '@/components/CountSelector';

const STYLES: { id: FakeWordStyle; label: string }[] = [
  { id: 'english', label: 'English' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'scifi', label: 'Sci-Fi' },
];

type LengthId = 'short' | 'medium' | 'long';

const LENGTHS: { id: LengthId; label: string; bounds: [number, number] }[] = [
  { id: 'short', label: 'Short', bounds: [3, 5] },
  { id: 'medium', label: 'Medium', bounds: [5, 8] },
  { id: 'long', label: 'Long', bounds: [7, 12] },
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

export default function FakeWordGeneratorDemo() {
  const [count, setCount] = useState(10);
  const [style, setStyle] = useState<FakeWordStyle>('fantasy');
  const [lengthId, setLengthId] = useState<LengthId>('medium');
  const [words, setWords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bounds = LENGTHS.find((l) => l.id === lengthId)!.bounds;

  const handleGenerate = useCallback(() => {
    setWords(
      generateFakeWords({
        count,
        minLength: bounds[0],
        maxLength: bounds[1],
        style,
      }),
    );
    setCopiedIndex(null);
  }, [count, style, bounds]);

  const handleCopyWord = useCallback((word: string, index: number) => {
    navigator.clipboard
      .writeText(word)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      })
      .catch(() => {});
  }, []);

  const handleCopyAll = useCallback(() => {
    if (words.length === 0) return;
    navigator.clipboard.writeText(words.join('\n')).catch(() => {});
  }, [words]);

  const handleDownload = useCallback(() => {
    if (words.length === 0) return;
    const blob = new Blob([words.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-words.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [words]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <CountSelector
          value={count}
          onChange={setCount}
          min={1}
          max={50}
          label="Words"
        />
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Style
          </span>
          <Segmented options={STYLES} value={style} onChange={setStyle} />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Length
          </span>
          <Segmented options={LENGTHS} value={lengthId} onChange={setLengthId} />
        </div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-emerald-700 active:scale-[0.96]"
        >
          Generate
        </button>
      </div>

      {words.length === 0 ? (
        <div className="card-surface flex items-center justify-center px-6 py-10">
          <p className="text-center text-sm text-stone-500">
            Click “Generate” to invent new words. Click any word to copy it.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">
              {words.length} {words.length === 1 ? 'word' : 'words'} — click any
              word to copy
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy All
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
              >
                <Download className="h-3.5 w-3.5" />
                Download (.txt)
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {words.map((word, i) => (
              <button
                key={`${word}-${i}`}
                onClick={() => handleCopyWord(word, i)}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1.5 text-sm font-medium text-stone-800 transition-all duration-200 ease-out hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
                title="Click to copy"
              >
                {word}
                {copiedIndex === i ? (
                  <Check className="h-3 w-3 text-emerald-600" weight="bold" />
                ) : (
                  <Copy className="h-3 w-3 opacity-40" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
