import Link from 'next/link';

interface ToolLayoutProps {
  children: React.ReactNode;
}

export default function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <>
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← All Text Tools
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
