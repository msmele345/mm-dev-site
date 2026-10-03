import { spawn, type ChildProcess } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Exercise the real homepage/build with isolated files, never authored posts. */
export function createTransmissionApp() {
  const dir = mkdtempSync(join(tmpdir(), "transmission-app-"));
  for (const file of ["src", "public", "package.json", "tsconfig.json", "next.config.ts"]) {
    cpSync(join(process.cwd(), file), join(dir, file), {
      recursive: true,
      filter: (source) => source !== join(process.cwd(), "src/content/blog"),
    });
  }
  mkdirSync(join(dir, "src/content/blog"));
  symlinkSync(join(process.cwd(), "node_modules"), join(dir, "node_modules"), "dir");
  return dir;
}

export async function runTransmissionBuild(dir: string) {
  return new Promise<{ exitCode: number | null; signal: NodeJS.Signals | null; output: string }>((resolve, reject) => {
    // Invoke the package script used by CI. Webpack supports the isolated app's
    // shared node_modules symlink; production uses the default Turbopack build.
    const child = spawn("npm", ["run", "build", "--", "--webpack"], {
      cwd: dir,
      timeout: 150_000,
      env: { ...process.env, CI: "1", GITHUB_API_BASE_URL: "http://127.0.0.1:4010", GITHUB_TOKEN: "mock-token", TZ: "America/Los_Angeles" },
    });
    let output = "";
    child.stdout.on("data", (data) => { output += data; });
    child.stderr.on("data", (data) => { output += data; });
    child.on("error", reject);
    child.on("close", (exitCode, signal) => resolve({ exitCode, signal, output }));
  });
}

export async function buildTransmissionApp(dir: string) {
  const result = await runTransmissionBuild(dir);
  if (result.exitCode !== 0) throw new Error(result.output);
  return result.output;
}

export async function serveTransmissionApp(dir: string, port: number): Promise<ChildProcess> {
  const child = spawn(process.execPath, [join(process.cwd(), "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: dir });
  let output = "";
  child.stdout.on("data", (data) => { output += data; });
  child.stderr.on("data", (data) => { output += data; });
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) throw new Error(output);
    try {
      if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return child;
    } catch { /* Wait for the production server. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  child.kill();
  throw new Error(`Transmission fixture did not start: ${output}`);
}
