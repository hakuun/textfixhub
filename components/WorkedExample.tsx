interface WorkedExampleProps {
  input: string;
  output: string;
  inputLabel?: string;
  outputLabel?: string;
}

export default function WorkedExample({
  input,
  output,
  inputLabel = 'Sample Input',
  outputLabel = 'Sample Output',
}: WorkedExampleProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl bg-stone-50 p-5" style={{ boxShadow: '0 0 0 1px oklch(0 0 0 / 0.06), 0 1px 2px -1px oklch(0 0 0 / 0.06), 0 2px 4px 0 oklch(0 0 0 / 0.04)' }}>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500">
          {inputLabel}
        </h3>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-700">
          {input}
        </pre>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-700">
          {outputLabel}
        </h3>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-700">
          {output}
        </pre>
      </div>
    </div>
  );
}
