// Builds dist/case-engine.browser.js: the engine and its data as one IIFE (global FormalkaEngine).
// Usage: node tools/build-browser.mjs   (from packages/case-engine)
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { parse } from "yaml";

const pkg = join(dirname(fileURLToPath(import.meta.url)), "..");
const lab = join(pkg, "..", "..");
const ref = join(lab, "reference");
const procedures = [], facts = [];
for (const sub of readdirSync(ref, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
  for (const name of readdirSync(join(ref, sub)).sort()) {
    if (!name.endsWith(".yaml")) continue;
    const text = () => readFileSync(join(ref, sub, name), "utf8");
    if (name.startsWith("procedure-")) procedures.push(parse(text()));
    else if (name.startsWith("facts-")) facts.push(parse(text()));
  }
}
const blueprints = {};
for (const name of readdirSync(join(lab, "blueprints")).filter((n) => n.endsWith(".yaml")).sort()) {
  const b = parse(readFileSync(join(lab, "blueprints", name), "utf8"));
  blueprints[b.id] = b;
}
// `--locales pl` keeps only the listed languages in every translated text (the prototype is Polish).
const arg = process.argv.indexOf("--locales");
const keep = arg > 0 ? new Set(process.argv[arg + 1].split(",")) : null;
const LOCALES = ["pl", "en", "uk", "ru"];
const strip = (v) => {
  if (Array.isArray(v)) return v.map(strip);
  if (v && typeof v === "object") {
    const isText = "pl" in v && Object.keys(v).every((k) => LOCALES.includes(k));
    return Object.fromEntries(Object.entries(v).filter(([k]) => !keep || !isText || keep.has(k)).map(([k, x]) => [k, strip(x)]));
  }
  return v;
};
procedures.splice(0, procedures.length, ...procedures.map(strip));
facts.splice(0, facts.length, ...facts.map(strip));
const readme = readFileSync(join(ref, "README.md"), "utf8");
const version = `formalka@${/at \*\*([0-9a-f]{7,})\*\*/.exec(readme)?.[1] ?? "unknown"}`;
mkdirSync(join(pkg, "dist"), { recursive: true });
writeFileSync(join(pkg, "dist", "data.json"), JSON.stringify({ version, builtAt: new Date().toISOString().slice(0, 10), procedures, facts, blueprints }));
await build({
  entryPoints: [join(pkg, "src", "browser.ts")], bundle: true, format: "iife", platform: "browser",
  target: "es2020", outfile: join(pkg, "dist", "case-engine.browser.js"), legalComments: "none",
  banner: { js: `/* Formalka Next case engine + registry ${version} (lab build; synthetic use only). */` },
});
const size = readFileSync(join(pkg, "dist", "case-engine.browser.js")).length;
console.log(`built dist/case-engine.browser.js ${(size / 1024).toFixed(0)} KB, registry ${version}, locales ${keep ? [...keep].join(",") : "all"}, blueprints: ${Object.keys(blueprints).join(", ")}`);
