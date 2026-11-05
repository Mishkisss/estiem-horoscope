// Cross-platform Netlify build command (cmd.exe on Windows, /bin/sh on Linux).
// Runs the framework build and, for production deploys, applies the schema
// migrations to the target database. Replaces the bash-only one-liner that
// cmd.exe cannot parse ("export X=... && if [ ... ]").
import { spawnSync } from "node:child_process";

const dbUrl =
  process.env.NETLIFY_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

function run(command, extraEnv = {}) {
  console.log(`[netlify-build] ${command}`);
  const result = spawnSync(command, {
    shell: true,
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
      ...(extraEnv.DATABASE_URL ? { DATABASE_URL: extraEnv.DATABASE_URL } : {}),
    },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("corepack pnpm build", { NITRO_PRESET: "netlify", DATABASE_URL: dbUrl });

// guard:allow-env-credential — CONTEXT is Netlify's deploy-context flag
// ("production"/"deploy-preview"/...), not a user credential; migrations must
// run only for production deploys.
if (process.env.CONTEXT === "production") { // guard:allow-env-credential — Netlify deploy-context flag, not a credential
  run("corepack pnpm migrate:production", { DATABASE_URL: dbUrl });
}
