/* ── Shell: screens, navigation, tab bar, sheets, toasts, the tester controls ── */
const TABS = [
  { id: 'world', label: 'Start', ic: 'house', on: 'house-fill' },
  { id: 'calendar', label: 'Kalendarz', ic: 'calendar-dots', on: 'calendar-dots-fill' },
  { id: 'chat', label: 'Czat', ic: 'chat-circle-dots', on: 'chat-circle-dots-fill' },
  { id: 'teczka', label: 'Teczka', ic: 'folder-simple', on: 'folder-simple-fill' },
];
const TAB_OF = { world: 'world', case: 'world', calendar: 'calendar', teczka: 'teczka' };
const hasApproved = () => S.cases.some((c) => c.state.approved);

function renderTabs() {
  const nav = $('#tabbar');
  const show = !!TAB_OF[S.screen] && S.cases.length > 0;
  $('#app').classList.toggle('has-tabs', show);
  if (!show) { nav.innerHTML = ''; return; }
  const cur = TAB_OF[S.screen];
  const unread = S.cases.some((c) => c.preview);
  nav.innerHTML = `<div class="tabs">${TABS.map((t) => `<button type="button" class="tab" data-tab="${t.id}" ${t.id === cur ? 'aria-current="page"' : ''} aria-label="${t.label}">
    ${icon(t.id === cur ? t.on : t.ic)}<span class="lbl">${t.label}</span>${t.id === 'chat' && unread ? '<span class="dot-badge"></span>' : ''}</button>`).join('')}</div>`;
  $$('.tab', nav).forEach((b) => { b.onclick = () => {
    const t = b.dataset.tab;
    if (t === 'chat') { go('chat', 'fwd'); return; }
    if (S.screen !== t) go(t, 'tab');
  }; });
}

function render() {
  const stage = $('#stage');
  stage.innerHTML = '';
  stage.append(SCREENS[S.screen]());
  renderTabs();
  renderClock();
}
function go(screen, dir = 'tab') {
  const swap = () => { S.screen = screen; render(); };
  document.documentElement.dataset.nav = dir;
  if (document.startViewTransition && !RM.matches) {
    try { document.startViewTransition(swap); return; } catch { /* fall through */ }
  }
  swap();
}
function renderClock() {
  const txt = `${dshort(S.clock.date)}, ${hm(S.clock.time)}`;
  $('#clock').innerHTML = `<b>Tester</b> · ${txt}`;
  $('#tp-clock').textContent = txt;
  $('#sb-time').textContent = hm(S.clock.time);
  const ready = hasApproved();
  $$('[data-travel]').forEach((b) => b.setAttribute('aria-disabled', String(!ready)));
}
let toastTimer;
function toast(text, ic = 'check-circle-fill') {
  const t = $('#toast');
  t.innerHTML = `${icon(ic)}<span>${esc(text)}</span>`;
  t.classList.remove('enter'); void t.offsetWidth; t.classList.add('enter');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.innerHTML = ''; }, 3600);
}
function closeLayer() {
  const l = $('#layer');
  const top = l.firstElementChild;
  if (!top) return;
  if (RM.matches) { l.innerHTML = ''; return; }
  top.classList.add('closing');
  setTimeout(() => { if (top.parentNode === l) top.remove(); }, 230);
}
// A bottom sheet with a grabber; drag it down to close.
function sheet(title, body, wire) {
  const layer = $('#layer');
  layer.innerHTML = `<div class="overlay" id="ov"><div class="sheet pad" role="dialog" aria-modal="true" aria-labelledby="sh-h">
    <div class="grab" aria-hidden="true"><i></i></div>
    <div class="sheet-head"><h2 id="sh-h">${esc(title)}</h2><button type="button" class="circle-btn flat" id="sh-x" aria-label="Zamknij">${icon('x')}</button></div>
    <div class="sheet-body">${body}</div></div></div>`;
  const ov = $('#ov', layer), sh = $('.sheet', layer);
  $('#sh-x', layer).onclick = closeLayer;
  ov.onclick = (e) => { if (e.target === ov) closeLayer(); };
  let y0 = null, dy = 0;
  $$('.grab, .sheet-head', sh).forEach((g) => {
    g.onpointerdown = (e) => { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; g.setPointerCapture(e.pointerId); sh.style.transition = 'none'; };
    g.onpointermove = (e) => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; };
    g.onpointerup = () => { if (y0 == null) return; y0 = null; sh.style.transition = 'transform 260ms var(--ease)'; if (dy > 110) closeLayer(); else sh.style.transform = ''; };
  });
  if (wire) wire(sh);
  $('#sh-x', layer).focus();
  return sh;
}
