'use client';

import { useState, useCallback } from 'react';
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
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          onClick={handleCopy}
          className="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm leading-relaxed whitespace-pre-wrap"
        dir="auto"
      >
        {text}
      </div>
    </div>
  );
}
