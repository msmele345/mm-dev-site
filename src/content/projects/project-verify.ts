import { execFileSync, spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { createServer } from "node:net";
import { join, relative } from "node:path";
import type { Project } from "./schema";
import type { collectShowcaseFindings } from "./readiness.ts";

export type VerificationInput = {
  project: Project;
  selection: { published: string[]; featured: string[] };
  stage: "authored" | "published" | "featured";
  gates: { contentReady: boolean; registered: boolean; finished: boolean };
  findings: ReturnType<typeof collectShowcaseFindings>;
};

export async function verifyProject(root: string, input: VerificationInput): Promise<number> {
  const { project, stage, gates, findings } = input;
  const evidenceRoot = join(root, ".project-evidence");
  mkdirSync(evidenceRoot, { recursive: true });
  const evidence = mkdtempSync(join(evidenceRoot, `${project.slug}-`));
  const notesFile = join(root, `docs/project-review/${project.slug}.md`);
  const provenance = existsSync(notesFile) ? readFileSync(notesFile, "utf8") : "Source provenance: not recorded.";
  const gitCommands: [string, string[]][] = [
    ["Branch changes relative to main", ["diff", "--name-status", "main...HEAD"]],
    ["Checkout changes", ["status", "--short", "--untracked-files=all"]],
  ];
  const changedPaths = gitCommands.map(([label, args]) => {
    try {
      return `${label}:\n${execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() || "None."}`;
    } catch (error) {
      return `${label}: unavailable. ${error instanceof Error ? error.message : String(error)}`;
    }
  }).join("\n");
  let failed = stage !== "authored" && findings.some((finding) => finding.blocksBuild);
  const report = [
    `# Project verification: ${project.slug}`, `Stage: ${stage}`, `Recorded: ${new Date().toISOString()}`,
    `Content ready: ${gates.contentReady ? "yes" : "no"}`,
    `Presentation registered: ${gates.registered ? "yes" : "no"}`,
    `Presentation finished: ${gates.finished ? "yes" : "no"}`,
    "## Source review notes", provenance, "## Changed paths", "```text", changedPaths, "```",
    "## Commands and results", `Command: npm run project -- verify ${project.slug}`,
    ...findings.map((finding) => `- ${finding.slug} ${finding.subject}: ${finding.message}`),
    failed ? "Browser checks: skipped because publication gates failed" : stage === "authored" ? "Browser checks: not required for authored work" : "Browser checks: required for published work",
    "## Owner evidence", "- [ ] Owner copy review", "- [ ] Owner artwork approval",
    "- [ ] Physical-device review", "- [ ] Deployment", "- [ ] Production curation",
    "Captures are automated evidence and do not approve visual quality.",
  ];
  if (stage !== "authored" && !failed) {
    const app = mkdtempSync(join(tmpdir(), "project-verify-app-"));
    try {
      for (const file of ["src", "public", "package.json", "tsconfig.json", "next.config.ts", "playwright.project.config.ts"]) {
        cpSync(join(root, file), join(app, file), { recursive: true });
      }
      mkdirSync(join(app, "tests"));
      cpSync(join(root, "tests/project-verification.spec.ts"), join(app, "tests/project-verification.spec.ts"));
      symlinkSync(join(root, "node_modules"), join(app, "node_modules"), "dir");
      const inputFile = join(evidence, "input.json");
      writeFileSync(inputFile, JSON.stringify(input, null, 2));
      // Refuse live enrichment: exercise the actual unavailable-service fallback.
      const env = { ...process.env, GITHUB_API_BASE_URL: "http://127.0.0.1:9", GITHUB_TOKEN: "", CI: "1", NEXT_TELEMETRY_DISABLED: "1" };
      const build = await runCommand(app, "npm", ["run", "build", "--", "--webpack"], env, join(evidence, "build.log"));
      report.push("Command: npm run build -- --webpack (isolated checkout snapshot; unavailable local enrichment)", `Build exit: ${build}`);
      if (build !== 0) throw new Error("Build failed; see build.log");
      const port = await availablePort();
      const browser = await runCommand(app, process.execPath, [join(root, "node_modules/@playwright/test/cli.js"), "test", "--config", "playwright.project.config.ts"], {
        ...env, PROJECT_VERIFY_SLUG: project.slug, PROJECT_VERIFY_INPUT: inputFile,
        PROJECT_VERIFY_EVIDENCE: evidence, PROJECT_VERIFY_PORT: String(port),
      }, join(evidence, "playwright.log"));
      failed = browser !== 0;
      report.push("Command: playwright test --config playwright.project.config.ts", `Browser exit: ${browser}`, `Browser checks: ${failed ? "failed" : "passed"}`);
    } catch (error) {
      failed = true;
      report.push(`Verification error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      rmSync(app, { recursive: true, force: true });
    }
  }
  report.push(`Result: ${failed ? "failed" : "passed"}`, "## Diagnostic evidence and captures");
  for (const file of readdirSync(evidence, { recursive: true, withFileTypes: true })) {
    if (file.isFile()) {
      const name = relative(evidence, join(file.parentPath, file.name)).split("\\").join("/");
      report.push(`- [${name}](${name.split("/").map(encodeURIComponent).join("/")})`);
    }
  }
  const file = join(evidence, "README.md");
  writeFileSync(file, `${report.join("\n\n")}\n`);
  console.log(`Evidence report: ${file}`);
  return failed ? 1 : 0;
}

async function availablePort(): Promise<number> {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close((error) => {
        if (error) reject(error);
        else if (address && typeof address === "object") resolve(address.port);
        else reject(new Error("No verification server port available"));
      });
    });
  });
}

async function runCommand(cwd: string, command: string, args: string[], env: NodeJS.ProcessEnv, log: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env, detached: process.platform !== "win32" });
    let timedOut = false;
    let forcedStop: ReturnType<typeof setTimeout> | undefined;
    function terminate(signal: NodeJS.Signals) {
      if (!child.pid) return;
      try {
        if (process.platform === "win32") child.kill(signal);
        else process.kill(-child.pid, signal);
      } catch (error) {
        if (!(error instanceof Error) || !("code" in error) || error.code !== "ESRCH") throw error;
      }
    }
    const timeout = setTimeout(() => {
      timedOut = true;
      output += "\nVerification command timed out after 180 seconds.\n";
      terminate("SIGTERM");
      forcedStop = setTimeout(() => terminate("SIGKILL"), 5_000);
    }, 180_000);
    let output = "";
    child.stdout.on("data", (data) => { output += data; });
    child.stderr.on("data", (data) => { output += data; });
    child.once("error", (error) => {
      clearTimeout(timeout);
      writeFileSync(log, `${output}\n${error.message}`);
      reject(error);
    });
    child.once("close", (code, signal) => {
      clearTimeout(timeout);
      if (forcedStop) {
        clearTimeout(forcedStop);
        terminate("SIGKILL");
      }
      writeFileSync(log, `${output}\nExit: ${code}; signal: ${signal}\n`);
      resolve(timedOut ? 1 : code ?? 1);
    });
  });
}
