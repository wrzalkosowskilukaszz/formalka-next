'use strict';
/*
 * Formalka Next, experience prototype v4: the design-led app (brief 15) driven by the real case engine.
 * Every question, level, state, lock reason, fee, deadline, office and reminder comes from
 * FormalkaEngine (packages/case-engine): Formalka's verified content (reference/, formalka@04057ef)
 * and the case blueprints (blueprints/). No AI, no network, no storage: the state lives in memory
 * until "Reset". Values are labelled examples; nothing here is advice.
 */
const E = window.FormalkaEngine;
const ICONS = /*__ICONS__*/ {};

/* ── DOM and text helpers ──────────────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icon = (n, cls = '') => `<span class="icon ${cls}" aria-hidden="true">${ICONS[n] || ''}</span>`;
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const cap = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const tickSvg = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" pathLength="1"/></svg>';
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
// Polish plural: 1 zadanie, 2-4 zadania, 5+ zadań (12-14 take the last form).
const plural = (n, one, few, many) => {
  if (n === 1) return one;
  const d = n % 10, t = n % 100;
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
};
// Personal numbers are masked before anything the person typed is shown (audit F7): PESEL, ID card and
// passport numbers, phone numbers, e-mail addresses and bank accounts. The case never needs them.
const PERSONAL = [
  /\bPL ?\d{2}(?: ?\d{4}){6}\b/gi, /\b\d{6}[ -]?\d{5}\b/g, /\b[A-Za-z]{3} ?\d{6}\b/g, /\b[A-Za-z]{2} ?\d{7}\b/g,
  /(?:\+48[ -]?)?\b\d{3}[ -]?\d{3}[ -]?\d{3}\b/g, /[\w.+-]+@[\w-]+\.[\w.-]+/g,
];
const maskPersonal = (t) => PERSONAL.reduce((s, re) => s.replace(re, '•••'), String(t ?? ''));
const looksPersonal = (t) => maskPersonal(t) !== String(t ?? '');
// The person's words as the app shows them back: masked, then escaped.
const echoed = (t) => esc(maskPersonal(t));
// The part of the person's sentence around a phrase, so a short match reads in context.
const clause = (text, ev) => {
  const i = text.indexOf(ev);
  if (i < 0) return ev;
  const a = Math.max(...[...'.,;!?'].map((p) => text.lastIndexOf(p, i - 1))) + 1;
  const ends = [...'.,;!?'].map((p) => text.indexOf(p, i + ev.length)).filter((x) => x >= 0);
  return text.slice(a, ends.length ? Math.min(...ends) : text.length).trim();
};

/* ── Scripted timing. RUN changes on reset and FLOW when a new flow starts; a stale timer or answer
   never resolves, so an abandoned flow simply stops. ─────────────────────── */
let RUN = 0;
let FLOW = 0;
const sleep = (ms) => {
  const r = RUN, f = FLOW;
  return new Promise((res) => setTimeout(() => { if (r === RUN && f === FLOW) res(); }, RM.matches ? Math.min(ms, 120) : ms));
};
const later = (ms, fn) => { const r = RUN; setTimeout(() => { if (r === RUN) fn(); }, RM.matches ? 0 : ms); };

/* ── Dates. The engine counts in ISO days with no time zone; so does the prototype. ── */
const DAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const DS = ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'];
const MON_S = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
const MON_N = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const MON_G = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const pad = (n) => String(n).padStart(2, '0');
const isoDate = (iso) => new Date(`${iso}T00:00:00Z`);
const isoAdd = (iso, n) => { const d = isoDate(iso); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const isoOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const wd = (iso) => isoDate(iso).getUTCDay();
const dnum = (iso) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
const dshort = (iso) => `${DS[wd(iso)]} ${dnum(iso)}`;
const dday = (iso) => `${DAYS[wd(iso)]} ${dnum(iso)}`;
// With the year, for every confirmation of a date the person gave (audit F5).
const dayFull = (iso) => `${DAYS[wd(iso)]} ${dnum(iso)}.${iso.slice(0, 4)}`;
const dlong = (iso) => `${DAYS[wd(iso)]}, ${Number(iso.slice(8, 10))} ${MON_G[Number(iso.slice(5, 7)) - 1]}`;
const hm = (time) => time.replace(/^0(\d):/, '$1:');
const stamp = (clock) => `${clock.date}T${clock.time}`;
// "do środy, 18 listopada" (the engine's dueRangePl puts the date after "do" in the genitive).
const dueRange = (due) => E.dueRangePl(due.earliest, due.latest);
const fromStamp = (s) => ({ date: s.slice(0, 10), time: s.slice(11, 16) });

/* ── The brand mark (BRAND.md): three sheets of paper, the top one folded. ── */
let MID = 0;
function mark(cls = '') {
  const g = 'msh' + (++MID);
  return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
<g class="sh sh1"><rect x="9" y="7" width="12" height="35" rx="2.5" style="fill:var(--mark-1)"/></g>
<g class="sh sh2"><rect x="9" y="22" width="22" height="9" rx="2.5" style="fill:var(--mark-2)"/><rect x="9" y="31" width="12" height="3.5" fill="url(#${g})"/></g>
<g class="sh sh3"><rect x="9" y="17" width="12" height="3.5" fill="url(#${g})"/><path d="M11.5 7H33l6 6v1.5a2.5 2.5 0 0 1-2.5 2.5h-25A2.5 2.5 0 0 1 9 14.5v-5A2.5 2.5 0 0 1 11.5 7Z" style="fill:var(--mark-3)"/><path d="M33 7v4.5a1.5 1.5 0 0 0 1.5 1.5H39Z" style="fill:var(--mark-fold)"/><path d="M33 7 39 13" stroke-width=".6" stroke-opacity=".5" style="stroke:var(--mark-1)"/></g></svg>`;
}
