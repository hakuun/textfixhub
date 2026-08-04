import type { Metadata } from 'next';
import { generateNouns } from '@/lib/text/generate-nouns';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import NounGeneratorDemo from './noun-generator-demo';
import { DEFAULT_COUNT, SSG_SEED } from './sample-data';

export const metadata: Metadata = {
  title: 'Random Noun Generator - For Games & Ideas',
  description:
    'Generate random English nouns instantly — perfect for classroom activities, word games, brainstorming, and creative writing. Choose your count. Free, no sign-up.',
  alternates: {
    canonical: '/tools/random-noun-generator',
  },
  openGraph: {
    title: 'Random Noun Generator — Free Online Noun Generator | TextFixHub',
    description:
      'Generate random English nouns instantly — perfect for classroom activities, word games, brainstorming, and creative writing. Choose your count. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Random Noun Generator — Free Online Noun Generator | TextFixHub',
    description:
      'Generate random English nouns instantly — perfect for classroom activities, word games, brainstorming, and creative writing. Choose your count. Free, no sign-up.',
  },
};

const ssgNouns = generateNouns({ count: DEFAULT_COUNT, seed: SSG_SEED });

const NOUN_GENERATOR_FAQS = [
  {
    question: 'How does the random noun generator work?',
    answer:
      'Choose how many nouns you want (1 to 500) and click Generate. The tool randomly selects from a built-in list of over 2,200 common English nouns. Every click gives you a fresh, random set.',
  },
  {
    question: 'How many nouns are in the word list?',
    answer:
      'The generator draws from a library of 2,228+ common English nouns, covering a wide range of everyday vocabulary — from household objects to abstract concepts.',
  },
  {
    question: 'Can I save or download the generated nouns?',
    answer:
      'Yes. Click any generated noun to save it to your saved list, then download the entire list as a .txt file when you\'re done. This is useful for building vocabulary lists, word banks for lessons, or game materials.',
  },
  {
    question: 'How many nouns can I generate at once?',
    answer:
      'You can generate anywhere from 1 to 500 nouns per click. Each batch is randomly selected without repeats within that batch, and each new click gives you a fresh random set.',
  },
  {
    question: 'What can I use random nouns for?',
    answer:
      'Random nouns are versatile: teachers use them for vocabulary exercises and word games (Pictionary, charades), writers use them for brainstorming and idea generation, and game designers use them for item name tables.',
  },
  {
    question: 'Are these common English nouns?',
    answer:
      'Yes. The word list covers standard English vocabulary — nothing obscure or technical. You\'ll get familiar, everyday words that are useful for most classroom and creative applications.',
  },
  {
    question: 'Is my data sent to a server?',
    answer:
      'No. Everything runs locally in your browser. Your noun selections, saved lists, and downloads are all handled on your device. We never see or store any of your data.',
  },
];

export default function RandomNounGeneratorPage() {
  return (
    <ToolLayout pageName="Random Noun Generator">
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
        <FaqSection faqs={NOUN_GENERATOR_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Random Noun Generator',
          description:
            'Free online random noun generator — instantly generate random English nouns for word games, classroom activities, and brainstorming.',
          url: 'https://www.textfixhub.com/tools/random-noun-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
