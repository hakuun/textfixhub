import Link from 'next/link';
import type { ToolMeta } from '@/lib/text/types';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  SortAscending,
  TextIndent,
  Article,
  Quotes,
  Tag,
} from '@phosphor-icons/react/dist/ssr';

const TOOL_ICONS: Record<string, PhosphorIcon> = {
  alphabetizer: SortAscending,
  'line-break-remover': TextIndent,
  'sentence-counter': Article,
  'random-sentence-generator': Quotes,
  'random-noun-generator': Tag,
};

interface ToolCardProps {
  tool: ToolMeta;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = TOOL_ICONS[tool.slug] ?? Tag;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card-surface group block p-5 hover:border-emerald-200 hover:shadow-md hover:shadow-stone-200/50"
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-50 text-stone-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
          <IconComponent className="h-4 w-4" weight="duotone" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
            {tool.name}
          </h2>
          <p className="mt-1 text-sm text-stone-500 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
