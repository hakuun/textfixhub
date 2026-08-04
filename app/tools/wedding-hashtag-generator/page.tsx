import type { Metadata } from 'next';
import { generateWeddingHashtags } from '@/lib/text/wedding-hashtags';
import ToolLayout from '@/components/ToolLayout';
import WorkedExample from '@/components/WorkedExample';
import ToolSidebar from '@/components/ToolSidebar';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import WeddingHashtagGeneratorDemo from './wedding-hashtag-generator-demo';

export const metadata: Metadata = {
  title: 'Wedding Hashtag Generator - Free Couple Name Hashtags',
  description:
    'Generate wedding hashtags from your names in seconds — MrAndMrs, last-name mashups, classic phrases and more. Free, no sign-up, runs in your browser.',
  alternates: {
    canonical: '/tools/wedding-hashtag-generator',
  },
  openGraph: {
    title: 'Wedding Hashtag Generator — Couple Name Hashtag Ideas | TextFixHub',
    description:
      'Generate wedding hashtags from your names — MrAndMrs, last-name mashups, classic phrases and more. Free, no sign-up.',
    siteName: 'TextFixHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Wedding Hashtag Generator — Couple Name Hashtag Ideas | TextFixHub',
    description:
      'Generate wedding hashtags from your names — MrAndMrs, last-name mashups, classic phrases and more. Free, no sign-up.',
  },
};

const sampleHashtags = generateWeddingHashtags({
  partner1: 'Emma Smith',
  partner2: 'Liam Jones',
  year: '2026',
})
  .flatMap((g) => g.hashtags)
  .slice(0, 8)
  .join('  ');

const WEDDING_HASHTAG_FAQS = [
  {
    question: 'What is a wedding hashtag?',
    answer:
      'A wedding hashtag is a short, unique tag guests use on social media posts so the couple can find every photo and message from their big day in one place — like #SmithWedding or #EmmaAndLiam2026.',
  },
  {
    question: 'How does this wedding hashtag generator work?',
    answer:
      'Enter both partners’ names (first and last). We combine them into three style groups: shared last-name hashtags (like #MrAndMrsSmith), name mashups (like #EmmaAndLiam), and classic wedding phrases with the year (like #JustSaidIDo2026). Everything runs locally in your browser.',
  },
  {
    question: 'What is the best wedding hashtag format?',
    answer:
      'The most popular formats are last-name hashtags (#TheSmiths, #HappilyEverSmith), combined names (#EmmaWedsLiam), and a shared phrase plus the year (#ForeverStartsWithToday2026). Short and easy to spell wins — guests are more likely to use it.',
  },
  {
    question: 'Do I need my last name?',
    answer:
      'No. If you only enter first names, you still get name-mashup and classic-phrase hashtags. Adding last names unlocks the shared last-name group, which is the most common wedding hashtag style.',
  },
  {
    question: 'Where should I use my wedding hashtag?',
    answer:
      'Put it on your save-the-date cards, invitations, wedding website, signs at the venue, and add it to your Instagram bio. Ask guests to include it in every post, caption, and story about your day.',
  },
  {
    question: 'Does this tool store my names?',
    answer:
      'No. Hashtags are generated locally in your browser with JavaScript. Your names never leave your device.',
  },
];

export default function WeddingHashtagGeneratorPage() {
  return (
    <ToolLayout pageName="Wedding Hashtag Generator">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Wedding Hashtag Generator
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Free couple name hashtag generator — enter your names and get
          Instagram-ready wedding hashtags in seconds.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-800">
            Try It Out
          </h2>
          <div className="mt-4">
            <WeddingHashtagGeneratorDemo />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-stone-800">
            What You Get
          </h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-stone-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    Style
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-stone-700">
                    Examples
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Shared Last Name
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    #SmithWedding, #MrAndMrsSmith, #HappilyEverSmith
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Names &amp; Mashups
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    #EmmaLiam, #EmmaAndLiam, #EmmaWedsLiam
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-stone-800">
                    Classic &amp; Date
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    #JustSaidIDo2026, #TyingTheKnot2026, #HappilyEverAfter2026
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
              input="Emma Smith + Liam Jones (2026)"
              output={sampleHashtags}
              inputLabel="Couple"
              outputLabel="Sample Hashtags"
            />
          </div>
        </section>

        <ToolSidebar currentSlug="wedding-hashtag-generator" />
        <FaqSection faqs={WEDDING_HASHTAG_FAQS} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Wedding Hashtag Generator',
          description:
            'Generate wedding hashtags from couple names — last-name mashups, name mashups and classic phrases. Runs entirely in the browser.',
          url: 'https://www.textfixhub.com/tools/wedding-hashtag-generator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
        }}
      />
    </ToolLayout>
  );
}
