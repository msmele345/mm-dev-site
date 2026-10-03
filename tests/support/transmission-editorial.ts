/** Fresh content fixtures model the public manual-record contract. */
export function validEditorial() {
  return {
    updatedOn: "2026-09-30",
    nowBuilding: {
      headline: "FIELD ATLAS",
      supportingText: "Mapping the next geography experiment.",
      destination: "https://example.com/field-atlas",
    },
    nextExperiment: {
      headline: "SAIL SKETCHES",
      supportingText: "Considering an all-ages sailing prototype.",
    },
  };
}

export function editorialWith(field: string, value: unknown): Record<string, unknown> {
  const editorial: Record<string, unknown> = validEditorial();
  const [group, child] = field.split(".");
  const record = child ? editorial[group] as Record<string, unknown> : editorial;
  const key = child ?? group;
  if (value === undefined) delete record[key];
  else record[key] = value;
  return editorial;
}
