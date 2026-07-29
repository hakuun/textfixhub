import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import JsonLd from './JsonLd';

interface ToolLayoutProps {
  children: React.ReactNode;
  pageName?: string;
}

export default function ToolLayout({ children, pageName }: ToolLayoutProps) {
  const breadcrumbSchema = pageName
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'TextFixHub',
            item: 'https://www.textfixhub.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: pageName,
            item: `https://www.textfixhub.com/tools/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
          },
        ],
      }
    : undefined;
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
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
    </>
  );
}
