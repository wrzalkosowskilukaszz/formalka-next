// Builds dist/case-engine.browser.js: the engine and its data as one IIFE (global FormalkaEngine).
// Usage: node tools/build-browser.mjs --locales pl   (from packages/case-engine)
// Writes dist/manifest.json: the registry version, the hash of every source file and of the engine,
// and the bundle's sha256.
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { parse } from "yaml";

const pkg = join(dirname(fileURLToPath(import.meta.url)), "..");
const lab = join(pkg, "..", "..");
const ref = join(lab, "reference");
const procedures = [], facts = [], offices = [];
let institutions = [];
// What this build is made of, by content hash: a bundle is identified by its inputs, not by the day it
// was built (audit F8, 2026-10-16). The same inputs give the same bundle, byte for byte.
const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const sources = {};
for (const sub of readdirSync(ref, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
  for (const name of readdirSync(join(ref, sub)).sort()) {
    if (!name.endsWith(".yaml")) continue;
    const text = () => readFileSync(join(ref, sub, name), "utf8");
    sources[`reference/${sub}/${name}`] = sha(readFileSync(join(ref, sub, name))).slice(0, 16);
    if (name.startsWith("procedure-")) procedures.push(parse(text()));
    else if (name.startsWith("facts-")) facts.push(parse(text()));
    else if (name.startsWith("offices-")) offices.push(parse(text()));
    else if (name === "institutions.yaml") institutions = parse(text());
  }
}
const blueprints = {};
for (const name of readdirSync(join(lab, "blueprints")).filter((n) => n.endsWith(".yaml")).sort()) {
  const b = parse(readFileSync(join(lab, "blueprints", name), "utf8"));
  sources[`blueprints/${name}`] = sha(readFileSync(join(lab, "blueprints", name))).slice(0, 16);
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
offices.splice(0, offices.length, ...offices.map(strip));
facts.splice(0, facts.length, ...facts.map(strip));
const readme = readFileSync(join(ref, "README.md"), "utf8");
const version = `formalka@${/at \*\*([0-9a-f]{7,})\*\*/.exec(readme)?.[1] ?? "unknown"}`;
mkdirSync(join(pkg, "dist"), { recursive: true });
const engine = sha(readdirSync(join(pkg, "src")).filter((n) => n.endsWith(".ts")).sort().map((n) => readFileSync(join(pkg, "src", n), "utf8")).join("\n")).slice(0, 16);
const manifest = { registry: version, locales: keep ? [...keep].sort() : LOCALES, engine, sources };
writeFileSync(join(pkg, "dist", "data.json"), JSON.stringify({ version, manifest, procedures, facts, offices, institutions, blueprints }));
await build({
  entryPoints: [join(pkg, "src", "browser.ts")], bundle: true, format: "iife", platform: "browser",
  target: "es2020", outfile: join(pkg, "dist", "case-engine.browser.js"), legalComments: "none",
  banner: { js: `/* Formalka Next case engine + registry ${version} (lab build; synthetic use only). */` },
});
const bundle = readFileSync(join(pkg, "dist", "case-engine.browser.js"));
writeFileSync(join(pkg, "dist", "manifest.json"), `${JSON.stringify({ ...manifest, bundle: { file: "case-engine.browser.js", sha256: sha(bundle) } }, null, 2)}\n`);
const size = bundle.length;
console.log(`built dist/case-engine.browser.js ${(size / 1024).toFixed(0)} KB, registry ${version}, locales ${keep ? [...keep].join(",") : "all"}, blueprints: ${Object.keys(blueprints).join(", ")}`);
