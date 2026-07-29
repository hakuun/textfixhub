import type { Metadata } from 'next';
import { alphabetize } from '@/lib/text/alphabetize';
import { DEFAULT_ALPHABETIZER_OPTIONS } from '@/lib/text/types';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import AlphabetizerDemo from './alphabetizer-demo';
import { SAMPLE_INPUT } from './sample-data';

export const metadata: Metadata = {
  title: 'Alphabetizer - Free Online Alphabetize List Tool',
  description:
    'Alphabetize any list instantly — sort A to Z, remove duplicates, reverse order, custom separators, and HTML removal. Free online tool, no sign-up required.',
  alternates: {
    canonical: '/tools/alphabetizer',
  },
  openGraph: {
    title: 'Alphabetizer — Free Online Alphabetize List Tool | TextFixHub',
    description:
      'Alphabetize any list instantly — sort A to Z, remove duplicates, reverse order, custom separators, and HTML removal. Free online tool, no sign-up required.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Alphabetizer — Free Online Alphabetize List Tool | TextFixHub',
    description:
      'Alphabetize any list instantly — sort A to Z, remove duplicates, reverse order, custom separators, and HTML removal. Free online tool, no sign-up required.',
  },
};

const ALPHABETIZER_FAQS = [
  {
    question: 'How does the alphabetizer tool work?',
    answer:
      'Paste your list into the input box (one item per line by default) and the tool instantly sorts it alphabetically — no button click needed. Results update automatically as you type.',
  },
  {
    question: 'Can I sort in reverse order (Z to A)?',
    answer:
      'Yes. Check the "Reverse Order" toggle to sort from Z to A instead of A to Z.',
  },
  {
    question: 'Does the tool remove duplicate entries?',
    answer:
      'You can optionally remove duplicates by checking the "Remove Duplicates" toggle. When enabled, any repeated lines in your list are automatically removed from the sorted output.',
  },
  {
    question: 'What separators are supported for input and output?',
    answer:
      'You can choose from New line, Comma, Semicolon, Space, or a Custom separator of your choice. This lets you paste comma-separated values and get back newline-separated results, or vice versa.',
  },
  {
    question: 'Is my data safe when using this alphabetizer?',
    answer:
      'Yes. All processing happens locally in your browser using JavaScript. Your text never leaves your computer — nothing is uploaded to a server, stored in a database, or shared with third parties.',
  },
  {
    question: 'Can I remove HTML tags from my list?',
    answer:
      'Yes. Enable the "Remove HTML" toggle to strip any HTML tags from your list items before sorting. This is useful when copying content from web pages or HTML source.',
  },
  {
    question: 'Does this tool work on mobile devices?',
    answer:
      'Yes. The alphabetizer is fully responsive and works on phones and tablets. It has been tested on iOS Safari and Android Chrome.',
  },
];

const workedExampleOutput = alphabetize(
  SAMPLE_INPUT,
  DEFAULT_ALPHABETIZER_OPTIONS,
);

export default function AlphabetizerPage() {
  return (
    <ToolLayout pageName="Alphabetizer">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">Alphabetizer</h1>
        <p className="mt-2 text-lg text-stone-600">
          Sort any list alphabetically — instantly, with options to remove
          duplicates and reverse order.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <AlphabetizerDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">How It Works</h2>
          <p className="mt-2 text-stone-600">
            Paste your list into the input box — one item per line. Your list is
            sorted automatically as you type. Use the toggles to customize:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-stone-600">
            <li><strong>Case Sensitive</strong> — sort uppercase and lowercase separately</li>
            <li><strong>Reverse Order</strong> — sort Z→A instead of A→Z</li>
            <li><strong>Remove Duplicates</strong> — strip repeated lines</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample input={SAMPLE_INPUT} output={workedExampleOutput} />
          </div>
        </section>

        <ToolSidebar currentSlug="alphabetizer" />
        <FaqSection faqs={ALPHABETIZER_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Alphabetizer',
          description:
            'Free online tool to alphabetize any list — sort A to Z, remove duplicates, reverse order, and toggle case sensitivity.',
          url: 'https://www.textfixhub.com/tools/alphabetizer',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
