interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-xl bg-stone-50/50 px-6 py-10" style={{ boxShadow: '0 0 0 1px oklch(0 0 0 / 0.06), 0 1px 2px -1px oklch(0 0 0 / 0.06), 0 2px 4px 0 oklch(0 0 0 / 0.04)' }}>
      <p className="text-center text-sm text-stone-500">{message}</p>
    </div>
  );
}
