import type { Metadata } from 'next';
import { generateSentences } from '@/lib/text/generate-sentences';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import JsonLd from '@/components/JsonLd';
import SentenceGeneratorDemo from './sentence-generator-demo';
import { DEFAULT_COUNT, SSG_SEED } from './sample-data';

export const metadata: Metadata = {
  title:
    'Random Sentence Generator - Free Online Sentence Generator | TextFixHub',
  description:
    'Generate random sentences for writing prompts, brainstorming, and creative exercises. 500 hand-written sentences — no AI slop, no grammar errors. Free, no sign-up.',
  alternates: {
    canonical: '/tools/random-sentence-generator',
  },
};

const ssgSentences = generateSentences({ count: DEFAULT_COUNT, seed: SSG_SEED });

export default function RandomSentenceGeneratorPage() {
  return (
    <ToolLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Random Sentence Generator
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Generate random sentences for writing prompts, brainstorming, and
          creative exercises. Every sentence is hand-written — grammatically
          correct and actually interesting.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <SentenceGeneratorDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            Choose how many sentences you want (1 to 500) and click Generate.
            Unlike other generators that use templates or AI, our sentences are
            drawn from a library of 500 human-written sentences — each one
            crafted to be grammatically correct, interesting, and actually
            useful as a writing prompt.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-stone-600">
            <li>
              <strong>Story starters</strong> — novel and short story opening
              lines that hook the reader
            </li>
            <li>
              <strong>Absurd situations</strong> — quirky, funny, surreal
              scenarios for creative brainstorming
            </li>
            <li>
              <strong>Dialogue openers</strong> — conversation starters and
              character voice prompts
            </li>
            <li>
              <strong>Mystery hooks</strong> — intriguing sentences that make
              you ask &ldquo;what happens next?&rdquo;
            </li>
          </ul>
          <p className="mt-2 text-stone-600">
            Sentences are generated entirely in your browser — no API calls,
            no waiting.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input={`Count: ${DEFAULT_COUNT}`}
              output={ssgSentences.join('\n')}
              inputLabel="Request"
              outputLabel="Generated Sentences"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="random-sentence-generator" />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Random Sentence Generator',
          description:
            'Free online random sentence generator with 500 hand-written sentences for writing prompts and creative brainstorming. No AI slop, no grammar errors.',
          url: 'https://textfixhub.com/tools/random-sentence-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
