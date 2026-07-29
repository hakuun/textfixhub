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
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
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
