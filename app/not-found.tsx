import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-stone-300">404</h1>
      <p className="mt-4 text-xl font-semibold text-stone-800">
        Page Not Found
      </p>
      <p className="mt-2 text-stone-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        Back to Home
      </Link>
      <p className="mt-6 text-sm text-stone-500">
        Or try{' '}
        <Link
          href="/"
          className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
        >
          all tools
        </Link>
        , the{' '}
        <a
          href="/sitemap.xml"
          className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
        >
          sitemap
        </a>
        , or the{' '}
        <a
          href="/llms.txt"
          className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
        >
          agent guide
        </a>
        .
      </p>
    </div>
  );
}
