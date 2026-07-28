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
    const clamped = Math.min(count, 500);
    const nouns = generateNouns({ count: clamped });
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
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Generate
        </button>
      </div>

      <p className="text-xs text-gray-400">
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
              className={`rounded-full px-3 py-1 text-sm transition ${
                saved.includes(noun)
                  ? 'bg-blue-100 text-blue-600 cursor-default'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {noun}
            </button>
          ))}
        </div>
      )}

      {/* Saved nouns */}
      {saved.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-blue-800">
              Your Saved Nouns ({saved.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                Download (.txt)
              </button>
              <button
                onClick={() => setSaved([])}
                className="rounded border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {saved.map((noun) => (
              <span
                key={noun}
                onClick={() => handleRemoveSaved(noun)}
                className="cursor-pointer rounded-full bg-blue-200 px-2 py-0.5 text-xs text-blue-800 hover:bg-red-200 hover:text-red-800 hover:line-through"
                title="Click to remove"
              >
                {noun} ×
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
