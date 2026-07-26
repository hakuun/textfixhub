'use client';

import { useState, useCallback } from 'react';
import { generateSentences } from '@/lib/text/generate-sentences';
import CountSelector from '@/components/CountSelector';
import OutputPanel from '@/components/OutputPanel';

export default function SentenceGeneratorDemo() {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

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
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Generate
        </button>
      </div>

      <OutputPanel
        label="Generated Sentences"
        text={output}
        emptyMessage='Click "Generate" to create random sentences'
      />
    </div>
  );
}
