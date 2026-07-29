'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from '@phosphor-icons/react/dist/ssr';
import EmptyState from './EmptyState';

interface OutputPanelProps {
  text: string;
  emptyMessage?: string;
  label?: string;
}

export default function OutputPanel({
  text,
  emptyMessage = 'Output will appear here.',
  label = 'Output',
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [text]);

  if (!text) {
    return (
      <div>
        {label && (
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-500">
            {label}
          </label>
        )}
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-stone-500">
          {label}
        </label>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-500 transition-[color,background-color,border-color,scale] duration-150 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" weight="bold" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <div
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm leading-relaxed text-stone-800 whitespace-pre-wrap"
        dir="auto"
      >
        {text}
      </div>
    </div>
  );
}
