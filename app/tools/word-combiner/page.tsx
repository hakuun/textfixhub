import type { Metadata } from 'next';
import { combineWords } from '@/lib/text/word-combiner';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import WordCombinerDemo from './word-combiner-demo';

export const metadata: Metadata = {
  title: 'Word Combiner - Make New Portmanteau Words',
  description:
    'Combine two words into new portmanteau-style words with syllable-aware blending. Perfect for brand names, couples, and creative writing. Free, no sign-up, runs in your browser.',
  alternates: {
    canonical: '/tools/word-combiner',
  },
  openGraph: {
    title:
      'Word Combiner — Blend Two Words into New Portmanteaus | TextFixHub',
    description:
      'Combine two words into new portmanteau-style words with syllable-aware blending. Perfect for brand names, couples, and creative writing. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'Word Combiner — Blend Two Words into New Portmanteaus | TextFixHub',
    description:
      'Combine two words into new portmanteau-style words with syllable-aware blending. Perfect for brand names, couples, and creative writing. Free, no sign-up.',
  },
};

const workedExampleOutput = combineWords('sun', 'flower').join(', ');

const WORD_COMBINER_FAQS = [
  {
    question: 'What is a word combiner?',
    answer:
      'A word combiner blends two words into new coined words (portmanteaus). You give it two words and it returns a set of variations that mix their sounds and syllables, so you can pick one that looks and sounds right.',
  },
  {
    question: 'How is this different from just putting two words together?',
    answer:
      'Simple combiners just concatenate — “sun” + “flower” becomes “sunflower”. This tool also finds syllable boundaries and shared overlaps, so you get natural blends like “sunower”, “lightouse”, or “brunchlunch” — options that sound like real coined words, not just glued-together pairs.',
  },
  {
    question: 'What can I use a word combiner for?',
    answer:
      'Naming a brand, product, or website; coming up with a couple name; inventing usernames or gamertags; creative writing and worldbuilding; and any time you want a fresh word that combines two existing ideas.',
  },
  {
    question: 'How many variations do I get?',
    answer:
      'It depends on the words — usually between 5 and 15 unique variations. The direct concatenation is always first, followed by blends at syllable boundaries and shared overlaps.',
  },
  {
    question: 'Do I need to worry about the results being real words?',
    answer:
      'Some blends may coincidentally form real English words (like “chocolate” from “choco” + “late”), which is a nice bonus. For brand naming, we still recommend a quick search before committing to a name.',
  },
  {
    question: 'Does this tool store the words I combine?',
    answer:
      'No. All blending happens locally in your browser using JavaScript. Your word combinations never leave your device.',
  },
];

export default function WordCombinerPage() {
  return (
    <ToolLayout pageName="Word Combiner">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">Word Combiner</h1>
        <p className="mt-2 text-lg text-stone-600">
          Blend two words into new portmanteaus with syllable-aware merging —
          perfect for brand names, couple names, and creative writing.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <WordCombinerDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            A good portmanteau isn’t just two words glued together — it blends
            them at a point where the sounds flow. This tool looks for natural
            syllable boundaries in both words (where vowels and consonants
            switch), splits at those points, and recombines the pieces.
          </p>
          <p className="mt-3 text-stone-600">
            It also handles the tricky cases: when the first word ends with the
            same letters the second starts with (overlap), or when two vowels
            collide at the join (like <em>spice</em> + <em>ice</em>), it drops
            one vowel so the result still reads smoothly.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input="sun + flower"
              output={workedExampleOutput}
              inputLabel="Words"
              outputLabel="Combined Variations"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="word-combiner" />
        <FaqSection faqs={WORD_COMBINER_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Word Combiner',
          description:
            'Blend two words into new portmanteau variations using syllable-aware merging. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/word-combiner',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
