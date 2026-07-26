import EmptyState from './EmptyState';

interface OutputPanelProps {
  text: string;
  emptyMessage?: string;
  label?: string;
}

export default function OutputPanel({
  text,
  emptyMessage = 'Output will appear here.',
  label = 'Output',
}: OutputPanelProps) {
  if (!text) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm leading-relaxed whitespace-pre-wrap"
        dir="auto"
      >
        {text}
      </div>
    </div>
  );
}
