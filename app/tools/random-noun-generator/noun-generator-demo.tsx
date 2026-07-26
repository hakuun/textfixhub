'use client';

import { useState, useCallback } from 'react';
import { generateNouns, getNounListSize } from '@/lib/text/generate-nouns';
import CountSelector from '@/components/CountSelector';
import OutputPanel from '@/components/OutputPanel';

export default function NounGeneratorDemo() {
  const [count, setCount] = useState(10);
  const [output, setOutput] = useState('');
  const [exhausted, setExhausted] = useState(false);

  const nounListSize = getNounListSize();

  const handleGenerate = useCallback(() => {
    const clamped = Math.min(count, 500);
    const nouns = generateNouns({ count: clamped });
    setOutput(nouns.join('\n'));
    setExhausted(clamped > nounListSize || clamped > nouns.length);
  }, [count, nounListSize]);

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

      {exhausted && (
        <p className="text-sm text-amber-600">
          Showing all {nounListSize} nouns in our list.
        </p>
      )}

      <OutputPanel
        label="Generated Nouns"
        text={output}
        emptyMessage='Click "Generate" to create random nouns'
      />
    </div>
  );
}
