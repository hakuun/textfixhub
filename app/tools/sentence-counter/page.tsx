import type { Metadata } from 'next';
import { countSentences } from '@/lib/text/sentence-counter';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import SentenceCounterDemo from './sentence-counter-demo';
import { SAMPLE_INPUT } from './sample-data';

export const metadata: Metadata = {
  title: 'Sentence Counter - Free Online Sentence Counting Tool | TextTools',
  description:
    'Count sentences in your text with smart abbreviation handling. Accurately detects sentence boundaries without splitting on Mr., Dr., e.g., etc. Free, no sign-up.',
  alternates: {
    canonical: '/tools/sentence-counter',
  },
};

const workedExampleResult = countSentences(SAMPLE_INPUT);

export default function SentenceCounterPage() {
  return (
    <ToolLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Sentence Counter</h1>
        <p className="mt-2 text-lg text-gray-600">
          Count sentences in your text — with smart abbreviation handling for
          accurate results.
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
            Paste your text and the counter instantly shows how many sentences
            it contains. Unlike simple counters that naïvely split on every
            period, our tool knows that not all periods end sentences:
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

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input={SAMPLE_INPUT}
              output={`${workedExampleResult.count} sentences`}
              inputLabel="Sample Input"
              outputLabel="Sentence Count"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="sentence-counter" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Sentence Counter',
            description:
              'Free online sentence counter with smart abbreviation handling — accurately count sentences without splitting on Mr., Dr., e.g., etc.',
            url: 'https://texttools.example.com/tools/sentence-counter',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any',
          }),
        }}
      />
    </ToolLayout>
  );
}
