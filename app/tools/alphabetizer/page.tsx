import type { Metadata } from 'next';
import { alphabetize } from '@/lib/text/alphabetize';
import { DEFAULT_ALPHABETIZER_OPTIONS } from '@/lib/text/types';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import AlphabetizerDemo from './alphabetizer-demo';
import { SAMPLE_INPUT } from './sample-data';

export const metadata: Metadata = {
  title: 'Alphabetizer - Free Online Alphabetize List Tool | TextTools',
  description:
    'Alphabetize any list instantly — sort A to Z, remove duplicates, reverse order, custom separators, and HTML removal. Free online tool, no sign-up required.',
  alternates: {
    canonical: '/tools/alphabetizer',
  },
};

const workedExampleOutput = alphabetize(
  SAMPLE_INPUT,
  DEFAULT_ALPHABETIZER_OPTIONS,
);

export default function AlphabetizerPage() {
  return (
    <ToolLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Alphabetizer</h1>
        <p className="mt-2 text-lg text-gray-600">
          Sort any list alphabetically — instantly, with options to remove
          duplicates and reverse order.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <AlphabetizerDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800">How It Works</h2>
          <p className="mt-2 text-gray-600">
            Paste your list into the input box — one item per line. Your list is
            sorted automatically as you type. Use the toggles to customize:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li><strong>Case Sensitive</strong> — sort uppercase and lowercase separately</li>
            <li><strong>Reverse Order</strong> — sort Z→A instead of A→Z</li>
            <li><strong>Remove Duplicates</strong> — strip repeated lines</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Example</h2>
          <div className="mt-4">
            <WorkedExample input={SAMPLE_INPUT} output={workedExampleOutput} />
          </div>
        </section>

        <ToolSidebar currentSlug="alphabetizer" />
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Alphabetizer',
            description:
              'Free online tool to alphabetize any list — sort A to Z, remove duplicates, reverse order, and toggle case sensitivity.',
            url: 'https://texttools.example.com/tools/alphabetizer',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any',
          }),
        }}
      />
    </ToolLayout>
  );
}
