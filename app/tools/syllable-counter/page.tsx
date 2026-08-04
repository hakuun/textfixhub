import type { Metadata } from 'next';
import { countTextSyllables } from '@/lib/text/syllable-counter';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import SyllableCounterDemo from './syllable-counter-demo';

export const metadata: Metadata = {
  title: 'Syllable Counter - Count Syllables in Text',
  description:
    'Count syllables in poems, haiku, and any text — with per-line and per-word counts. Powered by a 20,000-word dictionary with human-reviewed corrections. Free, no sign-up, no text limit.',
  alternates: {
    canonical: '/tools/syllable-counter',
  },
  openGraph: {
    title:
      'Syllable Counter — Count Syllables in Poems & Text | TextFixHub',
    description:
      'Count syllables in poems, haiku, and any text — with per-line and per-word counts. Powered by a 20,000-word dictionary with human-reviewed corrections. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'Syllable Counter — Count Syllables in Poems & Text | TextFixHub',
    description:
      'Count syllables in poems, haiku, and any text — with per-line and per-word counts. Powered by a 20,000-word dictionary with human-reviewed corrections. Free, no sign-up.',
  },
};

const SAMPLE_HAIKU = [
  'The autumn wind blows',
  'Leaves fall softly to the ground',
  'Cold winter is near',
].join('\n');

const workedExampleStats = countTextSyllables(SAMPLE_HAIKU);

const SYLLABLE_FAQS = [
  {
    question: 'How does this syllable counter work?',
    answer:
      'It uses a dictionary-first approach: a 20,000-word syllable dictionary derived from the CMU Pronouncing Dictionary, with human-reviewed corrections for disputed words. Words not in the dictionary fall back to syllable rules. This is the same architecture the top competitors use.',
  },
  {
    question: 'How accurate is it?',
    answer:
      'Very accurate on common words. The dictionary covers the most frequent English words, and disputed words (like fire, hour, every, and chocolate) are corrected against a human-reviewed reference. Out-of-dictionary words use rule-based estimation, which is right for the large majority of cases.',
  },
  {
    question: 'Can I count syllables line by line for a haiku?',
    answer:
      'Yes. Paste each line of your poem on its own line and the tool shows the syllable count for every line in real time — perfect for checking 5-7-5 haiku structure while you write.',
  },
  {
    question: 'How do you count words like fire or hour?',
    answer:
      'We follow the standard dictionary treatment: fire and hour are counted as one syllable (the common American pronunciation), matching how many syllables and major dictionaries count them. The dictionary includes explicit corrections so these don’t rely on heuristics.',
  },
  {
    question: 'Is there a limit to how much text I can paste?',
    answer:
      'No. Unlike some competitors that cap input at 5,000 characters, this tool has no text limit. Everything runs locally, so even long documents process instantly.',
  },
  {
    question: 'Does this tool store my text?',
    answer:
      'No. All counting happens locally in your browser using JavaScript. Your text never leaves your device — we have no way to see, store, or access anything you paste.',
  },
];

export default function SyllableCounterPage() {
  return (
    <ToolLayout pageName="Syllable Counter">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Syllable Counter
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Count syllables in poems, haiku, and any text — with per-line and
          per-word counts, powered by a 20,000-word dictionary.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <SyllableCounterDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            Syllable counting is harder than it looks — English is full of
            silent letters, vowel pairs, and words like <em>rhythm</em> that
            break every rule. That’s why this tool is <strong>dictionary
            first</strong>: it looks up each word in a 20,000-word syllable
            dictionary, and only falls back to phonetic rules for words it
            doesn’t know.
          </p>
          <p className="mt-3 text-stone-600">
            Common problem words are corrected against a human-reviewed
            reference — <em>fire</em> and <em>hour</em> count as one syllable,
            <em> every</em> as two, <em>chocolate</em> as three — so the counts
            match what you’ll find in standard dictionaries.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            Built for Haiku &amp; Poetry
          </h2>
          <p className="mt-2 text-stone-600">
            Put each line of your poem on its own line and watch the per-line
            counts update as you type — no button needed. A quick glance tells
            you whether your haiku still fits 5-7-5, or whether your sonnet
            line has the meter you want.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input={SAMPLE_HAIKU}
              output={`${workedExampleStats.total} syllables — ${workedExampleStats.lines
                .map((l) => l.count)
                .join('-')} haiku`}
              inputLabel="Haiku Sample"
              outputLabel="Syllable Count"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="syllable-counter" />
        <FaqSection faqs={SYLLABLE_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Syllable Counter',
          description:
            'Count syllables in poems, haiku, and any text with per-line and per-word counts. Powered by a 20,000-word dictionary with human-reviewed corrections. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/syllable-counter',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
