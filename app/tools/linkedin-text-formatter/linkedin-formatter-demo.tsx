'use client';

import { useMemo, useState, useCallback } from 'react';
import { Check, Copy } from '@phosphor-icons/react/dist/ssr';
import {
  LINKEDIN_STYLES,
  LINKEDIN_LISTS,
} from '@/lib/text/linkedin-text-formatter';
import TextInput from '@/components/TextInput';

/** LinkedIn's per-post text limit. We surface it but don't block. */
const LINKEDIN_CHAR_LIMIT = 3000;

interface StyleCardProps {
  label: string;
  text: string;
}

function StyleCard({ label, text }: StyleCardProps) {
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
      <div className="max-h-40 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-sm leading-relaxed text-stone-700">
        {text || (
          <span className="text-stone-400">
            Type text above to see this style…
          </span>
        )}
      </div>
    </div>
  );
}

export default function LinkedinFormatterDemo() {
  const [input, setInput] = useState('');

  const outputs = useMemo(() => {
    const char: Record<string, string> = {};
    const list: Record<string, string> = {};
    for (const s of LINKEDIN_STYLES) char[s.id] = s.transform(input);
    for (const l of LINKEDIN_LISTS) list[l.id] = l.transform(input);
    return { char, list };
  }, [input]);

  const charCount = input.length;
  const overLimit = charCount > LINKEDIN_CHAR_LIMIT;

  return (
    <div className="space-y-4">
      <TextInput
        label="Your Text"
        placeholder="Type or paste the text you want to format for LinkedIn…"
        value={input}
        onChange={setInput}
      />

      <p
        className={`text-xs ${
          overLimit
            ? 'font-semibold text-red-600'
            : 'text-stone-500'
        }`}
      >
        {charCount.toLocaleString()} / {LINKEDIN_CHAR_LIMIT.toLocaleString()}{' '}
        characters
        {overLimit
          ? ' — over LinkedIn’s limit; the excess will be cut off when you post'
          : ''}
      </p>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-700">Text Styles</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINKEDIN_STYLES.map((s) => (
            <StyleCard key={s.id} label={s.label} text={outputs.char[s.id]} />
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-semibold text-stone-700">Lists</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINKEDIN_LISTS.map((s) => (
            <StyleCard key={s.id} label={s.label} text={outputs.list[s.id]} />
          ))}
        </div>
      </div>
    </div>
  );
}
