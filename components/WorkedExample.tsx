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
      <div className="card-surface rounded-xl p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          {inputLabel}
        </h3>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-700">
          {input}
        </pre>
      </div>
      <div className="card-surface rounded-xl border-emerald-200 bg-emerald-50/60 p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          {outputLabel}
        </h3>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-700">
          {output}
        </pre>
      </div>
    </div>
  );
}
