import type { Metadata } from 'next';
import { generateFakeWords } from '@/lib/text/fake-word-generator';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import FakeWordGeneratorDemo from './fake-word-generator-demo';

export const metadata: Metadata = {
  title: 'Fake Word Generator - Invent Words for Games & Writing',
  description:
    'Generate invented words that sound real. Markov-powered with English, fantasy and sci-fi styles — perfect for D&D names, fiction, and branding. Free, no sign-up, runs in your browser.',
  alternates: {
    canonical: '/tools/fake-word-generator',
  },
  openGraph: {
    title:
      'Fake Word Generator — Invent Words for Games & Writing | TextFixHub',
    description:
      'Generate invented words that sound real. Markov-powered with English, fantasy and sci-fi styles — perfect for D&D names, fiction, and branding. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'Fake Word Generator — Invent Words for Games & Writing | TextFixHub',
    description:
      'Generate invented words that sound real. Markov-powered with English, fantasy and sci-fi styles — perfect for D&D names, fiction, and branding. Free, no sign-up.',
  },
};

const workedExampleOutput = generateFakeWords({
  count: 5,
  minLength: 4,
  maxLength: 8,
  style: 'fantasy',
  seed: 2026,
}).join(', ');

const FAKE_WORD_FAQS = [
  {
    question: 'What is a fake word generator?',
    answer:
      'A fake word generator invents new words that don’t exist in any dictionary but still look and sound like they could be real. It’s useful for naming characters, places, spells, products, or languages.',
  },
  {
    question: 'How does this generator create words?',
    answer:
      'It uses a Markov model trained on style-specific seed words. The model learns which letters commonly follow which pairs of letters, then walks the chain to synthesize words with natural letter combinations — much more believable than random syllable mashing.',
  },
  {
    question: 'Who uses fake words?',
    answer:
      'Dungeons & Dragons dungeon masters naming towns and characters, fantasy and sci-fi novelists inventing names and terms, conlang builders, game developers, and anyone naming a brand or project who wants something fresh that doesn’t already exist.',
  },
  {
    question: 'What do the style options do?',
    answer:
      'Each style trains the model on a different word seed set. English produces words that sound like ordinary English. Fantasy draws from elven, dwarven, and magical naming patterns. Sci-Fi draws from space and futuristic vocabulary.',
  },
  {
    question: 'Can I use generated words commercially?',
    answer:
      'Yes. The words are algorithmically synthesized from style seeds — they aren’t copied from any published work. As with any creative output, we recommend a quick search before using a name for a product or brand.',
  },
  {
    question: 'Does this tool store the words I generate?',
    answer:
      'No. Generation happens locally in your browser using JavaScript. Nothing is uploaded, stored, or shared — and there’s no account, so your naming ideas stay private.',
  },
];

export default function FakeWordGeneratorPage() {
  return (
    <ToolLayout pageName="Fake Word Generator">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Fake Word Generator
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Invent words that sound real — for games, fiction, and naming.
          Markov-powered, with English, fantasy, and sci-fi styles.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <FakeWordGeneratorDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            Most generators glue random syllables together, which produces
            strings like “zab-quo-thrax” that look obviously fake. This tool
            takes a different approach: it learns how letters combine from a
            curated set of style words, then synthesizes words that follow the
            same patterns.
          </p>
          <p className="mt-3 text-stone-600">
            The result is words with natural vowel–consonant flow — like
            <em> dorwenix</em>, <em>aelassid</em>, or <em>ciralaxy</em> — that
            feel like they could belong to your world.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            Use Cases
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-stone-600">
            <li>
              <strong>D&D / tabletop</strong> — town names, NPCs, spell names,
              and fantasy place names.
            </li>
            <li>
              <strong>Fiction</strong> — invented terms, people, planets, and
              cultures that read as natural.
            </li>
            <li>
              <strong>Branding</strong> — a fresh portmanteau-style name that
              isn’t already taken.
            </li>
            <li>
              <strong>Languages</strong> — a starting vocabulary for a conlang
              or alien language.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input="Dragon, Wizard, Elven, Runeforge"
              output={workedExampleOutput}
              inputLabel="Style Seeds (Fantasy)"
              outputLabel="Generated Words"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="fake-word-generator" />
        <FaqSection faqs={FAKE_WORD_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Fake Word Generator',
          description:
            'Generate invented words that sound real, using a Markov model trained on English, fantasy, and sci-fi seed words. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/fake-word-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
