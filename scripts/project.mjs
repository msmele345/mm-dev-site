// @ts-check
if (!("typescript" in process.features) || !process.features.typescript) {
  console.error("The project command needs Node.js with native TypeScript type stripping (Node 22.22 or newer). Upgrade Node and run `npm run project -- check <slug>` again.");
  process.exit(1);
}

try {
  const { runProjectCommand } = await import("../src/content/projects/project-command.ts");
  process.exitCode = await runProjectCommand(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
