'use client';

import { useState, useMemo } from 'react';
import { removeLineBreaks } from '@/lib/text/remove-line-breaks';
import type { LineBreakMode } from '@/lib/text/types';
import TextInput from '@/components/TextInput';
import OutputPanel from '@/components/OutputPanel';

const MODES: { value: LineBreakMode; label: string; desc: string }[] = [
  {
    value: 'replace-with-space',
    label: 'Replace with space',
    desc: 'Single line breaks → spaces; paragraphs preserved',
  },
  {
    value: 'remove-with-space',
    label: 'Remove all (add space)',
    desc: 'All line breaks removed, space added at line ends',
  },
  {
    value: 'remove-entirely',
    label: 'Remove entirely',
    desc: 'All line breaks removed, text joined together',
  },
];

export default function LineBreakRemoverDemo() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<LineBreakMode>('replace-with-space');

  const output = useMemo(
    () => removeLineBreaks(input, mode),
    [input, mode],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {MODES.map((m) => (
          <label key={m.value} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="mode"
              checked={mode === m.value}
              onChange={() => setMode(m.value)}
              className="mt-0.5 border-stone-300 text-emerald-600 focus:ring-emerald-500/20"
            />
            <div>
              <div className="font-medium text-stone-800">{m.label}</div>
              <div className="text-xs text-stone-500">{m.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Pasted Text"
          rows={12}
          placeholder="Paste text with broken line breaks..."
          value={input}
          onChange={setInput}
        />
        <OutputPanel
          label="Cleaned Text"
          text={output}
          emptyMessage="Paste text above to remove line breaks"
        />
      </div>
    </div>
  );
}
