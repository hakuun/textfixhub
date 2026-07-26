'use client';

import { useState, useMemo } from 'react';
import { removeLineBreaks } from '@/lib/text/remove-line-breaks';
import type { LineBreakMode } from '@/lib/text/types';
import TextInput from '@/components/TextInput';
import OutputPanel from '@/components/OutputPanel';

export default function LineBreakRemoverDemo() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<LineBreakMode>('replace-with-space');

  const output = useMemo(
    () => removeLineBreaks(input, mode),
    [input, mode],
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            checked={mode === 'replace-with-space'}
            onChange={() => setMode('replace-with-space')}
            className="border-gray-300"
          />
          Replace with space
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            checked={mode === 'remove-entirely'}
            onChange={() => setMode('remove-entirely')}
            className="border-gray-300"
          />
          Remove entirely
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Pasted Text"
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
