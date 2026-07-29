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
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
        {label}
      </span>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-base font-medium text-stone-600 transition-all duration-200 ease-out hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-stone-200 disabled:hover:bg-white"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease count"
      >
        &minus;
      </button>
      <input
        type="number"
        className="h-9 w-16 rounded-lg border border-stone-200 bg-white text-center text-sm font-medium tabular-nums text-stone-900 transition-all duration-200 ease-out hover:border-stone-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        style={{
          boxShadow:
            '0 0 0 1px oklch(0 0 0 / 0.03), 0 1px 2px 0 oklch(0 0 0 / 0.04)',
        }}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) onChange(clamp(n));
        }}
      />
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-base font-medium text-stone-600 transition-all duration-200 ease-out hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-stone-200 disabled:hover:bg-white"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase count"
      >
        +
      </button>
    </div>
  );
}
