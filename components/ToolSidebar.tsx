import { RELATED_TOOLS, getToolBySlug, type ToolMeta } from '@/lib/text/types';
import ToolCard from './ToolCard';

interface ToolSidebarProps {
  currentSlug: string;
}

export default function ToolSidebar({ currentSlug }: ToolSidebarProps) {
  const relatedSlugs = RELATED_TOOLS[currentSlug];
  if (!relatedSlugs || relatedSlugs.length === 0) return null;

  const relatedTools = relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolMeta => t !== undefined);

  return (
    <section className="mt-12 border-t border-gray-100 pt-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Related Tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </section>
  );
}
