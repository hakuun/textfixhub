import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TextTools — Free Online Text Tools',
    template: '%s | TextTools',
  },
  description:
    'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random sentences and nouns. No sign-up required. Works instantly in your browser.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'TextTools — Free Online Text Tools',
    description:
      'Alphabetize, clean up text, count sentences, and generate random sentences and nouns. Free, instant, no sign-up.',
    siteName: 'TextTools',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'TextTools — Free Online Text Tools',
    description:
      'Alphabetize, clean up text, count sentences, and generate random sentences and nouns. Free, instant, no sign-up.',
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
        <div className="flex min-h-screen flex-col">
          {/* Global Header */}
          <header className="border-b border-gray-200">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
              <Link
                href="/"
                className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors"
              >
                TextTools
              </Link>
              <nav className="flex gap-4 text-sm">
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">{children}</main>

          {/* Global Footer */}
          <footer className="border-t border-gray-100">
            <div className="mx-auto max-w-4xl px-4 py-6">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <p className="text-sm text-gray-400">
                  © 2026 TextTools. All tools run locally in your browser.
                </p>
                <nav className="flex gap-4 text-sm">
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Terms
                  </Link>
                </nav>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
