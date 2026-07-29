/**
 * Reusable JSON-LD structured data component.
 *
 * Extracted to avoid repeating dangerouslySetInnerHTML + JSON.stringify
 * boilerplate across every page. (rendering-hoist-jsx)
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
