import type { ProductSpecs } from "@/types";

function formatLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: string | number | boolean | string[]) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function ProductSpecsList({ specs }: { specs: ProductSpecs }) {
  const entries = Object.entries(specs).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );

  if (!entries.length) return null;

  return (
    <dl className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-2 gap-3 px-4 py-3 text-sm sm:grid-cols-[140px_1fr]"
        >
          <dt className="text-text-muted">{formatLabel(key)}</dt>
          <dd className="font-medium text-text">{formatValue(value as string | number | boolean | string[])}</dd>
        </div>
      ))}
    </dl>
  );
}
