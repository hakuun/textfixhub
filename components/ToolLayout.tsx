import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';

interface ToolLayoutProps {
  children: React.ReactNode;
}

export default function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <>
      <div className="border-b border-stone-100 bg-stone-50/50 px-4 py-3">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Text Tools
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
