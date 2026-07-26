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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          {inputLabel}
        </h3>
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
          {input}
        </pre>
      </div>
      <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          {outputLabel}
        </h3>
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
          {output}
        </pre>
      </div>
    </div>
  );
}
