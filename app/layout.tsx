import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white text-stone-900 antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-base font-semibold tracking-tight text-stone-900 hover:text-emerald-600 transition-colors"
              >
                <img
                  src="/favicon.svg"
                  alt=""
                  className="h-7 w-7 rounded-md"
                  aria-hidden="true"
                />
                TextTools
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link
                  href="/about"
                  className="text-stone-500 hover:text-stone-900 transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-stone-100">
            <div className="mx-auto max-w-5xl px-4 py-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm text-stone-400">
                  &copy; {new Date().getFullYear()} TextTools. All tools run locally in your browser.
                </p>
                <nav className="flex gap-6 text-sm">
                  <Link
                    href="/about"
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-stone-400 hover:text-stone-600 transition-colors"
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
