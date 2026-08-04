import type { Metadata } from 'next';
import {
  smallCapsText,
  superscriptText,
  subscriptText,
} from '@/lib/text/small-text';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import SmallTextGeneratorDemo from './small-text-generator-demo';

export const metadata: Metadata = {
  title: 'Small Text Generator - Tiny, Superscript & Subscript',
  description:
    'Generate small text, tiny letters, superscript (x²) and subscript (H₂O) from any text. Great for social bios, math, and chemistry. Free, no sign-up, runs in your browser.',
  alternates: {
    canonical: '/tools/small-text-generator',
  },
  openGraph: {
    title:
      'Small Text Generator — Tiny Letters, Superscript & Subscript | TextFixHub',
    description:
      'Generate small text, tiny letters, superscript (x²) and subscript (H₂O) from any text. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'Small Text Generator — Tiny Letters, Superscript & Subscript | TextFixHub',
    description:
      'Generate small text, tiny letters, superscript (x²) and subscript (H₂O) from any text. Free, no sign-up.',
  },
};

const SAMPLE_INPUT = 'Hello World!';
const workedExampleSmall = smallCapsText(SAMPLE_INPUT);
const workedExampleSuper = superscriptText(SAMPLE_INPUT);

const SMALL_TEXT_FAQS = [
  {
    question: 'What is a small text generator?',
    answer:
      'It converts your text into Unicode small capital letters — like ᴀʙᴄ instead of ABC. The letters look noticeably smaller, which is why these styles are often called "small text" or "tiny text".',
  },
  {
    question: 'What is the difference between small text and tiny text?',
    answer:
      'They are the same effect with different names. Both use Unicode small capital letters to make text render smaller. We use "Small Text" as the page name, and "tiny text" is just another way people search for the same style.',
  },
  {
    question: 'What is superscript used for?',
    answer:
      'Superscript text is raised above the baseline — like x², 10⁹, or footnotes. It is commonly used in math, exponents, science, and references. If your platform does not support rich text, a superscript generator is the way to type it.',
  },
  {
    question: 'What is subscript used for?',
    answer:
      'Subscript text sits below the baseline — like H₂O, CO₂, or C₆H₁₂O₆. It is essential for chemical formulas and some math notation where a normal keyboard cannot type these characters.',
  },
  {
    question: 'Will small text and superscript work on social media?',
    answer:
      'Mostly yes. Small capitals, superscript and subscript are plain Unicode characters, so they display on platforms that support Unicode fonts — including Instagram, Twitter/X, Discord, and TikTok. On older devices or with missing fonts, a few characters may show as boxes.',
  },
  {
    question: 'Why are some letters not converted?',
    answer:
      'Unicode does not provide every style for every letter. For example, superscript has no letter "q", and subscript only exists for a handful of letters. In those cases the original letter passes through unchanged.',
  },
  {
    question: 'Does this tool store my text?',
    answer:
      'No. Everything happens locally in your browser using JavaScript. Your text never leaves your device.',
  },
];

export default function SmallTextGeneratorPage() {
  return (
    <ToolLayout pageName="Small Text Generator">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Small Text Generator
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Make tiny letters with small caps, superscript, and subscript — for
          social bios, math, and chemistry.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <SmallTextGeneratorDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            The Three Styles
          </h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-stone-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    Style
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    What It Does
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Small Text
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Converts letters to Unicode small capitals — “Hello”
                    becomes “ʜᴇʟʟᴏ”. This is the classic tiny-text look.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Superscript
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Raises letters and digits above the baseline — “x2”
                    becomes “ˣ²”. Great for exponents and footnotes.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Subscript
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    Lowers letters and digits below the baseline — “H2O”
                    becomes “H₂O”. Essential for chemical formulas.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">Example</h2>
          <div className="mt-4 space-y-4">
            <WorkedExample
              input={SAMPLE_INPUT}
              output={workedExampleSmall}
              inputLabel="Plain Text"
              outputLabel="Small Text"
            />
            <WorkedExample
              input={SAMPLE_INPUT}
              output={workedExampleSuper}
              inputLabel="Plain Text"
              outputLabel="Superscript"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="small-text-generator" />
        <FaqSection faqs={SMALL_TEXT_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Small Text Generator',
          description:
            'Generate small text, tiny letters, superscript and subscript from any text. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/small-text-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
