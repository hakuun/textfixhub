'use client';

import { useState, useCallback } from 'react';
import { generateNouns, getNounListSize } from '@/lib/text/generate-nouns';
import CountSelector from '@/components/CountSelector';
import OutputPanel from '@/components/OutputPanel';

export default function NounGeneratorDemo() {
  const [count, setCount] = useState(10);
  const [output, setOutput] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  const nounListSize = getNounListSize();

  const handleGenerate = useCallback(() => {
    const nouns = generateNouns({ count });
    setOutput(nouns.join('\n'));
  }, [count]);

  const handleSaveNoun = useCallback((noun: string) => {
    setSaved((prev) => {
      if (prev.includes(noun)) return prev;
      return [...prev, noun];
    });
  }, []);

  const handleRemoveSaved = useCallback((noun: string) => {
    setSaved((prev) => prev.filter((n) => n !== noun));
  }, []);

  const handleDownload = useCallback(() => {
    if (saved.length === 0) return;
    const blob = new Blob([saved.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved-nouns.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [saved]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <CountSelector
          value={count}
          onChange={setCount}
          min={1}
          max={500}
          label="Nouns"
        />
        <button
          onClick={handleGenerate}
          className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-emerald-700 active:scale-[0.96]"
        >
          Generate
        </button>
      </div>

      <p className="text-xs text-stone-500">
        Drawing from {nounListSize}+ English nouns. Click any noun to save it.
      </p>

      <OutputPanel
        label="Generated Nouns"
        text={output}
        emptyMessage='Click "Generate" to create random nouns'
      />

      {/* Clickable noun list */}
      {output && (
        <div className="flex flex-wrap gap-2">
          {output.split('\n').map((noun, i) => (
            <button
              key={`${noun}-${i}`}
              onClick={() => handleSaveNoun(noun)}
              disabled={saved.includes(noun)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.96] ${
                saved.includes(noun)
                  ? 'bg-emerald-100 text-emerald-600 cursor-default'
                  : 'bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              {noun}
            </button>
          ))}
        </div>
      )}

      {/* Saved nouns */}
      {saved.length > 0 && (
        <div className="card-surface rounded-xl border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-800">
              Your Saved Nouns ({saved.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-700 transition-all duration-200 ease-out hover:bg-emerald-100 active:scale-[0.96]"
              >
                Download (.txt)
              </button>
              <button
                onClick={() => setSaved([])}
                className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-700 transition-all duration-200 ease-out hover:bg-emerald-100 active:scale-[0.96]"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {saved.map((noun) => (
              <button
                key={noun}
                onClick={() => handleRemoveSaved(noun)}
                className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 transition-all duration-200 ease-out hover:bg-red-100 hover:text-red-700 hover:line-through active:scale-[0.96]"
                title="Click to remove"
              >
                {noun} &times;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
