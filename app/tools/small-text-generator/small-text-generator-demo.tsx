'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from '@phosphor-icons/react/dist/ssr';
import {
  smallCapsText,
  superscriptText,
  subscriptText,
} from '@/lib/text/small-text';
import TextInput from '@/components/TextInput';

interface ModeCardProps {
  label: string;
  hint: string;
  text: string;
}

function ModeCard({ label, hint, text }: ModeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }, [text]);

  return (
    <div className="card-surface overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 px-4 py-2.5">
        <div>
          <span className="text-sm font-semibold text-stone-800">{label}</span>
          <span className="ml-2 text-xs text-stone-400">{hint}</span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!text}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-500 transition-all duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
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
      <div className="max-h-48 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-sm leading-relaxed text-stone-700">
        {text || (
          <span className="text-stone-400">
            Type text above to see this style…
          </span>
        )}
      </div>
    </div>
  );
}

export default function SmallTextGeneratorDemo() {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      <TextInput
        label="Your Text"
        placeholder="Type text to shrink, raise, or lower…"
        value={input}
        onChange={setInput}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <ModeCard
          label="Small Text"
          hint="tiny letters"
          text={smallCapsText(input)}
        />
        <ModeCard
          label="Superscript"
          hint="x²"
          text={superscriptText(input)}
        />
        <ModeCard
          label="Subscript"
          hint="H₂O"
          text={subscriptText(input)}
        />
      </div>
    </div>
  );
}
