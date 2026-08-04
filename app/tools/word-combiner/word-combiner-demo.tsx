'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from '@phosphor-icons/react/dist/ssr';
import { combineWords } from '@/lib/text/word-combiner';
import TextInput from '@/components/TextInput';

export default function WordCombinerDemo() {
  const [wordA, setWordA] = useState('');
  const [wordB, setWordB] = useState('');
  const [variants, setVariants] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const canCombine = wordA.trim().length > 0 && wordB.trim().length > 0;

  const handleCombine = useCallback(() => {
    setVariants(combineWords(wordA, wordB));
    setCopied(null);
    setCopiedAll(false);
  }, [wordA, wordB]);

  const handleCopyVariant = useCallback((text: string, index: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(index);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => {});
  }, []);

  const handleCopyAll = useCallback(() => {
    if (variants.length === 0) return;
    navigator.clipboard
      .writeText(variants.join('\n'))
      .then(() => {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      })
      .catch(() => {});
  }, [variants]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Word 1"
          placeholder="e.g. sun"
          value={wordA}
          onChange={setWordA}
          rows={2}
        />
        <TextInput
          label="Word 2"
          placeholder="e.g. flower"
          value={wordB}
          onChange={setWordB}
          rows={2}
        />
      </div>

      <button
        onClick={handleCombine}
        disabled={!canCombine}
        className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-emerald-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Combine
      </button>

      {variants.length === 0 ? (
        <div className="card-surface flex items-center justify-center px-6 py-10">
          <p className="text-center text-sm text-stone-500">
            Enter two words and click Combine to blend them into portmanteaus.
            Click any result to copy it.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-700">
              {variants.length} {variants.length === 1 ? 'variation' : 'variations'}
            </p>
            <button
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5" weight="bold" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy All
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={`${v}-${i}`}
                onClick={() => handleCopyVariant(v, i)}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1.5 text-sm font-medium text-stone-800 transition-all duration-200 ease-out hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
                title="Click to copy"
              >
                {v}
                {copied === i ? (
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
