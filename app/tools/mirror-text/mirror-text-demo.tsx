'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from '@phosphor-icons/react/dist/ssr';
import {
  reverseText,
  upsideDownText,
  mirrorText,
} from '@/lib/text/mirror-text';
import TextInput from '@/components/TextInput';

interface ModeCardProps {
  label: string;
  text: string;
}

function ModeCard({ label, text }: ModeCardProps) {
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
        <span className="text-sm font-semibold text-stone-800">{label}</span>
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
            Type text above to see this mode…
          </span>
        )}
      </div>
    </div>
  );
}

export default function MirrorTextDemo() {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      <TextInput
        label="Your Text"
        placeholder="Type text to reverse, flip upside down, or mirror…"
        value={input}
        onChange={setInput}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <ModeCard label="Reverse" text={reverseText(input)} />
        <ModeCard label="Upside Down" text={upsideDownText(input)} />
        <ModeCard label="Mirror" text={mirrorText(input)} />
      </div>
    </div>
  );
}
