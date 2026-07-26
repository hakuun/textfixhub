import Link from 'next/link';
import type { ToolMeta } from '@/lib/text/types';

interface ToolCardProps {
  tool: ToolMeta;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-900">{tool.name}</h2>
      <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
    </Link>
  );
}
