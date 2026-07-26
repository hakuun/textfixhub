import Link from 'next/link';

interface ToolLayoutProps {
  children: React.ReactNode;
}

export default function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 px-4 py-3">
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← All Text Tools
        </Link>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-100 px-4 py-6 text-center text-sm text-gray-400">
        Free online text tools. No sign-up, no ads, no data collection.
      </footer>
    </div>
  );
}
