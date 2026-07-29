interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="card-surface flex items-center justify-center px-6 py-10">
      <p className="text-center text-sm text-stone-500">{message}</p>
    </div>
  );
}
