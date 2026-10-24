// Regenerate the authored catalogue and showcase identity barrels (ADR 0007).
// Run after adding, renaming, or removing an authored file or identity directory.
const { syncRegistration } = await import("../src/lib/generate-registration.ts");

const changed = syncRegistration(process.cwd());
console.log(changed.length ? `Updated ${changed.join(", ")}` : "Registration is already current.");
