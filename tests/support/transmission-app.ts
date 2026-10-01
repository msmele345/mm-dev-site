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

export async function buildTransmissionApp(dir: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [join(process.cwd(), "node_modules/next/dist/bin/next"), "build", "--webpack"], {
      cwd: dir,
      timeout: 150_000,
      env: { ...process.env, GITHUB_API_BASE_URL: "http://127.0.0.1:4010", GITHUB_TOKEN: "mock-token", TZ: "America/Los_Angeles" },
    });
    let output = "";
    child.stdout.on("data", (data) => { output += data; });
    child.stderr.on("data", (data) => { output += data; });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(output)));
  });
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
