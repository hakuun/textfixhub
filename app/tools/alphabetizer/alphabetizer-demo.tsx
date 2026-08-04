'use client';

import { useState, useMemo } from 'react';
import { alphabetize } from '@/lib/text/alphabetize';
import {
  DEFAULT_ALPHABETIZER_OPTIONS,
  type AlphabetizerOptions,
  type SeparatorPreset,
} from '@/lib/text/types';
import TextInput from '@/components/TextInput';
import OutputPanel from '@/components/OutputPanel';

const SEPARATOR_OPTIONS: { value: SeparatorPreset; label: string }[] = [
  { value: 'newline', label: 'New line' },
  { value: 'comma', label: 'Comma' },
  { value: 'semicolon', label: 'Semicolon' },
  { value: 'space', label: 'Space' },
  { value: 'custom', label: 'Custom' },
];

const checkboxClasses =
  'rounded border-stone-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer';
const selectClasses =
  'rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm text-stone-700 transition-all duration-200 ease-out hover:border-stone-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15';

export default function AlphabetizerDemo() {
  const [input, setInput] = useState('');
  const [opts, setOpts] = useState<AlphabetizerOptions>(
    DEFAULT_ALPHABETIZER_OPTIONS,
  );

  const output = useMemo(
    () => alphabetize(input, opts),
    [input, opts],
  );

  const updateOpt = (partial: Partial<AlphabetizerOptions>) => {
    setOpts((o) => ({ ...o, ...partial }));
  };

  return (
    <div className="space-y-4">
      {/* Sort options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={opts.caseSensitive}
            onChange={(e) => updateOpt({ caseSensitive: e.target.checked })}
            className={checkboxClasses}
          />
          Case Sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={opts.reverse}
            onChange={(e) => updateOpt({ reverse: e.target.checked })}
            className={checkboxClasses}
          />
          Reverse Order
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={opts.removeDuplicates}
            onChange={(e) => updateOpt({ removeDuplicates: e.target.checked })}
            className={checkboxClasses}
          />
          Remove Duplicates
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={opts.removeHTML}
            onChange={(e) => updateOpt({ removeHTML: e.target.checked })}
            className={checkboxClasses}
          />
          Remove HTML
        </label>
      </div>

      {/* Separator options */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Input:
          </label>
          <select
            value={opts.inputSeparator}
            onChange={(e) =>
              updateOpt({ inputSeparator: e.target.value as SeparatorPreset })
            }
            className={selectClasses}
          >
            {SEPARATOR_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {opts.inputSeparator === 'custom' && (
          <input
            type="text"
            placeholder="Custom separator"
            value={opts.customInputSeparator}
            onChange={(e) => updateOpt({ customInputSeparator: e.target.value })}
            className="w-32 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm text-stone-700 placeholder:text-stone-400 transition-all duration-200 ease-out hover:border-stone-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
          />
        )}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Output:
          </label>
          <select
            value={opts.outputSeparator}
            onChange={(e) =>
              updateOpt({ outputSeparator: e.target.value as SeparatorPreset })
            }
            className={selectClasses}
          >
            {SEPARATOR_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {opts.outputSeparator === 'custom' && (
          <input
            type="text"
            placeholder="Custom separator"
            value={opts.customOutputSeparator}
            onChange={(e) => updateOpt({ customOutputSeparator: e.target.value })}
            className="w-32 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm text-stone-700 placeholder:text-stone-400 transition-all duration-200 ease-out hover:border-stone-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
          />
        )}
      </div>

      <div className="space-y-4">
        <TextInput
          label="Your List"
          rows={12}
          autoResize
          placeholder={opts.inputSeparator === 'newline'
            ? 'Paste your list here, one item per line...'
            : `Paste your list here (separated by ${opts.inputSeparator})...`
          }
          value={input}
          onChange={setInput}
        />
        <OutputPanel
          label="Sorted List"
          text={output}
          emptyMessage="Paste your list in the input box to get started"
        />
      </div>
    </div>
  );
}
