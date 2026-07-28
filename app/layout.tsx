import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TextTools — Free Online Text Tools',
    template: '%s | TextTools',
  },
  description: 'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random sentences and nouns. No sign-up, no ads, works instantly.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'TextTools — Free Online Text Tools',
    description: 'Alphabetize, clean up text, count sentences, and generate random sentences and nouns. Free, instant, no sign-up.',
    siteName: 'TextTools',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'TextTools — Free Online Text Tools',
    description: 'Alphabetize, clean up text, count sentences, and generate random sentences and nouns. Free, instant, no sign-up.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
