import type { Metadata } from 'next';
import { generateSentences } from '@/lib/text/generate-sentences';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import SentenceGeneratorDemo from './sentence-generator-demo';
import { DEFAULT_COUNT, SSG_SEED } from './sample-data';

export const metadata: Metadata = {
  title:
    'Random Sentence Generator - Free Online Sentence Generator | TextTools',
  description:
    'Generate grammatically-plausible random sentences instantly for writing prompts, brainstorming, and creative exercises. Choose how many sentences you need. Free, no sign-up.',
  alternates: {
    canonical: '/tools/random-sentence-generator',
  },
};

const ssgSentences = generateSentences({ count: DEFAULT_COUNT, seed: SSG_SEED });

export default function RandomSentenceGeneratorPage() {
  return (
    <ToolLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Random Sentence Generator
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Generate grammatically-plausible random sentences for writing prompts,
          brainstorming, and creative exercises.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Try It Out</h2>
          <div className="mt-4">
            <SentenceGeneratorDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800">
            How It Works
          </h2>
          <p className="mt-2 text-gray-600">
            Choose how many sentences you want (1 to 500) and click Generate.
            Each sentence is built from a library of common English words using
            varied sentence templates, producing grammatically-plausible output
            every time. Sentences are generated entirely in your browser — no
            API calls, no waiting.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Example</h2>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Random Sentence Generator',
            description:
              'Free online random sentence generator — create grammatically-plausible sentences for writing prompts and brainstorming.',
            url: 'https://texttools.example.com/tools/random-sentence-generator',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any',
          }),
        }}
      />
    </ToolLayout>
  );
}
