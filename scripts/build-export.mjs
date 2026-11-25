// Builds the static export (output:'export') for Hostinger.
//
// Next.js hard-fails `next build --output=export` if ANY route in the app/
// tree uses a Server Action, cookies(), or another dynamic-only API — even a
// route nobody is about to deploy. The /admin dashboard uses all three, so
// its entire code closure (confirmed by grep to have no importers outside
// itself: app/admin, components/admin, lib/cms/admin, lib/cms/upload.ts) has
// to be physically absent from the tree for this one build, never for the
// normal `npm run build` (Vercel) build.
//
// This script moves that closure aside, runs the export build, then always
// moves it back — including on failure/Ctrl+C, so a crash never leaves the
// route tree missing its admin pages.
import { existsSync } from "node:fs";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { execSync, spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

// Parked OUTSIDE the project root (not just renamed in place) — tsc's
// `**/*.ts`/`**/*.tsx` include glob matches recursively by pattern, not by
// name, so a same-tree rename is still discovered and still fails on the
// closure's now-broken cross-references to itself under its old paths.
// Copied rather than renamed: os.tmpdir() can be a different filesystem
// (e.g. a CI runner's tmpfs), where fs.rename throws EXDEV.
const parkingRoot = path.join(os.tmpdir(), "next-export-admin-parked");

// [real path, parked path] pairs, moved in this order and restored in reverse.
const ADMIN_CLOSURE = [
  ["app/admin", "app-admin"],
  ["components/admin", "components-admin"],
  ["lib/cms/admin", "lib-cms-admin"],
  ["lib/cms/upload.ts", "lib-cms-upload.ts"],
  // proxy.ts (unsupported in export mode) is what renders this catch-all and
  // sets its 404 status on the live Vercel build. The export build's own
  // root app/not-found.tsx + Hostinger's ErrorDocument replace it instead —
  // see docs/deploy/static-export.md for the full picture.
  ["app/[lang]/[...rest]", "app-lang-rest"],
].map(([real, parkedName]) => [path.join(root, real), path.join(parkingRoot, parkedName)]);

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, ...env },
    });
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`))));
  });
}

async function parkAdminClosure() {
  await mkdir(parkingRoot, { recursive: true });
  for (const [real, parked] of ADMIN_CLOSURE) {
    await cp(real, parked, { recursive: true });
    await rm(real, { recursive: true, force: true });
  }
}

async function restoreAdminClosure() {
  // Reverse order, and only the ones actually parked — a partial failure
  // part-way through parkAdminClosure() must not lose track of the rest.
  for (const [real, parked] of [...ADMIN_CLOSURE].reverse()) {
    if (existsSync(parked) && !existsSync(real)) {
      await cp(parked, real, { recursive: true });
    }
  }
  await rm(parkingRoot, { recursive: true, force: true });
}

async function main() {
  for (const [real] of ADMIN_CLOSURE) {
    if (!existsSync(real)) throw new Error(`Expected ${real} to exist. Refusing to continue.`);
  }
  if (existsSync(parkingRoot)) {
    throw new Error(
      `${parkingRoot} already exists — a previous run of this script likely crashed before restoring it. ` +
        `Check whether app/admin, components/admin, lib/cms/admin and lib/cms/upload.ts are all still in ` +
        `place, then delete ${parkingRoot} before retrying.`,
    );
  }

  const restoreOnSignal = (signal) => async () => {
    await restoreAdminClosure();
    process.exit(128 + (signal === "SIGINT" ? 2 : 15));
  };
  process.on("SIGINT", restoreOnSignal("SIGINT"));
  process.on("SIGTERM", restoreOnSignal("SIGTERM"));

  // A stale .next/dev/types/validator.ts from an earlier `next dev` (or a
  // previous build, before admin was parked) still lists admin's routes —
  // tsconfig.json's include covers .next/dev/types, so a leftover copy of
  // that file fails the typecheck even though nothing in app/ is wrong.
  await rm(path.join(root, ".next"), { recursive: true, force: true });

  await parkAdminClosure();
  try {
    await run("npx", ["next", "build"], { DEPLOYMENT_TARGET: "export" });
  } finally {
    await restoreAdminClosure();
  }

  // The deploy workflow fetches this from the live site after uploading, to
  // confirm the upload actually took (not just that FTP reported success).
  // Best-effort: a missing git repo (e.g. a throwaway copy of the project)
  // shouldn't fail the whole build over this one verification aid.
  let buildId = process.env.GITHUB_SHA;
  if (!buildId) {
    try {
      buildId = execSync("git rev-parse HEAD", { cwd: root }).toString().trim();
    } catch {
      buildId = `unknown-${Date.now()}`;
    }
  }
  await writeFile(path.join(root, "out", "build-id.txt"), buildId);
}

main().catch((error) => {
  console.error("\nbuild:export failed:", error.message);
  process.exit(1);
});
