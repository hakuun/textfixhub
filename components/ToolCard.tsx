import Link from 'next/link';
import type { ToolMeta } from '@/lib/text/types';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  SortAscending,
  TextIndent,
  Article,
  Quotes,
  Tag,
  TextB,
  MagicWand,
  Hash,
  Trophy,
  ArrowsMerge,
  FlipHorizontal,
  TextT,
} from '@phosphor-icons/react/dist/ssr';

const TOOL_ICONS: Record<string, PhosphorIcon> = {
  alphabetizer: SortAscending,
  'line-break-remover': TextIndent,
  'sentence-counter': Article,
  'random-sentence-generator': Quotes,
  'random-noun-generator': Tag,
  'linkedin-text-formatter': TextB,
  'fake-word-generator': MagicWand,
  'syllable-counter': Hash,
  'random-nfl-team-generator': Trophy,
  'word-combiner': ArrowsMerge,
  'mirror-text': FlipHorizontal,
  'small-text-generator': TextT,
};

interface ToolCardProps {
  tool: ToolMeta;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = TOOL_ICONS[tool.slug] ?? Tag;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card-surface group block p-5"
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all duration-200 group-hover:scale-110"
        >
          <IconComponent className="h-[18px] w-[18px]" weight="duotone" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors truncate">
            {tool.name}
          </h2>
          <p className="mt-1 text-[13px] text-stone-500 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
