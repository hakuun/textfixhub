import type { Metadata } from 'next';
import { removeLineBreaks } from '@/lib/text/remove-line-breaks';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import LineBreakRemoverDemo from './line-break-remover-demo';
import { SAMPLE_INPUT } from './sample-data';

export const metadata: Metadata = {
  title: 'Line Break Remover - Free Online Remove Line Breaks Tool',
  description:
    'Remove broken line breaks from pasted text instantly — clean up PDF, email, and chat copy-paste. Three modes: replace with space, remove with space, remove entirely. Free, no sign-up.',
  alternates: {
    canonical: '/tools/line-break-remover',
  },
  openGraph: {
    title: 'Line Break Remover — Free Online Remove Line Breaks Tool | TextFixHub',
    description:
      'Remove broken line breaks from pasted text instantly — clean up PDF, email, and chat copy-paste. Three modes: replace with space, remove with space, remove entirely. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Line Break Remover — Free Online Remove Line Breaks Tool | TextFixHub',
    description:
      'Remove broken line breaks from pasted text instantly — clean up PDF, email, and chat copy-paste. Three modes: replace with space, remove with space, remove entirely. Free, no sign-up.',
  },
};

const workedExampleOutput = removeLineBreaks(SAMPLE_INPUT, 'replace-with-space');

const LINE_BREAK_FAQS = [
  {
    question: 'How do I remove line breaks from copied text?',
    answer:
      'Paste your text into the input box and the tool instantly removes line breaks. Choose "Replace with space" to turn single line breaks into spaces while keeping paragraph breaks, or "Remove entirely" to strip all line breaks.',
  },
  {
    question: "What's the difference between the three removal modes?",
    answer:
      '"Replace with space" turns single line breaks into spaces and preserves double line breaks (paragraphs). "Remove all (add space)" removes every line break but adds a space at each line end to prevent words from running together. "Remove entirely" strips all line breaks and joins all text together — best for quickly merging everything into one block.',
  },
  {
    question: 'Does it handle Windows and Mac line endings?',
    answer:
      'Yes. The tool handles Windows (CRLF), Unix (LF), and legacy Mac (CR) line endings automatically — you don\'t need to worry about which format your source text uses.',
  },
  {
    question: 'Will it keep my paragraph breaks?',
    answer:
      'Yes, when using "Replace with space" mode. Single line breaks are converted to spaces, but double line breaks (blank lines between paragraphs) are preserved.',
  },
  {
    question: 'Is my pasted text sent to a server?',
    answer:
      'No. All text processing happens locally in your browser. Your content is never uploaded, stored, or shared — we never see it.',
  },
  {
    question: 'Why does text copied from PDFs have broken line breaks?',
    answer:
      'PDFs often insert a line break at the end of each visible line rather than at the end of each paragraph. When you copy text from a PDF, these line breaks carry over, making the text appear broken. This tool fixes that.',
  },
];

export default function LineBreakRemoverPage() {
  return (
    <ToolLayout pageName="Line Break Remover">
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
            Choose between three modes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-stone-600">
            <li>
              <strong>Replace with space</strong> — single line breaks become
              spaces; double line breaks (paragraph breaks) are preserved.
            </li>
            <li>
              <strong>Remove all (add space)</strong> — all line breaks are
              removed, but a space is added at each line end to prevent words
              from running together.
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
        <FaqSection faqs={LINE_BREAK_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Line Break Remover',
          description:
            'Free online tool to remove broken line breaks from pasted text — clean up PDF and email copy-paste instantly.',
          url: 'https://www.textfixhub.com/tools/line-break-remover',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
