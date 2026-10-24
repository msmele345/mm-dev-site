import { identities } from "./identities.generated";
import { createShowcaseRegistry } from "./registration";

/** Identities are registered by directory (ADR 0007); the shared shells do not dispatch by slug. */
export const showcase = createShowcaseRegistry(identities);
