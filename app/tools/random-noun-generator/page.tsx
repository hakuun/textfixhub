import type { Metadata } from 'next';
import { generateNouns } from '@/lib/text/generate-nouns';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import JsonLd from '@/components/JsonLd';
import NounGeneratorDemo from './noun-generator-demo';
import { DEFAULT_COUNT, SSG_SEED } from './sample-data';

export const metadata: Metadata = {
  title: 'Random Noun Generator - Free Online Noun Generator | TextTools',
  description:
    'Generate random English nouns instantly — perfect for classroom activities, word games, brainstorming, and creative writing. Choose your count. Free, no sign-up.',
  alternates: {
    canonical: '/tools/random-noun-generator',
  },
};

const ssgNouns = generateNouns({ count: DEFAULT_COUNT, seed: SSG_SEED });

export default function RandomNounGeneratorPage() {
  return (
    <ToolLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Random Noun Generator
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Generate random English nouns — perfect for classroom activities, word
          games, brainstorming, and creative writing.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Try It Out</h2>
          <div className="mt-4">
            <NounGeneratorDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            Choose how many random nouns you want (1 to 500) and click Generate.
            Nouns are randomly selected from a built-in list of common English
            words. Every click gives you a fresh set. Nouns are generated
            entirely in your browser — no API calls, no waiting.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input={`Count: ${DEFAULT_COUNT}`}
              output={ssgNouns.join('\n')}
              inputLabel="Request"
              outputLabel="Generated Nouns"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="random-noun-generator" />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Random Noun Generator',
          description:
            'Free online random noun generator — instantly generate random English nouns for word games, classroom activities, and brainstorming.',
          url: 'https://texttools.example.com/tools/random-noun-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
