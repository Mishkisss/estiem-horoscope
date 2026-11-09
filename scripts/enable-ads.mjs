// Flip the advertising master switch in app/lib/ads-config.ts.
//
//   node scripts/enable-ads.mjs <ADSTERRA_KEY>   # turn ads on with a key
//   node scripts/enable-ads.mjs --disable        # turn ads off (keep the key)
//   node scripts/enable-ads.mjs --status         # show current state
//
// This only edits the config file; shipping is the usual
// commit -> push -> netlify deploy. The full activation checklist lives in
// docs/monetization-playbook.md.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target = path.join(root, "app", "lib", "ads-config.ts");
const arg = process.argv[2];

if (!arg) {
  console.error("usage: node scripts/enable-ads.mjs <ADSTERRA_KEY> | --disable | --status");
  process.exit(1);
}

let source = readFileSync(target, "utf8");

function replaceOnce(pattern, replacement, label) {
  const next = source.replace(pattern, replacement);
  if (next === source) {
    console.error(`ads-config.ts: could not find ${label} — file changed? Aborting without writing.`);
    process.exit(1);
  }
  source = next;
}

function status() {
  const enabled = /enabled: true/.test(source);
  const key = source.match(/adsterraKey: "([^"]*)"/)?.[1] ?? "?";
  console.log(`enabled=${enabled} adsterraKey=${key ? `${key.slice(0, 4)}… (${key.length} chars)` : "<empty>"}`);
}

if (arg === "--status") {
  status();
  process.exit(0);
}

if (arg === "--disable") {
  replaceOnce(/enabled: true/, "enabled: false", "`enabled: true`");
  writeFileSync(target, source);
  console.log("Advertising switched OFF. Redepublish to apply:");
  console.log("  git add app/lib/ads-config.ts && git commit -m \"Disable advertising\" && git push origin main");
  process.exit(0);
}

const key = arg.trim();
if (!/^[A-Za-z0-9_-]{6,}$/.test(key)) {
  console.error(`Refusing to use "${key}" as an Adsterra key — expected the alphanumeric Website key from the Adsterra banner embed.`);
  process.exit(1);
}
replaceOnce(/enabled: false/, "enabled: true", "`enabled: false`");
replaceOnce(/adsterrakey:\s*"[^"]*"/i, `adsterraKey: "${key}"`, "`adsterraKey` value");
writeFileSync(target, source);
console.log("Advertising switched ON.");
status();
console.log("Next: commit, push and deploy (see docs/monetization-playbook.md, «День включения»).");
