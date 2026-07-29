'use client';

import { useState, useCallback } from 'react';
import { generateSentences, getSentenceLibrarySize } from '@/lib/text/generate-sentences';
import CountSelector from '@/components/CountSelector';
import OutputPanel from '@/components/OutputPanel';

export default function SentenceGeneratorDemo() {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const librarySize = getSentenceLibrarySize();

  const handleGenerate = useCallback(() => {
    const sentences = generateSentences({ count });
    setOutput(sentences.join('\n'));
  }, [count]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <CountSelector
          value={count}
          onChange={setCount}
          min={1}
          max={500}
          label="Sentences"
        />
        <button
          onClick={handleGenerate}
          className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-[background-color,scale] duration-150 ease-out hover:bg-emerald-700 active:scale-[0.96]"
        >
          Generate
        </button>
      </div>

      <p className="text-xs text-stone-500">
        Drawing from a library of {librarySize} hand-written sentences —
        no AI, no templates, just good writing.
      </p>

      <OutputPanel
        label="Generated Sentences"
        text={output}
        emptyMessage='Click "Generate" to create random sentences'
      />
    </div>
  );
}
