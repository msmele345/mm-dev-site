import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderRegistration, readRegistrationListing } from "../../lib/generate-registration.ts";
import type { IdentityReadiness, ShowcaseContent } from "./readiness";

export type ShowcaseFilesystemFacts = Pick<ShowcaseContent, "assetExists" | "authoredFiles" | "identityDirectories" | "generatedRegistrationMatches" | "generatedRegistrationError">;

export function collectShowcaseFilesystemFacts(
  root: string,
  authoredRecords: readonly { fileSlug: string; recordSlug: string }[],
): ShowcaseFilesystemFacts {
  const listing = readRegistrationListing(root);
  let generated: ReturnType<typeof renderRegistration> | undefined;
  let generatedRegistrationError: string | undefined;
  try {
    generated = renderRegistration({ authored: listing.authored, identities: listing.identities.filter(({ files }) => {
      return ["Tile.tsx", "Artwork.tsx"].every((file) => files.includes(file));
    }) });
  } catch (error) {
    generatedRegistrationError = error instanceof Error ? error.message : String(error);
  }
  const authoredFiles = listing.authored.map((fileSlug) => {
    const recordSlug = authoredRecords.find((record) => record.fileSlug === fileSlug)?.recordSlug;
    return { fileSlug, recordSlug };
  });
  const identityDirectories: IdentityReadiness[] = listing.identities.map(({ slug }) => {
    const dir = join(root, "src/components/showcase/identities", slug);
    const complete = ["Tile.tsx", "Artwork.tsx"].every((file) => statSync(join(dir, file), { throwIfNoEntry: false })?.isFile());
    const unfinishedFiles = findUnfinishedFiles(dir, root);
    return { slug, complete, unfinished: unfinishedFiles.length > 0, unfinishedFiles };
  });
  return {
    authoredFiles,
    identityDirectories,
    generatedRegistrationMatches: Boolean(generated) &&
      readGenerated(root, "src/content/projects/authored.generated.ts") === generated?.authored &&
      readGenerated(root, "src/components/showcase/identities.generated.ts") === generated?.identities,
    generatedRegistrationError,
    assetExists: (src) => {
      let directory = join(root, "public");
      for (const segment of src.split("/").filter(Boolean)) {
        if (!statSync(directory, { throwIfNoEntry: false })?.isDirectory()) return false;
        if (!readdirSync(directory).includes(segment)) return false;
        directory = join(directory, segment);
      }
      return statSync(directory, { throwIfNoEntry: false })?.isFile() ?? false;
    },
  };
}

function findUnfinishedFiles(directory: string, root: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findUnfinishedFiles(path, root);
    return entry.isFile() && readFileSync(path, "utf8").includes("onboarding:unfinished")
      ? [path.slice(root.length + 1)] : [];
  });
}

function readGenerated(root: string, path: string): string | undefined {
  const absolute = join(root, path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : undefined;
}
