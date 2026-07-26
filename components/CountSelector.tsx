'use client';

interface CountSelectorProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export default function CountSelector({
  value,
  onChange,
  min = 1,
  max = 500,
  label = 'Count',
}: CountSelectorProps) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-30"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease count"
      >
        −
      </button>
      <input
        type="number"
        className="h-10 w-20 rounded-lg border border-gray-300 text-center text-sm font-medium shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) onChange(clamp(n));
        }}
      />
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-30"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase count"
      >
        +
      </button>
    </div>
  );
}
