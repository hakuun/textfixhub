import type { Metadata } from 'next';
import { reverseText } from '@/lib/text/mirror-text';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import MirrorTextDemo from './mirror-text-demo';

export const metadata: Metadata = {
  title: 'Mirror Text Generator - Reverse, Flip & Upside Down Text',
  description:
    'Reverse, flip, and mirror text in three modes on one page. Perfect for T-shirt prints, puzzles, social media, and pranks. Free, no sign-up, runs in your browser.',
  alternates: {
    canonical: '/tools/mirror-text',
  },
  openGraph: {
    title:
      'Mirror Text Generator — Reverse, Flip & Upside Down Text | TextFixHub',
    description:
      'Reverse, flip, and mirror text in three modes on one page. Perfect for T-shirt prints, puzzles, social media, and pranks. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'Mirror Text Generator — Reverse, Flip & Upside Down Text | TextFixHub',
    description:
      'Reverse, flip, and mirror text in three modes on one page. Perfect for T-shirt prints, puzzles, social media, and pranks. Free, no sign-up.',
  },
};

const SAMPLE_INPUT = 'Hello World!';

const workedExampleOutput = reverseText(SAMPLE_INPUT);

const MIRROR_FAQS = [
  {
    question: 'What is the difference between reverse, upside down, and mirror text?',
    answer:
      'Reverse reads the characters backwards (“Hello” → “olleH”). Upside down turns each character 180° and reverses the order, like a true upside-down rotation. Mirror flips each character horizontally while keeping the order — so a “b” becomes a “d”.',
  },
  {
    question: 'How does the upside-down text work?',
    answer:
      'Unicode contains turned versions of most letters (like ɐ, ɔ, ǝ) plus flipped punctuation. We swap each character for its turned twin and then reverse the order, which is what makes text read as genuinely upside down.',
  },
  {
    question: 'Why are some characters not transformed?',
    answer:
      'Unicode only includes turned/mirrored forms for letters, digits, and common punctuation. Characters without a turned form — like most Chinese, Japanese, or emoji — pass through unchanged in their original form.',
  },
  {
    question: 'What is this useful for?',
    answer:
      'T-shirt and poster printing, puzzles and riddles, prank messages, social media bios, and anywhere you want text to stand out by being flipped.',
  },
  {
    question: 'Will flipped text work on social media?',
    answer:
      'Mostly yes — turned letters are plain Unicode, so they display on platforms that support Unicode fonts. On older devices or with missing fonts, some characters may appear as boxes.',
  },
  {
    question: 'Does this tool store my text?',
    answer:
      'No. All flipping happens locally in your browser using JavaScript. Your text never leaves your device.',
  },
];

export default function MirrorTextPage() {
  return (
    <ToolLayout pageName="Mirror Text Generator">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Mirror Text Generator
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Reverse, flip, and mirror text in three modes — for T-shirt prints,
          puzzles, and pranks.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <MirrorTextDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            The Three Modes
          </h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-stone-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    Mode
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    What It Does
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Reverse
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Reads the characters backwards — “Hello” becomes “olleH”.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Upside Down
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Turns each character 180° and reverses the order, like a
                    true upside-down rotation.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Mirror
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Flips each character horizontally while keeping the order —
                    “b” becomes “d”, “p” becomes “q”.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input={SAMPLE_INPUT}
              output={workedExampleOutput}
              inputLabel="Plain Text"
              outputLabel="Reversed"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="mirror-text" />
        <FaqSection faqs={MIRROR_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Mirror Text Generator',
          description:
            'Reverse, flip upside down, and mirror text in three modes. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/mirror-text',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
