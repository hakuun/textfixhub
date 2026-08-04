import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_TOOLS } from '@/lib/text/types';
import ToolCard from '@/components/ToolCard';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Free Text Tools: Alphabetize, Count & More | TextFixHub',
  description:
    'Free online text tools: alphabetize lists, remove line breaks, count sentences, generate random sentences and nouns. No sign-up required. All processing happens locally in your browser — your data never leaves your computer.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 animate-enter">
      {/* Hero */}
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">
        Free Online{' '}
        <span className="text-emerald-600">Text Tools</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-500">
        Simple, fast text utilities that work right in your browser. No
        sign-up required — just open a tool and start working.
      </p>

      {/* Tool grid — auto-fit with centered last row */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {/* Why section */}
      <section className="mt-16 border-t border-stone-200/80 pt-12">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">
          Why Use TextFixHub?
        </h2>
        <div className="mt-6 space-y-4 leading-relaxed text-stone-600">
          <p>
            All TextFixHub tools run entirely in your browser using JavaScript. Your
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

        <h2 className="mt-10 text-2xl font-bold tracking-tight text-stone-900">
          Designed to Save You Time
        </h2>
        <div className="mt-6 space-y-4 leading-relaxed text-stone-600">
          <p>
            Each tool is built for a specific task. Need to{' '}
            <Link
              href="/tools/alphabetizer"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              alphabetize a list
            </Link>
            {' '}or clean up{' '}
            <Link
              href="/tools/line-break-remover"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              messy line breaks
            </Link>
            ? Check your{' '}
            <Link
              href="/tools/sentence-counter"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              sentence count
            </Link>
            , or count{' '}
            <Link
              href="/tools/syllable-counter"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              syllables in a poem
            </Link>
            {' '}line by line for a haiku? We&apos;ve got you covered.
          </p>
          <p>
            Need naming ideas or writing fuel? Generate{' '}
            <Link
              href="/tools/random-noun-generator"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              random nouns
            </Link>
            ,{' '}
            <Link
              href="/tools/fake-word-generator"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              invented fantasy words
            </Link>
            , or{' '}
            <Link
              href="/tools/random-sentence-generator"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              creative writing prompts
            </Link>
            . Blend two words into a{' '}
            <Link
              href="/tools/word-combiner"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              portmanteau
            </Link>
            {' '}for a brand or couple name.
          </p>
          <p>
            Want your text to stand out?{' '}
            <Link
              href="/tools/linkedin-text-formatter"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              Format it for LinkedIn
            </Link>
            ,{' '}
            <Link
              href="/tools/mirror-text"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              mirror or flip it
            </Link>
            , or{' '}
            <Link
              href="/tools/random-nfl-team-generator"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              pick a random NFL team
            </Link>
            .
          </p>
          <p>
            These free tools are here to save you time and needless
            frustration. More tools are on the way. If you have a suggestion,{' '}
            <a
              href="mailto:kuangxiu0702@gmail.com"
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
            >
              drop us a line
            </a>
            .
          </p>
        </div>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'TextFixHub',
          description:
            'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random text. All processing happens locally in your browser.',
          url: 'https://www.textfixhub.com',
        }}
      />
    </div>
  );
}
