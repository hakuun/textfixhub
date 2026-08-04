'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

interface TextInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  label?: string;
  rows?: number;
  /** Grow the textarea with its content (capped at 65% of the viewport). */
  autoResize?: boolean;
}

export default function TextInput({
  placeholder = 'Paste your text here...',
  value,
  onChange,
  debounceMs = 300,
  label,
  rows = 8,
  autoResize = false,
}: TextInputProps) {
  const id = useId();
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow the textarea with its content (capped at 40% of the viewport so
  // the output below stays visible on desktop).
  useEffect(() => {
    if (!autoResize) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = Math.round(window.innerHeight * 0.4);
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [autoResize, localValue, value]);

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
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-500"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={textareaRef}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-stone-900 transition-all duration-200 ease-out placeholder:text-stone-400 hover:border-stone-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
        style={{
          boxShadow:
            '0 0 0 1px oklch(0 0 0 / 0.03), 0 1px 2px 0 oklch(0 0 0 / 0.04)',
          ...(autoResize ? { maxHeight: '40vh', overflowY: 'auto' } : {}),
        }}
        rows={rows}
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        dir="auto"
        spellCheck={false}
      />
    </div>
  );
}
