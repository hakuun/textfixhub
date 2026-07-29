import type { Metadata } from 'next';
import { countSentences } from '@/lib/text/sentence-counter';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import SentenceCounterDemo from './sentence-counter-demo';
import { SAMPLE_INPUT } from './sample-data';

export const metadata: Metadata = {
  title: 'Sentence Counter - Free Online Text Statistics Tool',
  description:
    'Count sentences, words, characters, paragraphs, and more. Get reading time, speaking time, and detailed text statistics. Smart abbreviation handling. Free, no sign-up.',
  alternates: {
    canonical: '/tools/sentence-counter',
  },
  openGraph: {
    title: 'Sentence Counter — Free Online Text Statistics Tool | TextFixHub',
    description:
      'Count sentences, words, characters, paragraphs, and more. Get reading time, speaking time, and detailed text statistics. Smart abbreviation handling. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sentence Counter — Free Online Text Statistics Tool | TextFixHub',
    description:
      'Count sentences, words, characters, paragraphs, and more. Get reading time, speaking time, and detailed text statistics. Smart abbreviation handling. Free, no sign-up.',
  },
};

const workedExampleStats = countSentences(SAMPLE_INPUT);

const SENTENCE_COUNTER_FAQS = [
  {
    question: 'How does the sentence counter work?',
    answer:
      'Paste any text and the tool instantly shows a complete statistics dashboard — sentences, words, characters, paragraphs, reading time, speaking time, and more. Everything updates in real time as you type.',
  },
  {
    question: 'Does it handle abbreviations like Mr. and Dr.?',
    answer:
      'Yes. Unlike simple counters that naïvely split on every period, our tool recognizes common abbreviations (Mr., Mrs., Dr., e.g., i.e., etc., vs., U.S.A., Ph.D., and more) and does not count their periods as sentence endings.',
  },
  {
    question: 'Does it count decimal numbers as sentence endings?',
    answer:
      'No. The tool correctly handles decimal numbers like 3.14 and version numbers like 2.0. These periods are not mistaken for sentence boundaries.',
  },
  {
    question: 'How is reading time calculated?',
    answer:
      'Reading time is estimated at 200 words per minute, which is the average adult silent reading speed for English text. This gives readers a realistic estimate of how long your content will take to read.',
  },
  {
    question: 'How is speaking time calculated?',
    answer:
      'Speaking time is estimated at 130 words per minute, reflecting a natural conversational pace for presentations and speeches.',
  },
  {
    question: 'What statistics does the tool provide?',
    answer:
      'You get 10 metrics: sentence count, word count, character count (with and without spaces), paragraph count, line count, average sentence length (words), average word length (characters), estimated reading time, and estimated speaking time.',
  },
  {
    question: 'Is my text stored or uploaded anywhere?',
    answer:
      'No. All text processing runs locally in your browser using JavaScript. Your content never leaves your device — we have no way to see, store, or access any text you paste.',
  },
];

export default function SentenceCounterPage() {
  return (
    <ToolLayout pageName="Sentence Counter">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">Sentence Counter</h1>
        <p className="mt-2 text-lg text-stone-600">
          Count sentences, words, characters, and more — a complete text
          statistics tool with smart abbreviation handling.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Try It Out</h2>
          <div className="mt-4">
            <SentenceCounterDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            Paste your text and get a complete breakdown instantly. Unlike
            simple counters that naïvely split on every period, our tool knows
            that not all periods end sentences:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-stone-600">
            <li>
              <strong>Abbreviations</strong> like Mr., Dr., e.g., i.e., U.S.A.,
              and Ph.D. do not trigger false sentence splits.
            </li>
            <li>
              <strong>Decimal numbers</strong> like 3.14 and version 2.0 are
              handled correctly.
            </li>
            <li>
              <strong>Ellipsis (…)</strong> counts as one sentence ending, not
              three.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            All Statistics
          </h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-stone-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    Metric
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    What It Tells You
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Sentences
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Number of sentences detected — correctly ignores
                    abbreviations and decimals
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Words
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Total word count — useful for meeting length requirements
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Characters
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    With and without spaces — handy for SEO meta descriptions
                    and character limits
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Paragraphs
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Blocks of text separated by blank lines
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Avg Sentence Length
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Words per sentence — aim for 15–20 for readable web content
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Reading Time
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Estimated at 200 words per minute (adult silent reading
                    speed)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Speaking Time
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Estimated at 130 words per minute (natural speech pace)
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
              output={`${workedExampleStats.sentenceCount} sentences, ${workedExampleStats.wordCount} words, ${workedExampleStats.charCountWithSpaces} characters`}
              inputLabel="Sample Input"
              outputLabel="Statistics"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="sentence-counter" />
        <FaqSection faqs={SENTENCE_COUNTER_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Sentence Counter',
          description:
            'Free online text statistics tool — count sentences, words, characters, paragraphs, reading time, and more with smart abbreviation handling.',
          url: 'https://www.textfixhub.com/tools/sentence-counter',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
