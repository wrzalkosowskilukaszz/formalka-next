// Node-only loaders: read the registry snapshots and blueprints from disk. The browser build embeds
// the same content as JSON (tools/build-browser.mjs) and never imports this file.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { type Blueprint, blueprintFromData } from "./blueprint.ts";
import { type FactDef, type Institution, type Office, type Procedure, type Registry, registryFromData } from "./registry.ts";

/** Reads every `procedure-*.yaml` and `facts-*.yaml` one folder below `dir` (Node only). */
export function loadRegistry(dir: string, version: string): Registry {
  const procedureLists: Procedure[][] = [];
  const factLists: FactDef[][] = [];
  const officeLists: Office[][] = [];
  let institutions: Institution[] = [];
  for (const sub of readdirSync(dir, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    for (const name of readdirSync(join(dir, sub.name)).sort()) {
      const text = () => readFileSync(join(dir, sub.name, name), "utf8");
      if (name.startsWith("procedure-") && name.endsWith(".yaml")) procedureLists.push(parse(text()) as Procedure[]);
      else if (name.startsWith("facts-") && name.endsWith(".yaml")) factLists.push(parse(text()) as FactDef[]);
      else if (name.startsWith("offices-") && name.endsWith(".yaml")) officeLists.push(parse(text()) as Office[]);
      else if (name === "institutions.yaml") institutions = parse(text()) as Institution[];
    }
  }
  return registryFromData(procedureLists, factLists, version, officeLists, institutions);
}

/** Node only: reads a blueprint YAML file. */
export function loadBlueprint(file: string): Blueprint {
  return blueprintFromData(parse(readFileSync(file, "utf8")), file);
}
