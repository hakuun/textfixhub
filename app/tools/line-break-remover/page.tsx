import type { Metadata } from 'next';
import { removeLineBreaks } from '@/lib/text/remove-line-breaks';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import JsonLd from '@/components/JsonLd';
import LineBreakRemoverDemo from './line-break-remover-demo';
import { SAMPLE_INPUT } from './sample-data';

export const metadata: Metadata = {
  title: 'Line Break Remover - Free Online Remove Line Breaks Tool | TextFixHub',
  description:
    'Remove broken line breaks from pasted text instantly — clean up PDF, email, and chat copy-paste. Three modes: replace with space, remove with space, remove entirely. Free, no sign-up.',
  alternates: {
    canonical: '/tools/line-break-remover',
  },
};

const workedExampleOutput = removeLineBreaks(SAMPLE_INPUT, 'replace-with-space');

export default function LineBreakRemoverPage() {
  return (
    <ToolLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Line Break Remover
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Remove broken line breaks from pasted text — turn choppy PDF or email
          copy into flowing paragraphs.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Try It Out</h2>
          <div className="mt-4">
            <LineBreakRemoverDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            Paste text copied from a PDF, email, or chat message. The tool
            removes single line breaks and joins text into flowing paragraphs.
            Choose between two modes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-stone-600">
            <li>
              <strong>Replace with space</strong> — single line breaks become
              spaces; double line breaks (paragraph breaks) are preserved.
            </li>
            <li>
              <strong>Remove entirely</strong> — all line breaks are removed and
              text is joined together.
            </li>
          </ul>
          <p className="mt-2 text-stone-600">
            Handles Windows (CRLF), Unix (LF), and legacy Mac (CR) line endings.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4">
            <WorkedExample
              input={SAMPLE_INPUT}
              output={workedExampleOutput}
              inputLabel="Sample Input (with line breaks)"
              outputLabel="Output (replace with space mode)"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="line-break-remover" />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Line Break Remover',
          description:
            'Free online tool to remove broken line breaks from pasted text — clean up PDF and email copy-paste instantly.',
          url: 'https://textfixhub.com/tools/line-break-remover',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
