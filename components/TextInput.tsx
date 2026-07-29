'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  const isTypingRef = useRef(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      isTypingRef.current = true;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  // Sync external value changes (e.g., sample data load, clear button)
  useEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div>
      {label && (
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-500">
          {label}
        </label>
      )}
      <textarea
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-stone-900 shadow-sm transition-all placeholder:text-stone-400 hover:border-stone-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
