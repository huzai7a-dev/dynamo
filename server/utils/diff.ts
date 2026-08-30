export interface FieldChange {
  label: string;
  before: string;
  after: string;
}

export function diffFields(
  before: Record<string, any>,
  after: Record<string, any>,
  fieldMap: { key: string; label: string }[]
): FieldChange[] {
  const norm = (v: any) => (v === null || v === undefined || v === "" ? "" : String(v));
  return fieldMap
    .filter(({ key }) => norm(before?.[key]) !== norm(after?.[key]))
    .map(({ key, label }) => ({
      label,
      before: norm(before?.[key]) || "—",
      after: norm(after?.[key]) || "—",
    }));
}
