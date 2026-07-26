'use client';

import { useState, useMemo } from 'react';
import { alphabetize } from '@/lib/text/alphabetize';
import {
  DEFAULT_ALPHABETIZER_OPTIONS,
  type AlphabetizerOptions,
} from '@/lib/text/types';
import TextInput from '@/components/TextInput';
import OutputPanel from '@/components/OutputPanel';

export default function AlphabetizerDemo() {
  const [input, setInput] = useState('');
  const [opts, setOpts] = useState<AlphabetizerOptions>(
    DEFAULT_ALPHABETIZER_OPTIONS,
  );

  const output = useMemo(
    () => alphabetize(input, opts),
    [input, opts],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={opts.caseSensitive}
            onChange={(e) =>
              setOpts((o) => ({ ...o, caseSensitive: e.target.checked }))
            }
            className="rounded border-gray-300"
          />
          Case Sensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={opts.reverse}
            onChange={(e) =>
              setOpts((o) => ({ ...o, reverse: e.target.checked }))
            }
            className="rounded border-gray-300"
          />
          Reverse Order
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={opts.removeDuplicates}
            onChange={(e) =>
              setOpts((o) => ({ ...o, removeDuplicates: e.target.checked }))
            }
            className="rounded border-gray-300"
          />
          Remove Duplicates
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Your List"
          placeholder="Paste your list here, one item per line..."
          value={input}
          onChange={setInput}
        />
        <OutputPanel
          label="Sorted List"
          text={output}
          emptyMessage="Paste your list above to get started"
        />
      </div>
    </div>
  );
}
