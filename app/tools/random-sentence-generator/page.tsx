import type { Metadata } from 'next';
import { generateSentences } from '@/lib/text/generate-sentences';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import SentenceGeneratorDemo from './sentence-generator-demo';
import { DEFAULT_COUNT, SSG_SEED } from './sample-data';

export const metadata: Metadata = {
  title:
    'Random Sentence Generator - Free Online Sentence Generator',
  description:
    'Generate random sentences for writing prompts, brainstorming, and creative exercises. 500 hand-written sentences — no AI slop, no grammar errors. Free, no sign-up.',
  alternates: {
    canonical: '/tools/random-sentence-generator',
  },
  openGraph: {
    title: 'Random Sentence Generator — Free Online Sentence Generator | TextFixHub',
    description:
      'Generate random sentences for writing prompts, brainstorming, and creative exercises. 500 hand-written sentences — no AI slop, no grammar errors. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Random Sentence Generator — Free Online Sentence Generator | TextFixHub',
    description:
      'Generate random sentences for writing prompts, brainstorming, and creative exercises. 500 hand-written sentences — no AI slop, no grammar errors. Free, no sign-up.',
  },
};

const ssgSentences = generateSentences({ count: DEFAULT_COUNT, seed: SSG_SEED });

const SENTENCE_GENERATOR_FAQS = [
  {
    question: 'How does the random sentence generator work?',
    answer:
      'Choose how many sentences you want (1 to 500) and click Generate. The tool randomly selects sentences from a hand-written library of 500 unique sentences — no AI generation, no templates, no grammar errors.',
  },
  {
    question: 'Are the sentences AI-generated?',
    answer:
      'No. Every sentence in our library was written by a human. We deliberately avoided AI-generated and template-based approaches because they produce awkward, predictable results. Our sentences are grammatically correct and genuinely interesting.',
  },
  {
    question: 'How many sentences can I generate at once?',
    answer:
      'You can generate anywhere from 1 to 500 sentences in a single click. Each generation pulls from our full library of 500 unique sentences, so you\'ll always get fresh combinations.',
  },
  {
    question: 'What types of sentences are in the library?',
    answer:
      'The library contains four categories: story starters (40%), absurd situations (25%), dialogue openers (20%), and mystery hooks (15%). This mix ensures variety — whether you need a creative writing prompt or a conversation starter.',
  },
  {
    question: 'Can I use these sentences for writing prompts?',
    answer:
      'Absolutely. The sentences are specifically designed as creative writing prompts. Teachers use them for classroom exercises, writers use them to overcome writer\'s block, and game masters use them for RPG scenarios.',
  },
  {
    question: 'Are the sentences grammatically correct?',
    answer:
      'Yes. Each sentence was hand-written and reviewed for grammar. Unlike template-based generators that can produce errors like subject-verb mismatches, every sentence in our library is correct.',
  },
  {
    question: 'Is there any cost or sign-up required?',
    answer:
      'No. The random sentence generator is completely free. No sign-up, no account, no download. Just open the page and start generating.',
  },
];

export default function RandomSentenceGeneratorPage() {
  return (
    <ToolLayout pageName="Random Sentence Generator">
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
        <FaqSection faqs={SENTENCE_GENERATOR_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Random Sentence Generator',
          description:
            'Free online random sentence generator with 500 hand-written sentences for writing prompts and creative brainstorming. No AI slop, no grammar errors.',
          url: 'https://www.textfixhub.com/tools/random-sentence-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
