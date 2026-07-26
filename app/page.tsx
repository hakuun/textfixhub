import type { Metadata } from 'next';
import { ALL_TOOLS } from '@/lib/text/types';
import ToolCard from '@/components/ToolCard';

export const metadata: Metadata = {
  title:
    'Free Online Text Tools - Alphabetize, Count Sentences, Generate Random Text | TextTools',
  description:
    'Free online text tools: alphabetize lists, remove line breaks, count sentences, generate random sentences and nouns. No sign-up, no ads, works instantly in your browser.',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900">
            Free Online Text Tools
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Simple, fast text utilities that work right in your browser. No
            sign-up, no ads, no data collection.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_TOOLS.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-100 px-4 py-6 text-center text-sm text-gray-400">
        Free online text tools. No sign-up, no ads, no data collection.
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'TextTools',
            description:
              'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random text.',
            url: 'https://texttools.example.com',
          }),
        }}
      />
    </div>
  );
}
