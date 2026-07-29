interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-stone-200 bg-stone-50/50 px-6 py-10">
      <p className="text-center text-sm text-stone-400">{message}</p>
    </div>
  );
}
