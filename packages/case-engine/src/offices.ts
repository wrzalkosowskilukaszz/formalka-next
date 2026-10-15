// Which office: from the registry's office layer (quoted addresses, opening hours, booking links)
// and the user's place (a TERYT code at city level, non-identifying, kept on the device). Never a
// guessed address: if the registry has no office for the place, the plan says so.
import type { L10n, Quoted, Registry } from "./registry.ts";

export interface Place { teryt: string; name: string }
export interface PlanOffice {
  id: string; name: L10n; address?: Quoted<string>; openingHours?: Quoted<string>;
  booking?: string; website?: string; source: "office" | "institution";
}
export interface OfficeAnswer { offices: PlanOffice[]; needsPlace: boolean; noneForPlace: boolean }

export function officesFor(reg: Registry, officeKind: string | undefined, place: Place | undefined): OfficeAnswer | undefined {
  if (!officeKind) return undefined;
  if (!place) return { offices: [], needsPlace: true, noneForPlace: false };
  if (officeKind === "voivodeship_office") {
    // The registry's own TERYT code of each voivodeship office (two digits) decides.
    const inst = [...reg.institutions.values()].find((i) => i.kind === "voivodeship_office" && i.teryt === place.teryt.slice(0, 2));
    const offices: PlanOffice[] = inst
      ? [{ id: inst.id, name: { pl: inst.namePl }, website: inst.website?.url, source: "institution" }]
      : [];
    return { offices, needsPlace: false, noneForPlace: offices.length === 0 };
  }
  const offices = reg.offices
    .filter((o) => reg.institutions.get(o.institutionId)?.kind === officeKind)
    .filter((o) => o.jurisdiction.some((j) => place.teryt.startsWith(j) || j.startsWith(place.teryt)))
    .map((o): PlanOffice => ({
      id: o.id, name: o.name, address: o.address, openingHours: o.openingHours, booking: o.booking?.url,
      website: reg.institutions.get(o.institutionId)?.website?.url, source: "office",
    }));
  return { offices, needsPlace: false, noneForPlace: offices.length === 0 };
}
