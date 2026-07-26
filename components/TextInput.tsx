'use client';

import { useCallback, useRef, useState } from 'react';

interface TextInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  label?: string;
}

export default function TextInput({
  placeholder = 'Paste your text here...',
  value,
  onChange,
  debounceMs = 300,
  label,
}: TextInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  // Sync external value changes (e.g., sample data load)
  if (value !== localValue && !timerRef.current) {
    // Only sync if not currently typing
  }

  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm leading-relaxed shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={8}
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        dir="auto"
        spellCheck={false}
      />
    </div>
  );
}
