export type TransmissionEditorial = {
  updatedOn: string;
  nowBuilding: {
    headline: string;
    supportingText: string;
    destination: string;
  };
  nextExperiment: {
    headline: string;
    supportingText: string;
  };
};

function requiredRecord(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Current Transmission ${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Current Transmission ${field} must be a non-empty string`);
  }
  return value;
}

function isSafeDestination(destination: string): boolean {
  if (/[\s\\]/.test(destination) || Array.from(destination).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return false;
  if (destination.startsWith("/")) return !destination.startsWith("//");
  if (!/^https:\/\/[^/]/i.test(destination)) return false;
  try {
    const url = new URL(destination);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

/** Validate local editorial content before the homepage can be built. */
export function validateTransmissionEditorial(value: unknown): TransmissionEditorial {
  const editorial = requiredRecord(value, "editorial");
  const updatedOn = requiredString(editorial.updatedOn, "updatedOn");
  const date = new Date(`${updatedOn}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedOn) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== updatedOn) {
    throw new Error("Current Transmission updatedOn must be a real ISO calendar date (yyyy-mm-dd)");
  }
  const building = requiredRecord(editorial.nowBuilding, "nowBuilding");
  const experiment = requiredRecord(editorial.nextExperiment, "nextExperiment");
  const nowBuilding = {
    headline: requiredString(building.headline, "nowBuilding.headline"),
    supportingText: requiredString(building.supportingText, "nowBuilding.supportingText"),
    destination: requiredString(building.destination, "nowBuilding.destination"),
  };
  const nextExperiment = {
    headline: requiredString(experiment.headline, "nextExperiment.headline"),
    supportingText: requiredString(experiment.supportingText, "nextExperiment.supportingText"),
  };
  if ("destination" in experiment) {
    throw new Error("Current Transmission nextExperiment.destination is forbidden because Next Experiment is non-interactive");
  }
  if (!isSafeDestination(nowBuilding.destination)) {
    throw new Error("Current Transmission nowBuilding.destination must be a safe root-relative path or an absolute HTTPS URL");
  }
  return { updatedOn, nowBuilding, nextExperiment };
}
