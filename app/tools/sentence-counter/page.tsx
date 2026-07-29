import type { Metadata } from 'next';
import { countSentences } from '@/lib/text/sentence-counter';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import JsonLd from '@/components/JsonLd';
import SentenceCounterDemo from './sentence-counter-demo';
import { SAMPLE_INPUT } from './sample-data';

export const metadata: Metadata = {
  title: 'Sentence Counter - Free Online Text Statistics Tool | TextTools',
  description:
    'Count sentences, words, characters, paragraphs, and more. Get reading time, speaking time, and detailed text statistics. Smart abbreviation handling. Free, no sign-up.',
  alternates: {
    canonical: '/tools/sentence-counter',
  },
};

const workedExampleStats = countSentences(SAMPLE_INPUT);

export default function SentenceCounterPage() {
  return (
    <ToolLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Sentence Counter</h1>
        <p className="mt-2 text-lg text-gray-600">
          Count sentences, words, characters, and more — a complete text
          statistics tool with smart abbreviation handling.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Try It Out</h2>
          <div className="mt-4">
            <SentenceCounterDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800">
            How It Works
          </h2>
          <p className="mt-2 text-gray-600">
            Paste your text and get a complete breakdown instantly. Unlike
            simple counters that naïvely split on every period, our tool knows
            that not all periods end sentences:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
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
          <h2 className="text-xl font-semibold text-gray-800">
            All Statistics
          </h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Metric
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    What It Tells You
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    Sentences
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    Number of sentences detected — correctly ignores
                    abbreviations and decimals
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    Words
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    Total word count — useful for meeting length requirements
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    Characters
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    With and without spaces — handy for SEO meta descriptions
                    and character limits
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    Paragraphs
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    Blocks of text separated by blank lines
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    Avg Sentence Length
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    Words per sentence — aim for 15–20 for readable web content
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    Reading Time
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    Estimated at 200 words per minute (adult silent reading
                    speed)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    Speaking Time
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    Estimated at 130 words per minute (natural speech pace)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Example</h2>
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
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Sentence Counter',
          description:
            'Free online text statistics tool — count sentences, words, characters, paragraphs, reading time, and more with smart abbreviation handling.',
          url: 'https://texttools.example.com/tools/sentence-counter',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
