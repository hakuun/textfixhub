import type { Metadata } from 'next';
import { formatLinkedinText } from '@/lib/text/linkedin-text-formatter';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import LinkedinFormatterDemo from './linkedin-formatter-demo';

export const metadata: Metadata = {
  title: 'LinkedIn Text Formatter - Bold, Italic & Strikethrough Text',
  description:
    'Format text for LinkedIn with bold, italic, strikethrough, underline and more. 14 Unicode text styles plus bullet, numbered and checklist lists. Free, no sign-up, 100% private.',
  alternates: {
    canonical: '/tools/linkedin-text-formatter',
  },
  openGraph: {
    title:
      'LinkedIn Text Formatter — Bold, Italic & Strikethrough Text | TextFixHub',
    description:
      'Format text for LinkedIn with bold, italic, strikethrough, underline and more. 14 Unicode text styles plus bullet, numbered and checklist lists. Free, no sign-up, 100% private.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'LinkedIn Text Formatter — Bold, Italic & Strikethrough Text | TextFixHub',
    description:
      'Format text for LinkedIn with bold, italic, strikethrough, underline and more. 14 Unicode text styles plus bullet, numbered and checklist lists. Free, no sign-up, 100% private.',
  },
};

const SAMPLE_INPUT = 'Hello LinkedIn!';

const workedExampleOutput = formatLinkedinText(SAMPLE_INPUT, 'bold');

const LINKEDIN_FAQS = [
  {
    question: 'How do I format text on LinkedIn?',
    answer:
      'LinkedIn does not natively support bold, italic, or other rich text in posts and profiles. This tool works around that by swapping each letter for a Unicode character that looks bold or italic. LinkedIn treats those as plain text, so the formatting survives copy and paste.',
  },
  {
    question: 'Does bold text work everywhere on LinkedIn?',
    answer:
      'Yes, formatted text works anywhere LinkedIn accepts typing: posts, comments, your profile headline, and the About section. It also works on most other platforms that accept Unicode, such as X, Instagram, Threads, and Facebook.',
  },
  {
    question: 'Why does my formatted text look different on some devices?',
    answer:
      'Unicode styled letters depend on the fonts installed on the reader’s device. On modern phones and computers they render as bold or italic, but on older devices they may display as empty boxes. The formatted text is most reliable in short snippets like headings and punchy lines.',
  },
  {
    question: 'Is it safe to use a LinkedIn text formatter? Will I get banned?',
    answer:
      'Yes, it is safe. Formatted text is plain Unicode characters, not a violation of LinkedIn’s rules. That said, we recommend using it sparingly — for headings and key phrases — since heavily formatted text hurts readability and can look spammy.',
  },
  {
    question: 'Does formatted text count toward LinkedIn’s character limit?',
    answer:
      'Yes. Every styled character counts as one character toward LinkedIn’s 3,000-character post limit, even though it may look wider on screen. This tool shows your running character count so you know how much room you have.',
  },
  {
    question: 'Why are some letters not transformed in a style?',
    answer:
      'The Unicode character sets behind styles like script and gothic do not include every letter of the alphabet. Unavailable characters pass through unchanged in their plain form — the rest of your text still gets the style applied.',
  },
  {
    question: 'Does this tool store or upload my text?',
    answer:
      'No. All formatting happens locally in your browser using JavaScript. Your text never leaves your device — we have no way to see, store, or access anything you type.',
  },
];

export default function LinkedinTextFormatterPage() {
  return (
    <ToolLayout pageName="LinkedIn Text Formatter">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          LinkedIn Text Formatter
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Turn plain text into bold, italic, and eye-catching Unicode styles for
          your LinkedIn posts — free, private, and no sign-up required.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <LinkedinFormatterDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            How It Works
          </h2>
          <p className="mt-2 text-stone-600">
            LinkedIn doesn’t support rich text formatting, but it accepts plain
            Unicode. Beyond the normal alphabet, Unicode contains complete sets
            of look-alike letters — mathematical bold, italic, script, gothic,
            monospace, and more — originally added for mathematics and
            scientific notation.
          </p>
          <p className="mt-3 text-stone-600">
            This tool swaps each letter you type for its styled twin from one
            of those sets. When you “bold” a word you aren’t applying
            formatting the way a document does — you’re swapping letters for
            different characters that happen to look bold. Because they are
            real characters, they survive copy and paste and show up styled in
            your post.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            Available Styles
          </h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-stone-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    Style
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    Sample
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Bold
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Bold Text', 'bold')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Bold Sans
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Bold Text', 'bold-sans')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Italic
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Italic Text', 'italic')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Italic Sans
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Italic Text', 'italic-sans')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Bold Italic
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Bold Text', 'bold-italic')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Bold Italic Sans
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Bold Text', 'bold-italic-sans')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Monospace
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Mono Text', 'monospace')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Underline
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Under Text', 'underline')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Strikethrough
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Strike Text', 'strikethrough')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Fullwidth
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Full Text', 'fullwidth')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Bullet Points
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('One\nTwo', 'bullet')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Numbered List
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('One\nTwo', 'numbered')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Checklist
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {formatLinkedinText('Task', 'checklist')}
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
              outputLabel="Bold Style"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="linkedin-text-formatter" />
        <FaqSection faqs={LINKEDIN_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'LinkedIn Text Formatter',
          description:
            'Free tool to format text for LinkedIn with bold, italic, strikethrough, underline and more Unicode styles, plus bullet and checklist lists. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/linkedin-text-formatter',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
