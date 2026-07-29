import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_TOOLS } from '@/lib/text/types';
import ToolCard from '@/components/ToolCard';

export const metadata: Metadata = {
  title:
    'Free Online Text Tools - Alphabetize, Count Sentences, Generate Random Text | TextTools',
  description:
    'Free online text tools: alphabetize lists, remove line breaks, count sentences, generate random sentences and nouns. No sign-up required. All processing happens locally in your browser — your data never leaves your computer.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">
        Free Online Text Tools
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Simple, fast text utilities that work right in your browser. No
        sign-up required — just open a tool and start working.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <section className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Why Use TextTools?
        </h2>
        <div className="mt-6 space-y-4 leading-relaxed text-gray-600">
          <p>
            All TextTools run entirely in your browser using JavaScript. Your
            text never leaves your computer — nothing is uploaded to a server,
            stored in a database, or shared with third parties. This makes our
            tools both <strong>fast</strong> (no network round-trips waiting
            for a server) and <strong>private</strong> (your data is yours
            alone, always).
          </p>
          <p>
            Whether you&apos;re cleaning up text for a CMS, writing code,
            posting to social media, doing schoolwork, or handling routine
            office tasks, these tools are designed to get the job done with
            zero friction. No sign-up required. No software to download. Just
            open the tool and start working.
          </p>
          <p>
            These web tools have been tested on all modern browsers — Chrome,
            Firefox, Safari, and Edge — and should work exactly as expected.
            Since everything processes locally, you can work with large
            amounts of text instantly.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Designed to Save You Time
        </h2>
        <div className="mt-6 space-y-4 leading-relaxed text-gray-600">
          <p>
            Each tool is built for a specific task. Need to{' '}
            <Link
              href="/tools/alphabetizer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              alphabetize a list
            </Link>
            ? Clean up{' '}
            <Link
              href="/tools/line-break-remover"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              messy line breaks
            </Link>
            ? Get detailed{' '}
            <Link
              href="/tools/sentence-counter"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              text statistics like word count and reading time
            </Link>
            ? Generate{' '}
            <Link
              href="/tools/random-sentence-generator"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              creative writing prompts
            </Link>{' '}
            or{' '}
            <Link
              href="/tools/random-noun-generator"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              random nouns for brainstorming
            </Link>
            ? We&apos;ve got you covered.
          </p>
          <p>
            These free tools are here to save you time and needless
            frustration. More tools are on the way. If you have a suggestion,{' '}
            <a
              href="mailto:kuangxiu0702@gmail.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              drop us a line
            </a>
            .
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'TextTools',
            description:
              'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random text. All processing happens locally in your browser.',
            url: 'https://texttools.example.com',
          }),
        }}
      />
    </div>
  );
}
