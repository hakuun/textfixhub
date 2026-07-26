'use client';

import { useState, useMemo } from 'react';
import { countSentences } from '@/lib/text/sentence-counter';
import TextInput from '@/components/TextInput';
import OutputPanel from '@/components/OutputPanel';

export default function SentenceCounterDemo() {
  const [input, setInput] = useState('');

  const result = useMemo(() => countSentences(input), [input]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 px-6 py-4 text-center">
        <span className="text-4xl font-bold text-blue-700">
          {result.count}
        </span>
        <span className="ml-2 text-lg text-blue-600">
          {result.count === 1 ? 'sentence' : 'sentences'}
        </span>
      </div>

      <TextInput
        label="Your Text"
        placeholder="Paste your text here to count sentences..."
        value={input}
        onChange={setInput}
      />

      {result.sentences.length > 0 && (
        <details className="rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Show extracted sentences ({result.sentences.length})
          </summary>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-600">
            {result.sentences.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </details>
      )}

      {!input && (
        <OutputPanel
          text=""
          emptyMessage="Paste text above to count sentences"
        />
      )}
    </div>
  );
}
