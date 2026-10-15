// Formalka Next: variable AI cost per month by monthly active users (MAU).
// Prices: official/vendor pages read 2026-10-15 (docs/formalka-next/12-COST-MODEL.md §1), USD per million tokens.
// Usage figures are DESIGN HYPOTHESES, not measurements. Run: node tools/cost-model.mjs
const PRICE = {
  haiku: { in: 0.10, out: 0.50, cacheHit: 0.01 },
  sonnet: { in: 2.00, out: 10.00, cacheHit: 0.10 },
  mistralSmall: { in: 0.15, out: 0.60 },
  mistralMedium: { in: 1.50, out: 7.50 },
};
// Per MAU per month. Extraction: AI intake calls. Turns: companion answers. Tokens per call.
const SCENARIO = {
  low:  { extract: 1, turns: 2,  extractIn: 2500, extractOut: 250, turnIn: 5000, turnOut: 400, cacheable: 0.6, hitRate: 0.7 },
  base: { extract: 2, turns: 8,  extractIn: 3000, extractOut: 300, turnIn: 6000, turnOut: 500, cacheable: 0, hitRate: 0 },
  high: { extract: 4, turns: 25, extractIn: 4000, extractOut: 400, turnIn: 9000, turnOut: 700, cacheable: 0, hitRate: 0 },
};
const call = (p, tin, tout, cacheable = 0, hit = 0) => {
  const cached = p.cacheHit ? tin * cacheable * hit : 0; // cache writes not modelled (premium unverified)
  return ((tin - cached) * p.in + cached * (p.cacheHit ?? p.in) + tout * p.out) / 1e6;
};
const perMau = (s, extractModel, turnModel) =>
  s.extract * call(PRICE[extractModel], s.extractIn, s.extractOut) +
  s.turns * call(PRICE[turnModel], s.turnIn, s.turnOut, s.cacheable, s.hitRate);
const stacks = [["haiku", "sonnet"], ["haiku", "haiku"], ["mistralSmall", "mistralMedium"]];
const fmt = (n) => (n < 10 ? n.toFixed(2) : n.toFixed(0)).padStart(8);
console.log("AI cost per month (USD); extraction model / companion model");
for (const [e, t] of stacks) {
  console.log(`\n${e} / ${t}`);
  console.log("scenario  per MAU      100 MAU   1k MAU   10k MAU");
  for (const [name, s] of Object.entries(SCENARIO)) {
    const u = perMau(s, e, t);
    console.log(`${name.padEnd(8)} ${u.toFixed(4).padStart(8)} ${fmt(u * 100)} ${fmt(u * 1000)} ${fmt(u * 10000)}`);
  }
}
