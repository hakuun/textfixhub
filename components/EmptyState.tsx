interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-6 py-12">
      <p className="text-center text-sm text-gray-400">{message}</p>
    </div>
  );
}
